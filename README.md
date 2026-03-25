# 🔄 Automativ — AI-Native Workflow Automation Platform

A browser-based **AI-native workflow automation platform** that combines a visual drag-and-drop canvas, real-time execution feedback, multi-provider AI integrations, background job orchestration, and a complete SaaS business layer with authentication, payments, and subscriptions.

Automativ demonstrates how **reactive backend infrastructure, asynchronous job execution, visual workflow engines, and production-grade observability** can combine to create a **scalable, monetizable automation platform** — built entirely from scratch.

---

# ✨ What Makes Automativ Different

- **Visual workflow canvas** — drag-and-drop node editor built on React Flow with real-time execution state
- **Multi-provider AI nodes** — run OpenAI, Claude, and Gemini inside any workflow interchangeably
- **Reliable background execution** — long-running workflows execute via Inngest with automatic retries and pub-sub messaging
- **Template variable system** — pass data between nodes using dynamic placeholders for flexible data mapping
- **Production SaaS layer** — authentication, subscriptions, usage-based billing, and a billing portal out of the box
- **End-to-end type safety** — tRPC + Zod + Prisma from database schema to UI components

---

# 🧠 Core Architecture

| Technology                       | Purpose                                                  |
| -------------------------------- | -------------------------------------------------------- |
| ⚡ **Next.js 15 + TypeScript**   | Frontend framework and application architecture          |
| 🗄 **Prisma + Neon (Postgres)**  | Type-safe ORM with scalable cloud database               |
| 🔁 **tRPC v11 + TanStack Query** | End-to-end type-safe API and data fetching layer         |
| 🔐 **Better Auth**               | Authentication with GitHub and Google OAuth              |
| 💳 **Polar**                     | Payments, subscriptions, and usage-based billing         |
| ⚙️ **Inngest**                   | Background job execution, retries, and pub-sub messaging |
| 🎨 **React Flow**                | Visual drag-and-drop workflow canvas                     |
| 🤖 **AI SDK**                    | Multi-provider AI integration (OpenAI, Claude, Gemini)   |
| 📊 **Sentry**                    | Error tracking, session replay, and AI call telemetry    |
| 🧩 **Jotai**                     | Lightweight editor state management                      |
| 🐰 **CodeRabbit**                | AI-powered GitHub pull request review workflow           |
| 🔍 **Nooks**                     | URL-synchronized search and pagination state             |

---

# ⚙️ Workflow Engine

Automativ's core is a **node-based workflow engine** built around two node categories.

### Trigger Nodes

Workflow execution entry points:

- Webhook triggers
- Google Form submission listeners
- Stripe event listeners
- Manual triggers

### Execution Nodes

Actions that run inside a workflow:

- AI nodes — OpenAI, Claude, Gemini
- Messaging nodes — Discord, Slack
- HTTP request node with dynamic method and body configuration
- Template variable system for accessing data from upstream nodes

### Execution Architecture

Workflows execute via **Inngest background jobs**, decoupling execution from the UI. This enables:

- Non-blocking workflow runs — UI stays responsive during execution
- Automatic retries on transient failures
- Durable execution that survives server restarts
- Real-time status propagation via pub-sub messaging

---

# 🧩 System Design Insights

Automativ demonstrates several architectural patterns common in production automation platforms.

### Type-Safe Data Access Layer

tRPC serves as the API layer between Next.js and the database, providing:

- Fully typed procedures shared across client and server
- Zod validation on all inputs
- `protectedProcedure` middleware for authenticated routes
- `premiumProcedure` middleware for subscription-gated features
- Server-side callers for React Server Components with suspense and hydration

This eliminates an entire category of bugs where the client and server disagree on data shapes.

---

### Asynchronous Workflow Execution

Long-running tasks — AI inference, HTTP calls, external integrations — are executed through **Inngest workflows**, not inline API handlers.

Advantages:

- Zero UI blocking during execution
- Configurable retry policies per job type
- Workflow visibility in the Inngest dev dashboard
- Clean separation between triggering a workflow and observing its results

---

### Visual Canvas Architecture

The workflow editor is built on **React Flow** with custom node components.

Key implementation details:

- Custom node types registered per category (trigger, execution)
- Node state managed in React Flow instance via Jotai atom
- Editor save serializes current canvas state as a Prisma transaction
- Node status indicators (loading, success, error) update in real-time during execution
- Grid snapping and mini-map for editor usability
- Unique constraint on manual trigger nodes (max one per workflow)

