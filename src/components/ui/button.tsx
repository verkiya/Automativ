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

    "aria-invalid:border-destructive ",
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
          "ring-1 ring-inset ring-white/15",
          "bg-gradient-to-r",
          "from-[var(--brand-secondary)]",
          "via-[var(--brand-cyan-2)]",
          "to-[var(--brand-cyan)]",
          "shadow-[0_8px_24px_rgba(37,99,235,0.18)]",
          "hover:shadow-[0_12px_34px_rgba(37,99,235,0.26)]",
          "hover:-translate-y-0.5",
          "hover:brightness-105",
          "active:scale-[0.985]",
        ].join(" "),

        gradient: [
          "text-white",
          "bg-gradient-to-r from-[var(--brand-primary)] via-[var(--brand-secondary)] to-[var(--brand-cyan)]",
          "shadow-md shadow-[var(--brand-secondary)]/25",
          "hover:shadow-md hover:shadow-[var(--brand-cyan)]/35",
          "hover:scale-[1.05] hover:-translate-y-0.5",
          "active:scale-[0.985]",
          "ring-1 ring-inset ring-white/20",
        ].join(" "),

        shimmer: [
          "text-white",
          "bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)]",
          "shadow-lg shadow-[var(--brand-primary)]/20",
          "hover:scale-[1.05] hover:-translate-y-0.5",
          "hover:shadow-[var(--brand-primary)]/35",
          "active:scale-[0.985]",
          "before:absolute before:inset-0 before:-translate-x-full before:rounded-[inherit]",
          "before:bg-gradient-to-r before:from-transparent before:via-white/25 before:to-transparent",
          "before:transition-transform before:duration-1000",
          "hover:before:translate-x-full",
          "overflow-hidden",
          "ring-1 ring-inset ring-white/20",
        ].join(" "),

        workflow: [
          "text-white",
          "bg-gradient-to-r",
          "from-[var(--brand-secondary)]",
          "via-[var(--brand-cyan-2)]",
          "to-[var(--brand-cyan)]",
          "ring-1 ring-inset ring-white/15",
          "shadow-[0_8px_24px_rgba(37,99,235,0.22)]",
          "hover:shadow-[0_12px_32px_rgba(37,99,235,0.30)]",
          "hover:-translate-y-0.5",
        ].join(" "),

        aiGlow: [
          "text-cyan-800",
          "ring-1 ring-inset ring-cyan-200/50",
          "bg-gradient-to-r",
          "from-white",
          "via-cyan-50",
          "to-blue-50",
          "shadow-[0_0_24px_rgba(8,145,178,0.15)]",
          "hover:shadow-[0_0_34px_rgba(8,145,178,0.22)]",
          "hover:border-cyan-300",
          "hover:-translate-y-0.5",
        ].join(" "),

        premium: [
          "text-white",
          "ring-1 ring-inset ring-white/20",
          "bg-[image:var(--gradient-brand)]",
          "shadow-[0_8px_28px_rgba(109,40,217,0.20)]",
          "hover:shadow-[0_12px_40px_rgba(109,40,217,0.30)]",
          "hover:-translate-y-0.5",
          "hover:brightness-105",
          "active:scale-[0.985]",
        ].join(" "),

        brandCyan: [
          "text-white",
          "bg-gradient-to-r from-[var(--brand-cyan)] to-[var(--brand-cyan-2)]",
          "ring-1 ring-inset ring-white/15",
          "shadow-[0_8px_24px_rgba(8,145,178,0.20)]",
          "hover:shadow-[0_12px_32px_rgba(8,145,178,0.30)]",
          "hover:scale-[1.05] hover:-translate-y-0.5",
          "active:scale-[0.985]",
        ].join(" "),

        brandSuccess: [
          "text-white",
          "bg-gradient-to-r from-[var(--brand-success)] to-[var(--brand-success-2)]",
          "ring-1 ring-inset ring-white/15",
          "shadow-[0_8px_24px_rgba(5,150,105,0.20)]",
          "hover:shadow-[0_12px_32px_rgba(5,150,105,0.30)]",
          "hover:scale-[1.05] hover:-translate-y-0.5",
          "active:scale-[0.985]",
        ].join(" "),

        brandPremium: [
          "text-white",
          "ring-1 ring-inset ring-white/15",
          "bg-gradient-to-r",
          "from-[var(--brand-primary)]",
          "via-[var(--brand-secondary)]",
          "to-[var(--brand-cyan-2)]",
          "shadow-[0_8px_24px_rgba(109,40,217,0.18)]",
          "hover:shadow-[0_12px_32px_rgba(109,40,217,0.28)]",
          "hover:-translate-y-0.5",
        ].join(" "),

        brandDanger: [
          "text-white",
          "bg-red-600",
          "ring-1 ring-inset ring-red-400/50",
          "shadow-lg shadow-red-500/20",
          "hover:bg-red-500",
          "hover:shadow-red-500/30",
          "hover:scale-[1.05] hover:-translate-y-0.5",
          "active:scale-[0.985]",
        ].join(" "),

        aurora: [
          "text-white",
          "ring-1 ring-inset ring-white/20",
          "bg-[image:var(--gradient-brand)]",
          "shadow-[0_8px_30px_rgba(79,70,229,0.22)]",
          "hover:shadow-[0_12px_40px_rgba(37,99,235,0.30)]",
          "hover:brightness-105",
          "hover:-translate-y-0.5",
          "active:scale-[0.985]",
        ].join(" "),

        glassPrimary: [
          "text-sky-700",
          "border border-sky-200/50",
          "bg-gradient-to-r",
          "from-white",
          "via-sky-50/70",
          "to-cyan-50/60",
          "backdrop-blur-2xl",
          "shadow-[0_8px_24px_rgba(37,99,235,0.08)]",
          "hover:border-sky-300/50",
          "hover:shadow-[0_12px_30px_rgba(37,99,235,0.12)]",
          "hover:-translate-y-0.5",
        ].join(" "),

        glass: [
          "text-foreground",
          "border border-[var(--glass-border)]",
          "bg-[image:var(--glass-bg)]",
          "backdrop-blur-xl",
          "shadow-[0_8px_30px_var(--glass-shadow)]",
          "hover:bg-[image:var(--glass-bg-hover)]",
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
          "border border-[var(--glass-border)]",
          "bg-[image:var(--glass-bg)]",
          "backdrop-blur-3xl",
          "shadow-xl shadow-[var(--brand-primary)]/5",
          "hover:scale-[1.05] hover:-translate-y-0.5 hover:shadow-[var(--brand-primary)]/10",
        ].join(" "),

        outline: [
          "border border-blue-300/50",
          "bg-white/80",
          "backdrop-blur-md",
          "text-foreground",
          "shadow-sm",
          "hover:bg-blue-50/80",
          "hover:border-blue-400",
          "hover:text-primary",
          "hover:scale-[1.05] hover:-translate-y-0.5 hover:shadow-md",
          "transition-all",
        ].join(" "),

        secondary: [
          "bg-white/80 backdrop-blur-md",
          "text-slate-800",
          "border border-blue-100",
          "shadow-sm",
          "hover:bg-blue-50",
          "hover:border-blue-300",
          "hover:text-blue-700",
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
          "ring-1 ring-inset ring-white/20",
          "bg-gradient-to-r",
          "from-[#5b6df6]",
          "via-[var(--brand-cyan-2)]",
          "to-[var(--brand-cyan)]",
          "shadow-[0_8px_28px_rgba(79,70,229,0.18)]",
          "hover:shadow-[0_12px_38px_rgba(79,70,229,0.28)]",
          "hover:brightness-105",
          "hover:-translate-y-0.5",
          "active:scale-[0.985]",
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
          "text-blue-700",
          "border border-blue-300/50",
          "bg-gradient-to-r from-blue-50 to-cyan-50",
          "backdrop-blur-md",
          "shadow-[0_0_24px_rgba(37,99,235,0.14)]",
          "hover:bg-gradient-to-r hover:from-blue-100 hover:to-cyan-100",
          "hover:shadow-[0_0_34px_rgba(37,99,235,0.20)]",
          "hover:scale-[1.05] hover:-translate-y-0.5",
        ].join(" "),

        signal: [
          "text-cyan-800",
          "border border-cyan-300/50",
          "bg-gradient-to-r from-cyan-50 via-sky-50 to-blue-50",
          "shadow-[0_0_15px_rgba(6,182,212,0.15)]",
          "hover:shadow-[0_0_25px_rgba(6,182,212,0.25)]",
          "hover:scale-[1.05] hover:-translate-y-0.5",
        ].join(" "),

        signalSoft: [
          "text-cyan-700",
          "border border-cyan-200/50",
          "bg-gradient-to-r from-cyan-50 to-sky-50",
          "shadow-[0_4px_16px_rgba(8,145,178,0.08)]",
          "hover:border-cyan-300",
          "hover:bg-cyan-100/70",
          "hover:-translate-y-0.5",
        ].join(" "),

        workflowSoft: [
          "text-sky-700",
          "border border-sky-200/50",
          "bg-gradient-to-r",
          "from-sky-50",
          "via-blue-50",
          "to-cyan-50",
          "shadow-[0_6px_20px_rgba(37,99,235,0.08)]",
          "hover:border-sky-300",
          "hover:-translate-y-0.5",
        ].join(" "),

        floating: [
          "rounded-full",
          "text-foreground",
          "border border-white/60",
          "bg-white/70",
          "backdrop-blur-2xl",
          "shadow-xl shadow-blue-500/10",
          "hover:scale-[1.1] hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/20",
          "active:scale-[0.95]",
        ].join(" "),

        ghost: [
          "text-foreground",
          "hover:bg-blue-100/50",
          "hover:text-blue-700",
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

        premiumSoft: [
          "text-sky-800",
          "border border-sky-200/50",
          "bg-gradient-to-r",
          "from-sky-50",
          "via-white",
          "to-cyan-50",
          "shadow-[0_8px_24px_rgba(37,99,235,0.08)]",
          "hover:border-sky-300",
          "hover:shadow-[0_10px_30px_rgba(37,99,235,0.12)]",
          "hover:-translate-y-0.5",
        ].join(" "),

        dashboard: [
          "text-slate-700",
          "border border-slate-200/70",
          "bg-white/90",
          "backdrop-blur-xl",
          "shadow-sm",
          "hover:border-blue-200",
          "hover:bg-blue-50/30",
          "hover:text-blue-700",
          "hover:-translate-y-0.5",
        ].join(" "),

        ghostBrand: [
          "text-slate-600",
          "hover:bg-gradient-to-r",
          "hover:from-blue-50",
          "hover:to-cyan-50",
          "hover:text-blue-700",
          "hover:border-blue-200/30",
        ].join(" "),

        upgrade: [
          "text-sky-800",
          "border border-sky-200/40",
          "bg-gradient-to-r",
          "from-sky-50",
          "via-white",
          "to-cyan-50",
          "shadow-[0_6px_24px_rgba(37,99,235,0.08)]",
          "hover:border-sky-300/50",
          "hover:shadow-[0_10px_30px_rgba(37,99,235,0.14)]",
          "hover:-translate-y-0.5",
          "active:scale-[0.985]",
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
        "icon-xs": "size-4",
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
