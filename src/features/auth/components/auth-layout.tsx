"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Bot, Cpu, Sparkles, Workflow } from "lucide-react";

const icons = [
  "/github.svg",
  "/google.svg",
  "/openai.svg",
  "/slack.svg",
  "/discord.svg",
  "/vercel.svg",
  "/stripe.svg",
  "/anthropic.svg",
];

const nodes = [
  { id: 0, x: 74, y: 18, icon: icons[0] },
  { id: 1, x: 88, y: 28, icon: icons[1] },
  { id: 2, x: 78, y: 44, icon: icons[2] },
  { id: 3, x: 92, y: 56, icon: icons[3] },
  { id: 4, x: 70, y: 66, icon: icons[4] },
  { id: 5, x: 84, y: 78, icon: icons[5] },
  { id: 6, x: 62, y: 36, icon: icons[6] },
  { id: 7, x: 96, y: 14, icon: icons[7] },
];

const connections = [
  [0, 2],
  [2, 4],
  [1, 3],
  [3, 5],
  [6, 2],
  [2, 3],
];

const brandPills = [
  {
    name: "OpenAI",
    className: "bg-emerald-600 text-white border-emerald-500/30",
  },
  {
    name: "Anthropic",
    className: "bg-amber-700 text-white border-amber-600/30",
  },
  {
    name: "Google",
    className: "bg-blue-600 text-white border-blue-500/30",
  },
  {
    name: "Slack",
    className: "bg-fuchsia-700 text-white border-fuchsia-600/30",
  },
  {
    name: "Stripe",
    className: "bg-indigo-600 text-white border-indigo-500/30",
  },
];

