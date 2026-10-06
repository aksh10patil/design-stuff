"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Terrain,
  Riffle,
  Exploded,
  Phosphor,
  Turntable,
  Keyboard,
  Laptop,
  Vault,
  Terminal,
  Padlock,
  Branches,
  Router,
} from "@lucasmarkes/hairline/react";
import { ArrowLeft, Sparkles, Sliders, SunMoon, Code2, Feather } from "lucide-react";
import { PenFigure } from "./PenFigure";

type FigureKey =
  | "pen"
  | "terrain"
  | "riffle"
  | "exploded"
  | "phosphor"
  | "turntable"
  | "keyboard"
  | "laptop"
  | "vault"
  | "terminal"
  | "padlock"
  | "branches"
  | "router";

interface FigureMeta {
  key: FigureKey;
  name: string;
  description: string;
  isCustom?: boolean;
  component: React.ComponentType<{
    intensity?: number;
    theme?: "auto" | "light" | "dark";
    onRead?: (text: string) => void;
    className?: string;
  }>;
}

const FIGURES: FigureMeta[] = [
  {
    key: "pen",
    name: "Pen",
    description: "A fountain pen on a desk rest: the pointer draws its cap open along its axis on a spring, revealing the polished grip and 14k nib.",
    isCustom: true,
    component: PenFigure,
  },
  {
    key: "terrain",
    name: "Terrain",
    description: "81 pillars on a plinth that rise dynamically around pointer movement.",
    component: Terrain,
  },
  {
    key: "riffle",
    name: "Riffle",
    description: "A tray of cards that stand up and cascade as you sweep across them.",
    component: Riffle,
  },
  {
    key: "exploded",
    name: "Exploded",
    description: "An app window separated into 4 floating layers answering pointer depth.",
    component: Exploded,
  },
  {
    key: "phosphor",
    name: "Phosphor",
    description: "A dot matrix screen with lingering glowing trails in isometric space.",
    component: Phosphor,
  },
  {
    key: "turntable",
    name: "Turntable",
    description: "Blocks on a turntable that spin with cursor momentum and settle on 90° intervals.",
    component: Turntable,
  },
  {
    key: "keyboard",
    name: "Keyboard",
    description: "A mechanical 60% key matrix with wave depression physics.",
    component: Keyboard,
  },
  {
    key: "laptop",
    name: "Laptop",
    description: "A sleek notebook whose lid follows pointer elevation on a spring.",
    component: Laptop,
  },
  {
    key: "vault",
    name: "Vault",
    description: "A secure vault dial that turns with pointer circular motions.",
    component: Vault,
  },
  {
    key: "terminal",
    name: "Terminal",
    description: "An isometric terminal session where lines lift and reveal output.",
    component: Terminal,
  },
  {
    key: "padlock",
    name: "Padlock",
    description: "A heavy brass lock whose shackle springs upward and swings open.",
    component: Padlock,
  },
  {
    key: "branches",
    name: "Branches",
    description: "A Git commit tree where historical nodes elevate based on cursor hover.",
    component: Branches,
  },
  {
    key: "router",
    name: "Router",
    description: "Multi-antenna network device with omnidirectional directional bending.",
    component: Router,
  },
];

