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
import { nanoid } from "nanoid";
import { RequestInputsNode } from "@/components/workflow/nodes/request-inputs-node";
import { CropImageNode } from "@/components/workflow/nodes/crop-image-node";
import { GeminiNode } from "@/components/workflow/nodes/gemini-node";
import { ResponseNode } from "@/components/workflow/nodes/response-node";
import { WorkflowToolbar } from "@/components/workflow/workflow-toolbar";

const nodeTypes = {
  requestInputs: RequestInputsNode,
  cropImage: CropImageNode,
  gemini: GeminiNode,
  response: ResponseNode,
};

const initialNodes: Node[] = [
  {
    id: "request-inputs-1",
    type: "requestInputs",
    position: { x: 80, y: 220 },
    data: {},
  },
];

export function WorkflowCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  function onConnect(connection: Connection) {
    setEdges((currentEdges) =>
      addEdge(
        {
          ...connection,
          animated: true,
          style: {
            strokeWidth: 1.5,
          },
        },
        currentEdges
      )
    );
  }

  function addNode(type: string) {
    const node: Node = {
      id: `${type}-${nanoid(6)}`,
      type,
      position: {
        x: 300 + Math.random() * 280,
        y: 120 + Math.random() * 280,
      },
      data: {},
    };

    setNodes((currentNodes) => [...currentNodes, node]);
  }

  return (
    <div className="relative h-full flex-1 overflow-hidden bg-[#f3f3f1]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Background gap={22} size={1} color="#d7d7d3" />

        <Controls
          className="!rounded-2xl !border !border-neutral-200 !bg-white !shadow-sm"
          showInteractive={false}
        />
      </ReactFlow>

      <WorkflowToolbar onAddNode={addNode} />
    </div>
  );
}