import type { Edge, Node } from "@xyflow/react";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { sleep } from "@/lib/sleep";
import { generateGeminiText } from "@/lib/gemini";
import { interpolatePrompt } from "@/lib/interpolate";
import { getUpstreamNodeIds } from "@/lib/dag";

type ExecuteNodeArgs = {
    workflowRunId: string;
    userId: string;
    node: Node;
    nodes: Node[];
    edges: Edge[];
    outputs: Record<string, unknown>;
};

function getNodeData(node: Node) {
    return node.data as {
        label?: string;
        description?: string;
        config?: Record<string, unknown>;
    };
}

export async function executeNode({
    workflowRunId,
    node,
    edges,
    outputs,
}: ExecuteNodeArgs) {
    const start = Date.now();
    const nodeData = getNodeData(node);
    const config = nodeData.config ?? {};

    const upstreamNodeIds = getUpstreamNodeIds(node.id, edges);

    const upstreamOutputs: Record<string, unknown> = {};

    for (const upstreamNodeId of upstreamNodeIds) {
        upstreamOutputs[upstreamNodeId] = outputs[upstreamNodeId];
    }

    const nodeRun = await prisma.nodeRun.create({
        data: {
            workflowRunId,
            nodeId: node.id,
            nodeType: node.type ?? "unknown",
            status: "RUNNING",
            input: {
                config,
                upstreamOutputs,
            } as Prisma.InputJsonValue,
        },
    });

    try {
        let output: unknown = null;

        if (node.type === "requestInputs") {
            output = {
                text_field: config.textFieldValue ?? "",
                image_field: config.imageUrl ?? "",
            };
        }

        if (node.type === "cropImage") {
            await sleep(30_000);

            output = {
                imageUrl: String(upstreamOutputs[upstreamNodeIds[0]] ?? ""),
                crop: {
                    x: Number(config.x ?? 0),
                    y: Number(config.y ?? 0),
                    width: Number(config.width ?? 100),
                    height: Number(config.height ?? 100),
                },
                message: "Crop completed after 30 seconds.",
            };
        }

        if (node.type === "gemini") {
            const rawPrompt = String(config.prompt ?? "");
            const systemPrompt = String(config.systemPrompt ?? "You are a helpful assistant.");
            const model = String(config.model ?? "gemini-2.5-flash");

            const prompt = interpolatePrompt(rawPrompt, {
                ...outputs,
                ...upstreamOutputs,
            });

            const text = await generateGeminiText({
                model,
                systemPrompt,
                prompt,
            });

            output = text;
        }

        if (node.type === "response") {
            const sourceNodeId = String(config.sourceNodeId ?? "");

            if (sourceNodeId && outputs[sourceNodeId]) {
                output = outputs[sourceNodeId];
            } else {
                const lastUpstreamNodeId = upstreamNodeIds.at(-1);
                output = lastUpstreamNodeId ? outputs[lastUpstreamNodeId] : null;
            }
        }

        const durationMs = Date.now() - start;

        await prisma.nodeRun.update({
            where: {
                id: nodeRun.id,
            },
            data: {
                status: "SUCCESS",
                output: output as Prisma.InputJsonValue,
                durationMs,
            },
        });

        return {
            nodeId: node.id,
            output,
            durationMs,
            status: "SUCCESS" as const,
        };
    } catch (error) {
        const durationMs = Date.now() - start;
        const message = error instanceof Error ? error.message : "Unknown node error";

        await prisma.nodeRun.update({
            where: {
                id: nodeRun.id,
            },
            data: {
                status: "FAILED",
                error: message,
                durationMs,
            },
        });

        return {
            nodeId: node.id,
            output: null,
            durationMs,
            status: "FAILED" as const,
            error: message,
        };
    }
}