import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Crop } from "lucide-react";

export function CropImageNode({ data, selected }: NodeProps) {
  const nodeData = data as {
    label?: string;
    description?: string;
    config?: {
      x?: number;
      y?: number;
      width?: number;
      height?: number;
    };
  };

  const config = nodeData.config ?? {};

  return (
    <div
      className={`w-56 rounded-2xl border bg-white p-4 shadow-sm transition ${
        selected
          ? "border-neutral-900 ring-4 ring-neutral-900/10"
          : "border-neutral-200"
      }`}
    >
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-neutral-100">
          <Crop className="h-4 w-4 text-neutral-700" />
        </div>

        <div>
          <h3 className="text-sm font-semibold text-neutral-900">
            {nodeData.label ?? "Crop Image"}
          </h3>
          <p className="text-xs text-neutral-500">
            {nodeData.description ?? "FFmpeg crop task"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2">
          x: {config.x ?? 0}
        </div>
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2">
          y: {config.y ?? 0}
        </div>
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2">
          w: {config.width ?? 100}
        </div>
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2">
          h: {config.height ?? 100}
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