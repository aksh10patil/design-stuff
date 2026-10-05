"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export const Playground: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [sent, setSent] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSent(true);
      setTimeout(() => {
        setSent(false);
        setEmail("");
      }, 3000);
    }
  };

  return (
    <div className="flex flex-col rounded-2xl border border-neutral-800 bg-neutral-950 p-5 transition hover:border-neutral-700">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-white">waitlist showcase</span>
        <Link
          href="/playground"
          className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
        >
          <span>view</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="rounded-xl overflow-hidden bg-neutral-900/50 border border-neutral-800/80 p-8 min-h-[320px] flex flex-col items-center justify-center text-center">
        <h4 className="max-w-md bg-gradient-to-b from-neutral-50 to-neutral-500 bg-clip-text text-2xl font-bold tracking-tight text-transparent">
          Unleash the power of intuitive finance
        </h4>
        <p className="mt-3 text-xs text-neutral-400 max-w-sm">
          Track spending, grow savings, and make smarter money moves all from one simple dashboard.
        </p>

        <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-6 max-w-sm w-full">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 py-2 px-3 rounded-xl border border-neutral-700 bg-neutral-900 text-xs text-white placeholder:text-neutral-500 focus:outline-hidden focus:border-neutral-500"
          />
          <button
            type="submit"
            className="relative py-2 px-4 rounded-xl border border-neutral-600 bg-neutral-900 text-xs text-white hover:bg-neutral-800 transition cursor-pointer shrink-0"
          >
            {sent ? "Joined" : "Join Waitlist"}
            <span className="absolute -bottom-px inset-x-0 h-px bg-gradient-to-r from-transparent via-sky-500 to-transparent" />
          </button>
        </form>
      </div>
    </div>
  );
};
