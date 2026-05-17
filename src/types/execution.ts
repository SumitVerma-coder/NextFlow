import type { Edge, Node } from "@xyflow/react";

export type NodeExecutionStatus =
  | "pending"
  | "running"
  | "success"
  | "failed"
  | "skipped";

export type NodeExecutionInput = {
  workflowId: string;
  workflowRunId: string;
  node: Node;
  nodes: Node[];
  edges: Edge[];
  upstreamOutputs: Record<string, unknown>;
};

export type NodeExecutionOutput = {
  nodeId: string;
  nodeType: string;
  status: "success" | "failed";
  output?: unknown;
  error?: string;
  durationMs: number;
};

export type WorkflowExecutionPayload = {
  workflowId: string;
  userId: string;
  workflowRunId: string;
};