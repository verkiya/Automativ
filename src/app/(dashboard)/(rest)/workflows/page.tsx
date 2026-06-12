import {
  WorkflowsContainer,
  WorkflowsError,
  WorkflowsList,
  WorkflowsLoading,
} from "@/features/workflows/components/workflows";
import { workflowsParamsLoader } from "@/features/workflows/server/params-loader";
import { prefetchWorkflows } from "@/features/workflows/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

// Next.js Route Groups Strategy for Workflows:
// Workflows are split across route groups so the list/detail UI stays in `(rest)`
// while the visual editor lives in `(editor)`. That keeps the dashboard list
// route lightweight and lets the editor use a separate layout and loading flow
// without coupling the two experiences together.
// 
// Specifically, the individual workflow editor page (`/workflows/[id]`) is a 
// completely separate page placed in the `(editor)` route group. This allows it 
// to utilize a dedicated, full-screen canvas layout that is optimized for the 
// React Flow visual editor.
// Meanwhile, the main workflows page (`/workflows` list) uses the standard 
// `(rest)` dashboard layout with regular navigation components.
// This route group strategy ensures the two distinct experiences do not share 
// an overarching layout, preventing UI and dependency conflicts.
type Props = {
  searchParams: Promise<SearchParams>;
};
const Page = async ({ searchParams }: Props) => {
  await requireAuth();
  const params = await workflowsParamsLoader(searchParams);
  prefetchWorkflows(params);
  return (
    <WorkflowsContainer>
      <HydrateClient>
        <ErrorBoundary fallback={<WorkflowsError />}>
          <Suspense fallback={<WorkflowsLoading />}>
            <WorkflowsList />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </WorkflowsContainer>
  );
};
export default Page;
