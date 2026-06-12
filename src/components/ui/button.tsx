import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "relative inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap",
    "overflow-hidden isolate",
    "font-medium select-none",
    "transition-all duration-100 ease-out",
    "outline-none",
    "disabled:pointer-events-none disabled:opacity-50 disabled:scale-100",
    "focus-visible:ring-[3px] focus-visible:ring-ring/35",
    "focus-visible:border-ring",
    "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
    "[&>*]:relative [&>*]:z-10",
    "[&_svg]:pointer-events-none",
    "[&_svg]:shrink-0",
    "[&_svg:not([class*='size-'])]:size-4",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "text-white",
          "bg-gradient-to-r from-violet-600 to-indigo-600",
          "shadow-lg shadow-violet-500/25",
          "hover:shadow-xl hover:shadow-violet-500/40",
          "hover:scale-[1.05] hover:-translate-y-0.5",
          "active:scale-[0.985]",
          "border border-white/10",
        ].join(" "),

        gradient: [
          "text-white",
          "bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-500",
          "shadow-md shadow-indigo-500/25",
          "hover:shadow-md hover:shadow-cyan-500/35",
          "hover:scale-[1.05] hover:-translate-y-0.5",
          "active:scale-[0.985]",
          "border border-white/20",
        ].join(" "),

        shimmer: [
          "text-white",
          "bg-indigo-600",
          "shadow-lg shadow-indigo-500/25",
          "hover:scale-[1.05] hover:-translate-y-0.5 hover:shadow-indigo-500/40",
          "active:scale-[0.985]",
          "before:absolute before:inset-0 before:-translate-x-full before:rounded-[inherit]",
          "before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent",
          "before:transition-transform before:duration-1000",
          "hover:before:translate-x-full",
          "overflow-hidden border border-indigo-400/30",
        ].join(" "),

        workflow: [
          "text-white",
          "bg-gradient-to-r from-emerald-500 to-teal-500",
          "border border-white/20",
          "shadow-lg shadow-emerald-500/25",
          "hover:scale-[1.05] hover:-translate-y-0.5 hover:shadow-emerald-500/40",
          "active:scale-[0.985]",
        ].join(" "),

        aiGlow: [
          "text-cyan-900",
          "border border-cyan-300/50",
          "bg-gradient-to-r from-cyan-100 to-blue-100",
          "shadow-[0_0_20px_rgba(6,182,212,0.3)]",
          "hover:scale-[1.05] hover:-translate-y-0.5",
          "hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]",
          "hover:border-cyan-400",
          "active:scale-[0.985]",
        ].join(" "),

        premium: [
          "text-white",
          "border border-fuchsia-300/30",
          "bg-gradient-to-r from-fuchsia-500 via-purple-500 to-violet-500",
          "shadow-lg shadow-fuchsia-500/25",
          "hover:scale-[1.05] hover:-translate-y-0.5 hover:shadow-fuchsia-500/40",
          "active:scale-[0.985]",
        ].join(" "),

        brandCyan: [
          "text-white",
          "bg-cyan-600",
          "border border-cyan-400/50",
          "shadow-lg shadow-cyan-500/20",
          "hover:bg-cyan-500",
          "hover:shadow-cyan-500/30",
          "hover:scale-[1.05] hover:-translate-y-0.5",
          "active:scale-[0.985]",
        ].join(" "),

        brandSuccess: [
          "text-white",
          "bg-emerald-600",
          "border border-emerald-400/50",
          "shadow-lg shadow-emerald-500/20",
          "hover:bg-emerald-500",
          "hover:shadow-emerald-500/30",
          "hover:scale-[1.05] hover:-translate-y-0.5",
          "active:scale-[0.985]",
        ].join(" "),

        brandPremium: [
          "text-white",
          "bg-fuchsia-600",
          "border border-fuchsia-400/50",
          "shadow-lg shadow-fuchsia-500/20",
          "hover:bg-fuchsia-500",
          "hover:shadow-fuchsia-500/30",
          "hover:scale-[1.05] hover:-translate-y-0.5",
          "active:scale-[0.985]",
        ].join(" "),

        brandDanger: [
          "text-white",
          "bg-red-600",
          "border border-red-400/50",
          "shadow-lg shadow-red-500/20",
          "hover:bg-red-500",
          "hover:shadow-red-500/30",
          "hover:scale-[1.05] hover:-translate-y-0.5",
          "active:scale-[0.985]",
        ].join(" "),

        cyberpunk: [
          "text-yellow-300",
          "bg-zinc-900",
          "border border-yellow-500/50",
          "shadow-[4px_4px_0_rgba(234,179,8,0.5)]",
          "hover:translate-x-[2px]",
          "hover:translate-y-[2px]",
          "hover:shadow-[2px_2px_0_rgba(234,179,8,0.5)]",
          "active:scale-[0.985]",
        ].join(" "),

        glass: [
          "text-foreground",
          "border border-white/60",
          "bg-white/40",
          "backdrop-blur-xl",
          "shadow-lg shadow-black/5",
          "hover:bg-white/60",
          "hover:scale-[1.05] hover:-translate-y-0.5",
          "active:scale-[0.99]",
        ].join(" "),

        shimmerGlass: [
          "text-foreground",
          "border border-white/60",
          "bg-white/40",
          "backdrop-blur-xl",
          "shadow-lg shadow-black/5",
          "hover:scale-[1.05] hover:-translate-y-0.5",
          "before:absolute before:inset-0 before:-translate-x-full before:rounded-[inherit]",
          "before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent",
          "before:transition-transform before:duration-1000",
          "hover:before:translate-x-full",
          "overflow-hidden",
        ].join(" "),

        frost: [
          "text-foreground",
          "border border-white/50",
          "bg-[linear-gradient(135deg,rgba(255,255,255,0.75),rgba(245,248,255,0.42))]",
          "backdrop-blur-3xl",
          "shadow-xl shadow-indigo-500/5",
          "hover:scale-[1.05] hover:-translate-y-0.5 hover:shadow-indigo-500/10",
        ].join(" "),

        outline: [
          "border border-violet-300/50",
          "bg-white/80",
          "backdrop-blur-md",
          "text-foreground",
          "shadow-sm",
          "hover:bg-violet-50/80",
          "hover:border-violet-400",
          "hover:text-primary",
          "hover:scale-[1.05] hover:-translate-y-0.5 hover:shadow-md",
          "transition-all",
        ].join(" "),

        secondary: [
          "bg-white/80 backdrop-blur-md",
          "text-slate-800",
          "border border-violet-100",
          "shadow-sm",
          "hover:bg-violet-50",
          "hover:border-violet-300",
          "hover:text-violet-700",
          "hover:scale-[1.05] hover:-translate-y-0.5 hover:shadow-md",
          "active:scale-[0.985]",
        ].join(" "),

        subtle: [
          "bg-slate-100/80",
          "backdrop-blur-md",
          "text-muted-foreground",
          "hover:bg-slate-200/80",
          "hover:text-foreground",
          "hover:scale-[1.05] hover:-translate-y-0.5",
        ].join(" "),

        accent: [
          "text-white",
          "border border-white/10",
          "bg-gradient-to-r from-indigo-500 to-purple-600",
          "shadow-lg shadow-indigo-500/25",
          "hover:brightness-110",
          "hover:scale-[1.05] hover:-translate-y-0.5 hover:shadow-indigo-500/40",
        ].join(" "),

        success: [
          "text-emerald-800",
          "bg-emerald-100/80",
          "backdrop-blur-md",
          "border border-emerald-300",
          "shadow-sm",
          "hover:bg-emerald-200/80",
          "hover:scale-[1.05] hover:-translate-y-0.5 hover:shadow-md",
        ].join(" "),

        destructive: [
          "text-red-800",
          "bg-red-100/80",
          "backdrop-blur-md",
          "border border-red-300",
          "shadow-sm",
          "hover:bg-red-200/80",
          "hover:scale-[1.05] hover:-translate-y-0.5 hover:shadow-md",
        ].join(" "),

        dangerGlass: [
          "text-red-600",
          "border border-red-200/50",
          "bg-red-50/60",
          "backdrop-blur-xl",
          "shadow-[0_8px_20px_rgba(239,68,68,0.08)]",
          "hover:bg-red-100/80",
          "hover:scale-[1.05] hover:-translate-y-0.5",
        ].join(" "),

        glow: [
          "text-violet-700",
          "border border-violet-300/50",
          "bg-violet-50/80",
          "backdrop-blur-md",
          "shadow-[0_0_20px_rgba(124,58,237,0.2)]",
          "hover:bg-violet-100",
          "hover:shadow-[0_0_30px_rgba(124,58,237,0.3)]",
          "hover:scale-[1.05] hover:-translate-y-0.5",
        ].join(" "),

        signal: [
          "text-cyan-800",
          "border border-cyan-300/50",
          "bg-gradient-to-r from-cyan-50 to-blue-50",
          "shadow-[0_0_15px_rgba(6,182,212,0.15)]",
          "hover:shadow-[0_0_25px_rgba(6,182,212,0.25)]",
          "hover:scale-[1.05] hover:-translate-y-0.5",
        ].join(" "),

        neo: [
          "text-foreground",
          "bg-white",
          "border-2 border-violet-500",
          "shadow-[4px_4px_0px_rgba(139,92,246,1)]",
          "hover:translate-x-[2px]",
          "hover:translate-y-[2px]",
          "hover:shadow-[2px_2px_0px_rgba(139,92,246,1)]",
        ].join(" "),

        floating: [
          "rounded-full",
          "text-foreground",
          "border border-white/60",
          "bg-white/70",
          "backdrop-blur-2xl",
          "shadow-xl shadow-indigo-500/10",
          "hover:scale-[1.1] hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/20",
          "active:scale-[0.95]",
        ].join(" "),

        ghost: [
          "text-foreground",
          "hover:bg-violet-100/50",
          "hover:text-violet-700",
          "hover:scale-[1.05]",
        ].join(" "),

        ghostSoft: [
          "text-muted-foreground",
          "hover:bg-slate-100",
          "hover:text-foreground",
          "hover:scale-[1.05]",
        ].join(" "),

        toolbar: [
          "text-muted-foreground",
          "bg-transparent",
          "hover:bg-white/80",
          "backdrop-blur-md",
          "hover:text-foreground",
          "hover:shadow-sm",
          "hover:scale-[1.05]",
        ].join(" "),

        loading: [
          "text-zinc-500",
          "bg-zinc-100",
          "cursor-wait",
          "shadow-sm",
        ].join(" "),

        loadingGlass: [
          "text-foreground",
          "cursor-wait",
          "border border-white/60",
          "bg-white/50",
          "backdrop-blur-2xl",
        ].join(" "),

        link: [
          "p-0 h-auto",
          "text-primary",
          "shadow-none",
          "underline-offset-4",
          "hover:underline",
          "hover:scale-[1.02]",
        ].join(" "),

        neon: [
          "text-cyan-300",
          "border border-cyan-400/50",
          "bg-cyan-950/40",
          "backdrop-blur-md",
          "shadow-[0_0_15px_rgba(34,211,238,0.3)]",
          "hover:shadow-[0_0_25px_rgba(34,211,238,0.5)]",
          "hover:bg-cyan-900/50",
          "hover:scale-[1.05] hover:-translate-y-0.5",
          "active:scale-[0.985]",
        ].join(" "),

        holographic: [
          "text-indigo-900",
          "border border-white/50",
          "bg-gradient-to-tr from-pink-200/80 via-purple-200/80 to-cyan-200/80",
          "backdrop-blur-lg",
          "shadow-lg shadow-purple-500/20",
          "hover:scale-[1.05] hover:-translate-y-0.5",
          "hover:shadow-xl hover:shadow-cyan-500/30",
          "active:scale-[0.985]",
        ].join(" "),

        cosmic: [
          "text-white",
          "bg-[linear-gradient(135deg,#0f172a_0%,#312e81_50%,#4c1d95_100%)]",
          "border border-indigo-400/30",
          "shadow-[0_0_20px_rgba(76,29,149,0.4)]",
          "hover:shadow-[0_0_30px_rgba(76,29,149,0.6)]",
          "hover:scale-[1.05] hover:-translate-y-0.5",
          "hover:border-indigo-300/50",
        ].join(" "),
      },

      size: {
        xs: "h-7 rounded-md px-2.5 text-xs gap-1",
        sm: "h-8 rounded-lg px-3 text-sm gap-1.5",
        default: "h-10 rounded-xl px-4 text-sm",
        lg: "h-11 rounded-xl px-6 text-sm",
        xl: "h-12 rounded-2xl px-8 text-base",
        hero: "h-14 rounded-full px-10 text-base font-semibold tracking-tight",

        icon: "size-10 rounded-xl",
        "icon-xs": "size-7 rounded-md",
        "icon-sm": "size-8 rounded-lg",
        "icon-lg": "size-11 rounded-xl",
        "icon-xl": "size-12 rounded-2xl",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(
        buttonVariants({ variant, size, className }),
        "cursor-pointer",
      )}
      {...props}
    />
  );
}

export { Button, buttonVariants };
