import { Clock3 } from "lucide-react";

export function WorkflowHistoryPanel() {
  return (
    <aside className="h-full w-80 shrink-0 border-l border-neutral-200 bg-[#fbfbfa] p-4">
      <div className="mb-4 flex items-center gap-2">
        <Clock3 className="h-4 w-4 text-neutral-500" />
        <h2 className="text-sm font-semibold text-neutral-900">History</h2>
      </div>

      <div className="rounded-3xl border border-dashed border-neutral-300 bg-white p-4">
        <p className="text-sm font-medium text-neutral-800">
          No runs yet
        </p>
        <p className="mt-1 text-xs text-neutral-500">
          Workflow execution history will appear here after you run the workflow.
        </p>
      </div>

      <div className="mt-4 space-y-3">
        <div className="rounded-2xl border border-neutral-200 bg-white p-3 opacity-50">
          <div className="mb-2 h-3 w-24 rounded-full bg-neutral-200" />
          <div className="h-2 w-40 rounded-full bg-neutral-100" />
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-3 opacity-40">
          <div className="mb-2 h-3 w-20 rounded-full bg-neutral-200" />
          <div className="h-2 w-32 rounded-full bg-neutral-100" />
        </div>
      </div>
    </aside>
  );
}