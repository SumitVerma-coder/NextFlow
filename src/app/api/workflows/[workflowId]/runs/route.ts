import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    workflowId: string;
  }>;
};

export async function GET(_req: Request, context: RouteContext) {
  const { userId } = await auth();
  const { workflowId } = await context.params;

  if (!userId) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
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
      {
        error: "Workflow not found",
      },
      { status: 404 }
    );
  }

  const runs = await prisma.workflowRun.findMany({
    where: {
      workflowId,
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      nodeRuns: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  return NextResponse.json({
    runs,
  });
}