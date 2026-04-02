"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const icons = [
  "/github.svg",
  "/google.svg",
  "/openai.svg",
  "/slack.svg",
  "/discord.svg",
  "/globe.svg",
  "/vercel.svg",
  "/stripe.svg",
  "/anthropic.svg",
  "/gemini.svg",
  "/file.svg",
];

const NODE_COUNT = 10;

/* Stable random + center exclusion */
const nodes = Array.from({ length: NODE_COUNT }, (_, i) => {
  let seed = i * 999;

  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  let x, y;

  do {
    x = rand() * 90 + 5;
    y = rand() * 90 + 5;
  } while (x > 30 && x < 70 && y > 30 && y < 70);

  return {
    id: i,
    icon: icons[i % icons.length],
    x,
    y,
  };
});

const connections = [
  [0, 2],
  [2, 5],
  [5, 7],
  [1, 3],
  [3, 6],
  [6, 8],
  [0, 4],
  [4, 9],
];

const LOOP_DURATION = 12;

const BackgroundAnimation = () => {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* CONNECTION LINES */}
      <svg className="absolute inset-0 w-full h-full">
        {connections.map(([from, to], i) => (
          <motion.line
            key={i}
            x1={`${nodes[from].x}%`}
            y1={`${nodes[from].y}%`}
            x2={`${nodes[to].x}%`}
            y2={`${nodes[to].y}%`}
            stroke="hsl(var(--border))"
            strokeWidth="1"
            initial={{ opacity: 0.2 }}
            animate={{
              opacity: [0.2, 0.6, 0.2],
              stroke: [
                "hsl(var(--border))",
                "hsl(var(--primary))",
                "hsl(var(--border))",
              ],
            }}
            transition={{
              duration: 2,
              delay: i * 0.6,
              repeat: Infinity,
              repeatDelay: LOOP_DURATION,
              ease: "easeInOut",
            }}
          />
        ))}
      </svg>

      {/* DATA FLOW DOTS */}
      <svg className="absolute inset-0 w-full h-full">
        {connections.map(([from, to], i) => (
          <motion.circle
            key={`pulse-${i}`}
            r="3"
            fill="hsl(var(--primary))"
            initial={{
              cx: `${nodes[from].x}%`,
              cy: `${nodes[from].y}%`,
              opacity: 0,
            }}
            animate={{
              cx: [`${nodes[from].x}%`, `${nodes[to].x}%`],
              cy: [`${nodes[from].y}%`, `${nodes[to].y}%`],
              opacity: [0, 1, 0],
              scale: [0.6, 1.2, 0.6],
            }}
            transition={{
              duration: 10,
              delay: i * 1.6 + 0.3,
              repeat: Infinity,
              repeatDelay: LOOP_DURATION,
              ease: "easeInOut",
            }}
          />
        ))}
      </svg>

      {/* NODES */}
      {nodes.map((node, i) => (
        <motion.div
          key={node.id}
          className="absolute flex items-center justify-center w-10 h-10 rounded-xl
                     bg-background/70 backdrop-blur-md border border-border/40"
          style={{ left: `${node.x}%`, top: `${node.y}%` }}
          initial={{ opacity: 0.3, scale: 0.9 }}
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [0.95, 1.05, 0.95],

            // floating
            y: [-6 - (i % 3), 6 + (i % 3), -6 - (i % 3)],
            x: [-4 + (i % 2), 4 - (i % 2), -4 + (i % 2)],

            boxShadow: [
              "0 0 0px transparent",
              "0 0 20px hsl(var(--primary) / 0.5)",
              "0 0 0px transparent",
            ],
          }}
          transition={{
            duration: 6,
            delay: i * 0.4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {/* ICON */}
          <motion.div
            animate={{
              scale: [1, 1.5, 1.5, 1],
              opacity: [0.85, 1, 1, 0.85],
              filter: [
                "brightness(0.9)",
                "brightness(1.4) drop-shadow(0 0 6px hsl(var(--primary)))",
                "brightness(1.4) drop-shadow(0 0 6px hsl(var(--primary)))",
                "brightness(0.9)",
              ],
            }}
            transition={{
              duration: 2,
              delay: i * 0.6,
              times: [0, 0.4, 0.7, 1],
              repeat: Infinity,
              repeatDelay: LOOP_DURATION,
              ease: "easeInOut",
            }}
          >
            <Image src={node.icon} alt="" width={30} height={30} />
          </motion.div>
        </motion.div>
      ))}

      {/* CENTER FADE */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 65% 65% at 50% 50%, transparent 35%, hsl(var(--background)) 100%)",
        }}
      />
    </div>
  );
};

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative flex min-h-svh flex-col justify-center items-center gap-6 p-6 md:p-10 overflow-hidden bg-[#eafdf3]">
      <BackgroundAnimation />

      <div className="relative z-10 flex w-full max-w-sm flex-col gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 self-center font-semibold"
        >
          <Image src="logo.svg" alt="Automativ" width={60} height={60} />
          Automativ
        </Link>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
