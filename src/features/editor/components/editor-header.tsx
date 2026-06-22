"use client";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { HistoryIcon, Loader2Icon, SaveIcon, TrashIcon } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CircleHelpIcon,
  MousePointer2Icon,
  MoveIcon,
  ZoomInIcon,
} from "lucide-react";
import {
  useRemoveWorkflow,
  useSuspenseWorkflow,
  useUpdateWorkflow,
  useUpdateWorkflowName,
} from "@/features/workflows/hooks/use-workflows";
import { cn } from "@/lib/utils";
import { useAtomValue } from "jotai";
import { editorAtom } from "../store/atoms";
import { useRouter } from "next/navigation";
export const EditorSaveButton = ({ workflowId }: { workflowId: string }) => {
  const editor = useAtomValue(editorAtom);
  const removeWorkflow = useRemoveWorkflow();
  const router = useRouter();
  const handleRemove = async () => {
    await removeWorkflow.mutateAsync({ id: workflowId });
    router.replace("/workflows");
  };
  const saveWorkflow = useUpdateWorkflow();
  const handleSave = () => {
    if (!editor) {
      return;
    }
    const nodes = editor.getNodes();
    const edges = editor.getEdges();
    saveWorkflow.mutate({
      id: workflowId,
      nodes,
      edges,
    });
  };
  return (
    <div className="ml-auto flex space-x-2">
      {" "}
      <Button
        asChild
        size="default"
        variant="workflowSoft"
        className="
  border-sky-200
  bg-gradient-to-r
  from-sky-50
  to-sky-50
  text-sky-700
  hover:border-sky-300
"
      >
        <Link prefetch href={`/executions?workflowId=${workflowId}`}>
          <HistoryIcon className="size-4" />
          Workflow&apos;s Executions
        </Link>
      </Button>
      <Button
        size="default"
        onClick={handleSave}
        disabled={saveWorkflow.isPending}
        variant="workflowSoft"
        className="
  border-emerald-400
  bg-gradient-to-r
  from-emerald-50
  to-green-50
  text-emerald-700
  hover:border-emerald-300
"
      >
        {saveWorkflow.isPending ? (
          <>
            <Loader2Icon className="size-4 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <SaveIcon className="size-4" />
            Save Workflow
          </>
        )}
      </Button>{" "}
      <Button
        variant="destructive"
        size="default"
        onClick={handleRemove}
        disabled={removeWorkflow.isPending}
      >
        {removeWorkflow.isPending ? (
          <>
            <Loader2Icon className="size-4 animate-spin" />
            Deleting...
          </>
        ) : (
          <>
            <TrashIcon className="size-4" /> Delete
          </>
        )}
      </Button>
    </div>
  );
};

