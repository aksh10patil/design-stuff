"use client";

import React, { useRef } from "react";
import { Rocket, Sparkles, Sliders, Zap } from "lucide-react";
import { motion, useMotionTemplate, useScroll, useSpring, useTransform } from "motion/react";
import Image from "next/image";

type Feature = {
    icon: React.ReactNode;
    title: string;
    description: string;
    content: React.ReactNode;
    background: string;
};

const Features: Feature[] = [
    {
        icon: <Rocket className="w-8 h-8 text-white" strokeWidth={1.5} />,
        title: "Generate ultra realistic images in seconds",
        description: "With our state of the art AI, you can generate ultra realistic images in no time at all.",
        background: "#343434",
        content: (
            <div className="relative w-full h-full">
                <Image
                    src="/site_image/defender-western.jpg"
                    alt="Ultra realistic Land Rover Defender in an old Western ghost town"
                    fill
                    sizes="(max-width: 1024px) 100vw, 500px"
                    className="object-cover"
                    priority
                />
            </div>
        ),
    },
    {
        icon: <Sparkles className="w-8 h-8 text-white" strokeWidth={1.5} />,
        title: "Photorealistic architectural & interior renders",
        description: "Transform blueprints into immersive living spaces with natural volumetric lighting, depth of field, and ray-traced materials.",
        background: "#00193b",
        content: (
            <div className="relative w-full h-full">
                <Image
                    src="/site_image/villa-interior.jpg"
                    alt="Photorealistic modern luxury villa living room overlooking misty pine mountains"
                    fill
                    sizes="(max-width: 1024px) 100vw, 500px"
                    className="object-cover"
                />
            </div>
        ),
    },
    {
        icon: <Sliders className="w-8 h-8 text-white" strokeWidth={1.5} />,
        title: "Cinematic portraiture with studio-grade lighting",
        description: "Capture lifelike human expressions, skin pores, and dramatic chiaroscuro rim lighting with peerless character consistency.",
        background: "#05291c",
        content: (
            <div className="relative w-full h-full">
                <Image
                    src="/site_image/cinematic-portrait.jpg"
                    alt="Cinematic fashion portrait with studio key light and amber rim lighting"
                    fill
                    sizes="(max-width: 1024px) 100vw, 500px"
                    className="object-cover"
                />
            </div>
        ),
    },
    {
        icon: <Zap className="w-8 h-8 text-white" strokeWidth={1.5} />,
        title: "Futuristic concept hardware & industrial design",
        description: "Visualize cutting-edge physical product prototypes, aerodynamic supercars, and aerospace hardware with zero latency.",
        background: "#160a2c",
        content: (
            <div className="relative w-full h-full">
                <Image
                    src="/site_image/concept-hypercar.jpg"
                    alt="Futuristic aerodynamic concept hypercar in wind tunnel with laser streamlines"
                    fill
                    sizes="(max-width: 1024px) 100vw, 500px"
                    className="object-cover"
                />
            </div>
        ),
    },
];

function FeatureCard({ feature }: { feature: Feature }) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });

    const translateContent = useSpring(useTransform(scrollYProgress, [0, 1], [200, -300]), {
        mass: 1,
        damping: 30,
        stiffness: 100,
    });
    const opacityContent = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);

    const blur = useTransform(scrollYProgress, [0.5, 1], [0, 20]);
    const blurFilter = useMotionTemplate`blur(${blur}px)`;
    const scale = useTransform(scrollYProgress, [0.5, 1], [1, 0.8]);

    return (
        <div
            ref={ref}
            className="min-h-screen flex items-center justify-center py-20 relative overflow-hidden"
        >
            <div className="max-w-7xl w-full mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                {/* Left Side: Icon, Title, Description */}
                <motion.div
                    style={{
                        filter: blurFilter,
                        scale: scale,
                    }}
                    className="flex flex-col"
                >
                    <div className="mb-6 inline-flex items-center justify-center self-start">
                        {feature.icon}
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-[1.15] max-w-lg">
                        {feature.title}
                    </h2>
                    <p className="text-neutral-400 text-base sm:text-lg leading-relaxed mt-4 max-w-md">
                        {feature.description}
                    </p>
                </motion.div>

                {/* Right Side: Animated Image Card using translateContent & opacityContent */}
                <div className="flex justify-center lg:justify-end">
                    <motion.div
                        style={{
                            y: translateContent,
                            opacity: opacityContent,
                        }}
                        className="w-full max-w-[400px] aspect-square rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-neutral-900 relative"
                    >
                        {feature.content}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

export default function MotionHooksExample() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    // Each feature defines its own unique background; as you scroll, the screen smoothly blends between them
    const backgroundColor = useTransform(
        scrollYProgress,
        Features.map((_, i) => i / (Features.length - 1)),
        Features.map((f) => f.background)
    );

    return (
        <motion.section
            ref={containerRef}
            style={{ backgroundColor }}
            className="w-full text-white selection:bg-white selection:text-black min-h-screen"
        >
            <div className="flex flex-col">
                {Features.map((feature, idx) => (
                    <FeatureCard key={idx} feature={feature} />
                ))}
            </div>
        </motion.section>
    );
}
