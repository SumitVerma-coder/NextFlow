import type { Edge, Node } from "@xyflow/react";

export function createSampleWorkflow() {
  const nodes: Node[] = [
    {
      id: "request-inputs",
      type: "requestInputs",
      position: { x: 40, y: 260 },
      data: {
        label: "Request Inputs",
        description: "Text and image input",
        config: {
          textFieldLabel: "Product description",
          textFieldValue:
            "Wireless Bluetooth Headphones. Features: Noise cancellation, 30-hour battery, foldable design.",
          imageFieldLabel: "Product photo",
          imageUrl: "",
        },
      },
    },
    {
      id: "crop-image-1",
      type: "cropImage",
      position: { x: 380, y: 120 },
      data: {
        label: "Crop Image #1",
        description: "Tight product crop",
        config: {
          x: 20,
          y: 20,
          width: 60,
          height: 60,
        },
      },
    },
    {
      id: "crop-image-2",
      type: "cropImage",
      position: { x: 380, y: 400 },
      data: {
        label: "Crop Image #2",
        description: "Wide banner crop",
        config: {
          x: 0,
          y: 0,
          width: 100,
          height: 50,
        },
      },
    },
    {
      id: "gemini-1",
      type: "gemini",
      position: { x: 380, y: 260 },
      data: {
        label: "Gemini 2.5 Flash #1",
        description: "Marketing copywriter",
        config: {
          model: "gemini-2.5-flash",
          systemPrompt:
            "You are a marketing copywriter. Write a one-paragraph product description.",
          prompt: "{{Request Inputs.text_field}}",
        },
      },
    },
    {
      id: "gemini-2",
      type: "gemini",
      position: { x: 760, y: 260 },
      data: {
        label: "Gemini 2.5 Flash #2",
        description: "Condense previous output",
        config: {
          model: "gemini-2.5-flash",
          systemPrompt:
            "Condense the following product description into a tweet-length hook under 240 characters.",
          prompt: "{{gemini-1.Response}}",
        },
      },
    },
    {
      id: "final-gemini",
      type: "gemini",
      position: { x: 1120, y: 260 },
      data: {
        label: "Final Gemini",
        description: "Creative manager",
        config: {
          model: "gemini-2.5-flash",
          systemPrompt:
            "You are a social media manager. Combine the tweet hook and the two product crops into a final marketing post.",
          prompt:
            "{{gemini-2.Response}}\n\nCrop 1: {{crop-image-1.Image}}\n\nCrop 2: {{crop-image-2.Image}}",
        },
      },
    },
    {
      id: "response",
      type: "response",
      position: { x: 1500, y: 280 },
      data: {
        label: "Response",
        description: "Final response",
        config: {
          sourceNodeId: "final-gemini",
        },
      },
    },
  ];

  const edges: Edge[] = [
    {
      id: "request-to-crop-1",
      source: "request-inputs",
      target: "crop-image-1",
      animated: true,
    },
    {
      id: "request-to-crop-2",
      source: "request-inputs",
      target: "crop-image-2",
      animated: true,
    },
    {
      id: "request-to-gemini-1",
      source: "request-inputs",
      target: "gemini-1",
      animated: true,
    },
    {
      id: "gemini-1-to-gemini-2",
      source: "gemini-1",
      target: "gemini-2",
      animated: true,
    },
    {
      id: "crop-1-to-final",
      source: "crop-image-1",
      target: "final-gemini",
      animated: true,
    },
    {
      id: "crop-2-to-final",
      source: "crop-image-2",
      target: "final-gemini",
      animated: true,
    },
    {
      id: "gemini-2-to-final",
      source: "gemini-2",
      target: "final-gemini",
      animated: true,
    },
    {
      id: "final-to-response",
      source: "final-gemini",
      target: "response",
      animated: true,
    },
  ];

  return {
    name: "Sample Product Marketing Workflow",
    nodes,
    edges,
  };
}