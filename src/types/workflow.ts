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