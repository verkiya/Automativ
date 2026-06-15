"use client";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Loader2Icon, SaveIcon } from "lucide-react";
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
  useSuspenseWorkflow,
  useUpdateWorkflow,
  useUpdateWorkflowName,
} from "@/features/workflows/hooks/use-workflows";
import { cn } from "@/lib/utils";
import { useAtomValue } from "jotai";
import { editorAtom } from "../store/atoms";
export const EditorSaveButton = ({ workflowId }: { workflowId: string }) => {
  const editor = useAtomValue(editorAtom);
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
    <div className="ml-auto">
      <Button
        size="default"
        variant="aurora"
        onClick={handleSave}
        disabled={saveWorkflow.isPending}
        className="
    w-[140px]

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
          "  h-8  w-auto  min-w-[120px]  rounded-xl  border-white/60  bg-white/70  px-3  backdrop-blur-xl  transition-all  duration-200  focus-visible:ring-2  focus-visible:ring-blue-400/20  focus-visible:border-blue-300/50  ",
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
    bg-white/80

    backdrop-blur-3xl
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
      <div className="flex w-full items-center justify-between px-2 gap-x-4">
        {" "}
        <EditorBreadcrumbs workflowId={workflowId} />
        <EditorSaveButton workflowId={workflowId} />
        <Button
          size="icon"
          variant="workflowSoft"
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
      bg-white/90
      backdrop-blur-3xl
      shadow-[0_25px_80px_rgba(37,99,235,0.10)]
    "
        >
          <DialogHeader>
            <DialogTitle>Canvas Controls</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 text-sm text-slate-600">
            <div className="flex items-center gap-3">
              <MoveIcon className="size-4 text-sky-600" />
              <span>Drag empty canvas to pan</span>
            </div>

            <div className="flex items-center gap-3">
              <ZoomInIcon className="size-4 text-sky-600" />
              <span>Mouse wheel to zoom in and out</span>
            </div>

            <div className="flex items-center gap-3">
              <MousePointer2Icon className="size-4 text-sky-600" />
              <span>Drag nodes to reposition them</span>
            </div>

            <div className="flex items-center gap-3">
              <kbd
                className="
    rounded-lg
    border
    border-slate-200
    bg-white
    px-2
    py-1
    text-xs
    font-medium
    shadow-sm
  "
              >
                Del
              </kbd>
              <span>Delete selected nodes or connections</span>
            </div>

            <div className="flex items-center gap-3">
              <kbd
                className="
    rounded-lg
    border
    border-slate-200
    bg-white
    px-2
    py-1
    text-xs
    font-medium
    shadow-sm
  "
              >
                Ctrl
              </kbd>
              <span>Hold to select multiple nodes</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
};
