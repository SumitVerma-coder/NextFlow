import type { Node } from "@xyflow/react";
import { nanoid } from "nanoid";

export function createWorkflowNode(type: string, position?: { x: number; y: number }): Node {
  const id = `${type}-${nanoid(6)}`;

  if (type === "requestInputs") {
    return {
      id,
      type,
      position: position ?? { x: 80, y: 220 },
      data: {
        label: "Request Inputs",
        description: "Text and image input",
        config: {
          textFieldLabel: "Input Text",
          textFieldValue:
            "Enter the text or instructions for this workflow.",
          imageFieldLabel: "Input image",
          imageUrl: "",
        },
      },
    };
  }

  if (type === "cropImage") {
    return {
      id,
      type,
      position: position ?? { x: 420, y: 180 },
      data: {
        label: "Crop Image",
        description: "Crop image using FFmpeg",
        config: {
          x: 20,
          y: 20,
          width: 60,
          height: 60,
        },
      },
    };
  }

  if (type === "gemini") {
    return {
      id,
      type,
      position: position ?? { x: 760, y: 180 },
      data: {
        label: "Gemini 2.5 Flash",
        description: "Prompt and vision model",
        config: {
          model: "gemini-2.5-flash",
          systemPrompt: "You are a helpful AI assistant.",
          prompt: "Write a concise product description.",
        },
      },
    };
  }

  if (type === "response") {
    return {
      id,
      type,
      position: position ?? { x: 1120, y: 220 },
      data: {
        label: "Response",
        description: "Final workflow output",
        config: {
          sourceNodeId: "",
        },
      },
    };
  }

  return {
    id,
    type,
    position: position ?? { x: 300, y: 200 },
    data: {
      label: "Unknown Node",
      description: "",
      config: {},
    },
  };
}