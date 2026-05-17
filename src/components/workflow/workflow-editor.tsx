"use client";

import { useState } from "react";
import type { Edge, Node } from "@xyflow/react";
import { WorkflowCanvas } from "@/components/workflow/workflow-canvas";
import { WorkflowHistoryPanel } from "@/components/workflow/workflow-history-panel";
import { WorkflowTitleBar } from "@/components/workflow/workflow-title-bar";

type WorkflowEditorProps = {
  workflowId: string;
  name: string;
  status: string;
  updatedAt: string;
  nodes: Node[];
  edges: Edge[];
};

export function WorkflowEditor({
  workflowId,
  name,
  status,
  updatedAt,
  nodes,
  edges,
}: WorkflowEditorProps) {
  const [refreshKey, setRefreshKey] = useState(0);
  const [historyOpen, setHistoryOpen] = useState(true);

  function refreshRuns() {
    setRefreshKey((value) => value + 1);
  }

  return (
    <div className="flex h-[calc(100vh-48px)] min-h-0">
      <main className="flex min-w-0 flex-1 flex-col">
        <WorkflowTitleBar
          workflowId={workflowId}
          initialName={name}
          status={status}
          updatedAt={updatedAt}
          historyOpen={historyOpen}
          onToggleHistory={() => setHistoryOpen((value) => !value)}
          onRunStarted={refreshRuns}
        />

        <WorkflowCanvas
          workflowId={workflowId}
          initialNodes={nodes}
          initialEdges={edges}
        />
      </main>

      {historyOpen && (
        <WorkflowHistoryPanel
          workflowId={workflowId}
          refreshKey={refreshKey}
        />
      )}
    </div>
  );
}