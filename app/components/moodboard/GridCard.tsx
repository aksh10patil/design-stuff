"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ModelSelectorMock, CardSkeleton } from "@/public/components_v2/grid";

export const Grid: React.FC = () => {
  return (
    <div className="flex flex-col rounded-2xl border border-neutral-800 bg-neutral-950 p-5 transition hover:border-neutral-700">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-white">clean cards</span>
        <Link
          href="/grid"
          className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
        >
          <span>view</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="rounded-xl overflow-hidden bg-neutral-900/50 border border-neutral-800/80 p-4 min-h-[320px] flex items-center justify-center">
        <div className="w-full max-w-md ">
          <CardSkeleton>
            <ModelSelectorMock />
          </CardSkeleton>
        </div>
      </div>
    </div>
  );
};
