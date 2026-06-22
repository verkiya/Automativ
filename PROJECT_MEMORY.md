# Automativ project memory

This is the handoff record for decisions and assumptions that are not obvious from types alone. Keep it factual and update it when behavior changes. Automativ is authoritative; `nodebase-main` is historical reference material only.

## Product boundary

Automativ is a user-owned workflow graph editor and execution service. It is not currently a general distributed DAG scheduler, a secrets vault, or an immutable audit system. Its strongest contract is: save a small directed graph, run nodes sequentially in dependency order, carry a JSON-like context forward, and retain aggregate execution history.

## Why background execution exists

AI inference and external HTTP calls do not fit reliably inside an interactive request. A tRPC mutation therefore enqueues an Inngest event and returns. Inngest provides durable steps, retry handling, failure callbacks, and realtime publishing while the Next.js app remains the control plane and UI.

Do not move node side effects back into tRPC or React Server Actions merely to reduce indirection. That would couple user request latency and deployment lifetime to external providers.

## Why the graph is normalized

React Flow naturally uses arrays of nodes and edges. The database stores nodes and connections as related rows so workflow ownership, cascade deletion, endpoint integrity, and list queries remain explicit. Provider-specific node settings stay in JSON because those shapes vary and evolve faster than the graph structure.

The save algorithm replaces the graph in one transaction instead of diffing individual edits. This was chosen for a simpler consistency model. Consequences:

- React Flow IDs are persisted and must remain stable across one save request.
- Deleting nodes first intentionally cascade-deletes old connections.
- A failed recreate rolls back the entire transaction.
- Concurrent editor sessions are last-write-wins; there is no revision check.
- Unsaved editor state exists only in the browser.
- JSON-held credential IDs are not protected by the schema relation.

An incremental graph mutation API was not implemented. Do not add one unless it solves a concrete collaboration, scale, or latency problem and preserves transaction semantics.

## The `INITIAL` node

New workflows contain one `INITIAL` placeholder so the editor never starts as an unexplained blank canvas. The first selected node replaces that placeholder. `INITIAL` maps to the manual trigger executor as a defensive runtime fallback, but a normally configured workflow should replace it before execution.

The node selector's replacement branch returns only the newly selected node when `INITIAL` is present. This is safe only because `INITIAL` is expected to be the sole node at that stage. If future UI allows adding nodes around the placeholder, this assumption must be revisited.

## Execution ordering and context

Connections are topologically sorted immediately before execution. Nodes run sequentially even when branches are independent. Sequential execution keeps the shared context deterministic enough for template references and avoids inventing merge semantics.

Disconnected nodes are explicitly inserted into the sort through self-edges. Their relative order is not guaranteed. Cycles are detected at execution time, not prevented by the editor.

The context is a flat record. Trigger payloads seed it; each action returns a shallow copy with one variable added. Hidden contracts:

- Variable names are effectively top-level keys.
- Reusing a variable name overwrites the previous value.
- A faulty executor that forgets `...context` drops upstream data.
- Large provider responses increase the final `Execution.output` JSON value.
- Final output and failure details are durable; intermediate per-node context is not.

Handlebars is the cross-node reference language. The `json` helper is registered in multiple executor modules. HTTP templates disable HTML escaping because encoded ampersands, equals signs, and quotes break URLs/JSON. Template input is trusted as workflow-author configuration, not as safe HTML.

## Execution records are not snapshots

The execution event contains a workflow ID and optional trigger data. The Inngest function loads the graph after the event is accepted. An edit between enqueue and `prepare-workflow` can therefore change what the run executes.

The `Execution` row does not store node definitions, connections, model choice, or per-node output. It references the workflow and stores aggregate state. This is sufficient for the current history UI but not for forensic replay. Do not describe execution history as an immutable audit log.

The Inngest event ID is the unique correlation key. Inngest step memoization is part of retry safety, but external side effects still need idempotency thinking. HTTP, Slack, and Discord calls may be repeated if a failure occurs after the provider accepts the request but before the step is durably recorded.