function BackgroundAnimation() {
  return (
    <div className="pointer-events-none absolute inset-y-0 right-[-8%] w-[72%] overflow-hidden">
      <motion.div
        className="absolute top-[2%] right-[14%] h-[340px] w-[340px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(124,58,237,0.16), transparent 68%)",
        }}
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute bottom-[10%] right-[8%] h-[300px] w-[300px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(6,182,212,0.14), transparent 68%)",
        }}
        animate={{
          scale: [1.05, 1, 1.05],
          opacity: [0.75, 0.95, 0.75],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <svg className="absolute inset-0 h-full w-full">
        {connections.map(([from, to], i) => (
          <motion.line
            key={i}
            x1={`${nodes[from].x}%`}
            y1={`${nodes[from].y}%`}
            x2={`${nodes[to].x}%`}
            y2={`${nodes[to].y}%`}
            stroke="rgba(124,58,237,0.12)"
            strokeWidth="1"
            animate={{
              opacity: [0.2, 0.55, 0.2],
            }}
            transition={{
              duration: 4,
              delay: i * 0.35,
              repeat: Infinity,
            }}
          />
        ))}
      </svg>

      <svg className="absolute inset-0 h-full w-full">
        {connections.map(([from, to], i) => (
          <motion.circle
            key={i}
            r="2.8"
            fill="#06b6d4"
            initial={{
              cx: `${nodes[from].x}%`,
              cy: `${nodes[from].y}%`,
            }}
            animate={{
              cx: [`${nodes[from].x}%`, `${nodes[to].x}%`],
              cy: [`${nodes[from].y}%`, `${nodes[to].y}%`],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 6,
              delay: i * 1.05,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </svg>

      {nodes.map((node, i) => (
        <motion.div
          key={node.id}
          className="absolute flex h-11 w-11 items-center justify-center rounded-2xl border border-white/50 bg-white/70 shadow-xl backdrop-blur-xl"
          style={{
            left: `${node.x}%`,
            top: `${node.y}%`,
          }}
          animate={{
            y: [-4, 4, -4],
            scale: [0.98, 1.03, 0.98],
          }}
          transition={{
            duration: 6 + i * 0.25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Image src={node.icon} alt="" width={22} height={22} />
        </motion.div>
      ))}

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(248,250,252,1) 0%, rgba(248,250,252,0.94) 18%, rgba(248,250,252,0.55) 34%, transparent 56%)",
        }}
      />
    </div>
  );
}

function Feature({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.18 }}
      className="flex items-center gap-3 rounded-2xl border border-white/50 bg-white/60 px-4 py-3 shadow-lg backdrop-blur-xl"
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 via-indigo-500 to-cyan-500 text-white shadow-md">
        {icon}
      </div>

      <span className="text-sm font-semibold tracking-tight">{title}</span>
    </motion.div>
  );
}

function WorkflowPreview() {
  return (
    <div className="mt-7 rounded-3xl border border-white/60 bg-white/65 p-4 shadow-2xl backdrop-blur-2xl">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold">Workflow Execution</p>
          <p className="text-[11px] text-muted-foreground">
            AI orchestration live
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Running
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {["OpenAI", "Slack", "Stripe", "Done"].map((step, i) => (
          <div key={step} className="flex items-center gap-2">
            <div className="rounded-xl border border-white/60 bg-white/80 px-3 py-2 text-xs font-medium shadow-sm">
              {step}
            </div>
            {i < 3 && <ArrowRight className="size-3.5 text-cyan-500" />}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative h-screen overflow-hidden bg-background">
      <BackgroundAnimation />

      <div className="relative z-10 grid h-screen grid-cols-1 lg:grid-cols-2">
        <div className="hidden lg:flex flex-col justify-center px-14 xl:px-20">
          <Link href="/" className="mb-8 flex items-center gap-4">
            <Image src="/logo.svg" alt="Automativ" width={54} height={54} />
            <span className="-ml-5 text-4xl font-bold tracking-tight">
              utomativ
            </span>
          </Link>

          <div className="max-w-xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/75 px-4 py-2 shadow-sm backdrop-blur-xl">
              <Sparkles className="size-4 text-primary" />
              <span className="text-xs font-medium text-muted-foreground tracking-wide">
                AI-NATIVE WORKFLOW AUTOMATION
              </span>
            </div>

            <h1 className="mb-5 text-5xl font-bold leading-[1.05] tracking-tight">
              Automate work.
              <br />
              Orchestrate agents.
              <br />
              Scale execution.
            </h1>

            <p className="mb-6 max-w-lg text-base leading-relaxed text-muted-foreground">
              Connect apps, trigger workflows, run AI agents, and automate
              repetitive execution with intelligent orchestration.
            </p>

            <div className="mb-6 flex flex-wrap gap-2">
              {brandPills.map((brand) => (
                <div
                  key={brand.name}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold shadow-sm ${brand.className}`}
                >
                  {brand.name}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Feature
                icon={<Workflow className="size-4" />}
                title="Visual workflow builder"
              />
              <Feature
                icon={<Bot className="size-4" />}
                title="AI agent execution"
              />
              <Feature
                icon={<Cpu className="size-4" />}
                title="Async execution engine"
              />
              <Feature
                icon={<Sparkles className="size-4" />}
                title="Realtime triggers"
              />
            </div>

            <WorkflowPreview />
          </div>
        </div>

        <div className="flex items-center justify-center px-6 py-6 md:px-10">
          <div className="relative w-full max-w-lg">
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-violet-500/20 via-indigo-500/10 to-cyan-500/18 blur-2xl" />

            <div className="relative rounded-[2rem] border border-white/60 bg-white/78 p-6 shadow-2xl backdrop-blur-3xl md:p-8">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-20 rounded-t-[2rem] bg-gradient-to-b from-white/40 to-transparent" />
              <div className="pointer-events-none absolute inset-2 rounded-[1.65rem] border border-white/20" />

              <div className="relative mb-5 flex items-center gap-3 lg:hidden">
                <Image src="/logo.svg" alt="Automativ" width={42} height={42} />
                <span className="text-xl font-bold">Automativ</span>
              </div>

              <div className="relative">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
