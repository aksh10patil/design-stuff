"use client";

import React, { useState } from "react";
import { FolderComponent } from "@/components/ui/folder-component";

export const FolderCard: React.FC = () => {
  const [color, setColor] = useState<"blue" | "black" | "white">("blue");

  return (
    <div className="flex flex-col rounded-2xl border border-neutral-800 bg-neutral-950 p-5 transition hover:border-neutral-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-white">3d animated folder</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-neutral-900 text-neutral-400 border border-neutral-800">
            3d motion
          </span>
        </div>
        <div className="flex items-center gap-1.5 bg-neutral-900/80 p-1 rounded-lg border border-neutral-800/80 text-[11px] font-mono">
          {(["blue", "black", "white"] as const).map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={`px-2 py-0.5 rounded transition capitalize ${
                color === c
                  ? "bg-neutral-800 text-white font-medium shadow-sm"
                  : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl overflow-hidden bg-neutral-900/50 border border-neutral-800/80 p-6 min-h-[320px] flex flex-col items-center justify-center relative">
        <FolderComponent color={color} size="md" />
        <span className="text-[11px] font-mono text-neutral-500 mt-6 select-none pointer-events-none">
          Hover to fan cards · Click to lift flap
        </span>
      </div>
    </div>
  );
};
