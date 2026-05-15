import { AppHeader } from "@/components/layout/app-header";
import { WorkflowCanvas } from "@/components/workflow/workflow-canvas";
import { WorkflowHistoryPanel } from "@/components/workflow/workflow-history-panel";

type WorkflowPageProps = {
  params: Promise<{
    workflowId: string;
  }>;
};

export default async function WorkflowPage({ params }: WorkflowPageProps) {
  const { workflowId } = await params;

  return (
    <div className="flex h-screen flex-col bg-[#f7f7f6] text-neutral-900">
      <AppHeader />

      <div className="flex h-[calc(100vh-48px)] min-h-0">
        <main className="flex min-w-0 flex-1 flex-col">
          <div className="flex h-12 shrink-0 items-center justify-between border-b border-neutral-200 bg-[#fbfbfa] px-4">
            <div>
              <h1 className="text-sm font-semibold tracking-tight text-neutral-900">
                Untitled Workflow
              </h1>
              <p className="text-[11px] text-neutral-500">
                ID: {workflowId}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-medium text-neutral-600">
                Draft
              </span>

              <button className="rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 transition hover:bg-neutral-100">
                Save
              </button>

              <button className="rounded-xl bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-neutral-800">
                Run
              </button>
            </div>
          </div>

          <WorkflowCanvas />
        </main>

        <WorkflowHistoryPanel />
      </div>
    </div>
  );
}