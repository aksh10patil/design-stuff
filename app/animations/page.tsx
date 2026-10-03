"use client";

import { motion, stagger, useAnimate } from "motion/react";
import { useEffect, useState } from "react";

export default function Animations() {
    return (
        <div className="bg-black text-white min-h-screen p-8">
            <AnimatedText />
            <AnimationSequecnces />
        </div>
    );
}



const AnimationSequecnces = () => {
    const [scope, animate] = useAnimate();
    const [status, setStatus] = useState<"idle" | "processing" | "success">("idle");

    const startAnimating = async () => {
        if (status !== "idle") return;
        setStatus("processing");

        // 1. Tactile click feedback
        await animate("button", { scale: 0.96 }, { duration: 0.1 });

        // 2. Fade & slide out the "Purchase Now" text with blur
        await animate(
            ".btn-content",
            { opacity: 0, y: -12, filter: "blur(4px)" },
            { duration: 0.2, ease: "easeInOut" }
        );
        await animate(".btn-content", { display: "none" });

        // 3. Morph button into a circular loader
        await animate(
            "button",
            { width: 44, height: 44, borderRadius: 22, scale: 1 },
            { duration: 0.35, ease: [0.16, 1, 0.3, 1] }
        );

        // 4. Processing spinner rotation (creates real anticipation)
        await animate(".spinner", { display: "block", opacity: 1 });
        await animate(".spinner", { rotate: 360 }, { duration: 0.8, ease: "linear" });
        await animate(".spinner", { opacity: 0, scale: 0.6 }, { duration: 0.15 });
        await animate(".spinner", { display: "none" });

        // 5. Emerald Success State & Shockwave Burst
        animate(
            ".shockwave",
            { scale: [1, 2.2], opacity: [0.75, 0] },
            { duration: 0.65, ease: "easeOut" }
        );
        animate(
            "button",
            {
                backgroundColor: "#10b981",
                boxShadow: "0 0 35px -5px rgba(16, 185, 129, 0.55)",
                scale: [1, 1.1, 1],
            },
            { duration: 0.35, ease: "easeOut" }
        );

        // 6. Draw checkmark in the dead-center of the circle
        await animate(".success-content", { display: "flex", opacity: 1 });
        await animate(
            ".check-path",
            { pathLength: [0, 1] },
            { duration: 0.35, ease: "easeOut" }
        );

        // Settle briefly so the checkmark is clearly seen in the circle
        await new Promise((r) => setTimeout(r, 100));

        // 7. SILKY SMOOTH PARALLEL EXPANSION:
        // Button widens WHILE receipt text expands from width: 0 to 135px simultaneously.
        await Promise.all([
            animate(
                "button",
                { width: 215, height: 44, borderRadius: 22 },
                { duration: 0.45, ease: [0.16, 1, 0.3, 1] }
            ),
            animate(
                ".receipt-text",
                { width: 135, opacity: 1 },
                { duration: 0.45, ease: [0.16, 1, 0.3, 1] }
            ),
        ]);

        setStatus("success");
    };

    const reset = async () => {
        if (status !== "success") return;
        setStatus("processing");

        // 1. Smoothly shrink receipt text and button back into circle in parallel
        await Promise.all([
            animate(".receipt-text", { width: 0, opacity: 0 }, { duration: 0.3, ease: [0.16, 1, 0.3, 1] }),
            animate(".check-path", { pathLength: 0 }, { duration: 0.25 }),
            animate("button", { width: 44, height: 44, borderRadius: 22 }, { duration: 0.35, ease: [0.16, 1, 0.3, 1] }),
        ]);

        await animate(".success-content", { opacity: 0 }, { duration: 0.15 });
        await animate(".success-content", { display: "none" });

        // 2. Expand back into white Purchase button
        await animate(
            "button",
            {
                width: 160,
                height: 44,
                borderRadius: 14,
                backgroundColor: "#ffffff",
                boxShadow: "0 8px 24px -4px rgba(255, 255, 255, 0.12)",
                scale: 1,
            },
            { duration: 0.35, ease: [0.16, 1, 0.3, 1] }
        );

        // 3. Fade original button label back in
        await animate(".btn-content", { display: "flex" });
        await animate(".btn-content", { opacity: 1, y: 0, filter: "blur(0px)" }, { duration: 0.25 });

        setStatus("idle");
    };

    return (
        <div
            ref={scope}
            className="w-full min-h-[45vh] flex flex-col items-center justify-center select-none"
        >
            <div className="relative flex items-center justify-center">
                {/* Expanding Shockwave Ring (triggers on success) */}
                <span
                    className="shockwave absolute inset-0 rounded-full border-2 border-emerald-400 pointer-events-none"
                    style={{ scale: 1, opacity: 0 }}
                />

                {/* Main Morphing Action Button */}
                <motion.button
                    onClick={status === "idle" ? startAnimating : reset}
                    className="relative flex items-center justify-center bg-white text-neutral-900 cursor-pointer overflow-hidden border border-white/20 shadow-[0_8px_24px_-4px_rgba(255,255,255,0.12)] hover:shadow-[0_12px_28px_-4px_rgba(255,255,255,0.2)] transition-shadow"
                    style={{
                        width: 160,
                        height: 44,
                        borderRadius: 14,
                    }}
                >
                    {/* Initial State: Purchase Now + Price Pill */}
                    <span className="btn-content flex items-center justify-center gap-2 text-sm font-medium tracking-tight whitespace-nowrap">
                        <span>Purchase Now</span>
                        <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-neutral-100 text-neutral-600 font-mono font-semibold">
                            $49
                        </span>
                    </span>

                    {/* Processing Spinner */}
                    <svg
                        className="spinner absolute w-5 h-5 text-neutral-900"
                        style={{ display: "none", opacity: 0 }}
                        viewBox="0 0 24 24"
                        fill="none"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="3"
                        />
                        <path
                            className="opacity-90"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>

                    {/* Success Content: Checkmark on left, smoothly unrolling receipt on right */}
                    <div
                        className="success-content absolute inset-0 flex items-center justify-center pointer-events-none"
                        style={{ display: "none", opacity: 0 }}
                    >
                        <div className="check-container flex items-center justify-center shrink-0">
                            <svg
                                className="w-5 h-5 text-white"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <motion.path
                                    className="check-path"
                                    d="M5 13l4 4L19 7"
                                    style={{ pathLength: 0 }}
                                />
                            </svg>
                        </div>
                        <div
                            className="receipt-text overflow-hidden flex flex-col text-left whitespace-nowrap"
                            style={{ width: 0, opacity: 0 }}
                        >
                            <span className="text-xs font-semibold text-white tracking-tight leading-tight pl-2">
                                Payment Complete
                            </span>
                            <span className="text-[10px] text-emerald-100/90 font-mono pl-2 leading-tight">
                                Receipt sent • #84920
                            </span>
                        </div>
                    </div>
                </motion.button>
            </div>
        </div>
    );
};



const words =
    "The first rule of fight club is you don't talk about fight club. The second rule of fight club is you don't talk about fight club.".split(
        " "
    );

const AnimatedText = () => {
    const [scope, animate] = useAnimate();

    useEffect(() => {
        startAnimating();
    }, []);

    const startAnimating = () => {
        animate(
            "span",
            {
                opacity: 1,
                filter: "blur(0px)",
                y: 0,
            },
            {
                duration: 1,
                ease: "easeInOut",
                delay: stagger(0.1),
            }
        );
    };

    return (
        <div
            ref={scope}
            className="text-white max-w-4xl mx-auto font-bold text-4xl pt-20"
        >
            {words.map((word, idx) => (
                <motion.span
                    key={`${word}-${idx}`}
                    style={{
                        opacity: 0,
                        filter: "blur(10px)",
                        y: 10,
                    }}
                    className="inline-block mr-2"
                >
                    {word}
                </motion.span>
            ))}
        </div>
    );
};