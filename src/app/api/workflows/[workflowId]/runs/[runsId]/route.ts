import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    workflowId: string;
    runId: string;
  }>;
};

export async function GET(_req: Request, context: RouteContext) {
  const { userId } = await auth();
  const { workflowId, runId } = await context.params;

  if (!userId) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      { status: 401 }
    );
  }

  const run = await prisma.workflowRun.findFirst({
    where: {
      id: runId,
      workflowId,
      userId,
    },
    include: {
      nodeRuns: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!run) {
    return NextResponse.json(
      {
        error: "Run not found",
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    run,
  });
}