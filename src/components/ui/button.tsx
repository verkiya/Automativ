import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "relative inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap",
    "overflow-hidden",
    "font-medium select-none",
    "transition-all duration-300 ease-out",
    "outline-none",
    "disabled:pointer-events-none disabled:opacity-50",
    "focus-visible:ring-[3px] focus-visible:ring-ring/40",
    "focus-visible:border-ring",
    "aria-invalid:border-destructive aria-invalid:ring-destructive/20",

    /* FIXED LAYERING */
    "[&>*]:relative",
    "[&>*]:z-10",
    "[&_svg]:pointer-events-none",
    "[&_svg]:shrink-0",
    "[&_svg:not([class*='size-'])]:size-4",
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "bg-primary text-white shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/28 hover:scale-[1.015] active:scale-[0.985]",

        gradient:
          "bg-[var(--gradient-primary)] text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 hover:scale-[1.02]",

        shimmer:
          [
            "bg-[var(--gradient-primary)] text-white",
            "shadow-lg shadow-primary/25",
            "hover:shadow-xl hover:shadow-primary/35",
            "hover:scale-[1.015]",
            "before:absolute before:inset-0 before:z-0",
            "before:-translate-x-full",
            "before:rounded-[inherit]",
            "before:bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.35),transparent)]",
            "before:transition-transform before:duration-700",
            "hover:before:translate-x-full",
          ].join(" "),

        aiGlow:
          "bg-[var(--gradient-info)] text-white shadow-[0_0_26px_rgba(59,130,246,0.22)] hover:shadow-[0_0_42px_rgba(59,130,246,0.32)] hover:scale-[1.015]",

        workflow:
          "bg-[var(--gradient-success)] text-white shadow-lg shadow-emerald-400/25 hover:shadow-xl hover:shadow-emerald-400/35 hover:scale-[1.015]",

        premium:
          "bg-[var(--gradient-premium)] text-white shadow-lg shadow-pink-400/22 hover:shadow-xl hover:shadow-pink-400/30 hover:scale-[1.015]",

        glass:
          "border border-white/40 bg-white/85 backdrop-blur-xl text-foreground shadow-md hover:bg-white hover:shadow-lg hover:scale-[1.01]",

        shimmerGlass:
          [
            "border border-white/40",
            "bg-white/82",
            "backdrop-blur-xl",
            "text-foreground",
            "shadow-md",
            "hover:shadow-lg",
            "before:absolute before:inset-0 before:z-0",
            "before:-translate-x-full",
            "before:rounded-[inherit]",
            "before:bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.22),transparent)]",
            "before:transition-transform before:duration-700",
            "hover:before:translate-x-full",
          ].join(" "),

        frost:
          "border border-white/50 bg-white/92 backdrop-blur-2xl text-foreground shadow-lg hover:bg-white hover:shadow-xl",

        success:
          "bg-emerald-500 text-white shadow-md shadow-emerald-400/20 hover:bg-emerald-600 hover:shadow-lg",

        destructive:
          "bg-red-500 text-white shadow-md shadow-red-400/20 hover:bg-red-600 hover:shadow-lg",

        outline:
          "border border-border bg-background text-foreground shadow-sm hover:bg-accent hover:shadow-md",

        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:shadow-md",

        subtle:
          "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground",

        node:
          "border border-primary/15 bg-card text-foreground shadow-sm hover:border-primary/35 hover:shadow-md",

        ghost:
          "text-foreground hover:bg-accent hover:text-accent-foreground",

        ghostSoft:
          "text-muted-foreground hover:bg-muted hover:text-foreground",

        toolbar:
          "bg-transparent text-muted-foreground hover:bg-accent hover:text-foreground",

        floating:
          "rounded-full border border-white/40 bg-white/88 backdrop-blur-xl text-foreground shadow-lg hover:shadow-xl hover:scale-[1.03]",

        midnight:
          "bg-[linear-gradient(135deg,#1e1b2e_0%,#111827_100%)] text-white shadow-xl hover:shadow-2xl hover:scale-[1.015]",

        loading:
          "bg-[var(--gradient-primary)] text-white cursor-wait shadow-lg",

        loadingGlass:
          "border border-white/40 bg-white/82 backdrop-blur-xl text-foreground cursor-wait shadow-md",

        link:
          "text-primary underline-offset-4 hover:underline p-0 h-auto",
      },

      size: {
        xs: "h-7 rounded-md px-2.5 text-xs gap-1",
        sm: "h-8 rounded-lg px-3 text-sm gap-1.5",
        default: "h-10 rounded-xl px-4 text-sm",
        lg: "h-11 rounded-xl px-6 text-sm",
        xl: "h-12 rounded-2xl px-8 text-base",
        hero: "h-14 rounded-2xl px-10 text-base font-semibold",

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
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
}

export { Button, buttonVariants };
