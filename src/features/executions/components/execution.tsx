"use client";

import { ExecutionStatus } from "@/generated/prisma";
import {
  CheckCircle2Icon,
  ClockIcon,
  Loader2Icon,
  WorkflowIcon,
  XCircleIcon,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useSuspenseExecution } from "@/features/executions/hooks/use-executions";

const getStatusIcon = (status: ExecutionStatus) => {
  switch (status) {
    case ExecutionStatus.SUCCESS:
      return <CheckCircle2Icon className="size-5 text-green-600" />;
    case ExecutionStatus.FAILED:
      return <XCircleIcon className="size-5 text-red-600" />;
    case ExecutionStatus.RUNNING:
      return <Loader2Icon className="size-5 text-blue-600 animate-spin" />;
    default:
      return <ClockIcon className="size-5 text-muted-foreground" />;
  }
};

const formatStatus = (status: ExecutionStatus) => {
  return status.charAt(0) + status.slice(1).toLowerCase();
};

export const ExecutionView = ({ executionId }: { executionId: string }) => {
  const { data: execution } = useSuspenseExecution(executionId);
  const [showStackTrace, setShowStackTrace] = useState(false);

  const duration = execution.completedAt
    ? Math.round(
        (new Date(execution.completedAt).getTime() -
          new Date(execution.startedAt).getTime()) /
          1000,
      )
    : null;

  return (
    <Card className="h-full shadow-none">
      <CardHeader>
        <div className="flex items-center gap-4">
          <div
            className={`
              size-12
              rounded-xl
              flex
              items-center
              justify-center
              border
              ${
                execution.status === ExecutionStatus.SUCCESS
                  ? "bg-green-50 border-green-200"
                  : execution.status === ExecutionStatus.FAILED
                    ? "bg-red-50 border-red-200"
                    : execution.status === ExecutionStatus.RUNNING
                      ? "bg-sky-50 border-sky-200"
                      : "bg-slate-50 border-slate-200"
              }
            `}
          >
            {getStatusIcon(execution.status)}
          </div>

          <div>
            <CardTitle>{formatStatus(execution.status)}</CardTitle>
            <CardDescription>
              Execution for {execution.workflow.name}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 flex flex-col">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 rounded-xl border bg-card p-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              Workflow
            </p>

            <Button
              asChild
              variant="outline"
              size="sm"
              className="
      w-fit
      gap-2
      rounded-lg
      border-sky-200/60
      bg-gradient-to-r
      from-sky-50
      to-cyan-50
      hover:scale-[1.02]
      transition-all
    "
            >
              <Link prefetch href={`/workflows/${execution.workflowId}`}>
                <WorkflowIcon className="size-4" />
                {execution.workflow.name}
              </Link>
            </Button>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Status</p>
            <p className="text-sm">{formatStatus(execution.status)}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">Started</p>

            <p className="text-sm">
              {formatDistanceToNow(execution.startedAt, {
                addSuffix: true,
              })}
            </p>
          </div>

          {execution.completedAt ? (
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Completed
              </p>

              <p className="text-sm">
                {formatDistanceToNow(execution.completedAt, {
                  addSuffix: true,
                })}
              </p>
            </div>
          ) : null}

          {duration !== null ? (
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Duration
              </p>

              <p className="text-sm">{duration}s</p>
            </div>
          ) : null}

          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Inngest Event ID
            </p>

            <p className="font-mono text-xs break-all">
              {execution.inngestEventId}
            </p>
          </div>
        </div>

        {execution.error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 space-y-3">
            <div>
              <p className="mb-2 text-sm font-medium text-red-900">Error</p>

              <p className="font-mono text-sm text-red-800 break-words">
                {execution.error}
              </p>
            </div>

            {execution.errorStack && (
              <Collapsible
                open={showStackTrace}
                onOpenChange={setShowStackTrace}
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="text-red-900 hover:bg-red-100"
                  >
                    {showStackTrace ? "Hide stack trace" : "Show stack trace"}
                  </Button>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <pre
                    className="
                      mt-2
                      max-h-[300px]
                      overflow-auto
                      rounded-lg
                      bg-red-100
                      p-3
                      text-xs
                      font-mono
                      text-red-800
                    "
                  >
                    {execution.errorStack}
                  </pre>
                </CollapsibleContent>
              </Collapsible>
            )}
          </div>
        )}

        {execution.output && (
          <div className="mt-6 rounded-xl border bg-muted/40">
            <div className="border-b px-4 py-3">
              <p className="text-sm font-medium">Output</p>
            </div>

            <div className="max-h-[425px] overflow-auto p-4">
              <pre className="font-mono text-xs whitespace-pre-wrap break-words">
                {JSON.stringify(execution.output, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
