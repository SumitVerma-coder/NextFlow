import { Handle, Position, type NodeProps } from "@xyflow/react";
import { FileInput } from "lucide-react";

export function RequestInputsNode({ data, selected }: NodeProps) {
  const nodeData = data as {
    label?: string;
    description?: string;
    config?: {
      textFieldLabel?: string;
      textFieldValue?: string;
      imageFieldLabel?: string;
      imageUrl?: string;
    };
  };

  const config = nodeData.config ?? {};

  return (
    <div
      className={`w-56 rounded-2xl border bg-white p-3 shadow-sm transition ${
        selected
          ? "border-neutral-900 ring-4 ring-neutral-900/10"
          : "border-neutral-200"
      }`}
    >
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-neutral-100">
          <FileInput className="h-4 w-4 text-neutral-700" />
        </div>

        <div>
          <h3 className="text-sm font-semibold text-neutral-900">
            {nodeData.label ?? "Request Inputs"}
          </h3>
          <p className="text-xs text-neutral-500">
            {nodeData.description ?? "Text + image input"}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2">
          <div className="text-[11px] font-medium text-neutral-500">
            text_field
          </div>
          <div className="mt-1 line-clamp-2 text-xs text-neutral-700">
            {config.textFieldValue || config.textFieldLabel || "Input Text"}
          </div>
        </div>

        <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2">
          <div className="text-[11px] font-medium text-neutral-500">
            image_field
          </div>
          <div className="mt-1 truncate text-xs text-neutral-700">
            {config.imageUrl ? "Image URL added" : config.imageFieldLabel || "Input Image"}
          </div>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!h-3 !w-3 !border-2 !border-white !bg-neutral-900"
      />
    </div>
  );
}