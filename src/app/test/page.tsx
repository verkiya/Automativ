"use client";

import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Brain,
  Home,
  Loader2,
  Rocket,
  Shield,
  Sparkles,
  Workflow,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const variants = [
  "default",
  "gradient",
  "shimmer",
  "aiGlow",
  "glass",
  "shimmerGlass",
  "frost",
  "premium",
  "workflow",
  "success",
  "destructive",
  "outline",
  "secondary",
  "subtle",
  "node",
  "ghost",
  "ghostSoft",
  "toolbar",
  "floating",
  "midnight",
] as const;

const sizes = ["xs", "sm", "default", "lg", "xl", "hero"] as const;

export default function TestPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* HERO */}
        <section className="mb-20 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2 shadow-md">
            <Sparkles className="size-4 text-primary" />
            <span className="text-sm text-muted-foreground">
              Automativ Design System Playground
            </span>
          </div>

          <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-6xl">
            Premium Button System
          </h1>

          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-muted-foreground">
            Production-grade button primitives aligned with Automativ’s premium
            AI-native visual language.
          </p>
        </section>

        {/* HERO CTAS */}
        <section className="mb-16 rounded-3xl border border-border bg-card p-10 shadow-2xl">
          <h2 className="mb-8 text-2xl font-semibold">Hero CTAs</h2>

          <div className="flex flex-wrap gap-5">
            <Button variant="gradient" size="hero">
              Start Building
              <Rocket />
            </Button>

            <Button variant="workflow" size="hero">
              Launch Workflow
              <Workflow />
            </Button>

            <Button variant="aiGlow" size="hero">
              AI Orchestration
              <Brain />
            </Button>

            <Button variant="premium" size="hero">
              Upgrade Plan
              <Sparkles />
            </Button>
          </div>
        </section>

        {/* ALL VARIANTS */}
        <section className="mb-16">
          <h2 className="mb-8 text-2xl font-semibold">All Variants</h2>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {variants.map((variant) => (
              <div
                key={variant}
                className="rounded-2xl border border-border bg-card p-6 shadow-lg"
              >
                <h3 className="mb-5 text-sm font-medium capitalize text-muted-foreground">
                  {variant}
                </h3>

                <Button variant={variant}>
                  {variant}
                  <ArrowRight />
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/* SIZES */}
        <section className="mb-16 rounded-3xl border border-border bg-card p-10 shadow-xl">
          <h2 className="mb-8 text-2xl font-semibold">Sizes</h2>

          <div className="flex flex-wrap items-end gap-4">
            {sizes.map((size) => (
              <Button key={size} variant="gradient" size={size}>
                {size}
              </Button>
            ))}
          </div>
        </section>

        {/* EFFECTS */}
        <section className="mb-16 rounded-3xl border border-border bg-card p-10 shadow-xl">
          <h2 className="mb-8 text-2xl font-semibold">Effects</h2>

          <div className="flex flex-wrap gap-5">
            <Button variant="shimmer" size="lg">
              Shimmer
              <Sparkles />
            </Button>

            <Button variant="shimmerGlass" size="lg">
              Glass Sheen
              <Sparkles />
            </Button>

            <Button variant="midnight" size="lg">
              Midnight
              <Shield />
            </Button>

            <Button variant="aiGlow" size="lg">
              AI Glow
              <Bot />
            </Button>
          </div>
        </section>

        {/* LOADING */}
        <section className="mb-16 rounded-3xl border border-border bg-card p-10 shadow-xl">
          <h2 className="mb-8 text-2xl font-semibold">Loading States</h2>

          <div className="flex flex-wrap gap-5">
            <Button variant="loading" disabled>
              <Loader2 className="animate-spin" />
              Processing...
            </Button>

            <Button variant="loadingGlass" disabled>
              <Loader2 className="animate-spin" />
              Authenticating...
            </Button>

            <Button variant="workflow" disabled>
              <Loader2 className="animate-spin" />
              Running Workflow...
            </Button>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="rounded-3xl border border-border bg-card p-12 shadow-2xl text-center">
          <h2 className="mb-4 text-3xl font-semibold">
            Build Premium Interfaces Faster
          </h2>

          <p className="mx-auto mb-8 max-w-2xl leading-relaxed text-muted-foreground">
            Reusable UI primitives for AI-native SaaS products.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="premium" size="hero">
              Launch Product
              <Rocket />
            </Button>

            <Link href="/">
              <Button variant="glass" size="hero">
                <Home />
                Back Home
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
