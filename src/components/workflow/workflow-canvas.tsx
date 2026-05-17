"use client";

import "@xyflow/react/dist/style.css";

import {
  Background,
  Controls,
  ReactFlow,
  addEdge,
  useEdgesState,
  useNodesState,
  type Connection,
  type Edge,
  type Node,
} from "@xyflow/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { RequestInputsNode } from "@/components/workflow/nodes/request-inputs-node";
import { CropImageNode } from "@/components/workflow/nodes/crop-image-node";
import { GeminiNode } from "@/components/workflow/nodes/gemini-node";
import { ResponseNode } from "@/components/workflow/nodes/response-node";
import { WorkflowToolbar } from "@/components/workflow/workflow-toolbar";
import { NodeConfigPanel } from "@/components/workflow/node-config-panel";
import { createWorkflowNode } from "@/lib/workflow-node-factory";
import { canConnectEdge, validateWorkflow } from "@/lib/workflow-validation";

const nodeTypes = {
  requestInputs: RequestInputsNode,
  cropImage: CropImageNode,
  gemini: GeminiNode,
  response: ResponseNode,
};

type WorkflowCanvasProps = {
  workflowId: string;
  initialNodes: Node[];
  initialEdges: Edge[];
  onDirtyChange?: (dirty: boolean) => void;
};

export function WorkflowCanvas({
  workflowId,
  initialNodes,
  initialEdges,
  onDirtyChange,
}: WorkflowCanvasProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [saving, setSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [dirty, setDirty] = useState(false);

  function markDirty() {
    setDirty(true);
    onDirtyChange?.(true);
  }

  const onConnect = useCallback(
    (connection: Connection) => {
      if (!canConnectEdge(edges, connection.source, connection.target)) {
        return;
      }

      const nextEdges = addEdge(
        {
          ...connection,
          animated: true,
          style: {
            strokeWidth: 1.5,
          },
        },
        edges
      );

      const validation = validateWorkflow(nodes, nextEdges);

      if (!validation.valid && validation.errors.some((error) => error.includes("cycles"))) {
        setValidationErrors(validation.errors);
        return;
      }

      setEdges(nextEdges);
      setValidationErrors([]);
      markDirty();
    },
    [edges, nodes]
  );

  function addNode(type: string) {
    const node = createWorkflowNode(type, {
      x: 300 + Math.random() * 280,
      y: 120 + Math.random() * 280,
    });

    setNodes((currentNodes) => [...currentNodes, node]);
    markDirty();
  }

  function updateSelectedNodeFromNodes(nodeId: string, nextNodes: Node[]) {
    const nextSelectedNode = nextNodes.find((node) => node.id === nodeId) ?? null;
    setSelectedNode(nextSelectedNode);
  }

  function updateNodeData(nodeId: string, data: Record<string, unknown>) {
    setNodes((currentNodes) => {
      const nextNodes = currentNodes.map((node) => {
        if (node.id !== nodeId) {
          return node;
        }

        return {
          ...node,
          data,
        };
      });

      updateSelectedNodeFromNodes(nodeId, nextNodes);
      return nextNodes;
    });

    markDirty();
  }

  function deleteNode(nodeId: string) {
    setNodes((currentNodes) => currentNodes.filter((node) => node.id !== nodeId));
    setEdges((currentEdges) =>
      currentEdges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
    );
    setSelectedNode(null);
    markDirty();
  }

  async function saveWorkflow() {
    setSaving(true);

    const validation = validateWorkflow(nodes, edges);
    setValidationErrors(validation.errors);

    try {
      const res = await fetch(`/api/workflows/${workflowId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nodes,
          edges,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to save workflow");
      }

      setDirty(false);
      onDirtyChange?.(false);
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  }

  function exportWorkflowJson() {
    const data = {
      nodes,
      edges,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `workflow-${workflowId}.json`;
    link.click();

    URL.revokeObjectURL(url);
  }

  function importWorkflowJson(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      try {
        const result = String(reader.result);
        const parsed = JSON.parse(result);

        if (!Array.isArray(parsed.nodes) || !Array.isArray(parsed.edges)) {
          throw new Error("Invalid workflow JSON");
        }

        setNodes(parsed.nodes);
        setEdges(parsed.edges);
        setSelectedNode(null);
        setValidationErrors([]);
        markDirty();
      } catch (error) {
        console.error(error);
        setValidationErrors(["Invalid workflow JSON file."]);
      }
    };

    reader.readAsText(file);
  }

  useEffect(() => {
    const validation = validateWorkflow(nodes, edges);
    setValidationErrors(validation.errors);
  }, [nodes, edges]);
  
  useEffect(() => {
    function isTypingInsideInput(target: EventTarget | null) {
      if (!(target instanceof HTMLElement)) {
        return false;
      }

      const tagName = target.tagName.toLowerCase();

      return (
        tagName === "input" ||
        tagName === "textarea" ||
        tagName === "select" ||
        target.isContentEditable
      );
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (!selectedNode) {
        return;
      }

      if (isTypingInsideInput(event.target)) {
        return;
      }

      if (event.key === "Delete" || event.key === "Backspace") {
        event.preventDefault();
        deleteNode(selectedNode.id);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedNode]);

  useEffect(() => {
    if (!dirty) {
      return;
    }

    const timeout = setTimeout(() => {
      saveWorkflow();
    }, 1500);

    return () => clearTimeout(timeout);
  }, [nodes, edges, dirty]);
  
  return (
    <div className="relative h-full flex-1 overflow-hidden bg-[#f3f3f1] dark:bg-neutral-950">
      <div className="absolute left-4 top-4 z-20 flex items-center gap-2 rounded-2xl border border-neutral-200 bg-white/95 p-1.5 shadow-sm backdrop-blur">
        <button
          onClick={saveWorkflow}
          disabled={saving}
          className="rounded-xl bg-neutral-900 px-3 py-2 text-xs font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving..." : dirty ? "Save changes" : "Saved"}
        </button>

        <button
          onClick={exportWorkflowJson}
          className="cursor-pointer rounded-xl px-3 py-2 text-xs font-medium text-neutral-700 transition hover:bg-neutral-100"
        >
          Export JSON
        </button>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="cursor-pointer rounded-xl px-3 py-2 text-xs font-medium text-neutral-700 transition hover:bg-neutral-100"
        >
          Import JSON
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={importWorkflowJson}
        />
      </div>

      {validationErrors.length > 0 && (
        <div className="absolute left-4 top-20 z-20 max-w-sm rounded-2xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 shadow-sm">
          <p className="mb-1 font-semibold">Validation warnings</p>
          <ul className="list-inside list-disc space-y-1">
            {validationErrors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={(changes) => {
          onNodesChange(changes);
          markDirty();
        }}
        onEdgesChange={(changes) => {
          onEdgesChange(changes);
          markDirty();
        }}
        onConnect={onConnect}
        onNodeClick={(_, node) => setSelectedNode(node)}
        onPaneClick={() => setSelectedNode(null)}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Background gap={22} size={1} className="dark:opacity-30" color="#d7d7d3" />

        <Controls
          className="!rounded-2xl !border !border-neutral-200 !bg-white !shadow-sm"
          showInteractive={false}
        />
      </ReactFlow>

      <WorkflowToolbar onAddNode={addNode} />

      <NodeConfigPanel
        selectedNode={selectedNode}
        onClose={() => setSelectedNode(null)}
        onUpdateNode={updateNodeData}
        onDeleteNode={deleteNode}
      />
    </div>
  );
}