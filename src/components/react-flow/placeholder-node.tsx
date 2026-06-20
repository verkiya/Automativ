"use client";

import React, { useCallback, type ReactNode } from "react";
import {
  useReactFlow,
  useNodeId,
  Handle,
  Position,
  type NodeProps,
} from "@xyflow/react";
import { BaseNode } from "./base-node";
import { PlusIcon } from "lucide-react";

export type PlaceholderNodeProps = Partial<NodeProps> & {
  children?: ReactNode;
  onClick?: () => void;
};

export function PlaceholderNode({ children, onClick }: PlaceholderNodeProps) {
  return (
    <BaseNode
  className="
    group
    cursor-pointer
    rounded-2xl
    border
    border-dashed
    border-sky-300
    bg-gradient-to-br
    from-sky-50/80
    via-white
    to-cyan-50/80
    p-4

    text-sky-600
    shadow-[0_8px_24px_rgba(37,99,235,0.06)]
    transition-all
    duration-300
    hover:-translate-y-0.5
    hover:border-sky-400
    hover:shadow-[0_12px_32px_rgba(37,99,235,0.12)]
  "
  onClick={onClick}
>
  <div className="flex flex-col items-center gap-2 ">

    {children}
  </div>
</BaseNode>
  );
}
