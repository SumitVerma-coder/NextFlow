import type { Edge, Node } from "@xyflow/react";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { executeNode } from "@/lib/node-executor";
import { getReadyNodes } from "@/lib/dag";

type ExecuteWorkflowArgs = {
  workflowId: string;
  userId: string;
  workflowRunId: string;
};

export async function executeWorkflow({
  workflowId,
  userId,
  workflowRunId,
}: ExecuteWorkflowArgs) {
  const workflow = await prisma.workflow.findFirst({
    where: {
      id: workflowId,
      userId,
    },
  });

  if (!workflow) {
    throw new Error("Workflow not found");
  }

  const nodes = workflow.nodes as unknown as Node[];
  const edges = workflow.edges as unknown as Edge[];

//   const workflowRun = await prisma.workflowRun.create({
//     data: {
//       workflowId,
//       userId,
//       status: "RUNNING",
//       scope: "FULL",
//     },
//   });

  await prisma.workflow.update({
    where: {
      id: workflowId,
    },
    data: {
      status: "RUNNING",
    },
  });

  const start = Date.now();

  const outputs: Record<string, unknown> = {};
  const completedNodeIds = new Set<string>();
  const startedNodeIds = new Set<string>();
  const failedNodeIds = new Set<string>();

  try {
    while (completedNodeIds.size + failedNodeIds.size < nodes.length) {
      const readyNodes = getReadyNodes(nodes, edges, completedNodeIds, startedNodeIds);

      if (readyNodes.length === 0) {
        throw new Error("No executable nodes found. The workflow may contain invalid dependencies.");
      }

      for (const node of readyNodes) {
        startedNodeIds.add(node.id);
      }

      const results = await Promise.all(
        readyNodes.map((node) =>
          executeNode({
            workflowRunId: workflowRunId,
            userId,
            node,
            nodes,
            edges,
            outputs,
          })
        )
      );

      for (const result of results) {
        if (result.status === "SUCCESS") {
          outputs[result.nodeId] = result.output;
          completedNodeIds.add(result.nodeId);
        } else {
          failedNodeIds.add(result.nodeId);
        }
      }

      if (failedNodeIds.size > 0) {
        break;
      }
    }

    const responseNode = nodes.find((node) => node.type === "response");

    let finalResult: unknown = outputs;

    if (responseNode) {
    const responseData = responseNode.data as {
        config?: {
        sourceNodeId?: string;
        };
    };

    const sourceNodeId = responseData.config?.sourceNodeId;

    if (sourceNodeId && outputs[sourceNodeId]) {
        finalResult = outputs[sourceNodeId];
    } else {
        finalResult = outputs[responseNode.id] ?? outputs;
    }
    }

    const durationMs = Date.now() - start;

    const finalStatus = failedNodeIds.size > 0 ? "PARTIAL" : "SUCCESS";

    await prisma.workflowRun.update({
      where: {
        id: workflowRunId,
      },
      data: {
        status: finalStatus,
        durationMs,
        result: {
          finalResult,
          outputs,
          completedNodeIds: Array.from(completedNodeIds),
          failedNodeIds: Array.from(failedNodeIds),
        } as Prisma.InputJsonValue,
      },
    });

    await prisma.workflow.update({
      where: {
        id: workflowId,
      },
      data: {
        status: failedNodeIds.size > 0 ? "PARTIAL" : "COMPLETED",
      },
    });

    return {
      workflowRunId: workflowRunId,
      status: finalStatus,
      result: finalResult,
    };
  } catch (error) {
    const durationMs = Date.now() - start;
    const message = error instanceof Error ? error.message : "Workflow execution failed";

    await prisma.workflowRun.update({
      where: {
        id: workflowRunId,
      },
      data: {
        status: "FAILED",
        durationMs,
        result: {
          error: message,
          outputs,
        } as Prisma.InputJsonValue,
      },
    });

    await prisma.workflow.update({
      where: {
        id: workflowId,
      },
      data: {
        status: "FAILED",
      },
    });

    throw error;
  }
}