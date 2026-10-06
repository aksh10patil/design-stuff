"use client";

import React, { useState } from "react";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { Shuffle } from "lucide-react";

export const AnimatedCounterCard: React.FC = () => {
  const [val, setVal] = useState(14820);

  const randomize = () => {
    const next = Math.floor(Math.random() * 90000) + 1000;
    setVal(next);
  };

  return (
    <div className="flex flex-col rounded-2xl border border-neutral-800 bg-neutral-950 p-5 transition hover:border-neutral-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-white">odometer counter</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-neutral-900 text-neutral-400 border border-neutral-800">
            digit roll
          </span>
        </div>
        <button
          onClick={randomize}
          className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-mono text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800 transition"
        >
          <Shuffle className="w-3 h-3" />
          <span>Randomize</span>
        </button>
      </div>

      <div className="rounded-xl overflow-hidden bg-neutral-900/50 border border-neutral-800/80 p-6 min-h-[320px] flex flex-col items-center justify-center relative gap-6">
        <div className="p-6 sm:p-7 rounded-2xl bg-neutral-950/90 border border-neutral-800/90 flex flex-col items-center gap-4 shadow-2xl min-w-[280px]">
          <div className="flex items-center justify-between w-full text-[10px] font-mono text-neutral-400 pb-2 border-b border-neutral-800/80">
            <span>INDEX // REVENUE_ARR</span>
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              LIVE
            </span>
          </div>

          <div className="px-5 py-3 rounded-xl bg-[#0b0b0f] border border-neutral-800/80 shadow-[inset_0_2px_6px_rgba(0,0,0,0.8)] text-3xl sm:text-4xl font-mono font-bold tracking-tight text-white flex items-center">
            <AnimatedCounter
              value={val}
              duration={0.65}
              prefix={<span className="text-neutral-500 mr-1.5 font-sans font-light">$</span>}
            />
          </div>

          <div className="flex items-center gap-1.5 pt-1">
            {[
              { label: "-500", delta: -500 },
              { label: "+250", delta: 250 },
              { label: "+1.2K", delta: 1200 },
              { label: "+5K", delta: 5000 },
            ].map(({ label, delta }) => (
              <button
                key={label}
                onClick={() => setVal((v) => Math.max(0, v + delta))}
                className="px-2.5 py-1 text-xs font-mono font-medium rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-800 transition active:scale-95"
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <span className="text-[11px] font-mono text-neutral-500 select-none pointer-events-none text-center">
          Independent digit rolls with inertia & masked edge fade
        </span>
      </div>
    </div>
  );
};
