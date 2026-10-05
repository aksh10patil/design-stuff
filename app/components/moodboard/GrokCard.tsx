"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Grok as GrokBot } from "@/public/grok_components/grok";

export const Grok: React.FC = () => {
  return (
    <div className="flex flex-col rounded-2xl border border-neutral-800 bg-neutral-950 p-5 transition hover:border-neutral-700">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-white">grok bot ui</span>
        <Link
          href="/grok"
          className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
        >
          <span>view</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="relative w-full rounded-xl overflow-hidden bg-[#090909] border border-neutral-900 flex items-center justify-center min-h-[320px]">
        <GrokBot isCard={true} />
      </div>
    </div>
  );
};
