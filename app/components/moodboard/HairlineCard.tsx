"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Terrain } from "@lucasmarkes/hairline/react";

export const HairlineCard: React.FC = () => {
  return (
    <div className="flex flex-col rounded-2xl border border-neutral-800 bg-neutral-950 p-5 transition hover:border-neutral-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-white">hairline figures</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-neutral-900 text-neutral-400 border border-neutral-800">
            isometric
          </span>
        </div>
        <Link
          href="/hairline-effects"
          className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
        >
          <span>view</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="rounded-xl overflow-hidden bg-neutral-900/50 border border-neutral-800/80 p-4 min-h-[320px] flex items-center justify-center">
        <div className="w-full max-w-xs aspect-[5/4] flex items-center justify-center">
          <Terrain intensity={0.6} theme="dark" className="w-full h-full cursor-crosshair" />
        </div>
      </div>
    </div>
  );
};
