"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { EmptyWorkflows } from "@/components/dashboard/empty-workflows";
import { WorkflowCard } from "@/components/dashboard/workflow-card";

type Workflow = {
  id: string;
  name: string;
  status: string;
  updatedAt: string;
};

export default function DashboardPage() {
  const router = useRouter();

  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  async function loadWorkflows() {
    try {
      const res = await fetch("/api/workflows");
      const data = await res.json();

      setWorkflows(data.workflows ?? []);
    } catch (error) {
      console.error("Failed to load workflows:", error);
    } finally {
      setLoading(false);
    }
  }

  async function createSampleWorkflow() {
  try {
    setCreating(true);

    const res = await fetch("/api/workflows/sample", {
      method: "POST",
    });

    const data = await res.json();

    if (data.workflow?.id) {
      router.push(`/workflow/${data.workflow.id}`);
    }
  } catch (error) {
    console.error("Failed to create sample workflow:", error);
  } finally {
    setCreating(false);
  }
}

  async function createWorkflow() {
    try {
      setCreating(true);

      const res = await fetch("/api/workflows", {
        method: "POST",
      });

      const data = await res.json();

      if (data.workflow?.id) {
        router.push(`/workflow/${data.workflow.id}`);
      }
    } catch (error) {
      console.error("Failed to create workflow:", error);
    } finally {
      setCreating(false);
    }
  }

  useEffect(() => {
    loadWorkflows();
  }, []);

  return (
    <AppShell>
      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
              Workflows
            </h1>
            <p className="mt-1 text-sm text-neutral-500">
              Create, edit, and run your AI workflows.
            </p>
          </div>
            <div className="flex items-center gap-2">
              <button
                onClick={createSampleWorkflow}
                disabled={creating}
                className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Use Sample
              </button>

              <button
                onClick={createWorkflow}
                disabled={creating}
                className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Plus className="h-4 w-4" />
                {creating ? "Creating..." : "New Workflow"}
              </button>
            </div>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-neutral-200 bg-white p-8 text-sm text-neutral-500">
            Loading workflows...
          </div>
        ) : workflows.length === 0 ? (
          <EmptyWorkflows onCreate={createWorkflow} creating={creating} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {workflows.map((workflow) => (
              <WorkflowCard
                key={workflow.id}
                id={workflow.id}
                name={workflow.name}
                status={workflow.status}
                updatedAt={workflow.updatedAt}
                onDeleted={loadWorkflows}
              />
            ))}
          </div>
        )}
      </main>
    </AppShell>
  );
}