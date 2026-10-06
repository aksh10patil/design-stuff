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
        <div className="p-8 rounded-2xl bg-neutral-950/80 border border-neutral-800/80 flex flex-col items-center gap-4 shadow-xl">
          <div className="text-4xl sm:text-5xl font-mono font-bold tracking-tight text-white flex items-center">
            <AnimatedCounter
              value={val}
              duration={0.65}
              prefix={<span className="text-neutral-500 mr-1">$</span>}
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            {[
              { label: "-250", delta: -250 },
              { label: "-50", delta: -50 },
              { label: "+100", delta: 100 },
              { label: "+500", delta: 500 },
            ].map(({ label, delta }) => (
              <button
                key={label}
                onClick={() => setVal((v) => Math.max(0, v + delta))}
                className="px-2.5 py-1 text-xs font-mono font-medium rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-800 transition"
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
