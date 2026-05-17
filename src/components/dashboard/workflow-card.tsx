"use client";

import Link from "next/link";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { useState } from "react";
import { ClientDate } from "@/components/common/client-date";

type WorkflowCardProps = {
  id: string;
  name: string;
  status: string;
  updatedAt: string;
  onDeleted?: () => void;
};

export function WorkflowCard({
  id,
  name,
  status,
  updatedAt,
  onDeleted,
}: WorkflowCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function deleteWorkflow() {
    const confirmed = window.confirm("Delete this workflow?");

    if (!confirmed) {
      return;
    }

    setDeleting(true);

    try {
      await fetch(`/api/workflows/${id}`, {
        method: "DELETE",
      });

      onDeleted?.();
    } catch (error) {
      console.error("Failed to delete workflow:", error);
    } finally {
      setDeleting(false);
      setMenuOpen(false);
    }
  }

  return (
    <div className="relative rounded-3xl border border-neutral-200 bg-white
     p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-6 flex items-start justify-between gap-3">
        <Link
          href={`/workflow/${id}`}
          className="flex h-10 w-10 items-center justify-center rounded-2xl bg-neutral-100 text-sm font-semibold text-neutral-700"
        >
          {name.charAt(0).toUpperCase()}
        </Link>

        <button
          type="button"
          onClick={() => setMenuOpen((value) => !value)}
          className="rounded-lg p-1 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      <Link href={`/workflow/${id}`}>
        <h3 className="text-sm font-semibold tracking-tight text-neutral-900">
          {name}
        </h3>

        <p className="cursor-pointer mt-1 text-xs text-neutral-500">
          Last edited <ClientDate value={updatedAt} />
        </p>

        <div
          className={`mt-4 inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium capitalize ${
            status === "RUNNING"
              ? "bg-blue-50 text-blue-700"
              : status === "COMPLETED"
              ? "bg-green-50 text-green-700"
              : status === "FAILED"
              ? "bg-red-50 text-red-700"
              : status === "PARTIAL"
              ? "bg-amber-50 text-amber-700"
              : "bg-neutral-100 text-neutral-600"
          }`}
        >
          {status.toLowerCase()}
        </div>
      </Link>

      {menuOpen && (
        <div className="absolute right-4 top-12 z-20 w-36 rounded-2xl border border-neutral-200 bg-white p-1 shadow-lg">
          <button
            onClick={deleteWorkflow}
            disabled={deleting}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-60"
          >
            <Trash2 className="h-3.5 w-3.5" />
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      )}
    </div>
  );
}