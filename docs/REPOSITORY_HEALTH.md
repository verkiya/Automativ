# Repository health report

Audit date: 2026-06-22

Scope: architecture, documentation, execution, credentials, providers, authentication, authorization, billing, persistence, caching, state, public triggers, observability, and conservative dead-code review.

## Strengths

- Feature folders keep UI, hooks, procedures, and node-specific execution code discoverable.
- tRPC procedures consistently scope workflow, credential, and execution records to the authenticated owner.
- Graph replacement runs in a Prisma transaction, preventing partially saved node/connection sets.
- Database cascades and recent indexes match the major ownership and history access paths.
- Inngest keeps slow AI/network work outside user-facing requests and records terminal failures.
- `NodeExecutor` is a small, useful extension contract without forcing all providers into a speculative abstraction.
- The execute button saves before enqueueing, reducing the common mismatch between visible and persisted graphs.
- Provider credentials are encrypted at rest and re-authorized against the workflow owner during execution.
- Server prefetch plus TanStack Query hydration gives clear server/client data ownership.
- URL-backed list state and separate editor/dashboard route groups improve maintainability as well as UX.

## Weaknesses

- There is no automated test suite or test command for graph ordering, ownership, credentials, triggers, or retries.
- Public-facing documentation must stay synchronized with implementation reality; before this stewardship pass, the README and learnings page were too promotional and thin to serve maintainers.
- Node registration is distributed across schema, UI registry, executor registry, channel registration, and selector data with no compile-time completeness check across all of them.
- Provider modules repeat template helper registration, credential lookup, status publishing, and AI response extraction.
- The execution record is aggregate only; debugging a historical node failure depends heavily on Inngest/Sentry retention.
- Environment variables are asserted throughout integration setup rather than validated once with actionable startup errors.
- `src/lib/db.ts` contained tutorial-scale comment volume around a conventional singleton, while more consequential orchestration assumptions were lightly documented.

## Security findings

### High: public trigger authenticity

Google Form and Stripe webhook handlers accept a query-string workflow ID and arbitrary JSON, then enqueue the workflow. There is no Stripe signature verification, generated trigger secret, event-age validation, or replay protection. Workflow IDs act as bearer capabilities but are not treated or rotated as secrets.

Impact: a discovered ID can trigger cost-bearing AI/network work and inject attacker-controlled context.

### High: arbitrary server-side HTTP requests

The HTTP node validates URL syntax but permits all destinations reachable from the application runtime. There is no private-address/DNS protection, protocol allowlist, timeout, response cap, or redirect policy.

Impact: an untrusted workflow author may probe internal services or consume server resources.

### Medium: realtime tenancy

Realtime token actions and channels are provider-wide, not scoped to a user, workflow, or execution. The browser filters messages by node ID after subscription.

Impact: transient metadata can cross tenant boundaries if a client subscribes directly or node IDs are learned.

### Medium: credential response and edit semantics

Authenticated credential queries return encrypted values. Edit forms use that value as the input default and encrypt submitted values again.

Impact: ciphertext is unnecessarily exposed to the browser and unchanged edit submissions may make credentials undecryptable for provider use.

### Medium: workflow data contains secret-like URLs

Slack and Discord webhook URLs are stored in node JSON and returned with workflow editor data.

Impact: these bearer URLs appear in browser memory, database exports, and possibly diagnostics rather than following credential handling rules.

### Medium: sensitive observability defaults

AI input/output telemetry, client replay, logs, broad tracing, and error stack persistence are enabled.

Impact: webhook payloads, prompts, generated text, and integration responses may leave the primary database or remain in multiple retention systems.

### Low: encryption lifecycle

One unversioned `ENCRYPTION_KEY` protects all credential records. Rotation and recovery tooling do not exist.

Impact: key loss is destructive; ad hoc key changes cause an outage for stored credentials.

## Technical debt

- `Node.credentialId` and its relation exist, but AI configuration uses `Node.data.credentialId`.
- Stripe trigger data is temporarily duplicated under `initialData.googleForm`.
- Several Inngest executors use static step IDs even though repeated nodes of the same type are allowed.
- `auth.ts` constructs a Prisma client independently of the application singleton.
- Polar server selection is hardcoded to `sandbox`; `POLAR_SERVER` is present in environment configuration but ignored.
- OpenAI and Anthropic model IDs are hardcoded, while Gemini model selection is a separate weighted policy.
- The workflow graph is not versioned or snapshotted into executions.
- Cycles are rejected only when executing, not while connecting or saving.
- Concurrent editor sessions have no optimistic concurrency/revision guard.
- Realtime status is not correlated to an execution ID and is lost on reload.
- Duplicate workflow word-list files existed beside the active combined dictionary; they were safe to remove because no source imports referenced them.
- Root provider model-list scripts are manual tools without package scripts or documentation beyond the new README note.
- Sentry example routes/pages remain in the product tree and should be explicitly classified before removal; they were retained because they may still be used to verify deployment telemetry.

## Maintenance risks

- Changing graph save semantics can break connection cascades, stable node IDs, and execution configuration simultaneously.
- Changing Inngest step IDs can alter retry/resume behavior for in-flight or replayed runs.
- Retrying non-idempotent Slack, Discord, Stripe-triggered, or arbitrary HTTP workflows can duplicate side effects.
- Deleting credentials referenced through node JSON leaves workflows that load correctly but fail only at runtime.
- Provider model availability can change independently of compile-time checks.
- Losing or rotating encryption keys without a migration affects every tenant at once.
- A slow/unavailable Polar API can block premium creation because subscription checks are synchronous and uncached.
- `Execution.output` has no explicit size policy; large external responses can inflate database rows and client payloads.
- The baseline lint signal is noisy enough that new warnings can hide among existing failures.

## Tooling status

- `npx tsc --noEmit`: passes.
- `npm run build`: passes. The build emits existing warnings from optional OpenTelemetry Winston transport resolution through Inngest Realtime and from Handlebars' `require.extensions` usage in bundled executors.
- `npm run lint`: fails at baseline with 233 errors, 93 warnings, and 2 informational diagnostics after the stewardship cleanup.
- Biome reports a schema/CLI version mismatch (`2.2.0` config schema versus installed `2.5.0`), deprecated configuration, CRLF formatting differences, source lint findings, and SVG parse/accessibility findings.
- No `test` script or test files were found.
- Production build verification should remain a release check because it can depend on configured integrations and network access.

Mass-formatting and broad lint autofixes were intentionally excluded from this stewardship pass to avoid mixing behavioral changes with repository-wide churn.

## Conservative cleanup performed

- Removed three unreferenced duplicate workflow dictionary modules; the active lists remain in `src/lib/dictionary.ts`.
- Removed stale commented-out error injection and unused imports near workflow procedures.
- Replaced tutorial narration in the Prisma singleton with a focused explanation of its real invariant.
- Replaced promotional/future-facing learnings content with implementation-specific knowledge.
- Added `.env.example`, architecture inventory, onboarding, project memory, and this health report.

## Suggested documentation improvements

The current handoff set covers the repository. Add focused records when these areas change:

- an explicit webhook authentication contract and rotation runbook
- credential encryption key rotation and incident recovery runbook
- deployment-specific Inngest, Polar, Better Auth, and Sentry configuration
- data retention/classification policy for execution output and telemetry
- decision records for graph versioning, step idempotency, and execution snapshots
- test strategy once the first orchestration/security tests establish conventions
- UI screenshots after stable product views are available and approved for public documentation
