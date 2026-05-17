import { task } from "@trigger.dev/sdk";
import { executeWorkflow } from "@/lib/workflow-executor";

export const runWorkflowTask = task({
  id: "run-workflow",
  run: async (payload: {
    workflowId: string;
    userId: string;
    workflowRunId: string;
  }) => {
    console.log("TRIGGER TASK STARTED:", payload);

    const result = await executeWorkflow({
      workflowId: payload.workflowId,
      userId: payload.userId,
      workflowRunId: payload.workflowRunId,
    });

    console.log("TRIGGER TASK COMPLETED:", result);

    return result;
  },
});