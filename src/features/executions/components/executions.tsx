"use client";

import { formatDistanceToNow } from "date-fns";
import {
  EmptyView,
  EntityContainer,
  EntityHeader,
  EntityItem,
  EntityList,
  EntityPagination,
  ErrorView,
  LoadingView,
} from "@/components/entity-components";
import { useSuspenseExecutions } from "../hooks/use-executions";
import { useExecutionsParams } from "../hooks/use-executions-params";
import type { Execution } from "@/generated/prisma";
import { ExecutionStatus } from "@/generated/prisma";
import {
  CheckCircle2Icon,
  ClockIcon,
  Loader2Icon,
  XCircleIcon,
} from "lucide-react";

export const ExecutionsList = () => {
  const executions = useSuspenseExecutions();

  return (
    <EntityList
      items={executions.data.items}
      className=" space-y-2 mt-4"
      getKey={(execution) => execution.id}
      renderItem={(execution) => <ExecutionItem data={execution} />}
      emptyView={<ExecutionsEmpty />}
    />
  );
};

export const ExecutionsHeader = () => {
  return (
    <EntityHeader
      title="Executions"
      
      description="Monitor workflow runs, statuses, and execution history"
    />
  );
};

export const ExecutionsPagination = () => {
  const executions = useSuspenseExecutions();
  const [params, setParams] = useExecutionsParams();

  return (
    <EntityPagination
      disabled={executions.isFetching}
      totalPages={executions.data.totalPages}
      page={executions.data.page}
      onPageChange={(page) => setParams({ ...params, page })}
    />
  );
};

export const ExecutionsContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <EntityContainer
      header={<ExecutionsHeader />}
      pagination={<ExecutionsPagination />}
    >
      {children}
    </EntityContainer>
  );
};

export const ExecutionsLoading = () => {
  return <LoadingView message="Loading executions..." />;
};

export const ExecutionsError = () => {
  return <ErrorView message="Error loading executions" />;
};

export const ExecutionsEmpty = () => {
  return (
    <EmptyView message="No executions yet. Run a workflow to start tracking execution history." />
  );
};

const getStatusIcon = (status: ExecutionStatus) => {
  switch (status) {
    case ExecutionStatus.SUCCESS:
      return <CheckCircle2Icon className="size-6 text-green-600" />;
    case ExecutionStatus.FAILED:
      return <XCircleIcon className="size-6 text-red-500" />;
    case ExecutionStatus.RUNNING:
      return <Loader2Icon className="size-6 text-sky-600 animate-spin" />;
    default:
      return <ClockIcon className="size-6 text-muted-foreground" />;
  }
};

const formatStatus = (status: ExecutionStatus) => {
  return status.charAt(0) + status.slice(1).toLowerCase();
};

export const ExecutionItem = ({
  data,
}: {
  data: Execution & {
    workflow: {
      id: string;
      name: string;
    };
  };
}) => {
  const duration = data.completedAt
    ? Math.round(
        (new Date(data.completedAt).getTime() -
          new Date(data.startedAt).getTime()) /
          1000,
      )
    : null;

  const subtitle = (
    <>
      <span className="font-medium">
        {formatStatus(data.status)}
      </span>
      {" • "}
      Started{" "}
      {formatDistanceToNow(data.startedAt, {
        addSuffix: true,
      })}
      {duration !== null && <> • Took {duration}s</>}
    </>
  );

  return (
    <EntityItem
      href={`/executions/${data.id}`}
      title={data.workflow.name}
      subtitle={subtitle}
      image={
        <div
          className={`
            size-10
            rounded-xl
            flex
            items-center
            justify-center
            ${
              data.status === ExecutionStatus.SUCCESS
                ? "bg-green-50"
                : data.status === ExecutionStatus.FAILED
                  ? "bg-red-50"
                  : data.status === ExecutionStatus.RUNNING
                    ? "bg-sky-50"
                    : "bg-slate-50"
            }
          `}
        >
          {getStatusIcon(data.status)}
        </div>
      }
    />
  );
};