Step names should include `nodeId` when repeated node types are possible. The HTTP executor follows this rule; several other executors use static IDs. Treat changes to step IDs as replay-sensitive because Inngest uses them to identify durable work.

## Realtime status is presentation state

Each node kind publishes to a provider-specific Inngest channel. Browser hooks subscribe and then filter all received messages by channel, topic, and node ID. The state begins at `initial` on mount and is not rebuilt from execution history.

Current channels/tokens are not scoped to a user, workflow, or execution. Node IDs reduce accidental overlap but are not an authorization boundary. A future security change should scope token issuance and channel identity together; changing only the client filter is insufficient.

## Credential model

Credential values are symmetrically encrypted with one process environment key. Only server-side executors decrypt values, and they query by credential ID plus workflow owner ID. This second ownership check is essential even though the editor only lists the current user's credentials.

Operational warnings:

- Losing `ENCRYPTION_KEY` loses access to every stored provider key.
- Changing it without a re-encryption migration makes existing values unreadable.
- There is no key version or rotation workflow.
- Credential queries currently send ciphertext to authenticated clients.
- The edit form treats returned ciphertext as the input value, so saving an unchanged key can double-encrypt it.
- AI node configuration stores `credentialId` in `Node.data`; `Node.credentialId` exists in the schema but graph saves do not populate it.
- Deleting a credential does not repair a credential ID embedded in JSON. Execution fails with `Credential not found`, which is safer than cross-user fallback.

Never log decrypted credentials or place them in workflow context. Masking in the UI is not a substitute for keeping plaintext off the client.

## Provider behavior

The common abstraction is `NodeExecutor`, not a universal AI-provider class. OpenAI, Anthropic, and Gemini each own a settings dialog, realtime action/channel, node component, and executor. This duplication makes provider differences visible and was retained because there are only three concrete providers.

Model policy currently lives in code:

- OpenAI: `gpt-5.4-mini`
- Anthropic: `claude-haiku-4-5`
- Gemini: weighted random choice from `model-selector.ts`

Gemini selection is wrapped in an Inngest step so a resumed run reuses the selected result. Root-level model access scripts list models using environment keys but are not part of workflow execution. Provider model names and UI help text can drift; verify them together during upgrades.

AI telemetry has `recordInputs` and `recordOutputs` enabled. Prompts can include upstream webhook data, and outputs can include confidential user material. Sentry configuration is therefore part of the data-handling boundary, not just debugging infrastructure.

## Trigger behavior

Manual execution is authenticated and ownership checked by tRPC. Google Form and Stripe execution enter through public Next.js route handlers. Those handlers currently accept a workflow ID in the query string and do not verify a signature, shared secret, event age, or replay key.

The Stripe handler builds a reduced `stripe` object and also writes the same object to `googleForm` as a temporary compatibility fallback. Preserve awareness of that alias when debugging templates; it is not a principled data model.

Trigger executors are pass-through nodes. They publish status and return the initial context rather than polling the external system.

## HTTP and messaging boundaries

The HTTP node can access any URL reachable by the server. It validates URL syntax but has no protocol allowlist, DNS/IP filtering, timeout policy, response-size cap, or private-network block. This is an SSRF and resource-consumption boundary if untrusted users can author workflows.

Slack and Discord use webhook URLs stored in node JSON rather than the credential store. Those URLs are secrets in practice. They can appear in workflow reads, browser state, database backups, and potentially error telemetry.

Messages and HTTP requests are side effects. Retries cannot be assumed exactly-once unless the destination supports an idempotency key and the executor supplies one.

## Authentication and authorization

Better Auth owns `User`, `Session`, `Account`, and `Verification` records. Server page helpers redirect unauthenticated users. tRPC resolves the session from request headers in middleware; the placeholder `createTRPCContext.userId` is not used for authorization.

