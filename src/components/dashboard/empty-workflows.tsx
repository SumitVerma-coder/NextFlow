import { Plus } from "lucide-react";

type EmptyWorkflowsProps = {
  onCreate: () => void;
  creating: boolean;
};

export function EmptyWorkflows({ onCreate, creating }: EmptyWorkflowsProps) {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-dashed border-neutral-300 bg-white px-6 py-12">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-100">
        <Plus className="h-5 w-5 text-neutral-500" />
      </div>

      <h2 className="text-lg font-semibold tracking-tight text-neutral-900">
        No workflows yet
      </h2>

      <p className="mt-2 max-w-sm text-center text-sm text-neutral-500">
        Create your first workflow and start building a Galaxy-style automation.
      </p>

      <button
        onClick={onCreate}
        disabled={creating}
        className="mt-6 rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {creating ? "Creating..." : "Create Workflow"}
      </button>
    </div>
  );
}