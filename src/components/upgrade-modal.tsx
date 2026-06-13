"use client";

import { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

import { Button } from "./ui/button";
import { authClient } from "@/lib/auth-client";

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UpgradeModal = ({
  open,
  onOpenChange,
}: UpgradeModalProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = async () => {
    try {
      setIsLoading(true);

      await authClient.checkout({
        slug: process.env.NEXT_PUBLIC_POLAR_PRODUCT_ID_SLUG!,
      });
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent
        className="
          overflow-hidden
          border
          border-white/70
          bg-gradient-to-br
          from-white
          via-violet-50/70
          to-cyan-50/60
          backdrop-blur-3xl
          shadow-[0_25px_80px_rgba(99,102,241,0.10)]
        "
      >
        {/* Top Accent */}
        <div
          className="
            absolute
            inset-x-0
            top-0
            h-px
            bg-gradient-to-r
            from-violet-500
            via-indigo-500
            to-cyan-500
          "
        />

        {/* Ambient Glow */}
        <div
          className="
            pointer-events-none
            absolute
            -top-20
            left-1/2
            h-48
            w-48
            -translate-x-1/2
            rounded-full
            bg-gradient-to-r
            from-violet-500/20
            via-indigo-500/15
            to-cyan-500/20
            blur-3xl
          "
        />

        <AlertDialogHeader className="relative z-10 space-y-5">
          <div
            className="
              flex
              w-fit
              items-center
              gap-2
              rounded-full
              border
              border-violet-200/50
              bg-gradient-to-r
              from-violet-50
              via-fuchsia-50
              to-cyan-50
              px-3
              py-1.5
              text-xs
              font-medium
              text-violet-700
              shadow-sm
            "
          >
            ✦ Pro Feature
          </div>

          <div className="space-y-2">
            <AlertDialogTitle
              className="
                text-2xl
                font-bold
                tracking-tight
                text-slate-900
              "
            >
              Unlock Automativ Pro
            </AlertDialogTitle>

            <AlertDialogDescription
              className="
                max-w-md
                text-sm
                leading-relaxed
                text-slate-600
              "
            >
              Access premium AI models, advanced workflow capabilities,
              higher usage limits, and future Pro features as Automativ grows.
            </AlertDialogDescription>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3 text-sm text-slate-700">
              <div className="size-2 rounded-full bg-violet-500" />
              Premium AI Models
            </div>

            <div className="flex items-center gap-3 text-sm text-slate-700">
              <div className="size-2 rounded-full bg-indigo-500" />
              Unlimited Workflows
            </div>

            <div className="flex items-center gap-3 text-sm text-slate-700">
              <div className="size-2 rounded-full bg-cyan-500" />
              Advanced Automations
            </div>

            <div className="flex items-center gap-3 text-sm text-slate-700">
              <div className="size-2 rounded-full bg-emerald-500" />
              Future Pro Features
            </div>
          </div>
        </AlertDialogHeader>

        <AlertDialogFooter className="relative z-10 mt-2 gap-2">
          <AlertDialogCancel asChild>
            <Button
              variant="ghostSoft"
              className="
                border-white/50
                bg-white/50
                backdrop-blur-md
              "
            >
              Maybe Later
            </Button>
          </AlertDialogCancel>

          <AlertDialogAction asChild>
            <Button
              variant="aurora"
              disabled={isLoading}
              onClick={handleUpgrade}
              className="
                min-w-[180px]
                shadow-[0_10px_35px_rgba(7, 6, 8, 0.2)]
              "
            >
              {isLoading ? "Redirecting..." : "Upgrade to Pro"}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
