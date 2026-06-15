import type { ComponentProps, ReactNode } from "react";
import {
  CheckCircle2Icon,
  Loader2Icon,
  XCircleIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { NodeStatus } from "./node-status-indicator";

type BaseNodeProps = ComponentProps<"div"> & {
  status?: NodeStatus;
};

export function BaseNode({
  className,
  status,
  ...props
}: BaseNodeProps) {
  return (
    <div
      className={cn(
        `
        relative
        rounded-2xl
        border
        border-white/60
        bg-white/85
        text-card-foreground
        backdrop-blur-xl
        shadow-[0_8px_24px_rgba(37,99,235,0.06)]
        transition-all
        duration-300
hover:scale-[0.95]

ease-in-out
hover:bg-[linear-gradient(135deg,rgba(255,255,255,0.92),rgba(240,249,255,0.9))]
        [.react-flow__node.selected_&]:border-sky-300
        [.react-flow__node.selected_&]:shadow-[0_0_0_2px_rgba(56,189,248,0.15),0_12px_36px_rgba(37,99,235,0.12)]
        `,
        className,
      )}
      tabIndex={0}
      {...props}
    >
      {props.children}

      {status === "error" && (
        <div
          className="
            absolute
            right-2
            top-2
            flex
            size-3
            items-center
            justify-center
            rounded-full
            bg-rose-50
            text-rose-500
            shadow-sm
            animate-in
            fade-in
            zoom-in-75
            duration-200
          "
        >
          <XCircleIcon className="size-2" />
        </div>
      )}

      {status === "success" && (
        <div
          className="
            absolute
            right-2
            top-2
            flex
            size-3
            items-center
            justify-center
            rounded-full
            bg-emerald-50
            text-emerald-500
            shadow-sm
            animate-in
            fade-in
            zoom-in-75
            duration-300
          "
        >
          <CheckCircle2Icon className="size-2" />
        </div>
      )}

      {status === "loading" && (
        <div
          className="
            absolute
            right-2
            top-2
            flex
            size-3
            items-center
            justify-center
            rounded-full
            bg-sky-50
            text-sky-500
            shadow-sm
          "
        >
          <Loader2Icon className="size-2 animate-spin" />
        </div>
      )}
    </div>
  );
}

/**
 * A container for a consistent header layout intended to be used inside the
 * `<BaseNode />` component.
 */
export function BaseNodeHeader({
  className,
  ...props
}: ComponentProps<"header">) {
  return (
    <header
      {...props}
      className={cn(
        `
        flex
        items-center
        justify-between
        gap-2
        px-4
        py-3

        border-b
        border-sky-100/50
        `,
        className,
      )}
    />
  );
}

/**
 * The title text for the node. To maintain a native application feel, the title
 * text is not selectable.
 */
export function BaseNodeHeaderTitle({
  className,
  ...props
}: ComponentProps<"h3">) {
  return (
    <h3
      data-slot="base-node-title"
      className={cn(
        `
        flex-1
        select-none
        font-semibold
        tracking-tight
        text-slate-800
        `,
        className,
      )}
      {...props}
    />
  );
}

export function BaseNodeContent({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      data-slot="base-node-content"
      className={cn(
        `
        flex
        flex-col
        gap-y-3
        p-4
        `,
        className,
      )}
      {...props}
    />
  );
}

export function BaseNodeFooter({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      data-slot="base-node-footer"
      className={cn(
        `
        flex
        flex-col
        items-center
        gap-y-2

        border-t
        border-sky-100/50

        bg-gradient-to-r
        from-sky-50/30
        via-white/20
        to-cyan-50/30

        px-4
        pb-4
        pt-3
        `,
        className,
      )}
      {...props}
    />
  );
}
