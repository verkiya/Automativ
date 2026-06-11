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
          "bg-zinc-900",
          "hover:bg-zinc-800",
          "shadow-sm",
          "hover:scale-[1.02]",
          "active:scale-[0.985]",
        ].join(" "),

        gradient: [
          "text-violet-700",
          "border border-violet-200",
          "bg-[linear-gradient(135deg,#f5f3ff_0%,#e0e7ff_100%)]",
          "shadow-sm",
          "hover:scale-[1.02]",
          "hover:border-violet-300",
          "active:scale-[0.985]",
        ].join(" "),

        shimmer: [
          "text-indigo-700",
          "border border-indigo-200",
          "bg-indigo-50",
          "shadow-sm",
          "hover:scale-[1.02]",
          "active:scale-[0.985]",
          "before:absolute before:inset-0 before:-translate-x-full before:rounded-[inherit]",
          "before:bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.8),transparent)]",
          "before:transition-transform before:duration-1000",
          "hover:before:translate-x-full",
        ].join(" "),

        workflow: [
          "text-emerald-700",
          "border border-emerald-200",
          "bg-emerald-50",
          "shadow-sm",
          "hover:scale-[1.02]",
          "hover:border-emerald-300",
          "active:scale-[0.985]",
        ].join(" "),

        aiGlow: [
          "text-cyan-700",
          "border border-cyan-200",
          "bg-cyan-50",
          "shadow-sm",
          "hover:scale-[1.02]",
          "hover:border-cyan-300",
          "active:scale-[0.985]",
        ].join(" "),

        premium: [
          "text-fuchsia-700",
          "border border-fuchsia-200",
          "bg-fuchsia-50",
          "shadow-sm",
          "hover:scale-[1.02]",
          "hover:border-fuchsia-300",
          "active:scale-[0.985]",
        ].join(" "),

        brandCyan: [
          "text-cyan-700",
          "bg-cyan-50",
          "border border-cyan-200",
          "shadow-sm",
          "hover:bg-cyan-100",
          "hover:border-cyan-300",
          "hover:scale-[1.02]",
          "active:scale-[0.985]",
        ].join(" "),

        brandSuccess: [
          "text-emerald-700",
          "bg-emerald-50",
          "border border-emerald-200",
          "shadow-sm",
          "hover:bg-emerald-100",
          "hover:border-emerald-300",
          "hover:scale-[1.02]",
          "active:scale-[0.985]",
        ].join(" "),

        brandPremium: [
          "text-fuchsia-700",
          "bg-fuchsia-50",
          "border border-fuchsia-200",
          "shadow-sm",
          "hover:bg-fuchsia-100",
          "hover:border-fuchsia-300",
          "hover:scale-[1.02]",
          "active:scale-[0.985]",
        ].join(" "),

        brandDanger: [
          "text-red-700",
          "bg-red-50",
          "border border-red-200",
          "shadow-sm",
          "hover:bg-red-100",
          "hover:border-red-300",
          "hover:scale-[1.02]",
          "active:scale-[0.985]",
        ].join(" "),

        cyberpunk: [
          "text-indigo-700",
          "bg-white",
          "border border-indigo-200",
          "shadow-[3px_3px_0_rgba(99,102,241,0.2)]",
          "hover:translate-x-[1px]",
          "hover:translate-y-[1px]",
          "hover:shadow-[2px_2px_0_rgba(99,102,241,0.2)]",
          "active:scale-[0.985]",
        ].join(" "),

        glass: [
          "text-foreground",
          "border border-white/60",
          "bg-white/65",
          "backdrop-blur-2xl",
          "shadow-[0_10px_26px_rgba(99,102,241,0.06)]",
          "hover:bg-white/78",
          "hover:scale-[1.02]",
          "active:scale-[0.99]",
        ].join(" "),

        shimmerGlass: [
          "text-foreground",
          "border border-white/60",
          "bg-white/65",
          "backdrop-blur-2xl",
          "shadow-[0_10px_26px_rgba(99,102,241,0.06)]",
          "hover:scale-[1.02]",
          "before:absolute before:inset-0 before:-translate-x-full before:rounded-[inherit]",
          "before:bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.22),transparent)]",
          "before:transition-transform before:duration-1000",
          "hover:before:translate-x-full",
        ].join(" "),

        frost: [
          "text-foreground",
          "border border-white/50",
          "bg-[linear-gradient(135deg,rgba(255,255,255,0.75),rgba(245,248,255,0.42))]",
          "backdrop-blur-3xl",
          "shadow-xl",
          "hover:scale-[1.02]",
        ].join(" "),

        outline: [
          "border border-violet-200",
          "bg-white/80",
          "text-foreground",
          "shadow-sm",
          "hover:bg-violet-50",
          "hover:border-violet-300",
          "hover:text-primary",
          "transition-colors duration-0",
        ].join(" "),

        secondary: [
          "bg-[linear-gradient(135deg,#eef2ff_0%,#f8fafc_100%)]",
          "text-secondary-foreground",
          "border border-violet-100",
          "shadow-sm",
          "hover:brightness-95",
        ].join(" "),

        subtle: [
          "bg-slate-100/80",
          "text-muted-foreground",
          "hover:bg-slate-200/80",
          "hover:text-foreground",
        ].join(" "),

        accent: [
          "text-white",
          "border border-white/10",
          "bg-[linear-gradient(135deg,#6366f1_0%,#8b5cf6_100%)]",
          "shadow-[0_10px_28px_rgba(99,102,241,0.2)]",
          "hover:brightness-110",
          "hover:scale-[1.02]",
        ].join(" "),

        success: [
          "text-emerald-700",
          "bg-emerald-100",
          "border border-emerald-300",
          "shadow-sm",
          "hover:bg-emerald-200",
          "hover:scale-[1.02]",
        ].join(" "),

        destructive: [
          "text-red-700",
          "bg-red-100",
          "border border-red-300",
          "shadow-sm",
          "hover:bg-red-200",
          "hover:scale-[1.02]",
        ].join(" "),

        dangerGlass: [
          "text-red-500",
          "border border-red-200",
          "bg-red-50/80",
          "backdrop-blur-xl",
          "shadow-[0_8px_20px_rgba(239,68,68,0.05)]",
          "hover:bg-red-100/80",
        ].join(" "),

        glow: [
          "text-primary",
          "border border-violet-200",
          "bg-violet-50",
          "shadow-[0_0_24px_rgba(124,58,237,0.12)]",
          "hover:bg-violet-100",
          "hover:shadow-[0_0_36px_rgba(124,58,237,0.18)]",
        ].join(" "),

        signal: [
          "text-cyan-700",
          "border border-cyan-200",
          "bg-[linear-gradient(135deg,#ecfeff_0%,#f0f9ff_100%)]",
          "shadow-[0_0_18px_rgba(6,182,212,0.08)]",
          "hover:shadow-[0_0_28px_rgba(6,182,212,0.14)]",
          "hover:scale-[1.02]",
        ].join(" "),

        neo: [
          "text-foreground",
          "bg-white",
          "border border-violet-100",
          "shadow-[6px_6px_0px_rgba(99,102,241,0.08)]",
          "hover:translate-x-[2px]",
          "hover:translate-y-[2px]",
          "hover:shadow-[4px_4px_0px_rgba(99,102,241,0.12)]",
        ].join(" "),

        floating: [
          "rounded-full",
          "text-foreground",
          "border border-white/60",
          "bg-white/72",
          "backdrop-blur-2xl",
          "shadow-[0_14px_30px_rgba(99,102,241,0.08)]",
          "hover:scale-[1.05]",
          "active:scale-[0.98]",
        ].join(" "),

        ghost: [
          "text-foreground",
          "hover:bg-violet-50",
          "hover:text-primary",
        ].join(" "),

        ghostSoft: [
          "text-muted-foreground",
          "hover:bg-slate-100",
          "hover:text-foreground",
        ].join(" "),

        toolbar: [
          "text-muted-foreground",
          "bg-transparent",
          "hover:bg-white/80",
          "hover:text-foreground",
          "hover:shadow-sm",
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
          "bg-white/65",
          "backdrop-blur-2xl",
        ].join(" "),

        link: [
          "p-0 h-auto",
          "text-primary",
          "shadow-none",
          "underline-offset-4",
          "hover:underline",
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
