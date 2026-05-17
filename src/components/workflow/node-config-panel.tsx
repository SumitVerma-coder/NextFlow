"use client";

import type { Node } from "@xyflow/react";
import { X } from "lucide-react";

type NodeConfigPanelProps = {
  selectedNode: Node | null;
  onClose: () => void;
  onUpdateNode: (nodeId: string, data: Record<string, unknown>) => void;
  onDeleteNode: (nodeId: string) => void;
};

export function NodeConfigPanel({
  selectedNode,
  onClose,
  onUpdateNode,
  onDeleteNode,
}: NodeConfigPanelProps) {
  if (!selectedNode) {
    return null;
  }

  const data = selectedNode.data as {
    label?: string;
    description?: string;
    config?: Record<string, unknown>;
  };

  const config = data.config ?? {};

  function updateLabel(value: string) {
    onUpdateNode(selectedNode!.id, {
      ...data,
      label: value,
      config,
    });
  }

  function updateDescription(value: string) {
    onUpdateNode(selectedNode!.id, {
      ...data,
      description: value,
      config,
    });
  }

  function updateConfig(key: string, value: string | number) {
    onUpdateNode(selectedNode!.id, {
      ...data,
      config: {
        ...config,
        [key]: value,
      },
    });
  }

  return (
    <aside className="absolute right-4 top-4 z-30 w-80 rounded-3xl border border-neutral-200 bg-white p-4 shadow-xl">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-neutral-900">
            Configure Node
          </h2>
          <p className="mt-1 text-xs text-neutral-500">
            {selectedNode.type}
          </p>
        </div>

        <button
          onClick={onClose}
          className="rounded-lg p-1 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-4">
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-neutral-600">
            Label
          </span>
          <input
            value={data.label ?? ""}
            onChange={(e) => updateLabel(e.target.value)}
            className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-neutral-400"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-medium text-neutral-600">
            Description
          </span>
          <input
            value={data.description ?? ""}
            onChange={(e) => updateDescription(e.target.value)}
            className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-neutral-400"
          />
        </label>

        {selectedNode.type === "requestInputs" && (
          <>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-neutral-600">
                Text Field Label
              </span>
              <input
                value={String(config.textFieldLabel ?? "")}
                onChange={(e) => updateConfig("textFieldLabel", e.target.value)}
                className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-neutral-400"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-medium text-neutral-600">
                Text Field Value
              </span>
              <textarea
                value={String(config.textFieldValue ?? "")}
                onChange={(e) => updateConfig("textFieldValue", e.target.value)}
                rows={4}
                className="w-full resize-none rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-neutral-400"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-medium text-neutral-600">
                Image URL
              </span>
              <input
                value={String(config.imageUrl ?? "")}
                onChange={(e) => updateConfig("imageUrl", e.target.value)}
                placeholder="https://..."
                className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-neutral-400"
              />
            </label>
          </>
        )}

        {selectedNode.type === "cropImage" && (
          <div className="grid grid-cols-2 gap-3">
            {["x", "y", "width", "height"].map((key) => (
              <label key={key} className="block">
                <span className="mb-1 block text-xs font-medium capitalize text-neutral-600">
                  {key}
                </span>
                <input
                  type="number"
                  value={Number(config[key] ?? 0)}
                  onChange={(e) => updateConfig(key, Number(e.target.value))}
                  className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-neutral-400"
                />
              </label>
            ))}
          </div>
        )}

        {selectedNode.type === "gemini" && (
          <>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-neutral-600">
                Model
              </span>
              <input
                value={String(config.model ?? "gemini-2.5-flash")}
                onChange={(e) => updateConfig("model", e.target.value)}
                className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-neutral-400"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-medium text-neutral-600">
                System Prompt
              </span>
              <textarea
                value={String(config.systemPrompt ?? "")}
                onChange={(e) => updateConfig("systemPrompt", e.target.value)}
                rows={4}
                className="w-full resize-none rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-neutral-400"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-medium text-neutral-600">
                Prompt
              </span>
              <textarea
                value={String(config.prompt ?? "")}
                onChange={(e) => updateConfig("prompt", e.target.value)}
                rows={4}
                className="w-full resize-none rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-neutral-400"
              />
            </label>
          </>
        )}

        {selectedNode.type === "response" && (
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-neutral-600">
              Source Node ID
            </span>
            <input
              value={String(config.sourceNodeId ?? "")}
              onChange={(e) => updateConfig("sourceNodeId", e.target.value)}
              className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-neutral-400"
            />
          </label>
        )}

        <button
          onClick={() => onDeleteNode(selectedNode.id)}
          className="w-full rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
        >
          Delete Node
        </button>
      </div>
    </aside>
  );
}