"use client";

import { useRef, useState } from "react";
import type { CSSProperties } from "react";

const THEMES = {
    silver: {
        label: "Silver",
        swatch: "#e3e3e3",
        vars: {
            "--page": "#0b0b0c",
            "--chassis": "#e3e3e3",
            "--key": "#fafafa",
            "--key-border": "rgba(163,163,163,0.7)",
            "--legend": "#262626",
            "--legend-shadow": "rgba(255,255,255,0.8)",
            "--ui": "rgba(255,255,255,0.75)",
        },
    },
    pink: {
        label: "Pink",
        swatch: "#f2b8c6",
        vars: {
            "--page": "#2b141d",
            "--chassis": "#f2b8c6",
            "--key": "#fdf2f5",
            "--key-border": "rgba(216,150,170,0.7)",
            "--legend": "#3d2129",
            "--legend-shadow": "rgba(255,255,255,0.8)",
            "--ui": "rgba(255,255,255,0.75)",
        },
    },
    blue: {
        label: "Blue",
        swatch: "#b6cfe6",
        vars: {
            "--page": "#0f1c2b",
            "--chassis": "#b6cfe6",
            "--key": "#f2f7fc",
            "--key-border": "rgba(140,173,203,0.7)",
            "--legend": "#1e2f40",
            "--legend-shadow": "rgba(255,255,255,0.8)",
            "--ui": "rgba(255,255,255,0.75)",
        },
    },
    midnight: {
        label: "Midnight",
        swatch: "#2f3033",
        vars: {
            "--page": "#dedbd6",
            "--chassis": "#2f3033",
            "--key": "#1b1c1e",
            "--key-border": "rgba(90,92,97,0.8)",
            "--legend": "#e8e8ea",
            "--legend-shadow": "rgba(0,0,0,0.55)",
            "--ui": "rgba(0,0,0,0.6)",
        },
    },
} as const;

type ThemeName = keyof typeof THEMES;


const SOUND_PROFILES = {
    normal: { tone: 2100, thump: 190, decay: 0.042, gain: 0.30 },
    large: { tone: 1450, thump: 135, decay: 0.058, gain: 0.36 },
    space: { tone: 1000, thump: 95, decay: 0.080, gain: 0.42 },
} as const;

