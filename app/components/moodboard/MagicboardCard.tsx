"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import MagicBoard from "@/app/magicboard/page";

export const Magicboard: React.FC = () => {
  return (
    <div className="flex flex-col rounded-2xl border border-neutral-800 bg-neutral-950 p-5 transition hover:border-neutral-700">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-white">magicboard built with tailwindcss</span>
        <Link
          href="/magicboard"
          className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
        >
          <span>view</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="rounded-xl overflow-hidden border border-neutral-900 shadow-lg">
        <MagicBoard isCard={true} />
      </div>
    </div>
  );
};
