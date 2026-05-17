import type { runWorkflowTask } from "@/trigger/run-workflow";
import { tasks } from "@trigger.dev/sdk";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    workflowId: string;
  }>;
};

export async function POST(_req: Request, context: RouteContext) {
  const { userId } = await auth();
  const { workflowId } = await context.params;

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const workflow = await prisma.workflow.findFirst({
    where: {
      id: workflowId,
      userId,
    },
  });

  if (!workflow) {
    return NextResponse.json(
      { error: "Workflow not found" },
      { status: 404 }
    );
  }

  const workflowRun = await prisma.workflowRun.create({
    data: {
      workflowId,
      userId,
      status: "RUNNING",
      scope: "FULL",
      result: {
        message: "Workflow execution queued.",
      },
    },
  });

  await prisma.workflow.update({
    where: {
      id: workflowId,
    },
    data: {
      status: "RUNNING",
    },
  });

  const handle = await tasks.trigger<typeof runWorkflowTask>("run-workflow", {
    workflowId,
    userId,
    workflowRunId: workflowRun.id,
  });

  return NextResponse.json({
    success: true,
    triggerRunId: handle.id,
    workflowRunId: workflowRun.id,
  });
}