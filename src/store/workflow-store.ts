import { create } from "zustand";
import type { Edge, Node } from "@xyflow/react";

type WorkflowState = {
  nodes: Node[];
  edges: Edge[];
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  resetWorkflow: () => void;
};

export const useWorkflowStore = create<WorkflowState>((set) => ({
  nodes: [],
  edges: [],

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  resetWorkflow: () =>
    set({
      nodes: [],
      edges: [],
    }),
}));