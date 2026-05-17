import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    workflowId: string;
  }>;
};

export async function GET(_req: NextRequest, context: RouteContext) {
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

  return NextResponse.json({ workflow });
}

export async function PATCH(req: NextRequest, context: RouteContext) {
  const { userId } = await auth();
  const { workflowId } = await context.params;

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await req.json();

  const existingWorkflow = await prisma.workflow.findFirst({
    where: {
      id: workflowId,
      userId,
    },
  });

  if (!existingWorkflow) {
    return NextResponse.json(
      { error: "Workflow not found" },
      { status: 404 }
    );
  }

  const workflow = await prisma.workflow.update({
    where: {
      id: workflowId,
    },
    data: {
      name: body.name ?? existingWorkflow.name,
      nodes: body.nodes ?? existingWorkflow.nodes,
      edges: body.edges ?? existingWorkflow.edges,
      status: body.status ?? existingWorkflow.status,
    },
  });

  return NextResponse.json({ workflow });
}

export async function DELETE(_req: NextRequest, context: RouteContext) {
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

  await prisma.workflow.delete({
    where: {
      id: workflowId,
    },
  });

  return NextResponse.json({
    success: true,
  });
}