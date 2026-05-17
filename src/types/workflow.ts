import type { Edge, Node } from "@xyflow/react";

export type WorkflowNodeType =
  | "requestInputs"
  | "cropImage"
  | "gemini"
  | "response";

export type WorkflowStatus =
  | "DRAFT"
  | "RUNNING"
  | "COMPLETED"
  | "FAILED"
  | "PARTIAL";

export type WorkflowSummary = {
  id: string;
  name: string;
  status: WorkflowStatus;
  updatedAt: string;
};

export type RequestInputsConfig = {
  textFieldLabel: string;
  textFieldValue: string;
  imageFieldLabel: string;
  imageUrl: string;
};

export type CropImageConfig = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type GeminiConfig = {
  model: string;
  systemPrompt: string;
  prompt: string;
};

export type ResponseConfig = {
  sourceNodeId: string;
};

export type WorkflowNodeConfig =
  | RequestInputsConfig
  | CropImageConfig
  | GeminiConfig
  | ResponseConfig;

export type WorkflowNodeData = {
  label: string;
  description?: string;
  config: Record<string, unknown>;
};

export type WorkflowJson = {
  name: string;
  nodes: Node[];
  edges: Edge[];
};