type SoundProfile = keyof typeof SOUND_PROFILES;
export default function () {
    const [theme, setTheme] = useState<ThemeName>("silver");
    const [soundOn, setSoundOn] = useState(true);

    const ctxRef = useRef<AudioContext | null>(null);
    const noiseRef = useRef<AudioBuffer | null>(null);

    const playKey = (profile: SoundProfile) => {
        if (!soundOn) return;

        // the context can only be created inside a user gesture
        let ctx = ctxRef.current;
        if (!ctx) {
            ctx = new AudioContext();
            ctxRef.current = ctx;
        }
        if (ctx.state === "suspended") void ctx.resume();

        // one shared buffer of white noise, built on first press
        if (!noiseRef.current) {
            const frames = Math.floor(ctx.sampleRate * 0.1);
            const buffer = ctx.createBuffer(1, frames, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < frames; i++) data[i] = Math.random() * 2 - 1;
            noiseRef.current = buffer;
        }

        const { tone, thump, decay, gain } = SOUND_PROFILES[profile];
        const now = ctx.currentTime;

        // the plastic "tick" of the cap bottoming out
        const click = ctx.createBufferSource();
        click.buffer = noiseRef.current;
        const band = ctx.createBiquadFilter();
        band.type = "bandpass";
        band.frequency.value = tone;
        band.Q.value = 0.9;
        const clickGain = ctx.createGain();
        clickGain.gain.setValueAtTime(gain, now);
        clickGain.gain.exponentialRampToValueAtTime(0.0001, now + decay);
        click.connect(band).connect(clickGain).connect(ctx.destination);
        click.start(now);
        click.stop(now + decay);

        // the low thud of the key hitting the plate
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.setValueAtTime(thump, now);
        osc.frequency.exponentialRampToValueAtTime(thump * 0.6, now + decay);
        const oscGain = ctx.createGain();
        oscGain.gain.setValueAtTime(gain * 0.5, now);
        oscGain.gain.exponentialRampToValueAtTime(0.0001, now + decay * 1.2);
        osc.connect(oscGain).connect(ctx.destination);
        osc.start(now);
        osc.stop(now + decay * 1.2);
    };

    // one listener for all 78 keys — the cap's rendered width picks the sound
    const handleKeyPress = (e: React.PointerEvent<HTMLDivElement>) => {
        const key = (e.target as HTMLElement).closest("button");
        if (!key) return;
        const w = key.offsetWidth;
        playKey(w > 180 ? "space" : w > 70 ? "large" : "normal");
    };

    return (

        <div
            className="bg-[var(--page)] h-screen w-full flex flex-col items-center justify-center gap-12 transition-colors duration-500"
            style={THEMES[theme].vars as CSSProperties}
        >
            <div
                onPointerDown={handleKeyPress}
                className="bg-[var(--chassis)] h-84 w-196 rounded-2xl p-1.5 font-apple [text-shadow:0_1px_0_var(--legend-shadow)] transition-colors duration-500"
            >
                <div className="flex flex-col justify-center h-full gap-1.5 items-stretch">


                    <div className="flex flex-row gap-1.5 w-full flex-1 min-h-0">

                        <button className="flex-1 min-w-0 h-full pl-2 pr-10 pb-1 bg-[var(--key)] rounded-md rounded-tl-xl flex items-end justify-start text-[9px] font-medium text-[var(--legend)] border border-[var(--key-border)] shadow-[0_1px_2px_0_rgba(0,0,0,0.10),0_2px_4px_-1px_rgba(0,0,0,0.08)] active:shadow-[0_0_0_0_rgba(0,0,0,0)] active:translate-y-0.5 transition-all">
                            esc
                        </button>
                        <button className="flex-1 min-w-0 h-full bg-[var(--key)] rounded-md flex flex-col items-center justify-center gap-1 text-[9px] font-medium text-[var(--legend)] border border-[var(--key-border)] shadow-[0_1px_2px_0_rgba(0,0,0,0.10),0_2px_4px_-1px_rgba(0,0,0,0.08)] active:shadow-[0_0_0_0_rgba(0,0,0,0)] active:translate-y-0.5 transition-all">
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M16.8 12.0L18.8 12.0M15.4 15.4L16.8 16.8M12.0 16.8L12.0 18.8M8.6 15.4L7.2 16.8M7.2 12.0L5.2 12.0M8.6 8.6L7.2 7.2M12.0 7.2L12.0 5.2M15.4 8.6L16.8 7.2" /></svg>
                            <span>F1</span>
                        </button>
                        <button className="flex-1 min-w-0 h-full bg-[var(--key)] rounded-md flex flex-col items-center justify-center gap-1 text-[9px] font-medium text-[var(--legend)] border border-[var(--key-border)] shadow-[0_1px_2px_0_rgba(0,0,0,0.10),0_2px_4px_-1px_rgba(0,0,0,0.08)] active:shadow-[0_0_0_0_rgba(0,0,0,0)] active:translate-y-0.5 transition-all">
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4.5" /><path d="M18.3 12.0L20.9 12.0M16.5 16.5L18.3 18.3M12.0 18.3L12.0 20.9M7.5 16.5L5.7 18.3M5.7 12.0L3.1 12.0M7.5 7.5L5.7 5.7M12.0 5.7L12.0 3.1M16.5 7.5L18.3 5.7" /></svg>
                            <span>F2</span>
                        </button>
                        <button className="flex-1 min-w-0 h-full bg-[var(--key)] rounded-md flex flex-col items-center justify-center gap-1 text-[9px] font-medium text-[var(--legend)] border border-[var(--key-border)] shadow-[0_1px_2px_0_rgba(0,0,0,0.10),0_2px_4px_-1px_rgba(0,0,0,0.08)] active:shadow-[0_0_0_0_rgba(0,0,0,0)] active:translate-y-0.5 transition-all">
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 10h18M9.5 10v9" /></svg>
                            <span>F3</span>
                        </button>
                        <button className="flex-1 min-w-0 h-full bg-[var(--key)] rounded-md flex flex-col items-center justify-center gap-1 text-[9px] font-medium text-[var(--legend)] border border-[var(--key-border)] shadow-[0_1px_2px_0_rgba(0,0,0,0.10),0_2px_4px_-1px_rgba(0,0,0,0.08)] active:shadow-[0_0_0_0_rgba(0,0,0,0)] active:translate-y-0.5 transition-all">
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="6" /><path d="M15.5 15.5L21 21" /></svg>
                            <span>F4</span>
                        </button>
                        <button className="flex-1 min-w-0 h-full bg-[var(--key)] rounded-md flex flex-col items-center justify-center gap-1 text-[9px] font-medium text-[var(--legend)] border border-[var(--key-border)] shadow-[0_1px_2px_0_rgba(0,0,0,0.10),0_2px_4px_-1px_rgba(0,0,0,0.08)] active:shadow-[0_0_0_0_rgba(0,0,0,0)] active:translate-y-0.5 transition-all">
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="2.5" width="6" height="11" rx="3" /><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" /></svg>
                            <span>F5</span>
                        </button>
                        <button className="flex-1 min-w-0 h-full bg-[var(--key)] rounded-md flex flex-col items-center justify-center gap-1 text-[9px] font-medium text-[var(--legend)] border border-[var(--key-border)] shadow-[0_1px_2px_0_rgba(0,0,0,0.10),0_2px_4px_-1px_rgba(0,0,0,0.08)] active:shadow-[0_0_0_0_rgba(0,0,0,0)] active:translate-y-0.5 transition-all">
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" /></svg>
                            <span>F6</span>
                        </button>
                        <button className="flex-1 min-w-0 h-full bg-[var(--key)] rounded-md flex flex-col items-center justify-center gap-1 text-[9px] font-medium text-[var(--legend)] border border-[var(--key-border)] shadow-[0_1px_2px_0_rgba(0,0,0,0.10),0_2px_4px_-1px_rgba(0,0,0,0.08)] active:shadow-[0_0_0_0_rgba(0,0,0,0)] active:translate-y-0.5 transition-all">
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M11 12l8-5.5v11zM3 12l8-5.5v11z" /></svg>
                            <span>F7</span>
                        </button>
                        <button className="flex-1 min-w-0 h-full bg-[var(--key)] rounded-md flex flex-col items-center justify-center gap-1 text-[9px] font-medium text-[var(--legend)] border border-[var(--key-border)] shadow-[0_1px_2px_0_rgba(0,0,0,0.10),0_2px_4px_-1px_rgba(0,0,0,0.08)] active:shadow-[0_0_0_0_rgba(0,0,0,0)] active:translate-y-0.5 transition-all">
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M5 6.5L14 12l-9 5.5zM16.5 6.5h2.5v11h-2.5z" /></svg>
                            <span>F8</span>
                        </button>
                        <button className="flex-1 min-w-0 h-full bg-[var(--key)] rounded-md flex flex-col items-center justify-center gap-1 text-[9px] font-medium text-[var(--legend)] border border-[var(--key-border)] shadow-[0_1px_2px_0_rgba(0,0,0,0.10),0_2px_4px_-1px_rgba(0,0,0,0.08)] active:shadow-[0_0_0_0_rgba(0,0,0,0)] active:translate-y-0.5 transition-all">
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M13 12L5 6.5v11zM21 12l-8-5.5v11z" /></svg>
                            <span>F9</span>
                        </button>
                        <button className="flex-1 min-w-0 h-full bg-[var(--key)] rounded-md flex flex-col items-center justify-center gap-1 text-[9px] font-medium text-[var(--legend)] border border-[var(--key-border)] shadow-[0_1px_2px_0_rgba(0,0,0,0.10),0_2px_4px_-1px_rgba(0,0,0,0.08)] active:shadow-[0_0_0_0_rgba(0,0,0,0)] active:translate-y-0.5 transition-all">
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 9.5h3.5L12 6v12L7.5 14.5H4z" fill="currentColor" stroke="none" /><path d="M16 9.5l5 5M21 9.5l-5 5" /></svg>
                            <span>F10</span>
                        </button>
                        <button className="flex-1 min-w-0 h-full bg-[var(--key)] rounded-md flex flex-col items-center justify-center gap-1 text-[9px] font-medium text-[var(--legend)] border border-[var(--key-border)] shadow-[0_1px_2px_0_rgba(0,0,0,0.10),0_2px_4px_-1px_rgba(0,0,0,0.08)] active:shadow-[0_0_0_0_rgba(0,0,0,0)] active:translate-y-0.5 transition-all">
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 9.5h3.5L12 6v12L7.5 14.5H4z" fill="currentColor" stroke="none" /><path d="M15.5 9.5a3.5 3.5 0 0 1 0 5" /></svg>
                            <span>F11</span>
                        </button>
                        <button className="flex-1 min-w-0 h-full bg-[var(--key)] rounded-md flex flex-col items-center justify-center gap-1 text-[9px] font-medium text-[var(--legend)] border border-[var(--key-border)] shadow-[0_1px_2px_0_rgba(0,0,0,0.10),0_2px_4px_-1px_rgba(0,0,0,0.08)] active:shadow-[0_0_0_0_rgba(0,0,0,0)] active:translate-y-0.5 transition-all">
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 9.5h3.5L12 6v12L7.5 14.5H4z" fill="currentColor" stroke="none" /><path d="M15.5 9.5a3.5 3.5 0 0 1 0 5M18.5 7a7 7 0 0 1 0 10" /></svg>
                            <span>F12</span>
                        </button>
                        <button className="flex-1 min-w-0 h-full bg-[var(--key)] rounded-md rounded-tr-xl flex flex-col items-center justify-center gap-1 text-[9px] font-medium text-[var(--legend)] border border-[var(--key-border)] shadow-[0_1px_2px_0_rgba(0,0,0,0.10),0_2px_4px_-1px_rgba(0,0,0,0.08)] active:shadow-[0_0_0_0_rgba(0,0,0,0)] active:translate-y-0.5 transition-all">
                            <div className="w-8 h-8 rounded-full border border-neutral-300 shadow-[inset_0_1px_2px_0_rgba(0,0,0,0.12)]" />
                        </button>


                    </div>

                    <div className="flex flex-row gap-1.5 w-full flex-1 min-h-0">
                        <button className="flex-1 min-w-0 h-full bg-[var(--key)] rounded-md flex items-center justify-center text-[10px] font-medium text-[var(--legend)] border border-[var(--key-border)] shadow-[0_1px_2px_0_rgba(0,0,0,0.10),0_2px_4px_-1px_rgba(0,0,0,0.08)] active:shadow-[0_0_0_0_rgba(0,0,0,0)] active:translate-y-0.5 transition-all">
                            ``
                        </button>
                        <button className="flex-1 min-w-0 h-full bg-[var(--key)] rounded-md flex items-center justify-center text-[10px] font-medium text-[var(--legend)] border border-[var(--key-border)] shadow-[0_1px_2px_0_rgba(0,0,0,0.10),0_2px_4px_-1px_rgba(0,0,0,0.08)] active:shadow-[0_0_0_0_rgba(0,0,0,0)] active:translate-y-0.5 transition-all">
                            1
                        </button>
                        <button className="flex-1 min-w-0 h-full bg-[var(--key)] rounded-md flex items-center justify-center text-[10px] font-medium text-[var(--legend)] border border-[var(--key-border)] shadow-[0_1px_2px_0_rgba(0,0,0,0.10),0_2px_4px_-1px_rgba(0,0,0,0.08)] active:shadow-[0_0_0_0_rgba(0,0,0,0)] active:translate-y-0.5 transition-all">
                            2
                        </button>
                        <button className="flex-1 min-w-0 h-full bg-[var(--key)] rounded-md flex items-center justify-center text-[10px] font-medium text-[var(--legend)] border border-[var(--key-border)] shadow-[0_1px_2px_0_rgba(0,0,0,0.10),0_2px_4px_-1px_rgba(0,0,0,0.08)] active:shadow-[0_0_0_0_rgba(0,0,0,0)] active:translate-y-0.5 transition-all">
                            3
                        </button>
                        <button className="flex-1 min-w-0 h-full bg-[var(--key)] rounded-md flex items-center justify-center text-[10px] font-medium text-[var(--legend)] border border-[var(--key-border)] shadow-[0_1px_2px_0_rgba(0,0,0,0.10),0_2px_4px_-1px_rgba(0,0,0,0.08)] active:shadow-[0_0_0_0_rgba(0,0,0,0)] active:translate-y-0.5 transition-all">
                            4
                        </button>
                        <button className="flex-1 min-w-0 h-full bg-[var(--key)] rounded-md flex items-center justify-center text-[10px] font-medium text-[var(--legend)] border border-[var(--key-border)] shadow-[0_1px_2px_0_rgba(0,0,0,0.10),0_2px_4px_-1px_rgba(0,0,0,0.08)] active:shadow-[0_0_0_0_rgba(0,0,0,0)] active:translate-y-0.5 transition-all">
                            5
                        </button>
                        <button className="flex-1 min-w-0 h-full bg-[var(--key)] rounded-md flex items-center justify-center text-[10px] font-medium text-[var(--legend)] border border-[var(--key-border)] shadow-[0_1px_2px_0_rgba(0,0,0,0.10),0_2px_4px_-1px_rgba(0,0,0,0.08)] active:shadow-[0_0_0_0_rgba(0,0,0,0)] active:translate-y-0.5 transition-all">
                            6
                        </button>
                        <button className="flex-1 min-w-0 h-full bg-[var(--key)] rounded-md flex items-center justify-center text-[10px] font-medium text-[var(--legend)] border border-[var(--key-border)] shadow-[0_1px_2px_0_rgba(0,0,0,0.10),0_2px_4px_-1px_rgba(0,0,0,0.08)] active:shadow-[0_0_0_0_rgba(0,0,0,0)] active:translate-y-0.5 transition-all">
                            7
                        </button>
                        <button className="flex-1 min-w-0 h-full bg-[var(--key)] rounded-md flex items-center justify-center text-[10px] font-medium text-[var(--legend)] border border-[var(--key-border)] shadow-[0_1px_2px_0_rgba(0,0,0,0.10),0_2px_4px_-1px_rgba(0,0,0,0.08)] active:shadow-[0_0_0_0_rgba(0,0,0,0)] active:translate-y-0.5 transition-all">
                            8
                        </button>
                        <button className="flex-1 min-w-0 h-full bg-[var(--key)] rounded-md flex items-center justify-center text-[10px] font-medium text-[var(--legend)] border border-[var(--key-border)] shadow-[0_1px_2px_0_rgba(0,0,0,0.10),0_2px_4px_-1px_rgba(0,0,0,0.08)] active:shadow-[0_0_0_0_rgba(0,0,0,0)] active:translate-y-0.5 transition-all">
                            9
                        </button>
                        <button className="flex-1 min-w-0 h-full bg-[var(--key)] rounded-md flex items-center justify-center text-[10px] font-medium text-[var(--legend)] border border-[var(--key-border)] shadow-[0_1px_2px_0_rgba(0,0,0,0.10),0_2px_4px_-1px_rgba(0,0,0,0.08)] active:shadow-[0_0_0_0_rgba(0,0,0,0)] active:translate-y-0.5 transition-all">
                            0
                        </button>
                        <button className="flex-1 min-w-0 h-full bg-[var(--key)] rounded-md flex items-center justify-center text-[10px] font-medium text-[var(--legend)] border border-[var(--key-border)] shadow-[0_1px_2px_0_rgba(0,0,0,0.10),0_2px_4px_-1px_rgba(0,0,0,0.08)] active:shadow-[0_0_0_0_rgba(0,0,0,0)] active:translate-y-0.5 transition-all">
                            -
                        </button>
                        <button className="flex-1 min-w-0 h-full bg-[var(--key)] rounded-md flex items-center justify-center text-[10px] font-medium text-[var(--legend)] border border-[var(--key-border)] shadow-[0_1px_2px_0_rgba(0,0,0,0.10),0_2px_4px_-1px_rgba(0,0,0,0.08)] active:shadow-[0_0_0_0_rgba(0,0,0,0)] active:translate-y-0.5 transition-all">
                            =
                        </button>
                        <button className="flex-1 min-w-0 h-full pl-6 pr-2 pb-1 bg-[var(--key)] rounded-md flex items-end justify-end text-[9px] font-medium text-[var(--legend)] border border-[var(--key-border)] shadow-[0_1px_2px_0_rgba(0,0,0,0.10),0_2px_4px_-1px_rgba(0,0,0,0.08)] active:shadow-[0_0_0_0_rgba(0,0,0,0)] active:translate-y-0.5 transition-all">
                            delete
                        </button>


                    </div>

                    <div className="flex flex-row gap-1.5 w-full flex-1">
                        <button className="flex-1 min-w-0 h-full pl-2 pr-6 pb-1 bg-[var(--key)] rounded-md flex items-end justify-start text-[9px] font-medium text-[var(--legend)] border border-[var(--key-border)] shadow-[0_1px_2px_0_rgba(0,0,0,0.10),0_2px_4px_-1px_rgba(0,0,0,0.08)] active:shadow-[0_0_0_0_rgba(0,0,0,0)] active:translate-y-0.5 transition-all">
                            tab
                        </button>
                        <button className="flex-1 min-w-0 h-full bg-[var(--key)] rounded-md flex items-center justify-center text-[10px] font-medium text-[var(--legend)] border border-[var(--key-border)] shadow-[0_1px_2px_0_rgba(0,0,0,0.10),0_2px_4px_-1px_rgba(0,0,0,0.08)] active:shadow-[0_0_0_0_rgba(0,0,0,0)] active:translate-y-0.5 transition-all">
                            Q
                        </button>
                        <button className="flex-1 min-w-0 h-full bg-[var(--key)] rounded-md flex items-center justify-center text-[10px] font-medium text-[var(--legend)] border border-[var(--key-border)] shadow-[0_1px_2px_0_rgba(0,0,0,0.10),0_2px_4px_-1px_rgba(0,0,0,0.08)] active:shadow-[0_0_0_0_rgba(0,0,0,0)] active:translate-y-0.5 transition-all">
                            W
                        </button>
                        <button className="flex-1 min-w-0 h-full bg-[var(--key)] rounded-md flex items-center justify-center text-[10px] font-medium text-[var(--legend)] border border-[var(--key-border)] shadow-[0_1px_2px_0_rgba(0,0,0,0.10),0_2px_4px_-1px_rgba(0,0,0,0.08)] active:shadow-[0_0_0_0_rgba(0,0,0,0)] active:translate-y-0.5 transition-all">
                            E
                        </button>
                        <button className="flex-1 min-w-0 h-full bg-[var(--key)] rounded-md flex items-center justify-center text-[10px] font-medium text-[var(--legend)] border border-[var(--key-border)] shadow-[0_1px_2px_0_rgba(0,0,0,0.10),0_2px_4px_-1px_rgba(0,0,0,0.08)] active:shadow-[0_0_0_0_rgba(0,0,0,0)] active:translate-y-0.5 transition-all">
                            R
                        </button>
                        <button className="flex-1 min-w-0 h-full bg-[var(--key)] rounded-md flex items-center justify-center text-[10px] font-medium text-[var(--legend)] border border-[var(--key-border)] shadow-[0_1px_2px_0_rgba(0,0,0,0.10),0_2px_4px_-1px_rgba(0,0,0,0.08)] active:shadow-[0_0_0_0_rgba(0,0,0,0)] active:translate-y-0.5 transition-all">
                            T
                        </button>
                        <button className="flex-1 min-w-0 h-full bg-[var(--key)] rounded-md flex items-center justify-center text-[10px] font-medium text-[var(--legend)] border border-[var(--key-border)] shadow-[0_1px_2px_0_rgba(0,0,0,0.10),0_2px_4px_-1px_rgba(0,0,0,0.08)] active:shadow-[0_0_0_0_rgba(0,0,0,0)] active:translate-y-0.5 transition-all">
                            Y
                        </button>
                        <button className="flex-1 min-w-0 h-full bg-[var(--key)] rounded-md flex items-center justify-center text-[10px] font-medium text-[var(--legend)] border border-[var(--key-border)] shadow-[0_1px_2px_0_rgba(0,0,0,0.10),0_2px_4px_-1px_rgba(0,0,0,0.08)] active:shadow-[0_0_0_0_rgba(0,0,0,0)] active:translate-y-0.5 transition-all">
                            U
                        </button>
                        <button className="flex-1 min-w-0 h-full bg-[var(--key)] rounded-md flex items-center justify-center text-[10px] font-medium text-[var(--legend)] border border-[var(--key-border)] shadow-[0_1px_2px_0_rgba(0,0,0,0.10),0_2px_4px_-1px_rgba(0,0,0,0.08)] active:shadow-[0_0_0_0_rgba(0,0,0,0)] active:translate-y-0.5 transition-all">
                            I
                        </button>
                        <button className="flex-1 min-w-0 h-full bg-[var(--key)] rounded-md flex items-center justify-center text-[10px] font-medium text-[var(--legend)] border border-[var(--key-border)] shadow-[0_1px_2px_0_rgba(0,0,0,0.10),0_2px_4px_-1px_rgba(0,0,0,0.08)] active:shadow-[0_0_0_0_rgba(0,0,0,0)] active:translate-y-0.5 transition-all">
                            O
                        </button>
                        <button className="flex-1 min-w-0 h-full bg-[var(--key)] rounded-md flex items-center justify-center text-[10px] font-medium text-[var(--legend)] border border-[var(--key-border)] shadow-[0_1px_2px_0_rgba(0,0,0,0.10),0_2px_4px_-1px_rgba(0,0,0,0.08)] active:shadow-[0_0_0_0_rgba(0,0,0,0)] active:translate-y-0.5 transition-all">
                            P
                        </button>
                        <button className="flex-1 min-w-0 h-full bg-[var(--key)] rounded-md flex items-center justify-center text-[10px] font-medium text-[var(--legend)] border border-[var(--key-border)] shadow-[0_1px_2px_0_rgba(0,0,0,0.10),0_2px_4px_-1px_rgba(0,0,0,0.08)] active:shadow-[0_0_0_0_rgba(0,0,0,0)] active:translate-y-0.5 transition-all">
                            [
                        </button>
                        <button className="flex-1 min-w-0 h-full bg-[var(--key)] rounded-md flex items-center justify-center text-[10px] font-medium text-[var(--legend)] border border-[var(--key-border)] shadow-[0_1px_2px_0_rgba(0,0,0,0.10),0_2px_4px_-1px_rgba(0,0,0,0.08)] active:shadow-[0_0_0_0_rgba(0,0,0,0)] active:translate-y-0.5 transition-all">
                            ]
                        </button>
                        <button className="flex-1 min-w-0 h-full bg-[var(--key)] rounded-md flex items-center justify-center text-[10px] font-medium text-[var(--legend)] border border-[var(--key-border)] shadow-[0_1px_2px_0_rgba(0,0,0,0.10),0_2px_4px_-1px_rgba(0,0,0,0.08)] active:shadow-[0_0_0_0_rgba(0,0,0,0)] active:translate-y-0.5 transition-all">
                            \
                        </button>

                    </div>

                    <div className="flex flex-row gap-1.5 w-full flex-1">
                        <button className="flex-1 min-w-0 h-full pl-2 pr-10 pb-1 bg-[var(--key)] rounded-md flex items-end justify-start whitespace-nowrap text-[9px] font-medium text-[var(--legend)] border border-[var(--key-border)] shadow-[0_1px_2px_0_rgba(0,0,0,0.10),0_2px_4px_-1px_rgba(0,0,0,0.08)] active:shadow-[0_0_0_0_rgba(0,0,0,0)] active:translate-y-0.5 transition-all">
                            caps lock
                        </button>
                        <button className="flex-1 min-w-0 h-full bg-[var(--key)] rounded-md flex items-center justify-center text-[10px] font-medium text-[var(--legend)] border border-[var(--key-border)] shadow-[0_1px_2px_0_rgba(0,0,0,0.10),0_2px_4px_-1px_rgba(0,0,0,0.08)] active:shadow-[0_0_0_0_rgba(0,0,0,0)] active:translate-y-0.5 transition-all">
                            A
                        </button>
                        <button className="flex-1 min-w-0 h-full bg-[var(--key)] rounded-md flex items-center justify-center text-[10px] font-medium text-[var(--legend)] border border-[var(--key-border)] shadow-[0_1px_2px_0_rgba(0,0,0,0.10),0_2px_4px_-1px_rgba(0,0,0,0.08)] active:shadow-[0_0_0_0_rgba(0,0,0,0)] active:translate-y-0.5 transition-all">
                            S
                        </button>
                        <button className="flex-1 min-w-0 h-full bg-[var(--key)] rounded-md flex items-center justify-center text-[10px] font-medium text-[var(--legend)] border border-[var(--key-border)] shadow-[0_1px_2px_0_rgba(0,0,0,0.10),0_2px_4px_-1px_rgba(0,0,0,0.08)] active:shadow-[0_0_0_0_rgba(0,0,0,0)] active:translate-y-0.5 transition-all">
                            D
                        </button>
                        <button className="flex-1 min-w-0 h-full bg-[var(--key)] rounded-md flex items-center justify-center text-[10px] font-medium text-[var(--legend)] border border-[var(--key-border)] shadow-[0_1px_2px_0_rgba(0,0,0,0.10),0_2px_4px_-1px_rgba(0,0,0,0.08)] active:shadow-[0_0_0_0_rgba(0,0,0,0)] active:translate-y-0.5 transition-all">
                            F
                        </button>
                        <button className="flex-1 min-w-0 h-full bg-[var(--key)] rounded-md flex items-center justify-center text-[10px] font-medium text-[var(--legend)] border border-[var(--key-border)] shadow-[0_1px_2px_0_rgba(0,0,0,0.10),0_2px_4px_-1px_rgba(0,0,0,0.08)] active:shadow-[0_0_0_0_rgba(0,0,0,0)] active:translate-y-0.5 transition-all">
                            G
                        </button>
                        <button className="flex-1 min-w-0 h-full bg-[var(--key)] rounded-md flex items-center justify-center text-[10px] font-medium text-[var(--legend)] border border-[var(--key-border)] shadow-[0_1px_2px_0_rgba(0,0,0,0.10),0_2px_4px_-1px_rgba(0,0,0,0.08)] active:shadow-[0_0_0_0_rgba(0,0,0,0)] active:translate-y-0.5 transition-all">
                            H
                        </button>
                        <button className="flex-1 min-w-0 h-full bg-[var(--key)] rounded-md flex items-center justify-center text-[10px] font-medium text-[var(--legend)] border border-[var(--key-border)] shadow-[0_1px_2px_0_rgba(0,0,0,0.10),0_2px_4px_-1px_rgba(0,0,0,0.08)] active:shadow-[0_0_0_0_rgba(0,0,0,0)] active:translate-y-0.5 transition-all">
                            J
                        </button>
                        <button className="flex-1 min-w-0 h-full bg-[var(--key)] rounded-md flex items-center justify-center text-[10px] font-medium text-[var(--legend)] border border-[var(--key-border)] shadow-[0_1px_2px_0_rgba(0,0,0,0.10),0_2px_4px_-1px_rgba(0,0,0,0.08)] active:shadow-[0_0_0_0_rgba(0,0,0,0)] active:translate-y-0.5 transition-all">
                            K
                        </button>
                        <button className="flex-1 min-w-0 h-full bg-[var(--key)] rounded-md flex items-center justify-center text-[10px] font-medium text-[var(--legend)] border border-[var(--key-border)] shadow-[0_1px_2px_0_rgba(0,0,0,0.10),0_2px_4px_-1px_rgba(0,0,0,0.08)] active:shadow-[0_0_0_0_rgba(0,0,0,0)] active:translate-y-0.5 transition-all">
                            L
                        </button>
                        <button className="flex-1 min-w-0 h-full bg-[var(--key)] rounded-md flex items-center justify-center text-[10px] font-medium text-[var(--legend)] border border-[var(--key-border)] shadow-[0_1px_2px_0_rgba(0,0,0,0.10),0_2px_4px_-1px_rgba(0,0,0,0.08)] active:shadow-[0_0_0_0_rgba(0,0,0,0)] active:translate-y-0.5 transition-all">
                            ;
                        </button>
                        <button className="flex-1 min-w-0 h-full bg-[var(--key)] rounded-md flex items-center justify-center text-[10px] font-medium text-[var(--legend)] border border-[var(--key-border)] shadow-[0_1px_2px_0_rgba(0,0,0,0.10),0_2px_4px_-1px_rgba(0,0,0,0.08)] active:shadow-[0_0_0_0_rgba(0,0,0,0)] active:translate-y-0.5 transition-all">
                            &#39;
                        </button>
                        <button className="flex-1 min-w-0 h-full pl-10 pr-2 pb-1 bg-[var(--key)] rounded-md flex items-end justify-end text-[9px] font-medium text-[var(--legend)] border border-[var(--key-border)] shadow-[0_1px_2px_0_rgba(0,0,0,0.10),0_2px_4px_-1px_rgba(0,0,0,0.08)] active:shadow-[0_0_0_0_rgba(0,0,0,0)] active:translate-y-0.5 transition-all">
                            return
                        </button>

                    </div>

                    <div className="flex flex-row gap-1.5 w-full flex-1">
                        <button className="flex-1 min-w-0 h-full pl-2 pr-14 pb-1 bg-[var(--key)] rounded-md flex items-end justify-start text-[9px] font-medium text-[var(--legend)] border border-[var(--key-border)] shadow-[0_1px_2px_0_rgba(0,0,0,0.10),0_2px_4px_-1px_rgba(0,0,0,0.08)] active:shadow-[0_0_0_0_rgba(0,0,0,0)] active:translate-y-0.5 transition-all">
                            shift
                        </button>
                        <button className="flex-1 min-w-0 h-full bg-[var(--key)] rounded-md flex items-center justify-center text-[10px] font-medium text-[var(--legend)] border border-[var(--key-border)] shadow-[0_1px_2px_0_rgba(0,0,0,0.10),0_2px_4px_-1px_rgba(0,0,0,0.08)] active:shadow-[0_0_0_0_rgba(0,0,0,0)] active:translate-y-0.5 transition-all">
                            Z
                        </button>
                        <button className="flex-1 min-w-0 h-full bg-[var(--key)] rounded-md flex items-center justify-center text-[10px] font-medium text-[var(--legend)] border border-[var(--key-border)] shadow-[0_1px_2px_0_rgba(0,0,0,0.10),0_2px_4px_-1px_rgba(0,0,0,0.08)] active:shadow-[0_0_0_0_rgba(0,0,0,0)] active:translate-y-0.5 transition-all">
                            X
                        </button>
                        <button className="flex-1 min-w-0 h-full bg-[var(--key)] rounded-md flex items-center justify-center text-[10px] font-medium text-[var(--legend)] border border-[var(--key-border)] shadow-[0_1px_2px_0_rgba(0,0,0,0.10),0_2px_4px_-1px_rgba(0,0,0,0.08)] active:shadow-[0_0_0_0_rgba(0,0,0,0)] active:translate-y-0.5 transition-all">
                            C
                        </button>
                        <button className="flex-1 min-w-0 h-full bg-[var(--key)] rounded-md flex items-center justify-center text-[10px] font-medium text-[var(--legend)] border border-[var(--key-border)] shadow-[0_1px_2px_0_rgba(0,0,0,0.10),0_2px_4px_-1px_rgba(0,0,0,0.08)] active:shadow-[0_0_0_0_rgba(0,0,0,0)] active:translate-y-0.5 transition-all">
                            V
                        </button>
                        <button className="flex-1 min-w-0 h-full bg-[var(--key)] rounded-md flex items-center justify-center text-[10px] font-medium text-[var(--legend)] border border-[var(--key-border)] shadow-[0_1px_2px_0_rgba(0,0,0,0.10),0_2px_4px_-1px_rgba(0,0,0,0.08)] active:shadow-[0_0_0_0_rgba(0,0,0,0)] active:translate-y-0.5 transition-all">
                            B
                        </button>
                        <button className="flex-1 min-w-0 h-full bg-[var(--key)] rounded-md flex items-center justify-center text-[10px] font-medium text-[var(--legend)] border border-[var(--key-border)] shadow-[0_1px_2px_0_rgba(0,0,0,0.10),0_2px_4px_-1px_rgba(0,0,0,0.08)] active:shadow-[0_0_0_0_rgba(0,0,0,0)] active:translate-y-0.5 transition-all">
                            N
                        </button>
                        <button className="flex-1 min-w-0 h-full bg-[var(--key)] rounded-md flex items-center justify-center text-[10px] font-medium text-[var(--legend)] border border-[var(--key-border)] shadow-[0_1px_2px_0_rgba(0,0,0,0.10),0_2px_4px_-1px_rgba(0,0,0,0.08)] active:shadow-[0_0_0_0_rgba(0,0,0,0)] active:translate-y-0.5 transition-all">
                            M
                        </button>
                        <button className="flex-1 min-w-0 h-full bg-[var(--key)] rounded-md flex items-center justify-center text-[10px] font-medium text-[var(--legend)] border border-[var(--key-border)] shadow-[0_1px_2px_0_rgba(0,0,0,0.10),0_2px_4px_-1px_rgba(0,0,0,0.08)] active:shadow-[0_0_0_0_rgba(0,0,0,0)] active:translate-y-0.5 transition-all">
                            ,
                        </button>
                        <button className="flex-1 min-w-0 h-full bg-[var(--key)] rounded-md flex items-center justify-center text-[10px] font-medium text-[var(--legend)] border border-[var(--key-border)] shadow-[0_1px_2px_0_rgba(0,0,0,0.10),0_2px_4px_-1px_rgba(0,0,0,0.08)] active:shadow-[0_0_0_0_rgba(0,0,0,0)] active:translate-y-0.5 transition-all">
                            .
                        </button>
                        <button className="flex-1 min-w-0 h-full bg-[var(--key)] rounded-md flex items-center justify-center text-[10px] font-medium text-[var(--legend)] border border-[var(--key-border)] shadow-[0_1px_2px_0_rgba(0,0,0,0.10),0_2px_4px_-1px_rgba(0,0,0,0.08)] active:shadow-[0_0_0_0_rgba(0,0,0,0)] active:translate-y-0.5 transition-all">
                            /
                        </button>
                        <button className="flex-1 min-w-0 h-full pl-14 pr-2 pb-1 bg-[var(--key)] rounded-md flex items-end justify-end text-[9px] font-medium text-[var(--legend)] border border-[var(--key-border)] shadow-[0_1px_2px_0_rgba(0,0,0,0.10),0_2px_4px_-1px_rgba(0,0,0,0.08)] active:shadow-[0_0_0_0_rgba(0,0,0,0)] active:translate-y-0.5 transition-all">
                            shift
                        </button>

                    </div>

                    <div className="flex flex-row gap-1.5 w-full flex-1">
                        <button className="flex-1 min-w-0 h-full bg-[var(--key)] rounded-md rounded-bl-xl flex flex-col items-start justify-center gap-1.5 leading-none pl-2 text-[9px] font-medium text-[var(--legend)] border border-[var(--key-border)] shadow-[0_1px_2px_0_rgba(0,0,0,0.10),0_2px_4px_-1px_rgba(0,0,0,0.08)] active:shadow-[0_0_0_0_rgba(0,0,0,0)] active:translate-y-0.5 transition-all">
                            <span>fn</span>
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="8.5" /><path d="M3.5 12h17M12 3.5c2.5 2.6 2.5 14.4 0 17M12 3.5c-2.5 2.6-2.5 14.4 0 17" /></svg>
                        </button>
                        <button className="flex-1 min-w-0 h-full bg-[var(--key)] rounded-md flex flex-col items-start justify-center gap-1.5 leading-none pl-2 text-[9px] font-medium text-[var(--legend)] border border-[var(--key-border)] shadow-[0_1px_2px_0_rgba(0,0,0,0.10),0_2px_4px_-1px_rgba(0,0,0,0.08)] active:shadow-[0_0_0_0_rgba(0,0,0,0)] active:translate-y-0.5 transition-all">
                            <span className="text-[11px]">⌃</span>
                            <span>control</span>
                        </button>
                        <button className="flex-1 min-w-0 h-full bg-[var(--key)] rounded-md flex flex-col items-start justify-center gap-1.5 leading-none pl-2 text-[9px] font-medium text-[var(--legend)] border border-[var(--key-border)] shadow-[0_1px_2px_0_rgba(0,0,0,0.10),0_2px_4px_-1px_rgba(0,0,0,0.08)] active:shadow-[0_0_0_0_rgba(0,0,0,0)] active:translate-y-0.5 transition-all">
                            <span className="text-[11px]">⌥</span>
                            <span>option</span>
                        </button>
                        <button className="flex-1 min-w-0 h-full bg-[var(--key)] rounded-md flex flex-col items-start justify-center gap-1.5 leading-none pl-2 text-[9px] font-medium text-[var(--legend)] border border-[var(--key-border)] shadow-[0_1px_2px_0_rgba(0,0,0,0.10),0_2px_4px_-1px_rgba(0,0,0,0.08)] active:shadow-[0_0_0_0_rgba(0,0,0,0)] active:translate-y-0.5 transition-all">
                            <span className="text-[11px]">⌘</span>
                            <span>command</span>
                        </button>
                        <button className="flex-1 min-w-0 h-full px-20 bg-[var(--key)] rounded-md flex items-center justify-center text-[10px] font-medium text-[var(--legend)] border border-[var(--key-border)] shadow-[0_1px_2px_0_rgba(0,0,0,0.10),0_2px_4px_-1px_rgba(0,0,0,0.08)] active:shadow-[0_0_0_0_rgba(0,0,0,0)] active:translate-y-0.5 transition-all">

                        </button>
                        <button className="flex-1 min-w-0 h-full bg-[var(--key)] rounded-md flex flex-col items-start justify-center gap-1.5 leading-none pl-2 text-[9px] font-medium text-[var(--legend)] border border-[var(--key-border)] shadow-[0_1px_2px_0_rgba(0,0,0,0.10),0_2px_4px_-1px_rgba(0,0,0,0.08)] active:shadow-[0_0_0_0_rgba(0,0,0,0)] active:translate-y-0.5 transition-all">
                            <span className="text-[11px]">⌘</span>
                            <span>command</span>
                        </button>
                        <button className="flex-1 min-w-0 h-full bg-[var(--key)] rounded-md flex flex-col items-start justify-center gap-1.5 leading-none pl-2 text-[9px] font-medium text-[var(--legend)] border border-[var(--key-border)] shadow-[0_1px_2px_0_rgba(0,0,0,0.10),0_2px_4px_-1px_rgba(0,0,0,0.08)] active:shadow-[0_0_0_0_rgba(0,0,0,0)] active:translate-y-0.5 transition-all">
                            <span className="text-[11px]">⌥</span>
                            <span>option</span>
                        </button>
                        <div className="flex flex-row gap-0.5 flex-3 min-w-0 h-full">
                            <button className="flex-1 min-w-0 h-full bg-[var(--key)] rounded-md flex items-center justify-center text-[10px] font-medium text-[var(--legend)] border border-[var(--key-border)] shadow-[0_1px_2px_0_rgba(0,0,0,0.10),0_2px_4px_-1px_rgba(0,0,0,0.08)] active:shadow-[0_0_0_0_rgba(0,0,0,0)] active:translate-y-0.5 transition-all">
                                ◀
                            </button>
                            <div className="flex flex-col gap-1.0 flex-1 min-w-0 h-full">
                                <button className="flex-1 min-h-0 w-full bg-[var(--key)] rounded-md flex items-center justify-center text-[10px] font-medium text-[var(--legend)] border border-[var(--key-border)] shadow-[0_1px_2px_0_rgba(0,0,0,0.10),0_2px_4px_-1px_rgba(0,0,0,0.08)] active:shadow-[0_0_0_0_rgba(0,0,0,0)] active:translate-y-0.5 transition-all">
                                    ▲
                                </button>
                                <button className="flex-1 min-h-0 w-full bg-[var(--key)] rounded-md flex items-center justify-center text-[10px] font-medium text-[var(--legend)] border border-[var(--key-border)] shadow-[0_1px_2px_0_rgba(0,0,0,0.10),0_2px_4px_-1px_rgba(0,0,0,0.08)] active:shadow-[0_0_0_0_rgba(0,0,0,0)] active:translate-y-0.5 transition-all">
                                    ▼
                                </button>
                            </div>
                            <button className="flex-1  min-w-0 h-full bg-[var(--key)] rounded-md rounded-br-xl flex items-center justify-center text-[10px] font-medium text-[var(--legend)] border border-[var(--key-border)] shadow-[0_1px_2px_0_rgba(0,0,0,0.10),0_2px_4px_-1px_rgba(0,0,0,0.08)] active:shadow-[0_0_0_0_rgba(0,0,0,0)] active:translate-y-0.5 transition-all">
                                ▶
                            </button>

                        </div>


                    </div>


                </div>
            </div>

            <div className="flex flex-row items-center gap-5">
                {(Object.keys(THEMES) as ThemeName[]).map((name) => (
                    <button
                        key={name}
                        type="button"
                        onClick={() => setTheme(name)}
                        aria-label={THEMES[name].label}
                        aria-pressed={theme === name}
                        style={{ backgroundColor: THEMES[name].swatch }}
                        className={`h-7 w-7 rounded-full ring-offset-4 ring-offset-[var(--page)] transition-all duration-300 hover:scale-110 ${
                            theme === name
                                ? "ring-2 ring-[var(--ui)] scale-110"
                                : "ring-1 ring-[var(--ui)]/40"
                        }`}
                    />
                ))}

                <span className="mx-1 h-6 w-px bg-[var(--ui)]/25" />

                <button
                    type="button"
                    onClick={() => setSoundOn((on) => !on)}
                    aria-label={soundOn ? "Mute key sounds" : "Unmute key sounds"}
                    aria-pressed={soundOn}
                    className="flex h-7 items-center gap-2 rounded-full border border-[var(--ui)]/30 px-3 text-[11px] font-medium text-[var(--ui)] transition-all duration-300 hover:border-[var(--ui)]/60"
                >
                    {soundOn ? (
                        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 9.5h3.5L12 6v12L7.5 14.5H4z" fill="currentColor" stroke="none" />
                            <path d="M15.5 9.5a3.5 3.5 0 0 1 0 5M18.5 7a7 7 0 0 1 0 10" />
                        </svg>
                    ) : (
                        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 9.5h3.5L12 6v12L7.5 14.5H4z" fill="currentColor" stroke="none" />
                            <path d="M16 9.5l5 5M21 9.5l-5 5" />
                        </svg>
                    )}
                    {soundOn ? "Sound on" : "Sound off"}
                </button>
            </div>
        </div>
    )
}
