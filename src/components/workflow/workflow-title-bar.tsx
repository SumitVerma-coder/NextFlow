"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Home,History,Trash2 } from "lucide-react";
import { ClientDate } from "@/components/common/client-date";

type WorkflowTitleBarProps = {
  workflowId: string;
  initialName: string;
  status: string;
  updatedAt: string;
  historyOpen: boolean;
  onToggleHistory: () => void;
  onRunStarted?: () => void;
};

export function WorkflowTitleBar({
  workflowId,
  initialName,
  status,
  updatedAt,
  historyOpen,
  onToggleHistory,
  onRunStarted,
}: WorkflowTitleBarProps) {
  const router = useRouter();

  const [name, setName] = useState(initialName);
  const [renaming, setRenaming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [running, setRunning] = useState(false);

  async function renameWorkflow() {
    setRenaming(true);

    try {
      await fetch(`/api/workflows/${workflowId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
        }),
      });

      router.refresh();
    } catch (error) {
      console.error("Failed to rename workflow:", error);
    } finally {
      setRenaming(false);
    }
  }

  async function runWorkflow() {
  setRunning(true);

  try {
    const res = await fetch(`/api/workflows/${workflowId}/run`, {
      method: "POST",
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error ?? "Failed to start workflow");
    }

    onRunStarted?.();
    router.refresh();
  } catch (error) {
    console.error("Failed to run workflow:", error);
    alert(error instanceof Error ? error.message : "Failed to run workflow");
  } finally {
    setRunning(false);
  }
}

  async function deleteWorkflow() {
    const confirmed = window.confirm("Delete this workflow? This cannot be undone.");

    if (!confirmed) {
      return;
    }

    setDeleting(true);

    try {
      await fetch(`/api/workflows/${workflowId}`, {
        method: "DELETE",
      });

      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to delete workflow:", error);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="flex h-12 shrink-0 items-center justify-between border-b border-neutral-200 bg-[#fbfbfa] px-4">
      <div className="flex items-center gap-3">
        <div>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={renameWorkflow}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.currentTarget.blur();
              }
            }}
            className="w-72 bg-transparent text-sm font-semibold tracking-tight text-neutral-900 outline-none"
          />

          <p className="text-[11px] text-neutral-500">
            Last edited <ClientDate value={updatedAt} />
          </p>
        </div>

        {renaming && (
          <span className="text-[11px] text-neutral-400">Saving name...</span>
        )}
      </div>

      <button
        onClick={() => router.push("/dashboard")}
        className="cursor-pointer inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
      >
        <Home className="h-3.5 w-3.5" />
        Dashboard
      </button>

      <div className="flex items-center gap-2">
        <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-medium text-neutral-600">
          {status.toLowerCase()}
        </span>

        <button
          onClick={onToggleHistory}
          className={`inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-medium transition ${
            historyOpen
              ? "cursor-pointer border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900"
              : "cursor-pointer border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
          }`}
        >
          <History className="h-3.5 w-3.5" />
          History
        </button>

        <button
          onClick={deleteWorkflow}
          disabled={deleting}
          className="cursor-pointer rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100 disabled:opacity-60"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>

        <button
          onClick={runWorkflow}
          disabled={running}
          className="cursor-pointer rounded-xl bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {running ? "Starting..." : "Run"}
        </button>
      </div>
    </div>
  );
}