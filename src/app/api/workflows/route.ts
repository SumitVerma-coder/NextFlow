import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DEFAULT_WORKFLOW_NAME } from "@/lib/constants";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const workflows = await prisma.workflow.findMany({
    where: {
      userId,
    },
    orderBy: {
      updatedAt: "desc",
    },
    select: {
      id: true,
      name: true,
      status: true,
      updatedAt: true,
    },
  });

  return NextResponse.json({
    workflows,
  });
}

export async function POST() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const workflow = await prisma.workflow.create({
    data: {
      userId,
      name: DEFAULT_WORKFLOW_NAME,
      nodes: [],
      edges: [],
    },
  });

  return NextResponse.json(
    {
      workflow,
    },
    { status: 201 }
  );
}