import Link from "next/link";
import { MoreHorizontal } from "lucide-react";

type WorkflowCardProps = {
  id: string;
  name: string;
  status: string;
  updatedAt: string;
};

export function WorkflowCard({
  id,
  name,
  status,
  updatedAt,
}: WorkflowCardProps) {
  return (
    <Link href={`/workflow/${id}`}>
      <div className="group rounded-3xl border border-neutral-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
        <div className="mb-6 flex items-start justify-between gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-neutral-100 text-sm font-semibold text-neutral-700">
            {name.charAt(0).toUpperCase()}
          </div>

          <button
            type="button"
            className="rounded-lg p-1 text-neutral-400 opacity-0 transition hover:bg-neutral-100 hover:text-neutral-700 group-hover:opacity-100"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>

        <h3 className="text-sm font-semibold tracking-tight text-neutral-900">
          {name}
        </h3>

        <p className="mt-1 text-xs text-neutral-500">
          Last edited {new Date(updatedAt).toLocaleString()}
        </p>

        <div className="mt-4 inline-flex rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-medium capitalize text-neutral-600">
          {status.toLowerCase()}
        </div>
      </div>
    </Link>
  );
}