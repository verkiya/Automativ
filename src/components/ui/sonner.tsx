"use client";

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps, toast as sonnerToast } from "sonner";

const toast = Object.assign(
  (message: string | React.ReactNode, data?: any) => sonnerToast(message, data),
  sonnerToast,
  {
    loading: (message: string | React.ReactNode, data?: any) => {
      const id = sonnerToast.loading(message, data);
      setTimeout(() => sonnerToast.dismiss(id), 3000);
      return id;
    },
  }
) as typeof sonnerToast;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      duration={3000}
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-[image:var(--glass-bg)] group-[.toaster]:text-slate-900 group-[.toaster]:border-[var(--glass-border)] group-[.toaster]:shadow-[0_8px_30px_var(--glow-primary)] group-[.toaster]:backdrop-blur-2xl",
          title: "group-[.toast]:font-semibold group-[.toast]:text-slate-900",
          description: "group-[.toast]:text-slate-500",
          actionButton:
            "group-[.toast]:bg-[var(--brand-primary)] group-[.toast]:text-white group-[.toast]:font-medium group-[.toast]:hover:bg-[var(--brand-primary)]/90",
          cancelButton:
            "group-[.toast]:bg-slate-100 group-[.toast]:text-slate-500 group-[.toast]:hover:bg-slate-200",
          closeButton:
            "group-[.toast]:bg-white group-[.toast]:text-slate-900 group-[.toast]:border-[var(--glass-border)] group-[.toast]:shadow-sm group-[.toast]:hover:bg-slate-50",
          success:
            "group-[.toaster]:!bg-[image:var(--glass-bg)] group-[.toaster]:!text-[var(--brand-success)] group-[.toaster]:!border-[var(--brand-success)]/30 group-[.toaster]:!shadow-[0_8px_30px_var(--glow-success)]",
          error:
            "group-[.toaster]:!bg-[image:var(--glass-bg)] group-[.toaster]:!text-[var(--brand-danger)] group-[.toaster]:!border-[var(--brand-danger)]/30 group-[.toaster]:!shadow-[0_8px_30px_rgba(220,38,38,0.12)]",
          warning:
            "group-[.toaster]:!bg-[image:var(--glass-bg)] group-[.toaster]:!text-amber-600 group-[.toaster]:!border-amber-500/30 group-[.toaster]:!shadow-[0_8px_30px_rgba(217,119,6,0.12)]",
          info:
            "group-[.toaster]:!bg-[image:var(--glass-bg)] group-[.toaster]:!text-[var(--brand-cyan)] group-[.toaster]:!border-[var(--brand-cyan)]/30 group-[.toaster]:!shadow-[0_8px_30px_var(--glow-cyan)]",
          loading:
            "group-[.toaster]:!bg-[image:var(--glass-bg)] group-[.toaster]:!text-[var(--brand-primary)] group-[.toaster]:!border-[var(--brand-primary)]/30 group-[.toaster]:!shadow-[0_8px_30px_var(--glow-primary)]",
        },
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster, toast };
