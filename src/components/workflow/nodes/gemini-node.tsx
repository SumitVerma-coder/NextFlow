import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Sparkles } from "lucide-react";

export function GeminiNode({ data, selected }: NodeProps) {
  const nodeData = data as {
    label?: string;
    description?: string;
    config?: {
      model?: string;
      systemPrompt?: string;
      prompt?: string;
    };
  };

  const config = nodeData.config ?? {};

  return (
    <div
      className={`w-60 rounded-2xl border bg-white p-4 shadow-sm transition ${
        selected
          ? "border-neutral-900 ring-4 ring-neutral-900/10"
          : "border-neutral-200"
      }`}
    >
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-neutral-100">
          <Sparkles className="h-4 w-4 text-neutral-700" />
        </div>

        <div>
          <h3 className="text-sm font-semibold text-neutral-900">
            {nodeData.label ?? "Gemini 3.1 Pro"}
          </h3>
          <p className="text-xs text-neutral-500">
            {nodeData.description ?? "Prompt + vision model"}
          </p>
        </div>
      </div>

      <div className="space-y-2 text-xs">
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2">
          {config.model ?? "gemini-2.5-flash"}
        </div>

        <div className="line-clamp-2 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2">
          {config.systemPrompt || "System prompt"}
        </div>

        <div className="line-clamp-2 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2">
          {config.prompt || "User prompt"}
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Left}
        className="!h-3 !w-3 !border-2 !border-white !bg-neutral-400"
      />

      <Handle
        type="source"
        position={Position.Right}
        className="!h-3 !w-3 !border-2 !border-white !bg-neutral-900"
      />
    </div>
  );
}