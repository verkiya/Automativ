import { Button } from "@/components/ui/button";
import { useExecuteWorkflow } from "@/features/workflows/hooks/use-workflows";
import { FlaskConicalIcon } from "lucide-react";
import { useUpdateWorkflow } from "@/features/workflows/hooks/use-workflows";
import { useAtomValue } from "jotai";
import { editorAtom } from "../store/atoms";
import { toast } from "@/components/ui/sonner";
export const ExecuteWorkflowButton = ({
  workflowId,
}: {
  workflowId: string;
}) => {
  const executeWorkflow = useExecuteWorkflow();

  const saveWorkflow = useUpdateWorkflow();
  const editor = useAtomValue(editorAtom);
  const handleExecute = async () => {
    if (saveWorkflow.isPending || executeWorkflow.isPending) return;

    if (!editor) {
      toast.error("Editor not ready");
      return;
    }

    const nodes = editor.getNodes();
    const edges = editor.getEdges();

    try {
      await saveWorkflow.mutateAsync({
        id: workflowId,
        nodes,
        edges,
      });

      await executeWorkflow.mutateAsync({ id: workflowId });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to execute workflow";
    }
  };
  return (
    <Button
      size="lg"
      variant="success"
      onClick={handleExecute}
      disabled={executeWorkflow.isPending || saveWorkflow.isPending}
    >
      <FlaskConicalIcon className="size-4" />
      {executeWorkflow.isPending || saveWorkflow.isPending
        ? "Running..."
        : "Execute Workflow"}
    </Button>
  );
};