export default function HairlineEffectsPage() {
  const [activeKey, setActiveKey] = useState<FigureKey>("pen");
  const [intensity, setIntensity] = useState<number>(0.6);
  const [theme, setTheme] = useState<"auto" | "light" | "dark">("dark");
  const [readout, setReadout] = useState<string>("");

  const activeFigure = FIGURES.find((f) => f.key === activeKey) ?? FIGURES[0];
  const ActiveComponent = activeFigure.component;

  return (
    <div className="min-h-screen bg-[#09090b] text-neutral-100 font-sans antialiased selection:bg-neutral-800 selection:text-white">
      <div className="max-w-6xl mx-auto px-6 py-12 sm:py-16">
        {/* Navigation & Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 mb-8 border-b border-neutral-900">
          <div>
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors bg-neutral-900/80 px-2.5 py-1 rounded-md border border-neutral-800"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </Link>
              <span className="text-xs px-2 py-0.5 rounded-full font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                hairline v0.3
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center gap-1">
                <Feather className="w-3 h-3" />
                <span>New: Pen with Cap Opening</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-3">
              Hairline Interactive Figures
            </h1>
            <p className="text-sm text-neutral-400 mt-1 max-w-xl">
              Isometric SVG line figures built from rounded solids that respond to pointer movement in real time.
            </p>
          </div>

    
        </header>


        {/* Featured Stage Preview */}
        <section className="mb-12 rounded-2xl border border-neutral-800/80 bg-neutral-950 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-neutral-800/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Interactive Canvas Area */}
            <div className="lg:col-span-7 flex flex-col items-center">
              <div className="w-full max-w-md aspect-[5/4] rounded-xl bg-neutral-900/40 border border-neutral-800 flex items-center justify-center p-6 relative group">
                <ActiveComponent
                  intensity={intensity}
                  theme={theme}
                  onRead={(txt) => setReadout(txt)}
                  className="w-full h-full cursor-crosshair transition-transform"
                />
              </div>

              {/* Status / Live Readout caption */}
              <div className="w-full max-w-md mt-3 flex items-center justify-between text-xs text-neutral-400 font-mono px-1">
                <span className="flex items-center gap-1.5 text-neutral-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {readout || activeFigure.name}
                </span>
                <span className="text-neutral-500">Move cursor across figure</span>
              </div>
            </div>

            {/* Interactive Controls & Metadata */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              <div>
               
                <div className="flex items-center gap-2.5">
                  <h2 className="text-2xl font-semibold text-white tracking-tight">
                    {activeFigure.name}
                  </h2>
                  {activeFigure.isCustom && (
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/25 font-mono">
                      Hairline Skill Figure
                    </span>
                  )}
                </div>
                <p className="text-sm text-neutral-400 mt-2 leading-relaxed">
                  {activeFigure.description}
                </p>
              </div>

              {/* Slider for intensity */}
              <div className="space-y-3 p-4 rounded-xl bg-neutral-900/50 border border-neutral-800">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="flex items-center gap-1.5 text-neutral-300">
                    <Sliders className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Intensity</span>
                  </span>
                  <span className="text-neutral-400">{Math.round(intensity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={intensity}
                  onChange={(e) => setIntensity(parseFloat(e.target.value))}
                  className="w-full accent-white bg-neutral-800 rounded-lg h-1.5 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
                  <span>0.0 (Subtle)</span>
                  <span>0.5 (Default)</span>
                  <span>1.0 (Maximum)</span>
                </div>
              </div>

              {/* Theme Selector */}
              <div className="space-y-2 p-4 rounded-xl bg-neutral-900/50 border border-neutral-800">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="flex items-center gap-1.5 text-neutral-300">
                    <SunMoon className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Theme</span>
                  </span>
                  <span className="text-neutral-400 capitalize">{theme}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-xs">
                  {(["dark", "light", "auto"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTheme(t)}
                      className={`px-3 py-1.5 rounded-lg border transition capitalize ${
                        theme === t
                          ? "bg-white text-black border-white font-medium"
                          : "bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white hover:border-neutral-700"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Figure switcher buttons */}
              <div>
                <label className="text-xs font-mono text-neutral-400 block mb-2">
                  Switch Active Figure:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {FIGURES.map((fig) => (
                    <button
                      key={fig.key}
                      onClick={() => setActiveKey(fig.key)}
                      className={`text-xs px-2.5 py-1 rounded-md font-mono transition ${
                        activeKey === fig.key
                          ? "bg-neutral-200 text-neutral-950 font-semibold"
                          : "bg-neutral-900/90 text-neutral-400 border border-neutral-800 hover:text-white hover:border-neutral-700"
                      }`}
                    >
                      {fig.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-white tracking-tight">
                All {FIGURES.length} Featured Figures
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Hover over any card below to interact with the isometric canvas directly.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FIGURES.map((fig) => {
              const Comp = fig.component;
              const isSelected = activeKey === fig.key;
              return (
                <div
                  key={fig.key}
                  onClick={() => setActiveKey(fig.key)}
                  className={`group rounded-2xl border p-5 transition cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "border-neutral-500 bg-neutral-900/90"
                      : "border-neutral-800/80 bg-neutral-950 hover:border-neutral-700 hover:bg-neutral-900/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white">{fig.name}</span>
                      {fig.isCustom && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/25 font-mono">
                          Custom Figure
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-mono text-neutral-500 group-hover:text-neutral-300 transition">
                      {isSelected ? "Active" : "Click to test"}
                    </span>
                  </div>

                  <div className="rounded-xl overflow-hidden bg-neutral-900/30 border border-neutral-800/60 p-4 aspect-[5/4] flex items-center justify-center relative">
                    <Comp
                      intensity={intensity}
                      theme={theme}
                      className="w-full h-full cursor-pointer"
                    />
                  </div>

                  <p className="text-xs text-neutral-400 mt-3 line-clamp-2 leading-relaxed">
                    {fig.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Quick Usage & Integration Guide */}
        <section className="rounded-2xl border border-neutral-800 bg-neutral-950 p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-4 text-white">
            <Code2 className="w-5 h-5 text-neutral-400" />
            <h2 className="text-lg font-semibold tracking-tight">How to use Hairline in your code</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono">
            <div className="space-y-3">
              <h3 className="text-sm font-sans font-semibold text-neutral-200">
                1. React / Next.js Component
              </h3>
              <p className="text-neutral-400 font-sans">
                Ensure you include <code className="text-neutral-200 bg-neutral-900 px-1.5 py-0.5 rounded">&quot;use client&quot;</code> at the top because figures attach directly to the DOM with effects.
              </p>
              <pre className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 overflow-x-auto">
{`"use client";

import { Terrain } from "@lucasmarkes/hairline/react";

export function HeroVisual() {
  return (
    <div className="w-64 aspect-[5/4]">
      <Terrain 
        intensity={0.7} 
        theme="dark" 
        onRead={(caption) => console.log(caption)} 
      />
    </div>
  );
}`}
              </pre>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-sans font-semibold text-neutral-200">
                2. Available Props
              </h3>
              <ul className="space-y-2 text-neutral-300 font-sans list-disc pl-5">
                <li>
                  <strong className="text-white font-mono">intensity</strong> (number, 0 to 1): How strongly the figure answers the pointer. Default is <code className="font-mono text-neutral-400">0.5</code>.
                </li>
                <li>
                  <strong className="text-white font-mono">theme</strong> (&quot;auto&quot; | &quot;light&quot; | &quot;dark&quot;): Theme mode. Defaults to <code className="font-mono text-neutral-400">&quot;auto&quot;</code>.
                </li>
                <li>
                  <strong className="text-white font-mono">onRead</strong> ((text: string) =&gt; void): Callback triggered when the caption changes dynamically.
                </li>
                <li>
                  <strong className="text-white font-mono">label</strong> (string): Accessible SVG aria-label description.
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
