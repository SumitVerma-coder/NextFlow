import type { Edge, Node } from "@xyflow/react";

export function getIncomingEdges(nodeId: string, edges: Edge[]) {
  return edges.filter((edge) => edge.target === nodeId);
}

export function getOutgoingEdges(nodeId: string, edges: Edge[]) {
  return edges.filter((edge) => edge.source === nodeId);
}

export function getUpstreamNodeIds(nodeId: string, edges: Edge[]) {
  return getIncomingEdges(nodeId, edges).map((edge) => edge.source);
}

export function getDownstreamNodeIds(nodeId: string, edges: Edge[]) {
  return getOutgoingEdges(nodeId, edges).map((edge) => edge.target);
}

export function getReadyNodes(
  nodes: Node[],
  edges: Edge[],
  completedNodeIds: Set<string>,
  startedNodeIds: Set<string>
) {
  return nodes.filter((node) => {
    if (completedNodeIds.has(node.id) || startedNodeIds.has(node.id)) {
      return false;
    }

    const upstreamNodeIds = getUpstreamNodeIds(node.id, edges);

    return upstreamNodeIds.every((id) => completedNodeIds.has(id));
  });
}

export function getNodeById(nodes: Node[], nodeId: string) {
  return nodes.find((node) => node.id === nodeId);
}