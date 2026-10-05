"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const ITEMS = [
  { title: "Aerospace & Automotive Concept", img: "/site_image/concept-hypercar.jpg" },
  { title: "Natural Environment Lighting", img: "/site_image/defender-western.jpg" },
  { title: "Spatial Architecture", img: "/site_image/villa-interior.jpg" },
  { title: "Cinematic Portraiture", img: "/site_image/cinematic-portrait.jpg" },
];

export const Hooks: React.FC = () => {
  const [active, setActive] = useState<number>(0);

  return (
    <div className="flex flex-col rounded-2xl border border-neutral-800 bg-neutral-950 p-5 transition hover:border-neutral-700">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-white">feature section</span>
        <Link
          href="/hooks"
          className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
        >
          <span>view</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="rounded-xl overflow-hidden bg-neutral-900/50 border border-neutral-800/80 p-4 min-h-[320px] flex flex-col justify-between">
        <div className="relative aspect-16/9 w-full rounded-lg overflow-hidden bg-black">
          <Image
            src={ITEMS[active].img}
            alt={ITEMS[active].title}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover"
          />
        </div>

        <div className="flex items-center justify-between mt-4 pt-2">
          <span className="text-xs text-neutral-300 font-medium">
            {ITEMS[active].title}
          </span>
          <div className="flex items-center gap-1">
            {ITEMS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`h-1.5 rounded-full transition-all ${
                  active === i ? "w-5 bg-white" : "w-1.5 bg-neutral-700 hover:bg-neutral-500"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