---

### SaaS Business Layer

The full subscription infrastructure is handled by **Polar** as the merchant of record.

- Automatic customer creation on sign-up via Better Auth integration
- Checkout and billing portal flows
- React hooks for subscription status checks
- `premiumProcedure` backend middleware for feature gating
- Upgrade modal on forbidden resource access

---

### Observability and AI Monitoring

Sentry provides end-to-end visibility across:

- Frontend runtime errors
- Backend API failures
- Inngest background job crashes
- AI request tracking and latency per provider
- Token usage and cost per model
- Session replay for reconstructing user workflows that led to failures

AI telemetry via the Vercel AI SDK tracks per-request token input/output, per-model costs, and request frequency — critical for operating AI workflows at any meaningful scale without surprise billing.

---

# ⚡ Key Capabilities

## 🔄 Workflow Management

- Full workflow CRUD with URL-synchronized search and pagination
- Optimistic UI updates for instant feedback
- Type-safe pagination via Nooks
- Workflow naming with auto-generated slugs
- Server prefetching with client hydration via TanStack Query

---

## 🤖 AI-Powered Automation

- OpenAI, Claude, and Gemini nodes configurable per workflow
- AI SDK v5 with provider-agnostic interface
- Async AI job execution via Inngest with retry logic
- AI call monitoring including token usage and cost via Sentry

---

## 🎨 Visual Editor Experience

- Drag-and-drop canvas with pan, zoom, controls, background grid, and mini-map
- Node settings dialogs with React Hook Form and Zod validation
- Template variable syntax for cross-node data mapping
- Real-time node status indicators during execution
- Persistent canvas state saved as Prisma transaction
- Collapsible sidebar node selector

---

## 🔐 Authentication and Security

- Secure authentication via Better Auth
- GitHub and Google OAuth
- `protectedProcedure` and `premiumProcedure` tRPC middleware
- Server-side route protection with auth redirect
- External API keys stored server-side only

---

## 💳 Payments and Subscriptions

- Polar as merchant of record — handles tax, invoicing, and compliance
- Sandbox and production environments
- Checkout flow and customer billing portal
- Subscription status hooks for UI gating
- Automatic customer provisioning on sign-up

---

# 📚 Engineering Notes

This section documents the key technical decisions and lessons learned while building Automativ.

---

## Background Job Architecture

The central engineering decision in Automativ is **separating workflow triggering from workflow execution**.

When a user runs a workflow:

1. The tRPC mutation enqueues an Inngest event
2. Inngest picks up the event and begins executing nodes in sequence
3. Each node publishes status updates that the UI subscribes to in real-time
4. Failures at any node are retried automatically based on Inngest retry policy
5. The `onFailure` handler updates node state so the UI never gets stuck

This pattern is essential for any platform where individual steps can take 10–60 seconds.

---

## Type Safety Strategy

Automativ enforces type safety at every layer:

| Layer            | Technology                           |
| ---------------- | ------------------------------------ |
| Database schema  | Prisma schema + migrations           |
| API inputs       | Zod validators on tRPC procedures    |
| API responses    | tRPC inferred types                  |
| UI data fetching | TanStack Query with typed tRPC hooks |
| Forms            | React Hook Form + Zod resolver       |

The result: a schema change in Prisma surfaces as a TypeScript error in the UI before the app ever runs.

---

## URL State Management

Search queries and pagination parameters are stored in the URL via **Nooks**, making:

- Workflow list state bookmarkable and shareable
- Browser back/forward navigation work correctly
- Deep linking to filtered or paginated views possible

This is a small implementation detail with a large UX impact that most tutorial projects skip entirely.

---

## Key Engineering Takeaways

- Background job orchestration is the foundational pattern for reliable automation platforms
- Type safety across the full stack eliminates an entire class of integration bugs
- Separating tRPC into `protectedProcedure` and `premiumProcedure` gives clean, enforceable access control
- Visual workflow editors require careful state synchronization between React Flow and the persistence layer
- AI provider abstraction via AI SDK makes swapping or combining models trivial
- URL-synchronized state is a non-negotiable UX requirement for list views with search and pagination
- Observability is mandatory for AI systems — silent token spikes are a real operational risk
- Optimistic UI updates are the difference between a product that feels fast and one that feels like a demo
