import { Button } from "@/components/ui/button";
import { useExecuteWorkflow } from "@/features/workflows/hooks/use-workflows";
import { FlaskConicalIcon } from "lucide-react";
import { useUpdateWorkflow } from "@/features/workflows/hooks/use-workflows";
import { useAtomValue } from "jotai";
import { editorAtom } from "../store/atoms";
import { toast } from "sonner";
export const ExecuteWorkflowButton = ({
  workflowId,
}: {
  workflowId: string;
}) => {
  const executeWorkflow = useExecuteWorkflow();
  // const handleExecute = () => {
  //   executeWorkflow.mutate({ id: workflowId });
  // };
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
    } catch (err: any) {
      console.error(err);
    }
  };
  return (
    <Button
      size="lg"
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
