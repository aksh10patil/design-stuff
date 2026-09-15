import React from "react";

export default function Motion() {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-neutral-900">
            <button className="group relative rounded-lg bg-black px-12 py-4
             text-neutral-500 shadow-[0px_1px_2px_0px_rgba(255,255,255,0.1)_inset,0px_-1px_2px_0px_rgba(255,255,255,0.1)_inset]">
                Subscribe

                <span className="pointer-events-none absolute bottom-0 left-1/2 h-2 w-1/2 -translate-x-1/2 rounded-full
                 bg-cyan-500/40 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />

                <span className="pointer-events-none absolute bottom-px
                 left-1/2 h-px w-1/2 -translate-x-1/2 bg-linear-to-r from-transparent via-cyan-500 to-transparent" />
            </button>
        </div>
    );
}
