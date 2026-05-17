import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSampleWorkflow } from "@/lib/sample-workflow";

export async function POST() {
    const { userId } = await auth();

    if (!userId) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    const sample = createSampleWorkflow();

    const workflow = await prisma.workflow.create({
        data: {
            userId,
            name: sample.name,
            nodes: JSON.parse(JSON.stringify(sample.nodes)),
            edges: JSON.parse(JSON.stringify(sample.edges)),
            isSample: true,
        },
    });

    return NextResponse.json(
        {
            workflow,
        },
        { status: 201 }
    );
}