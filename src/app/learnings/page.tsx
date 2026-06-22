import {
  AlertTriangle,
  ArrowLeft,
  Braces,
  CheckCircle2,
  Clock3,
  Database,
  GitBranch,
  KeyRound,
  ListChecks,
  LockKeyhole,
  Network,
  Radio,
  Route,
  SearchCode,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import Link from "next/link";

const lessons = [
  {
    icon: Workflow,
    title: "Save before enqueueing",
    area: "Execution",
    summary:
      "The canvas and the worker do not read from the same state. React Flow owns unsaved browser state, while Inngest reads the persisted graph from PostgreSQL. The execute button therefore saves first and only emits the event after the graph update resolves.",
    evidence:
      "ExecuteWorkflowButton awaits workflows.update before workflows.execute. The worker still loads the graph after enqueue, so executions are not immutable snapshots.",
    watchFor:
      "Do not add a faster execute path that skips save. It will reintroduce runs that do not match what the user sees on the canvas.",
  },
  {
    icon: GitBranch,
    title: "Sequential DAG execution keeps context understandable",
    area: "Workflow engine",
    summary:
      "Nodes are topologically sorted and run one at a time. This makes the context contract simple: each node receives one accumulated object and returns the next accumulated object.",
    evidence:
      "topologicalSort rejects cycles during execution. Disconnected nodes are included, but ordering between independent branches is not a stable business promise.",
    watchFor:
      "Parallel branch execution needs an explicit merge policy before it is safe to implement.",
  },
  {
    icon: Database,
    title: "Replace-all graph persistence is intentional",
    area: "Prisma",
    summary:
      "A save deletes existing graph rows and recreates the submitted nodes and connections inside one transaction. This avoids partial writes and keeps the server translation easy to audit.",
    evidence:
      "workflows.update preserves React Flow node IDs while recreating nodes because connections refer to those IDs.",
    watchFor:
      "Concurrent editors are last-write-wins. Add revisions before promising collaborative editing or conflict warnings.",
  },
  {
    icon: Braces,
    title: "Workflow context is a public internal API",
    area: "Data flow",
    summary:
      "Trigger payloads and action outputs share a flat context object. Handlebars expressions in later nodes depend on exact top-level variable names and output shapes.",
    evidence:
      "Executors are expected to return the previous context plus their named output. A missing spread silently removes upstream data.",
    watchFor:
      "Changing an executor's output shape can break saved workflows even when TypeScript still passes.",
  },
  {
    icon: KeyRound,
    title: "Encryption and authorization solve different problems",
    area: "Credentials",
    summary:
      "Credential values are encrypted at rest, but executors still need an ownership predicate. Ciphertext is not a permission boundary.",
    evidence:
      "AI executors query by credential ID and workflow owner ID before decrypting server-side.",
    watchFor:
      "The credential edit flow can double-encrypt unchanged ciphertext. Fixing that requires a UI/API contract change, not just a crypto helper change.",
  },
  {
    icon: Radio,
    title: "Realtime status is presentation state",
    area: "Inngest",
    summary:
      "Realtime messages help the editor feel alive during a run. They are not the durable audit trail and they are not reconstructed from execution history.",
    evidence:
      "The browser subscribes to provider-specific channels and filters incoming messages by node ID.",
    watchFor:
      "Node status should eventually be correlated to execution ID if simultaneous runs become common.",
  },
  {
    icon: Network,
    title: "External side effects are not exactly-once by default",
    area: "Operations",
    summary:
      "Inngest steps are durable, but a provider can accept a request before the step result is recorded. Retrying Slack, Discord, arbitrary HTTP, or AI calls can repeat work.",
    evidence:
      "The HTTP executor already includes nodeId in its step identity; several repeated node-capable executors still use static step names.",
    watchFor:
      "Use idempotency keys or node-specific durable step IDs before adding high-value side effects.",
  },
  {
    icon: ShieldCheck,
    title: "Public trigger URLs need a trust model",
    area: "Security",
    summary:
      "Authenticated tRPC execution checks ownership. Public Google Form and Stripe route handlers are separate entry points and currently trust the workflow ID.",
    evidence:
      "Both routes parse request JSON and enqueue an Inngest event without signature validation, shared trigger secret validation, event age checks, or replay controls.",
    watchFor:
      "Workflow IDs are identifiers. They should not be treated as long-lived webhook secrets.",
  },
  {
    icon: LockKeyhole,
    title: "Stored workflow data can contain secret-like values",
    area: "Data classification",
    summary:
      "Provider API keys use the credential table, but Slack and Discord webhook URLs are saved inside node configuration JSON and returned to the editor.",
    evidence:
      "The graph load path returns node data so dialogs can be edited. That includes integration configuration stored directly on nodes.",
    watchFor:
      "Do not assume all secrets go through Credential. Audit node data before exporting, logging, or broadening telemetry.",
  },
  {
    icon: Clock3,
    title: "Executions are records of outcomes, not records of code",
    area: "History",
    summary:
      "An execution row stores aggregate status, final output, and failure details. It does not store the graph definition, executor version, per-node output, or model configuration used at the time.",
    evidence:
      "executeWorkflow loads the current workflow graph after enqueue. Execution.output is one JSON blob for the terminal context.",
    watchFor:
      "Historical debugging will remain limited until graph snapshots or per-node execution rows are added.",
  },
];

const decisions = [
  {
    decision: "Normalized Node and Connection rows",
    reason:
      "The database can enforce workflow ownership, cascade graph deletion, and keep connection endpoints queryable instead of hiding the entire graph in one JSON field.",
    cost: "The editor and server need a translation layer between React Flow objects and Prisma rows.",
    files: "prisma/schema.prisma, workflows router",
  },
  {
    decision: "Replace graph on save",
    reason:
      "A single transaction is straightforward, avoids partial graph persistence, and keeps complex diff logic out of the editor.",
    cost: "No partial updates, no revision guard, and concurrent saves overwrite each other.",
    files: "src/features/workflows/server/routers.ts",
  },
  {
    decision: "Explicit provider modules",
    reason:
      "OpenAI, Anthropic, and Gemini each have provider-specific model behavior, UI copy, credentials, and status channels.",
    cost: "Prompt compilation, credential lookup, response extraction, and status publishing are repeated.",
    files: "src/features/executions/components/*",
  },
  {
    decision: "Server prefetch plus browser hydration",
    reason:
      "Route components can authenticate and prefetch while TanStack Query remains the browser mutation and cache layer.",
    cost: "Prefetch inputs, URL params, hook keys, and procedure schemas must stay synchronized.",
    files: "src/trpc, feature prefetch modules",
  },
  {
    decision: "Separate dashboard and editor shells",
    reason:
      "List pages use normal dashboard chrome while the workflow editor gets the full browser viewport.",
    cost: "Route groups make the file hierarchy more complex than the public URL hierarchy.",
    files: "src/app/(dashboard)",
  },
  {
    decision: "Premium creation, protected maintenance",
    reason:
      "New workflows and credentials are gated by Polar state, while existing owned resources remain manageable through authentication and ownership checks.",
    cost: "This product policy is easy to accidentally change while moving procedure middleware.",
    files: "src/trpc/init.ts, feature routers",
  },
];

const debugging = [
  {
    symptom: "Execution stays RUNNING",
    checks:
      "Confirm both Next.js and the Inngest dev server are running. Inspect the Inngest run, then check whether onFailure could find the Execution row by event ID.",
  },
  {
    symptom: "Canvas changes did not execute",
    checks:
      "Verify workflows.update completed before workflows.execute. Inspect persisted nodes and connections because the worker does not read unsaved browser state.",
  },
  {
    symptom: "AI node says credential not found",
    checks:
      "Check credentialId in node data, confirm the credential belongs to the workflow owner, and verify the credential was not deleted after the node was configured.",
  },
  {
    symptom: "AI node cannot decrypt",
    checks:
      "Confirm ENCRYPTION_KEY has not changed. Then check whether an edit form submitted encrypted ciphertext as if it were plaintext.",
  },
  {
    symptom: "Node status looks stale",
    checks:
      "Separate realtime state from execution history. Check provider channel subscription, node ID filtering, and whether another run reused the same node IDs.",
  },
  {
    symptom: "Template output is malformed",
    checks:
      "Inspect the accumulated context shape and variable name. HTTP templates disable HTML escaping; AI/message executors compile or decode templates differently.",
  },
  {
    symptom: "A repeated node behaves strangely",
    checks:
      "Review Inngest step IDs. Static step names are risky when the same node type can appear multiple times in one workflow.",
  },
  {
    symptom: "External trigger runs unexpectedly",
    checks:
      "Inspect the public webhook route and payload. Current Google Form and Stripe endpoints do not validate sender authenticity or replay.",
  },
];

const codePointers = [
  {
    label: "Graph save and execute procedures",
    path: "src/features/workflows/server/routers.ts",
    note: "Ownership checks, graph replacement, name generation, and Inngest event dispatch live here.",
  },
  {
    label: "Workflow worker",
    path: "src/inngest/functions.ts",
    note: "Creates execution rows, loads the graph, registers realtime channels, runs executors, and records success or failure.",
  },
  {
    label: "Graph utilities",
    path: "src/inngest/utils.ts",
    note: "Sends Inngest events and turns persisted connections into a topological node order.",
  },
  {
    label: "Executor registry",
    path: "src/features/executions/lib/executor-registry.ts",
    note: "Maps persisted NodeType values to server-side executor implementations.",
  },
  {
    label: "React Flow editor",
    path: "src/features/editor/components/editor.tsx",
    note: "Owns unsaved node and edge state until a save serializes it through tRPC.",
  },
  {
    label: "Credential encryption",
    path: "src/lib/encryption.ts",
    note: "Wraps Cryptr and requires ENCRYPTION_KEY server-side.",
  },
  {
    label: "Auth and premium middleware",
    path: "src/trpc/init.ts",
    note: "Builds protected and premium procedure middleware used by feature routers.",
  },
  {
    label: "Public trigger routes",
    path: "src/app/api/webhooks",
    note: "Development-facing webhook entry points that currently treat workflowId as the capability.",
  },
];

const invariants = [
  "Resource ownership belongs in the Prisma query predicate.",
  "An executor returns the complete next context, not only its own output.",
  "React Flow node IDs and persisted connection endpoints must agree within one save.",
  "Plaintext provider keys stay on the server and out of workflow context, logs, responses, and telemetry.",
  "A repeated node type needs node-specific durable step identity.",
  "Realtime status is a convenience; Execution rows are the durable aggregate record.",
  "Applied Prisma migrations are historical records and are not rewritten.",
  "nodebase-main can explain origins but never overrides Automativ behavior.",
  "Public trigger routes are not trusted just because a request contains a workflow ID.",
  "Provider model names are operational configuration and can become stale independently of the UI.",
];

const riskCards = [
  {
    title: "Webhook authenticity",
    level: "High",
    detail:
      "Google Form and Stripe routes can enqueue workflows from arbitrary JSON. Add a generated trigger secret, provider signature verification where applicable, event age checks, and replay storage before trusting them in production.",
  },
  {
    title: "Server-side HTTP reachability",
    level: "High",
    detail:
      "HTTP nodes can request arbitrary URLs from the application runtime. Private network protection, redirect policy, timeouts, and response-size limits are not yet implemented.",
  },
  {
    title: "Credential edit semantics",
    level: "Medium",
    detail:
      "Credential list/detail procedures expose ciphertext to authenticated clients. Editing without entering a new plaintext value can turn ciphertext into newly encrypted ciphertext.",
  },
  {
    title: "Observability data",
    level: "Medium",
    detail:
      "Sentry replay, traces, logs, error stacks, AI telemetry, prompts, provider responses, and execution output need a data classification policy before sensitive workloads.",
  },
];

export default function LearningsPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <Link
          href="/workflows"
          className="mb-10 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to workflows
        </Link>

        <header className="mb-14 max-w-5xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-sm text-muted-foreground">
            <Route className="size-4" />
            Engineering knowledge base
          </div>
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            What Automativ teaches maintainers
          </h1>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            This page is the in-product memory for engineering decisions,
            operational traps, debugging paths, and security boundaries. It is
            deliberately specific to this repository. It should help a future
            maintainer understand not only what exists, but why small-looking
            changes can have large effects.
          </p>
        </header>

        <section className="mb-16 grid gap-5 md:grid-cols-3">
          <article className="rounded-2xl border bg-card p-6 shadow-sm">
            <Workflow className="mb-5 size-7 text-primary" />
            <h2 className="text-xl font-semibold">Core mental model</h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              Automativ is a saved graph plus a background runner. The editor is
              an authoring surface; PostgreSQL is what Inngest executes.
            </p>
          </article>
          <article className="rounded-2xl border bg-card p-6 shadow-sm">
            <Database className="mb-5 size-7 text-primary" />
            <h2 className="text-xl font-semibold">Data contract</h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              Nodes and connections are normalized rows, while node-specific
              settings live in JSON. Context between nodes is a flat object.
            </p>
          </article>
          <article className="rounded-2xl border bg-card p-6 shadow-sm">
            <ShieldCheck className="mb-5 size-7 text-primary" />
            <h2 className="text-xl font-semibold">Boundary to respect</h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              Authenticated tRPC paths are user-scoped. Public trigger routes,
              arbitrary HTTP nodes, and telemetry are separate trust surfaces.
            </p>
          </article>
        </section>

        <section className="mb-16">
          <div className="mb-7 flex items-center gap-3">
            <Workflow className="size-6 text-primary" />
            <h2 className="text-2xl font-semibold">Lessons worth preserving</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {lessons.map((lesson) => {
              const Icon = lesson.icon;
              return (
                <article
                  key={lesson.title}
                  className="rounded-2xl border bg-card p-6 shadow-sm"
                >
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </div>
                    <span className="rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground">
                      {lesson.area}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold">{lesson.title}</h3>
                  <p className="mt-3 leading-7 text-muted-foreground">
                    {lesson.summary}
                  </p>
                  <div className="mt-5 border-l-2 border-primary/30 pl-4 text-sm leading-6 text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      Repository evidence:{" "}
                    </span>
                    {lesson.evidence}
                  </div>
                  <div className="mt-4 rounded-xl bg-muted/50 p-4 text-sm leading-6 text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      Watch for:{" "}
                    </span>
                    {lesson.watchFor}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mb-16">
          <div className="mb-7 flex items-center gap-3">
            <GitBranch className="size-6 text-primary" />
            <h2 className="text-2xl font-semibold">Decision tradeoffs</h2>
          </div>
          <div className="overflow-hidden rounded-2xl border bg-card">
            {decisions.map((item, index) => (
              <article
                key={item.decision}
                className={`grid gap-3 p-6 lg:grid-cols-[1fr_2fr_2fr_1.2fr] ${
                  index === decisions.length - 1 ? "" : "border-b"
                }`}
              >
                <h3 className="font-semibold">{item.decision}</h3>
                <p className="text-sm leading-6 text-muted-foreground">
                  <span className="font-medium text-foreground">Why: </span>
                  {item.reason}
                </p>
                <p className="text-sm leading-6 text-muted-foreground">
                  <span className="font-medium text-foreground">Cost: </span>
                  {item.cost}
                </p>
                <p className="text-sm leading-6 text-muted-foreground">
                  <span className="font-medium text-foreground">Look at: </span>
                  {item.files}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <div className="mb-7 flex items-center gap-3">
            <SearchCode className="size-6 text-primary" />
            <h2 className="text-2xl font-semibold">Where to look first</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {codePointers.map((item) => (
              <article
                key={item.label}
                className="rounded-2xl border bg-card p-5"
              >
                <h3 className="font-semibold">{item.label}</h3>
                <code className="mt-3 block rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
                  {item.path}
                </code>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {item.note}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <div className="mb-7 flex items-center gap-3">
            <AlertTriangle className="size-6 text-amber-600" />
            <h2 className="text-2xl font-semibold">Debugging discoveries</h2>
          </div>
          <div className="grid gap-4">
            {debugging.map((item) => (
              <article
                key={item.symptom}
                className="rounded-2xl border bg-card p-5 md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-8"
              >
                <h3 className="font-semibold">{item.symptom}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground md:mt-0">
                  {item.checks}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <div className="mb-7 flex items-center gap-3">
            <AlertTriangle className="size-6 text-destructive" />
            <h2 className="text-2xl font-semibold">Risk register highlights</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {riskCards.map((risk) => (
              <article
                key={risk.title}
                className="rounded-2xl border bg-card p-6 shadow-sm"
              >
                <div className="mb-4 flex items-center justify-between gap-4">
                  <h3 className="font-semibold">{risk.title}</h3>
                  <span className="rounded-full border border-destructive/30 bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive">
                    {risk.level}
                  </span>
                </div>
                <p className="text-sm leading-6 text-muted-foreground">
                  {risk.detail}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border bg-card p-7 md:p-9">
          <div className="mb-6 flex items-center gap-3">
            <ListChecks className="size-6 text-primary" />
            <h2 className="text-2xl font-semibold">Maintenance invariants</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {invariants.map((invariant) => (
              <div key={invariant} className="flex items-start gap-3">
                <CheckCircle2 className="mt-1 size-4 shrink-0 text-primary" />
                <p className="text-sm leading-6 text-muted-foreground">
                  {invariant}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-8 border-t pt-6 text-sm leading-6 text-muted-foreground">
            Deeper subsystem maps, operational warnings, and onboarding steps
            live in <code>docs/ARCHITECTURE.md</code>,{" "}
            <code>PROJECT_MEMORY.md</code>,{" "}
            <code>docs/ONBOARDING.md</code>, and{" "}
            <code>docs/REPOSITORY_HEALTH.md</code>.
          </p>
        </section>
      </div>
    </main>
  );
}
