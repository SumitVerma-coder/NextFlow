import { Handle, Position } from "@xyflow/react";
import { FileInput } from "lucide-react";

export function RequestInputsNode() {
  return (
    <div className="w-64 rounded-3xl border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-neutral-100">
          <FileInput className="h-4 w-4 text-neutral-700" />
        </div>

        <div>
          <h3 className="text-sm font-semibold text-neutral-900">
            Request Inputs
          </h3>
          <p className="text-xs text-neutral-500">Text + image input</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2">
          <div className="text-[11px] font-medium text-neutral-500">
            text_field
          </div>
          <div className="mt-1 text-xs text-neutral-700">
            Product description
          </div>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2">
          <div className="text-[11px] font-medium text-neutral-500">
            image_field
          </div>
          <div className="mt-1 text-xs text-neutral-700">
            Product photo
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