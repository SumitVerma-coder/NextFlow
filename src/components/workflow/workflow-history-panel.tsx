"use client";

import { useEffect, useState } from "react";
import {
  Clock3,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { ClientDate } from "@/components/common/client-date";
import { formatRunResult } from "@/lib/format-run-result";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type NodeRun = {
  id: string;
  nodeId: string;
  nodeType: string;
  status: string;
  input: unknown;
  output: unknown;
  error: string | null;
  durationMs: number | null;
  createdAt: string;
};

type WorkflowRun = {
  id: string;
  status: string;
  scope: string;
  durationMs: number | null;
  result: unknown;
  createdAt: string;
  nodeRuns: NodeRun[];
};

type WorkflowHistoryPanelProps = {
  workflowId: string;
  refreshKey?: number;
};

function StatusIcon({ status }: { status: string }) {
  if (status === "SUCCESS") {
    return <CheckCircle2 className="h-4 w-4 text-green-600" />;
  }

  if (status === "FAILED") {
    return <XCircle className="h-4 w-4 text-red-600" />;
  }

  if (status === "PARTIAL") {
    return <AlertTriangle className="h-4 w-4 text-amber-600" />;
  }

  return <Loader2 className="h-4 w-4 animate-spin text-neutral-500" />;
}

export function WorkflowHistoryPanel({
  workflowId,
  refreshKey = 0,
}: WorkflowHistoryPanelProps) {
  const [runs, setRuns] = useState<WorkflowRun[]>([]);
  const [selectedRun, setSelectedRun] = useState<WorkflowRun | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadRuns() {
    try {
      const res = await fetch(`/api/workflows/${workflowId}/runs`);
      const data = await res.json();

      const nextRuns = data.runs ?? [];
      setRuns(nextRuns);

      setSelectedRun((currentSelectedRun) => {
        if (!currentSelectedRun && nextRuns[0]) {
          return nextRuns[0];
        }

        const updatedSelectedRun = nextRuns.find(
          (run: WorkflowRun) => run.id === currentSelectedRun?.id
        );

        return updatedSelectedRun ?? currentSelectedRun;
      });
    } catch (error) {
      console.error("Failed to load runs:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRuns();

    const interval = setInterval(loadRuns, 3000);

    return () => clearInterval(interval);
  }, [workflowId, refreshKey]);

  return (
    <aside className="h-full w-96 shrink-0 overflow-y-auto border-l border-neutral-200 bg-[#fbfbfa] p-4 dark:border-neutral-800 dark:bg-neutral-950">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock3 className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
          <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            History
          </h2>
        </div>

        <button
          onClick={loadRuns}
          className="rounded-lg px-2 py-1 text-[11px] font-medium text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-neutral-200 bg-white p-4 text-sm text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
          Loading runs...
        </div>
      ) : runs.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-neutral-300 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <p className="text-sm font-medium text-neutral-800 dark:text-neutral-100">
            No runs yet
          </p>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            Workflow execution history will appear here after you run the
            workflow.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {runs.map((run) => (
            <button
              key={run.id}
              onClick={() => setSelectedRun(run)}
              className={`w-full rounded-2xl border bg-white p-3 text-left transition hover:bg-neutral-50 dark:bg-neutral-900 dark:hover:bg-neutral-800 ${
                selectedRun?.id === run.id
                  ? "border-neutral-900 dark:border-neutral-100"
                  : "border-neutral-200 dark:border-neutral-800"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <StatusIcon status={run.status} />
                  <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                    {run.status}
                  </span>
                </div>

                <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  {run.durationMs
                    ? `${(run.durationMs / 1000).toFixed(1)}s`
                    : "..."}
                </span>
              </div>

              <p className="mt-2 text-[11px] text-neutral-500 dark:text-neutral-400">
                <ClientDate value={run.createdAt} />
              </p>
            </button>
          ))}
        </div>
      )}

      {selectedRun && (
        <div className="mt-5 rounded-3xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              Run Details
            </h3>

            <span className="rounded-full bg-neutral-100 px-2 py-1 text-[11px] font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
              {selectedRun.scope.toLowerCase()}
            </span>
          </div>

          {selectedRun.result ? (
            <div className="mb-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-950">
              <p className="mb-2 text-xs font-semibold text-neutral-800 dark:text-neutral-100">
                Final Response
              </p>
              
              <div className="prose prose-sm max-w-none text-xs text-neutral-700 dark:prose-invert dark:text-neutral-300">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ children }) => (
                      <h1 className="mb-2 mt-3 text-sm font-bold text-neutral-900 dark:text-neutral-100">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="mb-2 mt-3 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="mb-2 mt-3 text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                        {children}
                      </h3>
                    ),
                    p: ({ children }) => (
                      <p className="mb-2 whitespace-pre-wrap text-xs leading-5 text-neutral-700 dark:text-neutral-300">
                        {children}
                      </p>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-semibold text-neutral-900 dark:text-neutral-100">
                        {children}
                      </strong>
                    ),
                    em: ({ children }) => (
                      <em className="italic text-neutral-800 dark:text-neutral-200">
                        {children}
                      </em>
                    ),
                    ul: ({ children }) => (
                      <ul className="mb-2 list-disc space-y-1 pl-4 text-xs text-neutral-700 dark:text-neutral-300">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="mb-2 list-decimal space-y-1 pl-4 text-xs text-neutral-700 dark:text-neutral-300">
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => (
                      <li className="leading-5">
                        {children}
                      </li>
                    ),
                    hr: () => (
                      <div className="my-3 border-t border-neutral-200 dark:border-neutral-800" />
                    ),
                    code: ({ children }) => (
                      <code className="rounded bg-neutral-100 px-1 py-0.5 text-[11px] text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200">
                        {children}
                      </code>
                    ),
                  }}
                >
                  {formatRunResult(selectedRun.result)}
                </ReactMarkdown>
              </div>

              <details className="mt-3">
                <summary className="cursor-pointer text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
                  View raw JSON
                </summary>

                <pre className="mt-2 max-h-60 overflow-auto rounded-xl bg-white p-3 text-[10px] text-neutral-600 dark:bg-neutral-900 dark:text-neutral-300">
                  {JSON.stringify(selectedRun.result, null, 2)}
                </pre>
              </details>
            </div>
          ) : null}

          <div className="space-y-3">
            {selectedRun.nodeRuns.map((nodeRun) => (
              <div
                key={nodeRun.id}
                className="rounded-2xl border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-950"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                      {nodeRun.nodeId}
                    </p>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                      {nodeRun.nodeType}
                    </p>
                  </div>

                  <StatusIcon status={nodeRun.status} />
                </div>

                <p className="mt-2 text-[11px] text-neutral-500 dark:text-neutral-400">
                  Duration:{" "}
                  {nodeRun.durationMs
                    ? `${(nodeRun.durationMs / 1000).toFixed(1)}s`
                    : "..."}
                </p>

                {nodeRun.error && (
                  <p className="mt-2 rounded-xl bg-red-50 p-2 text-[11px] text-red-600 dark:bg-red-950/40 dark:text-red-400">
                    {nodeRun.error}
                  </p>
                )}

                {nodeRun.output ? (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
                      Output
                    </summary>

                    <pre className="mt-2 max-h-40 overflow-auto rounded-xl bg-white p-2 text-[10px] text-neutral-600 dark:bg-neutral-900 dark:text-neutral-300">
                      {JSON.stringify(nodeRun.output, null, 2)}
                    </pre>
                  </details>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}