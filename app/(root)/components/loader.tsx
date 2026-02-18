"use client";

import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { IProfile } from "../types/data";
import { OpacityTransition, Transition } from "./transitions";

interface LoaderProps {
  tagline: IProfile["tagline"];
  animateOut: boolean;
  onFinish?: () => void;
  onCounterDone?: () => void;
}

const Loader = ({
  tagline,
  animateOut,
  onFinish,
  onCounterDone,
}: LoaderProps) => {
  const [counter, setCounter] = useState(0);
  const [dots, setDots] = useState(1);

  useEffect(() => {
    const count = setInterval(() => {
      setCounter((prev) => {
        const next = prev + 2;
        if (next >= 100) {
          clearInterval(count);

          if (onCounterDone) setTimeout(() => onCounterDone(), 0);
          return 100;
        }

        return next;
      });
    }, 100);

    return () => clearInterval(count);
  }, [onCounterDone]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((d) => (d === 3 ? 1 : d + 1));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const loadingText = useMemo(() => {
    if (counter <= 10) return `Waking the bioluminescence${".".repeat(dots)}`;
    if (counter < 50) return `Descending into the deep blue${".".repeat(dots)}`;
    if (counter <= 95)
      return `Finding light in the silent depths${".".repeat(dots)}`;
    if (counter > 95) return "Welcome to the deep!";
  }, [counter, dots]);

  return (
    <motion.div
      initial={{ y: 0 }}
      animate={animateOut ? { y: "-100%" } : { y: 0 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      onAnimationComplete={() => {
        if (animateOut && onFinish) onFinish();
      }}
      className="bg-ocean-surface fixed top-0 left-0 z-9999 size-full overflow-hidden"
    >
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 z-0"
            animate={{
              scale: [0.8, 1.5, 2.2],
              opacity: [0, 0.2, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              delay: i * 2,
              ease: "linear",
            }}
            style={{
              background: `radial-gradient(circle, rgba(20, 184, 166, 0.2) 0%, transparent 60%)`,
              willChange: "transform, opacity",
            }}
          />
        ))}

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(20,184,166,0.05)_0%,transparent_100%)]" />
      </div>

      <div className="relative z-10 flex size-full flex-col p-4 max-md:gap-8 md:justify-between md:p-10">
        <Transition transition={{ delay: 0.2 }}>
          <h3 className="font-display text-foreground logo-tracking text-2xl font-bold md:text-3xl">
            AP
            <span className="text-ocean-teal animate-pulse" aria-hidden="true">
              .
            </span>
          </h3>
        </Transition>

        <div className="flex flex-col max-md:h-full max-md:justify-between">
          <Transition transition={{ delay: 0.4 }}>
            <div className="w-full text-2xl leading-tight font-light tracking-tight md:w-3/5 md:text-4xl">
              <OpacityTransition>
                {`Welcome to the workshop below the waves —\n${tagline}`}
              </OpacityTransition>
            </div>
          </Transition>

          <div className="mt-12 flex flex-col gap-4">
            <div className="mb-2 flex items-end justify-between">
              <span
                className="text-ocean-teal/80 text-sm md:text-xl"
                role="status"
              >
                {loadingText}
              </span>
              <motion.span className="to-ocean-teal bg-linear-to-r from-white bg-clip-text text-6xl font-black text-transparent drop-shadow-[0_0_20px_rgba(20,184,166,0.3)] md:text-8xl">
                {counter}%
              </motion.span>
            </div>

            <div className="w-full">
              <Progress value={counter} aria-label="Loading progress" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Loader;
