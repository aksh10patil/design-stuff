"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import type { PointerEvent } from "react";

const clamp = (value: number) => Math.max(-1, Math.min(1, value));

export const Grok = () => {
  const botRef = useRef<HTMLDivElement>(null);
  const pointerX = useMotionValue(-1);
  const pointerY = useMotionValue(-1);
  const smoothX = useSpring(pointerX, {
    stiffness: 180,
    damping: 18,
    mass: 0.35,
  });
  const smoothY = useSpring(pointerY, {
    stiffness: 180,
    damping: 18,
    mass: 0.35,
  });
  const eyeX = useTransform(smoothX, [-1, 1], [-11, 11]);
  const eyeY = useTransform(smoothY, [-1, 1], [-7, 7]);
  const tiltX = useTransform(smoothY, [-1, 1], [4, -4]);
  const tiltY = useTransform(smoothX, [-1, 1], [-5, 5]);

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    const rect = botRef.current?.getBoundingClientRect();

    if (!rect) {
      return;
    }

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    pointerX.set(clamp((event.clientX - centerX) / (rect.width * 0.45)));
    pointerY.set(clamp((event.clientY - centerY) / (rect.height * 0.45)));
  };

  const resetEyes = () => {
    pointerX.set(-1);
    pointerY.set(-1);
  };

  return (
    <motion.section
      className="flex min-h-screen items-center justify-center bg-[#090909] px-4 py-10"
      onPointerLeave={resetEyes}
      onPointerMove={handlePointerMove}
    >
      <div className="relative h-[352px] w-full max-w-[1230px]">
        <div className="absolute inset-0 rounded-[22px] bg-[#191919] shadow-[0_28px_90px_rgba(0,0,0,0.45)]" />

        <div
          aria-hidden="true"
          className="absolute top-[-160px] right-[-140px] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(124,247,255,0.24),transparent_62%)]"
        />

        <div className="absolute top-8 right-6 left-6 z-20 max-w-[440px] lg:top-1/2 lg:right-auto lg:left-12 lg:max-w-[480px] lg:-translate-y-1/2">
          <h1 className="text-3xl text-white">Message Bots like teammates</h1>

          <p className="mt-5 text-lg leading-[1.6] text-[#858585]">
            Give tasks to Bots like you would a teammate on desktop or iOS. They
            take projects from start to end, keep context on how you work and
            get smarter over time.
          </p>
        </div>

        <motion.div
          ref={botRef}
          className="absolute top-[-40px] right-[-10px] z-10 h-[430px] w-[430px] rounded-full"
          style={{
            rotateX: tiltX,
            rotateY: tiltY,
            transformStyle: "preserve-3d",
          }}
        >
          <div
            aria-hidden="true"
            className="absolute -inset-10 z-0 rounded-full"
          >
            <div className="absolute top-0 left-1/2 h-7 w-7 -translate-x-1/2 rounded-full bg-[#7cf7ff] shadow-[0_0_28px_rgba(124,247,255,0.88)]" />
          </div>

          <div
            aria-hidden="true"
            className="absolute -inset-6 z-20 rounded-full"
          >
            <div className="absolute bottom-8 left-8 h-5 w-5 rounded-full bg-[#ffcf5d] shadow-[0_0_24px_rgba(255,207,93,0.85)]" />
          </div>

          <div className="absolute inset-0 z-10 rounded-full bg-white shadow-[inset_-36px_-36px_70px_rgba(0,0,0,0.08)]" />

          <motion.div
            className="absolute top-[38%] left-[41%] z-20 h-[88px] w-[32px] rounded-full bg-[#191919] sm:h-[98px] sm:w-[36px] lg:top-[160px] lg:left-[175px] lg:h-[105px] lg:w-[38px]"
            style={{ x: eyeX, y: eyeY, rotate: 15 }}
          />

          <motion.div
            className="absolute top-[35%] left-[66%] z-20 h-[82px] w-[32px] rounded-full bg-[#191919] sm:h-[92px] sm:w-[36px] lg:top-[145px] lg:left-[285px] lg:h-[95px] lg:w-[38px]"
            style={{ x: eyeX, y: eyeY, rotate: -38 }}
          />
        </motion.div>

        <div className="absolute top-[352px] right-0 left-0 z-30 h-[100px] bg-[#090909]" />
      </div>
    </motion.section>
  );
};
