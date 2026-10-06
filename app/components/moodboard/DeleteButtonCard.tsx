"use client";

import React, { useState } from "react";
import { DeleteButton } from "@/components/ui/delete-button";

export const DeleteButtonCard: React.FC = () => {
  const [history, setHistory] = useState<string>("Ready");

  return (
    <div className="flex flex-col rounded-2xl border border-neutral-800 bg-neutral-950 p-5 transition hover:border-neutral-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-white">hinged delete button</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-neutral-900 text-neutral-400 border border-neutral-800">
            micro-interaction
          </span>
        </div>
        <span className="text-[11px] font-mono text-neutral-400">
          Status: <span className="text-neutral-200">{history}</span>
        </span>
      </div>

      <div className="rounded-xl overflow-hidden bg-neutral-900/50 border border-neutral-800/80 p-6 min-h-[320px] flex flex-col items-center justify-center gap-6">
        <div className="p-8 rounded-2xl bg-neutral-950/80 border border-neutral-800/80 flex flex-col items-center gap-5 shadow-xl">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900/90 border border-neutral-800 text-[11px] font-mono text-neutral-400">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500/80" />
            <span>cache_snapshot_v1.tar</span>
          </div>
          <DeleteButton
            onConfirm={() => setHistory("Confirmed (Deleted)")}
            onCancel={() => setHistory("Cancelled (Kept)")}
          />
        </div>

        <span className="text-[11px] font-mono text-neutral-500 select-none pointer-events-none text-center">
          Tap trash icon to open spring lid · Confirm or cancel in place
        </span>
      </div>
    </div>
  );
};
