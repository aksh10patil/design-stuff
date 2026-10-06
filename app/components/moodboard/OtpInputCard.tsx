"use client";

import React, { useState } from "react";
import { OtpInput, type OtpStatus } from "@/components/ui/otp-input";
import { Eye, EyeOff, RotateCcw } from "lucide-react";

export const OtpInputCard: React.FC = () => {
  const [code, setCode] = useState("");
  const [mask, setMask] = useState(false);
  const [status, setStatus] = useState<OtpStatus>("idle");
  const [key, setKey] = useState(0);

  const handleComplete = (_val: string) => {
    setStatus("success");
    setTimeout(() => {
      setStatus("idle");
    }, 2000);
  };

  const handleReset = () => {
    setCode("");
    setStatus("idle");
    setKey((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col rounded-2xl border border-neutral-800 bg-neutral-950 p-5 transition hover:border-neutral-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-white">otp pin input</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-neutral-900 text-neutral-400 border border-neutral-800">
            sliding caret
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMask((m) => !m)}
            className="p-1 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
            title={mask ? "Show digits" : "Mask digits"}
          >
            {mask ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={handleReset}
            className="p-1 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
            title="Reset code"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="rounded-xl overflow-hidden bg-neutral-900/50 border border-neutral-800/80 p-6 min-h-[320px] flex flex-col items-center justify-center relative gap-6">
        <div className="p-8 rounded-2xl bg-neutral-950/80 border border-neutral-800/80 flex flex-col items-center gap-4 shadow-xl">
          <OtpInput
            key={key}
            length={6}
            value={code}
            onChange={setCode}
            onComplete={handleComplete}
            mask={mask}
            status={status}
            size="md"
          />

          <div className="flex items-center gap-2 font-mono text-xs text-neutral-400 pt-2">
            <span>Value:</span>
            <span className="text-neutral-200 tracking-widest">
              {code ? (mask ? "•".repeat(code.length) : code) : "------"}
            </span>
            {status === "success" && (
              <span className="text-emerald-400 ml-2 text-[11px] font-sans font-medium">✓ Verified</span>
            )}
          </div>
        </div>

        <span className="text-[11px] font-mono text-neutral-500 select-none pointer-events-none text-center">
          Type or paste 6 digits · Smooth spring caret & digit roll
        </span>
      </div>
    </div>
  );
};
