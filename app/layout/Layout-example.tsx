"use client";

import { useEffect, useId, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";



type Card = {
    description: string;
    title: string;
    src: string;
    ctaText: string;
    ctaLink: string;
    content: () => React.ReactNode;
}


const cards: Card[] = [
    {
        description: "Lana Del Rey",
        title: "Ride",
        src: "/img/lanadelrey.jpg",
        ctaText: "Play",
        ctaLink: "https://open.spotify.com/album/5Voe90P1v0qVj5f5cQW5tM",
        content: () => {
            return (
                <p>
                    Featured on her iconic <em>Paradise</em> EP, &ldquo;Ride&rdquo; is the ultimate embodiment
                    of Lana Del Rey&rsquo;s cinematic Americana and melancholic grandiosity. Set against lush
                    orchestral strings and vintage Hollywood noir, the record explores tragic romance,
                    untamed road-trip wanderlust, and the intoxicating pursuit of personal freedom.
                </p>
            );
        },
    },
    {
        description: "The 1975",
        title: "Robbers",
        src: "/img/the1975.jpg",
        ctaText: "Play",
        ctaLink: "https://open.spotify.com/album/4deqBzhB2k94wN6A52Q7dY",
        content: () => {
            return (
                <p>
                    The 1975&rsquo;s self-titled 2013 debut defined a generation with its monochrome neon aesthetic
                    and anthemic heartbreak. Highlighted by the tender chaos of &ldquo;Robbers&rdquo; and the funk-infused
                    pulse of &ldquo;Chocolate&rdquo;, the album crystallizes youth culture, reckless love, and late-night
                    British angst under flickering neon signs.
                </p>
            );
        },
    },
    {
        description: "The Weeknd",
        title: "Blinding Lights",
        src: "/img/theweeknd.jpg",
        ctaText: "Play",
        ctaLink: "https://open.spotify.com/album/4yP0hdKOZPNshxUOjY0cZj",
        content: () => {
            return (
                <p>
                    With <em>After Hours</em>, The Weeknd engineered a cinematic masterpiece that revitalized 1980s
                    synthwave and electro-pop. Depicting a battered, red-suited protagonist spiraling through the
                    hallucinatory neon underworld of Las Vegas, the album delivered record-shattering hits exploring
                    loneliness, self-destruction, and fatal attraction.
                </p>
            );
        },
    },
    {
        description: "Lord Huron",
        title: "The Night We Met",
        src: "/img/lordhuron.jpg",
        ctaText: "Play",
        ctaLink: "https://open.spotify.com/track/0QZ5hao8XM4JNnRsgG0ZG6",
        content: () => {
            return (
                <p>
                    From their 2015 concept album <em>Strange Trails</em>, &ldquo;The Night We Met&rdquo; is Lord Huron&rsquo;s
                    haunting, timeless indie-folk masterpiece. Formatted with vintage vinyl fidelity, its warm acoustic
                    fingerpicking and ghostly reverbs tell an enduring tale of grief, memory, and longing across
                    the moonlit American west.
                </p>
            );
        },
    },
];

export const LayoutCards = () => {
    const [current, setCurrent] = useState<Card | null>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const id = useId();

    // Close on Escape key or outside click and lock background scroll when card is open
    useEffect(() => {
        function onKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setCurrent(null);
            }
        }
        function onPointerDown(event: MouseEvent | TouchEvent) {
            if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
                setCurrent(null);
            }
        }
        if (current) {
            document.body.style.overflow = "hidden";
            window.addEventListener("keydown", onKeyDown);
            document.addEventListener("mousedown", onPointerDown);
            document.addEventListener("touchstart", onPointerDown);
        } else {
            document.body.style.overflow = "auto";
        }
        return () => {
            window.removeEventListener("keydown", onKeyDown);
            document.removeEventListener("mousedown", onPointerDown);
            document.removeEventListener("touchstart", onPointerDown);
        };
    }, [current]);

    return (
        <div className="py-24 sm:py-32 bg-neutral-100 min-h-screen relative px-4">
            {/* Expanded Modal Card */}
            <AnimatePresence>
                {current && (
                    <div className="fixed inset-0 grid place-items-center z-50 p-4">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
                        />

                        {/* Modal Card */}
                        <motion.div
                            layoutId={`card-${current.title}-${id}`}
                            ref={cardRef}

                            className="w-full max-w-[500px] max-h-[90vh] bg-white rounded-3xl overflow-hidden shadow-2xl border border-neutral-200 flex flex-col z-10 relative"
                        >


                            {/* Full-width Album Cover */}
                            <motion.img
                                layoutId={`image-${current.title}-${id}`}
                                src={current.src}
                                alt={current.title}
                                className="w-full h-72 rounded-md sm:h-80 object-cover object-top shrink-0 bg-neutral-100"
                            />

                            {/* Header Row: Title + Artist on Left, Play CTA on Right */}
                            <div className="p-6 flex flex-col">
                                <div className="flex justify-between items-center gap-4">
                                    <div className="flex flex-col items-start">
                                        <motion.h2
                                            layoutId={`title-${current.title}-${id}`}
                                            className="font-bold text-xl sm:text-2xl text-neutral-900 leading-snug"
                                        >
                                            {current.title}
                                        </motion.h2>
                                        <motion.p
                                            layoutId={`description-${current.title}-${id}`}
                                            className="text-sm text-neutral-500 font-medium"
                                        >
                                            {current.description}
                                        </motion.p>
                                    </div>

                                    <motion.a
                                        layoutId={`button-${current.title}-${id}`}
                                        href={current.ctaLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full text-xs font-semibold tracking-wide transition-colors shadow-sm inline-block cursor-pointer shrink-0"
                                    >
                                        {current.ctaText}
                                    </motion.a>
                                </div>

                                {/* Scrollable Story / Content */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2, delay: 0.05 }}
                                    className="mt-4 pt-4 border-t border-neutral-100 max-h-48 overflow-y-auto text-sm text-neutral-600 leading-relaxed"
                                >
                                    {current.content()}
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* List of Cards */}
            <div className="max-w-lg mx-auto flex flex-col gap-4">
                {cards.map((card) => (
                    <motion.div
                        layoutId={`card-${card.title}-${id}`}
                        key={card.title}
                        onClick={() => setCurrent(card)}
                        className="p-4 rounded-2xl flex justify-between items-center bg-white hover:bg-neutral-50 border border-neutral-100 shadow-sm hover:shadow-md transition-colors cursor-pointer text-left"
                    >
                        <div className="flex gap-4 items-center">
                            <motion.img
                                layoutId={`image-${card.title}-${id}`}
                                src={card.src}
                                alt={card.title}
                                className="h-14 w-14 rounded-xl object-cover shrink-0"
                            />
                            <div className="flex flex-col items-start">
                                <motion.h2
                                    layoutId={`title-${card.title}-${id}`}
                                    className="font-bold text-base text-neutral-900"
                                >
                                    {card.title}
                                </motion.h2>
                                <motion.p
                                    layoutId={`description-${card.title}-${id}`}
                                    className="text-xs text-neutral-500 font-medium"
                                >
                                    {card.description}
                                </motion.p>
                            </div>
                        </div>

                        <motion.button
                            layoutId={`button-${card.title}-${id}`}
                            className="px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-full text-xs font-semibold transition-colors shadow-xs shrink-0 cursor-pointer"
                        >
                            {card.ctaText}
                        </motion.button>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default LayoutCards;
