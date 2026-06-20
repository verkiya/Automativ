"use client";

import { createId } from "@paralleldrive/cuid2";
import { useReactFlow } from "@xyflow/react";
import {
  ChevronRightIcon,
  GlobeIcon,
  MousePointerIcon,
} from "lucide-react";
import React, { useCallback } from "react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

import { NodeType } from "@/generated/prisma";
import { toast } from "@/components/ui/sonner";

export type NodeTypeOption = {
  type: NodeType;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }> | string;
};

const triggerNodes: NodeTypeOption[] = [
  {
    type: NodeType.MANUAL_TRIGGER,
    label: "Trigger manually",
    description:
      "Runs the flow on clicking a button. Good for getting started quickly",
    icon: MousePointerIcon,
  },
  {
    type: NodeType.GOOGLE_FORM_TRIGGER,
    label: "Google Form",
    description: "Runs the flow when a Google Form is submitted",
    icon: "/googleform.svg",
  },
  {
    type: NodeType.STRIPE_TRIGGER,
    label: "Stripe",
    description: "Runs the flow when a Stripe Event is captured",
    icon: "/stripe.svg",
  },
];

const executionNodes: NodeTypeOption[] = [
  {
    type: NodeType.HTTP_REQUEST,
    label: "HTTP Request",
    description: "Makes an HTTP request",
    icon: GlobeIcon,
  },
  {
    type: NodeType.GEMINI,
    label: "Gemini",
    description: "Generate text with Google Gemini",
    icon: "/gemini.svg",
  },
  {
    type: NodeType.OPENAI,
    label: "OpenAI",
    description: "Generate text with OpenAI",
    icon: "/openai.svg",
  },
  {
    type: NodeType.ANTHROPIC,
    label: "Anthropic",
    description: "Generate text with Anthropic",
    icon: "/anthropic.svg",
  },
  {
    type: NodeType.DISCORD,
    label: "Discord",
    description: "Send a Discord message",
    icon: "/discord.svg",
  },
  {
    type: NodeType.SLACK,
    label: "Slack",
    description: "Send a Slack message",
    icon: "/slack.svg",
  },
];

interface NodeSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

function NodeCard({
  nodeType,
  onClick,
}: {
  nodeType: NodeTypeOption;
  onClick: () => void;
}) {
  const Icon = nodeType.icon;

  return (
    <div
      onClick={onClick}
      className="
        group
        mx-3
        mb-2
        cursor-pointer
        rounded-2xl
        border
        border-white/60
        bg-white/95
        p-3

        transition-all
        duration-200 ease-in-out

        hover:-translate-y-0.5
        hover:border-sky-200/80
        hover:bg-[linear-gradient(135deg,rgba(255,255,255,0.95),rgba(240,249,255,0.88))]
        hover:shadow-[0_12px_30px_rgba(37,99,235,0.08)]
      "
    >
      <div className="flex items-center gap-4 w-full overflow-hidden">
        <div
          className="
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center
            rounded-xl
            border
            border-sky-100
            bg-gradient-to-br
            from-sky-50
            via-white
            to-cyan-50
          "
        >
          {typeof Icon === "string" ? (
            <img
              src={Icon}
              alt={nodeType.label}
              className="size-5 object-contain"
            />
          ) : (
            <Icon className="size-5 text-sky-700" />
          )}
        </div>

        <div className="min-w-0 flex-1 flex flex-col items-start text-left">
          <span className="font-medium text-sm text-slate-800">
            {nodeType.label}
          </span>

          <span className="mt-1 text-xs leading-relaxed text-slate-500">
            {nodeType.description}
          </span>
        </div>

        <ChevronRightIcon
          className="
            size-4
            text-slate-400
            opacity-0
            transition-all
            duration-300
            group-hover:translate-x-1
            group-hover:opacity-100
          "
        />
      </div>
    </div>
  );
}

export function NodeSelector({
  open,
  onOpenChange,
  children,
}: NodeSelectorProps) {
  const { setNodes, getNodes, screenToFlowPosition } = useReactFlow();

  const handleNodeSelect = useCallback(
    (selection: NodeTypeOption) => {
      // Check if there's already a manual trigger existing
      if (selection.type === NodeType.MANUAL_TRIGGER) {
        const nodes = getNodes();

        const hasManualTrigger = nodes.some(
          (node) => node.type === NodeType.MANUAL_TRIGGER,
        );

        if (hasManualTrigger) {
          toast.info("Only one manual trigger is allowed per workflow");
          return;
        }
      }

      setNodes((nodes) => {
        const hasInitialTrigger = nodes.some(
          (node) => node.type === NodeType.INITIAL,
        );

        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        const flowPosition = screenToFlowPosition({
          x: centerX + (Math.random() - 0.5) * 200,
          y: centerY + (Math.random() - 0.5) * 200,
        });

        const newNode = {
          id: createId(),
          data: {},
          position: flowPosition,
          type: selection.type,
        };

        if (hasInitialTrigger) {
          return [newNode];
        }

        return [...nodes, newNode];
      });

      onOpenChange(false);
    },
    [setNodes, getNodes, onOpenChange, screenToFlowPosition],
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>{children}</SheetTrigger>

      <SheetContent
        side="right"
        className="
          w-full
          overflow-y-auto
          border-l-white/60
          bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,250,252,0.92))]
          sm:max-w-md
        "
      >
        <SheetHeader className="pb-4">
          <SheetTitle>Add Workflow Step</SheetTitle>

          <SheetDescription>
            Choose a trigger to start your workflow or an action to execute.
          </SheetDescription>
        </SheetHeader>

        <div className="px-4 pb-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Triggers
          </p>
        </div>

        <div>
          {triggerNodes.map((nodeType) => (
            <NodeCard
              key={nodeType.type}
              nodeType={nodeType}
              onClick={() => handleNodeSelect(nodeType)}
            />
          ))}
        </div>


        <div className="px-4 pb-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Actions
          </p>
        </div>

        <div>
          {executionNodes.map((nodeType) => (
            <NodeCard
              key={nodeType.type}
              nodeType={nodeType}
              onClick={() => handleNodeSelect(nodeType)}
            />
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
