import React from "react";
import Link from "next/link";
import { Func } from "@/app/components/moodboard/FuncCard";
import { Grid } from "@/app/components/moodboard/GridCard";
import { Grok } from "@/app/components/moodboard/GrokCard";
import { Hooks } from "@/app/components/moodboard/HooksCard";
import { Magicboard } from "@/app/components/moodboard/MagicboardCard";
import { Motion } from "@/app/components/moodboard/MotionCard";
import { Playground } from "@/app/components/moodboard/PlaygroundCard";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#09090b] text-neutral-100 font-sans antialiased">
      <div className="max-w-6xl mx-auto px-6 py-12 sm:py-16">
        
        {/* Simple minimal header */}
        <header className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-8 mb-8 border-b border-neutral-900">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Moodboard
            </h1>
            <p className="text-xs text-neutral-400 mt-1">
              Frontend UI design experiments.
            </p>
          </div>

          <nav className="flex flex-wrap items-center gap-3 text-xs text-neutral-400 font-mono">
            <Link href="/func" className="hover:text-white transition-colors">func</Link>
            <span className="text-neutral-800">/</span>
            <Link href="/grid" className="hover:text-white transition-colors">grid</Link>
            <span className="text-neutral-800">/</span>
            <Link href="/grok" className="hover:text-white transition-colors">grok</Link>
            <span className="text-neutral-800">/</span>
            <Link href="/hooks" className="hover:text-white transition-colors">hooks</Link>
            <span className="text-neutral-800">/</span>
            <Link href="/magicboard" className="hover:text-white transition-colors">magicboard</Link>
            <span className="text-neutral-800">/</span>
            <Link href="/motion" className="hover:text-white transition-colors">motion</Link>
            <span className="text-neutral-800">/</span>
            <Link href="/playground" className="hover:text-white transition-colors">playground</Link>
          </nav>
        </header>

        {/* Clean minimal mood board grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <Magicboard />
          </div>
          <div>
            <Grok />
          </div>
          <div>
            <Motion />
          </div>
          <div>
            <Grid />
          </div>
          <div>
            <Playground />
          </div>
          <div>
            <Hooks />
          </div>
          <div>
            <Func />
          </div>
        </div>

      </div>
    </div>
  );
}