export const EditorNameInput = ({ workflowId }: { workflowId: string }) => {
  const { data: workflow } = useSuspenseWorkflow(workflowId);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(workflow.name);
  const inputRef = useRef<HTMLInputElement>(null);
  const updateWorkflow = useUpdateWorkflowName();
  useEffect(() => {
    if (workflow.name) {
      setName(workflow.name);
    }
  }, [workflow.name]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);
  const handleSave = async () => {
    if (name === workflow.name) {
      setIsEditing(false);
      return;
    }
    try {
      await updateWorkflow.mutateAsync({ id: workflowId, name });
    } catch {
      setName(workflow.name);
    } finally {
      setIsEditing(false);
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setName(workflow.name);
      setIsEditing(false);
    }
  };
  if (isEditing) {
    return (
      <Input
        disabled={updateWorkflow.isPending}
        ref={inputRef}
        value={name}
        onChange={(e) => setName(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className={cn(
          "  h-8  w-auto  min-w-[120px]  rounded-xl  border-white/60  bg-white/95  px-3  transition-all  duration-200  focus-visible:ring-2  focus-visible:ring-blue-400/20  focus-visible:border-blue-300/50  ",
          updateWorkflow.isPending && "animate-[pulse_1.2s_linear_infinite]",
        )}
      />
    );
  }
  return (
    <BreadcrumbItem
      onClick={() => setIsEditing(true)}
      className="
  cursor-pointer
  rounded-lg
  px-2
  py-1
  text-slate-700
  transition-all
  duration-200
  hover:bg-blue-50
  hover:text-blue-700
"
    >
      {workflow.name}
    </BreadcrumbItem>
  );
};
export const EditorBreadcrumbs = ({ workflowId }: { workflowId: string }) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink
            asChild
            className="
    text-slate-500
    transition-colors
    hover:text-blue-700
  "
          >
            <Link prefetch href="/workflows">
              Workflows
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <EditorNameInput workflowId={workflowId} />
      </BreadcrumbList>
    </Breadcrumb>
  );
};
export const EditorHeader = ({ workflowId }: { workflowId: string }) => {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="
    sticky
    top-0
    z-30
    flex
    h-15
    shrink-0
    items-center
    justify-between
    border-b
    border-white/60
    bg-white/95

    shadow-[0_1px_0_rgba(255,255,255,0.5)]
  "
    >
      <SidebarTrigger
        className="
    group
    !flex
    !h-8
    !w-8
    !p-0
    !items-center
    !justify-center
rounded-2xl
    ml-2
mr-2
  "
      />
      <div className="flex w-full items-center justify-between px-2 gap-x-2">
        {" "}
        <EditorBreadcrumbs workflowId={workflowId} />
        <EditorSaveButton workflowId={workflowId} />
        <Button
          size="icon"
          variant="warning"
          onClick={() => setOpen(true)}
          className="
    rounded-4xl

  "
        >
          <CircleHelpIcon className="size-4" />
        </Button>
      </div>{" "}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="
      border-white/70
      bg-white/95
      shadow-[0_25px_80px_rgba(37,99,235,0.10)]
    "
        >
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-slate-900">
              Workflow Canvas Guide
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            {/* Navigation */}
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Navigation & Movement
              </p>

              <div className="space-y-3 text-sm text-slate-600">
                <div className="flex items-center gap-3">
                  <MoveIcon className="size-4 shrink-0 text-sky-600" />
                  <span>Right-click and drag to move around the canvas</span>
                </div>

                <div className="flex items-center gap-3">
                  <kbd className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium shadow-sm">
                    Scroll
                  </kbd>
                  <span>Scroll vertically through the canvas</span>
                </div>

                <div className="flex items-center gap-3">
                  <kbd className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium shadow-sm">
                    Ctrl
                  </kbd>
                  <span>Hold and scroll to zoom in and out</span>
                </div>
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

            {/* Selection */}
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Selection & Editing
              </p>

              <div className="space-y-3 text-sm text-slate-600">
                <div className="flex items-center gap-3">
                  <MousePointer2Icon className="size-4 shrink-0 text-sky-600" />
                  <span>Drag nodes to reposition them</span>
                </div>

                <div className="flex items-center gap-3">
                  <MousePointer2Icon className="size-4 shrink-0 text-sky-600" />
                  <span>Click a connection line to select it</span>
                </div>

                <div className="flex items-center gap-3">
                  <kbd className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium shadow-sm">
                    Shift
                  </kbd>
                  <span>Drag to create a selection box</span>
                </div>

                <div className="flex items-center gap-3">
                  <kbd className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium shadow-sm">
                    Ctrl
                  </kbd>
                  or
                  <kbd className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium shadow-sm">
                    ⌘
                  </kbd>
                  <span>Select multiple nodes on Windows/Linux/macOS</span>
                </div>

                <div className="flex items-center gap-3">
                  <kbd className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium shadow-sm">
                    Del
                  </kbd>
                  <span>Delete selected nodes or connections</span>
                </div>
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

            {/* Workflow Building */}
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Workflow Building
              </p>

              <div className="rounded-2xl border border-sky-100 bg-gradient-to-r from-sky-50 via-white to-cyan-50 p-4">
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>
                    • Drag from one node handle to another to create a
                    connection
                  </li>
                  <li>• Use the minimap to navigate large workflows quickly</li>
                  <li>
                    • Connect triggers to actions to build execution chains
                  </li>
                </ul>
              </div>
            </div>

            {/* Node Configuration */}
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Node Configuration
              </p>

              <div className="rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 via-white to-sky-50 p-4">
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>✏️ Double-click a node to open its configuration form</li>

                  <li>
                    📝 Configure prompts, API settings, inputs, outputs and
                    node-specific options
                  </li>

                  <li>⚙️ Each node type has its own configuration panel</li>
                </ul>
              </div>
            </div>

            {/* Save Reminder */}
            <div
              className="
          rounded-2xl
          border
          border-sky-200/50
          bg-gradient-to-r
          from-sky-50
          via-white
          to-cyan-50
          p-4
          shadow-[0_8px_24px_rgba(37,99,235,0.08)]
        "
            >
              <p className="text-sm font-semibold text-sky-800">
                💾 Save Workflow
              </p>

              <p className="mt-1 text-sm text-slate-600">
                Changes on the canvas remain local until you click
                <span className="font-semibold text-sky-700">
                  {" "}
                  Save Workflow
                </span>
                . Save after adding, removing, connecting, or configuring nodes.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
};
