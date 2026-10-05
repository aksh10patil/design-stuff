"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import apple from "@/public/site_image/apple.png";
import grokBot from "@/public/site_image/grok-bot.png";
import key from "@/public/site_image/key.png";
import posthog from "@/public/site_image/posthog.png";
import shad from "@/public/site_image/shad.png";
import tesla from "@/public/site_image/tesla.png";

const SNAPS = [
  { img: apple, alt: "Apple" },
  { img: grokBot, alt: "Grok" },
  { img: posthog, alt: "PostHog" },
  { img: tesla, alt: "Tesla" },
  { img: shad, alt: "Shad" },
  { img: key, alt: "Key" },
];

export const Func: React.FC = () => {
  return (
    <div className="flex flex-col rounded-2xl border border-neutral-800 bg-neutral-950 p-5 transition hover:border-neutral-700">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-white">clean grid layout</span>
        <Link
          href="/func"
          className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
        >
          <span>view</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-2 rounded-xl bg-neutral-900/50 border border-neutral-800/80 p-3 min-h-[320px] items-center">
        {SNAPS.map((item, idx) => (
          <div key={idx} className="relative aspect-4/3 rounded-lg overflow-hidden border border-neutral-800 bg-black">
            <Image
              src={item.img}
              alt={item.alt}
              fill
              sizes="(max-width: 768px) 33vw, 150px"
              className="object-cover hover:scale-105 transition duration-300"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
