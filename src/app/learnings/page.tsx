"use client";

import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Brain,
  CheckCircle2,
  Cloud,
  Cpu,
  Database,
  GitBranch,
  Globe,
  Home,
  Layers3,
  Lock,
  Radar,
  Rocket,
  Server,
  Sparkles,
  Workflow,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const pillars = [
  {
    icon: Workflow,
    title: "Visual Workflow Engine",
    desc: "A drag-and-drop node-based workflow editor powered by React Flow, enabling complex automation construction visually instead of manually wiring scripts.",
  },
  {
    icon: Bot,
    title: "Multi-Provider AI Execution",
    desc: "Run OpenAI, Claude, and Gemini inside workflows using a provider-agnostic abstraction layer via the AI SDK.",
  },
  {
    icon: Server,
    title: "Background Job Orchestration",
    desc: "Long-running execution is offloaded to Inngest for durable background processing, retries, and event-driven automation reliability.",
  },
  {
    icon: Database,
    title: "Type-Safe Persistence Layer",
    desc: "Prisma + Postgres power workflow storage, execution state, user data, subscriptions, and persistent platform state.",
  },
  {
    icon: Lock,
    title: "Authentication + SaaS Access Control",
    desc: "Better Auth secures authentication while premium feature access is enforced through typed backend middleware.",
  },
  {
    icon: Radar,
    title: "Observability & Monitoring",
    desc: "Sentry captures runtime failures, AI telemetry, execution crashes, and debugging visibility across frontend + backend systems.",
  },
];

const stack = [
  "Next.js 15",
  "React 19",
  "TypeScript",
  "TailwindCSS v4",
  "Prisma ORM",
  "Postgres",
  "Better Auth",
  "Polar",
  "Inngest",
  "TanStack Query",
  "tRPC v11",
  "Zod",
  "React Flow",
  "AI SDK",
  "Sentry",
  "Jotai",
];

const capabilities = [
  "Visual workflow CRUD",
  "Drag-and-drop automation canvas",
  "Webhook triggers",
  "Manual triggers",
  "AI provider nodes",
  "Dynamic template variable mapping",
  "External HTTP integrations",
  "Background async execution",
  "Automatic retries",
  "Subscription billing",
  "OAuth authentication",
  "Premium feature gating",
  "Real-time execution feedback",
  "Typed API layer",
];

