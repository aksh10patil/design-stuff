"use client";

import React, { useState } from "react";
import { VoiceNote } from "@/components/ui/voice-note";

export const VoiceNoteCard: React.FC = () => {
  const [accent, setAccent] = useState<string>("#FC4C01");

  return (
    <div className="flex flex-col rounded-2xl border border-neutral-800 bg-neutral-950 p-5 transition hover:border-neutral-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-white">aurora voice note</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-neutral-900 text-neutral-400 border border-neutral-800">
            waveform
          </span>
        </div>
        <div className="flex items-center gap-1.5 bg-neutral-900/80 p-1 rounded-lg border border-neutral-800/80 text-[11px] font-mono">
          {[
            { label: "orange", color: "#FC4C01" },
            { label: "emerald", color: "#10B981" },
            { label: "blue", color: "#3B82F6" },
          ].map((item) => (
            <button
              key={item.color}
              onClick={() => setAccent(item.color)}
              className={`px-2 py-0.5 rounded transition flex items-center gap-1.5 ${
                accent === item.color
                  ? "bg-neutral-800 text-white font-medium"
                  : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="capitalize">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl overflow-hidden bg-neutral-900/50 border border-neutral-800/80 p-6 min-h-[320px] flex flex-col items-center justify-center gap-6">
        <div className="w-full max-w-sm flex flex-col gap-4">
          <VoiceNote
            duration={42}
            bars={38}
            seed={11}
            accent={accent}
            size="md"
            className="w-full justify-between"
          />
          <VoiceNote
            duration={86}
            bars={44}
            seed={42}
            accent={accent}
            size="sm"
            className="w-full justify-between opacity-80 hover:opacity-100 transition-opacity"
          />
        </div>
        <span className="text-[11px] font-mono text-neutral-500 select-none pointer-events-none">
          Click play for audio wave animation · Scrub waveform to seek
        </span>
      </div>
    </div>
  );
};
