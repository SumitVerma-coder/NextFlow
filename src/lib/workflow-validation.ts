import type { Edge, Node } from "@xyflow/react";

export type ValidationResult = {
  valid: boolean;
  errors: string[];
};

export function hasCycle(nodes: Node[], edges: Edge[]) {
  const graph = new Map<string, string[]>();
  const visited = new Set<string>();
  const recursionStack = new Set<string>();

  for (const node of nodes) {
    graph.set(node.id, []);
  }

  for (const edge of edges) {
    graph.get(edge.source)?.push(edge.target);
  }

  function dfs(nodeId: string): boolean {
    if (recursionStack.has(nodeId)) {
      return true;
    }

    if (visited.has(nodeId)) {
      return false;
    }

    visited.add(nodeId);
    recursionStack.add(nodeId);

    const neighbors = graph.get(nodeId) ?? [];

    for (const neighbor of neighbors) {
      if (dfs(neighbor)) {
        return true;
      }
    }

    recursionStack.delete(nodeId);
    return false;
  }

  for (const node of nodes) {
    if (dfs(node.id)) {
      return true;
    }
  }

  return false;
}

export function validateWorkflow(nodes: Node[], edges: Edge[]): ValidationResult {
  const errors: string[] = [];

  if (nodes.length === 0) {
    errors.push("Workflow must contain at least one node.");
  }

  const requestInputNodes = nodes.filter((node) => node.type === "requestInputs");
  const responseNodes = nodes.filter((node) => node.type === "response");

  if (requestInputNodes.length === 0) {
    errors.push("Workflow must contain a Request Inputs node.");
  }

  if (responseNodes.length === 0) {
    errors.push("Workflow must contain a Response node.");
  }

  for (const edge of edges) {
    if (edge.source === edge.target) {
      errors.push("A node cannot connect to itself.");
    }
  }

  if (hasCycle(nodes, edges)) {
    errors.push("Workflow cannot contain cycles.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function canConnectEdge(edges: Edge[], source?: string | null, target?: string | null) {
  if (!source || !target) {
    return false;
  }

  if (source === target) {
    return false;
  }

  const duplicate = edges.some(
    (edge) => edge.source === source && edge.target === target
  );

  if (duplicate) {
    return false;
  }

  return true;
}