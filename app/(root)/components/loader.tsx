"use client";

import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { IHero } from "../types/data";
import { OpacityTransition, Transition } from "./transitions";
import { useLocale, useTranslations } from "next-intl";
import { Icons } from "@/components/icons";

interface LoaderProps {
  taglines: { tagline: string; tagline_id: string };
  animateOut: boolean;
  onFinish?: () => void;
  onCounterDone?: () => void;
}

const Loader = ({
  taglines,
  animateOut,
  onFinish,
  onCounterDone,
}: LoaderProps) => {
  const t = useTranslations("Loader");
  const locale = useLocale();

  const [counter, setCounter] = useState(0);
  const [dots, setDots] = useState(1);

  const tagline = locale === "id" ? taglines.tagline_id : taglines.tagline;

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
    if (counter <= 10) return `${t("loading-texts.text1")}${".".repeat(dots)}`;
    if (counter < 50) return `${t("loading-texts.text2")}${".".repeat(dots)}`;
    if (counter <= 95) return `${t("loading-texts.text3")}${".".repeat(dots)}`;
    if (counter > 95) return t("loading-texts.text4");
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
              background:
                "radial-gradient(circle, color-mix(in oklch, var(--ocean-teal), transparent 80%) 0%, transparent 60%)",
              willChange: "transform, opacity",
            }}
          />
        ))}

        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, color-mix(in oklch, var(--ocean-teal), transparent 95%) 0%, transparent 100%)",
          }}
        />
      </div>

      <div className="relative z-10 flex size-full flex-col p-4 max-md:gap-8 md:justify-between md:p-10">
        <Transition transition={{ delay: 0.2 }}>
          <Icons.brandLogo className="text-ocean-blue dark:text-foreground" />
        </Transition>

        <div className="flex flex-col max-md:h-full max-md:justify-between">
          <Transition transition={{ delay: 0.4 }}>
            <div className="w-full text-2xl leading-tight font-light tracking-tight md:w-3/5 md:text-4xl">
              <OpacityTransition>
                {`${t("welcome-message")} —\n${tagline}`}
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
              <motion.span className="to-ocean-teal bg-linear-to-r from-white bg-clip-text text-6xl font-black text-transparent drop-shadow-glow md:text-8xl">
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
