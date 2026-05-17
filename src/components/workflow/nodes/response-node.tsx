import { Handle, Position, type NodeProps } from "@xyflow/react";
import { MessageSquare } from "lucide-react";

export function ResponseNode({ data, selected }: NodeProps) {
  const nodeData = data as {
    label?: string;
    description?: string;
    config?: {
      sourceNodeId?: string;
    };
  };

  const config = nodeData.config ?? {};

  return (
    <div
      className={`w-56 rounded-3xl border bg-white p-4 shadow-sm transition ${
        selected
          ? "border-neutral-900 ring-4 ring-neutral-900/10"
          : "border-neutral-200"
      }`}
    >
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-neutral-100">
          <MessageSquare className="h-4 w-4 text-neutral-700" />
        </div>

        <div>
          <h3 className="text-sm font-semibold text-neutral-900">
            {nodeData.label ?? "Response"}
          </h3>
          <p className="text-xs text-neutral-500">
            {nodeData.description ?? "Final output"}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-700">
        Source: {config.sourceNodeId || "Not selected"}
      </div>

      <Handle
        type="target"
        position={Position.Left}
        className="!h-3 !w-3 !border-2 !border-white !bg-neutral-400"
      />
    </div>
  );
}