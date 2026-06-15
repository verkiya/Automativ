import { type ReactNode } from "react";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

export type NodeStatus = "loading" | "success" | "error" | "initial";

export type NodeStatusVariant = "overlay" | "border";

export type NodeStatusIndicatorProps = {
  status?: NodeStatus;
  variant?: NodeStatusVariant;
  children: ReactNode;
  className?: string;
};

export const SpinnerLoadingIndicator = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <div className="relative">
      <StatusBorder className="border-sky-400/40">
        {children}
      </StatusBorder>

      <div className="absolute inset-0 z-50 rounded-xl bg-white/40 backdrop-blur-md" />

      <div className="absolute inset-0 z-50">
        <span
          className="
            absolute
            left-1/2
            top-1/2
            inline-block
            h-10
            w-10
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-sky-500/10
            animate-[pulse_2.5s_ease-in-out_infinite]
          "
        />

        <Loader2
          className="
            absolute
            left-1/2
            top-1/2
            size-2
            -translate-x-1/2
            -translate-y-1/2
            animate-spin
            text-sky-600
          "
        />
      </div>
    </div>
  );
};

export const BorderLoadingIndicator = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <>
      <div className="absolute -left-[2px] -top-[2px] h-[calc(100%+4px)] w-[calc(100%+4px)]">
        <style>
          {`
            @keyframes automativ-spin {
              from {
                transform: translate(-50%, -50%) rotate(0deg);
              }
              to {
                transform: translate(-50%, -50%) rotate(360deg);
              }
            }

            .automativ-spinner {
              animation: automativ-spin 4s linear infinite;
              position: absolute;
              left: 50%;
              top: 50%;
              width: 140%;
              aspect-ratio: 1;
              transform-origin: center;
            }
          `}
        </style>

        <div
          className={cn(
            "absolute inset-0 overflow-hidden rounded-xl",
            className,
          )}
        >
          <div
            className="
              automativ-spinner
              rounded-full
              bg-[conic-gradient(from_0deg_at_50%_50%,rgba(37,99,235,0.65)_0deg,rgba(8,145,178,0.45)_120deg,rgba(37,99,235,0)_360deg)]
            "
          />
        </div>
      </div>

      {children}
    </>
  );
};

const StatusBorder = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <>
      <div
        className={cn(
          "absolute -left-[2px] -top-[2px] h-[calc(100%+4px)] w-[calc(100%+4px)] rounded-xl border-[3px]",
          className,
        )}
      />

      {children}
    </>
  );
};

export const NodeStatusIndicator = ({
  status,
  variant = "border",
  children,
  className,
}: NodeStatusIndicatorProps) => {
  switch (status) {
    case "loading":
      switch (variant) {
        case "overlay":
          return (
            <SpinnerLoadingIndicator>
              {children}
            </SpinnerLoadingIndicator>
          );

        case "border":
          return (
            <BorderLoadingIndicator className={className}>
              {children}
            </BorderLoadingIndicator>
          );

        default:
          return <>{children}</>;
      }

    case "success":
      return (
        <StatusBorder
          className={cn(
            "border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.15)]",
            className,
          )}
        >
          {children}
        </StatusBorder>
      );

    case "error":
      return (
        <StatusBorder
          className={cn(
            "border-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.12)]",
            className,
          )}
        >
          {children}
        </StatusBorder>
      );

    default:
      return <>{children}</>;
  }
};