Prisma operations include `userId` directly or traverse `workflow.userId`. Keep authorization in the database predicate rather than fetching a row and checking ownership only in application code.

`src/lib/auth.ts` currently creates a separate Prisma client instead of importing the development singleton from `src/lib/db.ts`. It works, but it weakens the single-client assumption documented by the database helper.

## Billing policy

The Better Auth Polar plugin creates customers on sign-up and exposes checkout/portal APIs. `premiumProcedure` asks Polar for customer state on each gated request. This remote request is authoritative but uncached and can make workflow/credential creation dependent on Polar latency or availability.

Only creation is premium-gated today. Existing workflow and credential update/delete/read paths use `protectedProcedure`. That may be intentional retention policy; do not silently broaden the gate without a product decision.

`src/lib/polar.ts` hardcodes `server: "sandbox"`; `POLAR_SERVER` in the environment is not consumed. Production deployment requires an explicit code/configuration change and validation.

## tRPC, caching, and route groups

The tRPC layer centralizes validation, auth middleware, and Prisma ownership filters. React Server Components prefetch through a request-cached query client and hydrate TanStack Query with SuperJSON. The browser uses one query client to survive Suspense. Default query staleness is 30 seconds.

Mutation hooks invalidate list/detail keys after writes. They do not implement optimistic graph updates; React Flow already owns the immediate editor experience.

nuqs makes workflow/credential search and execution filters URL-backed. Parameter loaders must be kept aligned with hooks and router inputs.

Route groups separate dashboard chrome from editor chrome without changing URLs. `/workflows` lives in `(rest)` with the standard header; `/workflows/[workflowId]` lives in `(editor)` with a canvas-specific layout. Do not collapse those groups just because the URL hierarchy looks redundant.

## Database and migration rules

Prisma migrations, not the current schema alone, are the deployment history. Never edit an applied migration to make it prettier. Add a new migration and review generated SQL.

Important cascade behavior:

- user deletion removes owned workflows and credentials
- workflow deletion removes nodes, connections, and executions
- node deletion removes incident connections
- credential deletion only nulls the schema relation, not JSON references

Indexes added in Automativ cover user/date workflow lists, workflow node/connection lookups, and execution history/status. This is one concrete evolution beyond the reference repository.

## Observability

Sentry initializes separately for client, Node, and edge runtimes. Client traces sample at 100%, replay samples 10% of sessions and 100% of error sessions, and log capture is enabled. The Next.js config tunnels browser events through `/monitoring` and uploads broad source maps.

These settings improve diagnosis but increase cost and data exposure. Review them before onboarding sensitive workloads. Error stacks and final execution output are also stored in PostgreSQL, so deleting a Sentry event does not delete application history.

## Relationship to `nodebase-main`

The reference repository supplied much of the early conceptual skeleton: Next.js route groups, tRPC/TanStack hydration, React Flow graph persistence, Inngest orchestration, provider nodes, credentials, Better Auth, and Polar.

Automativ has its own migration timeline, package upgrades, database indexes, naming dictionaries, combined local process setup, UI/UX work, execution filtering, provider model changes, auth error handling, and documentation. Some core files still resemble the reference because the concepts remain useful, not because parity is a requirement.

When investigating origin, compare one subsystem at a time. Never copy the reference schema, migrations, package versions, or full files into Automativ. Its tutorial README and older defaults do not override live behavior here.

## Known rejected or absent approaches

The repository provides evidence of what was not implemented, but not always why. Preserve that uncertainty.

- Graph diff/patch persistence is absent; replace-all transactions are the current decision.
- Parallel branch execution and merge semantics are absent; sequential context mutation is current behavior.
- Immutable workflow revisions and execution snapshots are absent.
- A universal provider abstraction is absent; explicit provider modules remain.
- Per-node execution rows are absent; status is realtime-only and history is aggregate.
- Credential rotation/versioning is absent.
- Webhook authenticity and replay controls are absent.
- Automated tests are absent.

Do not claim these were formally rejected unless a future decision record documents that conclusion.
