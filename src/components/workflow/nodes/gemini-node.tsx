import { Handle, Position } from "@xyflow/react";
import { Sparkles } from "lucide-react";

export function GeminiNode() {
  return (
    <div className="w-72 rounded-3xl border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-neutral-100">
          <Sparkles className="h-4 w-4 text-neutral-700" />
        </div>

        <div>
          <h3 className="text-sm font-semibold text-neutral-900">
            Gemini 3.1 Pro
          </h3>
          <p className="text-xs text-neutral-500">Prompt + vision model</p>
        </div>
      </div>

      <div className="space-y-2 text-xs">
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2">
          System prompt
        </div>
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2">
          User prompt
        </div>
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2">
          Image input optional
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