export default function LearningsPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(167,139,250,0.14),transparent_35%),radial-gradient(circle_at_top_right,rgba(99,102,241,0.10),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(192,132,252,0.08),transparent_35%)]" />

      <div className="mx-auto max-w-7xl px-6 py-16 pb-40">
        {/* HERO */}
        <section className="mb-20 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/70 px-5 py-2 shadow-md backdrop-blur-xl">
            <Sparkles className="size-4 text-primary" />
            <span className="text-sm text-muted-foreground">
              Automativ System Architecture
            </span>
          </div>

          <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-6xl">
            AI-Native Workflow Automation Platform
          </h1>

          <p className="mx-auto max-w-4xl text-lg leading-relaxed text-muted-foreground">
            Automativ is a browser-based AI-native workflow automation platform
            combining visual workflow orchestration, background execution,
            multi-provider AI integrations, SaaS billing infrastructure,
            authentication, observability, and production-grade architecture.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button variant="shimmer" size="hero">
              Explore Architecture
              <ArrowRight />
            </Button>

            <Button variant="glass" size="hero">
              Production SaaS Design
              <Cloud />
            </Button>
          </div>
        </section>

        {/* CORE VISION */}
        <section className="mb-16 rounded-3xl border border-border/60 bg-card/60 p-10 shadow-2xl backdrop-blur-2xl">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <h2 className="mb-5 text-3xl font-semibold">
                Core Engineering Vision
              </h2>

              <p className="mb-5 leading-relaxed text-muted-foreground">
                Automativ demonstrates how modern AI systems should actually be
                built—not as toy demos, but as production-capable platforms with
                durable execution, architecture discipline, observability,
                monetization, and clean infrastructure boundaries.
              </p>

              <p className="mb-5 leading-relaxed text-muted-foreground">
                The central architectural decision is separating workflow
                triggering from workflow execution, enabling scalable automation
                without blocking UI interactions.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Button variant="workflow">
                  Execute Workflow
                  <Workflow />
                </Button>

                <Button variant="aiGlow">
                  AI Orchestration
                  <Brain />
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border border-border/60 bg-background/40 p-8 backdrop-blur-xl">
              <h3 className="mb-6 text-xl font-semibold">
                Key Product Characteristics
              </h3>

              <div className="space-y-4">
                {[
                  "Visual drag-and-drop workflow engine",
                  "Multi-provider AI execution",
                  "Durable async execution",
                  "Production SaaS billing layer",
                  "Type-safe full-stack architecture",
                  "Observability-first engineering",
                  "Extensible integration platform",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="size-5 text-primary" />
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SYSTEM PILLARS */}
        <section className="mb-16">
          <h2 className="mb-8 text-3xl font-semibold">System Pillars</h2>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;

              return (
                <div
                  key={pillar.title}
                  className="rounded-2xl border border-border/60 bg-card/60 p-6 shadow-lg backdrop-blur-xl"
                >
                  <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-primary/10">
                    <Icon className="size-6 text-primary" />
                  </div>

                  <h3 className="mb-3 text-xl font-semibold">{pillar.title}</h3>

                  <p className="leading-relaxed text-muted-foreground">
                    {pillar.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* STACK */}
        <section className="mb-16 rounded-3xl border border-border/60 bg-card/60 p-10 shadow-xl backdrop-blur-xl">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-3xl font-semibold">Technology Stack</h2>

              <p className="leading-relaxed text-muted-foreground">
                Modern full-stack architecture optimized for type safety,
                asynchronous reliability, production scalability, and
                maintainable engineering workflows.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {stack.map((item) => (
                <div
                  key={item}
                  className="rounded-full border border-border/60 bg-background/70 px-4 py-2 text-sm shadow-sm backdrop-blur-md"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ARCHITECTURE FLOW */}
        <section className="mb-16">
          <h2 className="mb-8 text-3xl font-semibold">
            Architecture Execution Flow
          </h2>

          <div className="rounded-3xl border border-border/60 bg-card/60 p-10 shadow-xl backdrop-blur-xl">
            <div className="grid gap-6 md:grid-cols-5">
              {[
                { icon: Layers3, label: "Frontend UI" },
                { icon: Brain, label: "AI Decision Layer" },
                { icon: Workflow, label: "Execution Engine" },
                { icon: Database, label: "Persistence" },
                { icon: Globe, label: "External Integrations" },
              ].map((step, idx) => {
                const Icon = step.icon;

                return (
                  <div
                    key={step.label}
                    className="flex flex-col items-center text-center"
                  >
                    <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary/10">
                      <Icon className="size-7 text-primary" />
                    </div>

                    <span className="font-medium">{step.label}</span>

                    {idx < 4 && (
                      <ArrowRight className="mt-6 hidden text-muted-foreground md:block" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CAPABILITIES */}
        <section className="mb-16 rounded-3xl border border-border/60 bg-card/60 p-10 shadow-xl backdrop-blur-xl">
          <h2 className="mb-8 text-3xl font-semibold">Platform Capabilities</h2>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {capabilities.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-2xl border border-border/50 bg-background/50 p-4 backdrop-blur-md"
              >
                <CheckCircle2 className="size-5 text-primary" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* FUTURE */}
        <section className="rounded-3xl border border-border/60 bg-card/60 p-10 shadow-xl backdrop-blur-xl">
          <h2 className="mb-6 text-3xl font-semibold">Long-Term Direction</h2>

          <p className="mb-8 max-w-5xl leading-relaxed text-muted-foreground">
            Automativ’s broader trajectory is evolving into a production-grade
            AI automation platform capable of intelligent orchestration,
            workflow composition, real-time execution visibility, subscription
            monetization, and enterprise-ready extensibility.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button variant="premium">
              AI Platform Evolution
              <Cpu />
            </Button>

            <Button variant="shimmer">
              Product Expansion
              <Rocket />
            </Button>

            <Button variant="glass">
              Observability
              <Zap />
            </Button>
          </div>
        </section>
      </div>

      {/* STICKY HOME */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/60 bg-background/70 p-5 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl justify-center">
          <Link href="/">
            <Button variant="shimmer" size="hero">
              <Home />
              Go To Home
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
