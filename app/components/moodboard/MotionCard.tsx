"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export const Motion: React.FC = () => {
  return (
    <div className="flex flex-col rounded-2xl border border-neutral-800 bg-neutral-950 p-5 transition hover:border-neutral-700">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-white">cool button</span>
        <Link
          href="/motion"
          className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
        >
          <span>view</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="rounded-xl overflow-hidden bg-neutral-900/60 border border-neutral-800/80 flex items-center justify-center min-h-[320px] p-8">
        <button className="group relative rounded-xl bg-black px-12 py-4 text-sm font-medium text-neutral-400 transition duration-300 hover:text-white shadow-[0px_1px_2px_0px_rgba(255,255,255,0.1)_inset,0px_-1px_2px_0px_rgba(255,255,255,0.1)_inset] border border-neutral-800 cursor-pointer">
          Subscribe

          <span className="pointer-events-none absolute bottom-0 left-1/2 h-2 w-1/2 -translate-x-1/2 rounded-full bg-cyan-500/40 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />

          <span className="pointer-events-none absolute bottom-px left-1/2 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
        </button>
      </div>
    </div>
  );
};
