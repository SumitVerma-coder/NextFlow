import { Crop, FileInput, MessageSquare, Sparkles } from "lucide-react";

type WorkflowToolbarProps = {
  onAddNode: (type: string) => void;
};

export function WorkflowToolbar({ onAddNode }: WorkflowToolbarProps) {
  return (
    <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1 rounded-2xl border border-neutral-200 bg-white/95 p-1.5 shadow-xl backdrop-blur">
      <button
        onClick={() => onAddNode("requestInputs")}
        className="cursor-pointer inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-neutral-700 transition hover:bg-neutral-100"
      >
        <FileInput className="h-4 w-4" />
        Inputs
      </button>

      <button
        onClick={() => onAddNode("cropImage")}
        className=" cursor-pointer inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-neutral-700 transition hover:bg-neutral-100"
      >
        <Crop className="h-4 w-4" />
        Crop
      </button>

      <button
        onClick={() => onAddNode("gemini")}
        className="cursor-pointer inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-neutral-700 transition hover:bg-neutral-100"
      >
        <Sparkles className="h-4 w-4" />
        Gemini
      </button>

      <button
        onClick={() => onAddNode("response")}
        className="cursor-pointer inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-neutral-700 transition hover:bg-neutral-100"
      >
        <MessageSquare className="h-4 w-4" />
        Response
      </button>
    </div>
  );
}