import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import type { Edge, Node } from "@xyflow/react";
import { AppHeader } from "@/components/layout/app-header";
import { WorkflowEditor } from "@/components/workflow/workflow-editor";
import { prisma } from "@/lib/prisma";

type WorkflowPageProps = {
  params: Promise<{
    workflowId: string;
  }>;
};

export default async function WorkflowPage({ params }: WorkflowPageProps) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const { workflowId } = await params;

  const workflow = await prisma.workflow.findFirst({
    where: {
      id: workflowId,
      userId,
    },
  });

  if (!workflow) {
    notFound();
  }

  return (
    <div className="flex h-screen flex-col bg-[#f7f7f6] text-neutral-900">
      <AppHeader />

      <WorkflowEditor
        workflowId={workflow.id}
        name={workflow.name}
        status={workflow.status}
        updatedAt={workflow.updatedAt.toISOString()}
        nodes={workflow.nodes as unknown as Node[]}
        edges={workflow.edges as unknown as Edge[]}
      />
    </div>
  );
}