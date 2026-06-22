# Developer onboarding

This guide is for an engineer inheriting Automativ without access to its original author.

## First hour

1. Read `README.md` for product scope and current security boundaries.
2. Read `docs/ARCHITECTURE.md` for the subsystem map.
3. Read `PROJECT_MEMORY.md` before changing graph persistence or execution behavior.
4. Install dependencies with `npm install`.
5. Copy `.env.example` to `.env` and fill the services needed for your task.
6. Start PostgreSQL with `docker compose up -d`.
7. Apply migrations with `npx prisma migrate dev`.
8. Start the application with `npm run dev`, or start Next.js and Inngest separately for work that does not need a public tunnel.

## Local services

### PostgreSQL

`docker-compose.yaml` exposes PostgreSQL 16 on `localhost:5432` with the development-only `postgres/postgres` credentials. Its named volume persists across container restarts.

Use the example `DATABASE_URL`, then run:

```bash
npx prisma migrate dev
npx prisma generate
```

Never edit generated files under `src/generated/prisma`. Change the schema, create a migration, and regenerate.

### Next.js and Inngest

The combined command starts three long-running processes:

```bash
npm run dev
```

- Next.js on port 3000
- the Inngest dev server
- ngrok forwarding the configured public hostname to port 3000

If ngrok is not installed or no external trigger is needed:

```bash
npx next dev --turbopack
npm run inngest:dev
```

The Inngest dev server discovers the application function through `/api/inngest`. Ensure both processes are running before diagnosing a workflow that enqueues but never advances beyond `RUNNING`.

## Environment setup

Start from `.env.example`. Do not commit `.env` or `.env.sentry-build-plugin`.

| Variable group             | Needed for                                  |
| -------------------------- | ------------------------------------------- |
| `DATABASE_URL`             | all persisted application behavior          |
| Better Auth secret/URLs    | sessions and auth handlers                  |
| GitHub/Google client pairs | corresponding OAuth buttons                 |
| `NEXT_PUBLIC_APP_URL`      | trusted origin and webhook URL generation   |
| `NGROK_URL`                | combined dev command and external callbacks |
| `ENCRYPTION_KEY`           | credential creation and AI execution        |
| Polar variables            | checkout, portal, subscription gating       |
| Sentry variables           | runtime events and source-map upload        |
| root provider API keys     | optional model-list scripts only            |

An exclamation mark in application code is a TypeScript assertion, not runtime validation. Missing integration variables may therefore fail during module initialization or first use. Validate deployment configuration outside the process.

## Trace a workflow execution

Use this path when debugging a run:

1. `ExecuteWorkflowButton` reads the React Flow instance from `editorAtom`.
2. `useUpdateWorkflow` calls `workflows.update` and waits for the graph transaction.
3. `useExecuteWorkflow` calls `workflows.execute`.
4. The procedure verifies ownership and calls `sendWorkflowExecution`.
5. Inngest receives `workflows/execute.workflow` in `src/inngest/functions.ts`.
6. `create-execution` inserts the `RUNNING` record.
7. `prepare-workflow` loads and topologically sorts the current graph.
8. `getExecutor` selects an implementation for each persisted `NodeType`.
9. The executor publishes status and returns an updated context.
10. `update-execution` persists success and output, or `onFailure` persists failure details.
11. Execution list/detail tRPC queries scope results through the workflow owner.

When status is wrong, inspect three different states separately:

- durable Inngest step/run state
- durable `Execution` row state
- transient browser node-status state

They serve different purposes and are not automatically reconstructed from one another.

## Add a node

Follow every step; a partial registration usually compiles but fails at runtime or renders as an unknown node.

1. Add the type to `NodeType` in `prisma/schema.prisma` and create a migration.
2. Add a node directory under `features/triggers/components` or `features/executions/components`.
3. Implement the settings dialog. Store serializable configuration only in React Flow `node.data`.
4. Implement the React Flow node component and use the shared base trigger/execution component.
5. Add a typed `NodeExecutor`. Validate required configuration before side effects.
6. Use node-specific Inngest step IDs, normally including `nodeId`.
7. Add a realtime channel and authenticated/scoped token action as appropriate.
8. Register the renderer in `node-components.ts`.
9. Register the executor in `executor-registry.ts`.
10. Register the channel on `executeWorkflow`.
11. Add the node to `node-selector.ts`.
12. Exercise save/load, duplicate nodes, cycles, failures, retries, execution history, and deletion.

Keep the context contract explicit. Action output should merge the previous context and write beneath the configured variable name. A node that returns a fresh object without spreading context silently removes all upstream data.

## Add an AI provider

In addition to the node checklist:

1. Add a `CredentialType` and migration.
2. Add the provider option and help text to credential UI.
3. Add the provider package and construct its client only on the server.
4. Query credentials with both `credentialId` and workflow `userId`.
5. Decrypt immediately before client construction; never put plaintext into node data, context, logs, or responses.
6. Decide whether model selection is fixed, weighted, or user-configurable and keep UI copy synchronized.
7. Decide which prompts and outputs may be sent to Sentry/AI telemetry.
8. Verify provider errors reach node status, Inngest failure state, and execution history without exposing the key.

The current provider modules are intentionally explicit and repetitive. Do not introduce a generalized provider framework until it removes actual maintenance cost across concrete providers.

## Database changes

1. Edit `prisma/schema.prisma`.
2. Run `npx prisma migrate dev --name <descriptive_name>` against a disposable development database.
3. Review the generated SQL, especially cascade behavior, defaults, and indexes.
4. Run `npx prisma generate`.
5. Update tRPC input/output transformations and docs.
6. Verify both an empty database and data created by prior migrations.

Do not rewrite old migrations after they have been deployed. Add a new migration.

## Review checklist

- Does every resource query enforce ownership at the database filter?
- Can a user-provided URL reach private infrastructure?
- Does any response, log, context, or telemetry contain plaintext credentials?
- Is the Inngest step ID unique when the same node type appears twice?
- Does retrying repeat a non-idempotent external side effect?
- Does graph save preserve IDs and valid edge endpoints?
- Does a new list query have a supporting index and bounded page size?
- Do client mutations invalidate all affected TanStack Query keys?
- Does a public webhook verify authenticity and prevent replay?
- Are provider model names and product/billing environments still valid?

## Verification commands

```bash
npx tsc --noEmit
npm run lint
npm run build
```

There is no test runner or test suite at present. Add focused automated coverage when changing orchestration, authorization, credential handling, or graph persistence; those systems have the highest blast radius.
