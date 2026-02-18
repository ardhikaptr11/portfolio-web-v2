"use client";

import { cn } from "@/lib/utils";
import {
  AnimatePresence,
  motion,
  useScroll,
  UseScrollOptions,
  useTransform,
} from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { SERVICES } from "../../constants/items.constants";
import SectionHeader from "../section-header";
import { useTranslations } from "next-intl";

const Services = () => {
  const [activeTab, setActiveTab] = useState(SERVICES[0].key);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // The animation start when the top of the element just appears from the bottom of the screen
  const offset: UseScrollOptions["offset"] = ["start end", "end start"];

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset,
  });
  const t = useTranslations("Services");

  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  const nextTab = useCallback(() => {
    setActiveTab((current) => {
      const currentIndex = SERVICES.findIndex((s) => s.key === current);
      const nextIndex = (currentIndex + 1) % SERVICES.length;
      return SERVICES[nextIndex].key;
    });
  }, []);

  const startIdleTimer = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);

    idleTimerRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 8000);
  }, []);

  // Autoplay
  useEffect(() => {
    if (!isPaused) {
      autoPlayTimerRef.current = setInterval(nextTab, 8000);
    } else {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    }

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [isPaused, nextTab]);

  const handleClick = (id: string) => {
    setIsPaused(true);

    if (activeTab !== id) setActiveTab(id);

    startIdleTimer();
  };

  return (
    <section id="services" ref={containerRef} className="">
      <motion.div
        style={{
          opacity: useTransform(scrollYProgress, [0.1, 0.25], [0, 1]),
          y: useTransform(scrollYProgress, [0.1, 0.25], [40, 0]),
          filter: useTransform(
            scrollYProgress,
            [0.1, 0.25],
            ["blur(10px)", "blur(0px)"],
          ),
        }}
        className="mx-auto max-w-6xl px-6 pt-32"
      >
        <SectionHeader
          title={t("title")}
          subtitle={t("subtitle")}
          align="left"
          style={{
            opacity: useTransform(scrollYProgress, [0.1, 0.25], [0, 1]),
            y: useTransform(scrollYProgress, [0.1, 0.25], [40, 0]),
            filter: useTransform(
              scrollYProgress,
              [0.1, 0.25],
              ["blur(10px)", "blur(0px)"],
            ),
          }}
          shouldAnimate
          className="mb-12!"
        />

        <div className="flex flex-col gap-1 md:h-125 md:flex-row md:items-stretch">
          {SERVICES.map((service, index) => {
            const isActive = activeTab === service.key;

            return (
              <div
                key={service.key}
                onClick={() => handleClick(service.key)}
                className={cn(
                  "border-ocean-teal/10 relative flex flex-col overflow-hidden border transition-all duration-700 ease-in-out",
                  isActive
                    ? "bg-ocean-teal/3 flex-3 md:flex-4"
                    : "bg-secondary/20 hover:bg-ocean-teal/5 flex-1",
                )}
              >
                {/* Progress Bar */}
                {isActive && !isPaused && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    key={`progress-${index + 1}`}
                    transition={{ duration: 8, ease: "linear" }}
                    className="bg-ocean-teal absolute top-0 left-0 z-20 h-0.5"
                  />
                )}

                {/* Vertical Title */}
                <div
                  className={cn(
                    "border-ocean-teal/10 absolute top-0 left-0 hidden h-full w-16 items-center justify-center border-r md:flex",
                    isActive
                      ? "bg-ocean-teal text-white/60"
                      : "text-ocean-teal/40 bg-transparent",
                  )}
                >
                  <p className="rotate-180 font-mono text-[10px] font-black tracking-[0.5em] uppercase [writing-mode:vertical-lr]">
                    {t(`services.${service.key}.title`)}
                  </p>
                </div>

                {/* Content Area */}
                <div
                  className={cn(
                    "flex h-full flex-col p-8 md:pl-24",
                    !isActive && "md:pointer-events-none md:opacity-0",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <p className="text-ocean-teal/20 font-mono text-4xl font-black italic">
                        {`0${index + 1}`}
                      </p>

                      {/* Minimalist Status Indicator */}
                      <AnimatePresence mode="wait">
                        {isActive && isPaused && (
                          <motion.div
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -5 }}
                            transition={{ duration: 0.1, ease: "circOut" }}
                            className="flex w-fit items-center gap-2"
                          >
                            <div className="bg-ocean-teal size-1.5 rounded-full" />
                            <motion.p
                              animate={{ opacity: [0.2, 1, 0.2] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                              className="text-ocean-teal font-mono text-[9px] uppercase"
                            >
                              Interrupted
                            </motion.p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Dynamic Animated Line */}
                    <div className="relative flex flex-1 items-center justify-end px-6">
                      <motion.div
                        initial={false}
                        animate={{
                          width: isActive ? (isPaused ? "90%" : "100%") : "0%",
                        }}
                        transition={{
                          duration: isActive ? 0.6 : 1,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        className="bg-ocean-teal/20 shadow-ocean-glow h-px"
                      />
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="mt-8 flex h-full flex-col justify-between"
                      >
                        <div>
                          <h4 className="text-3xl font-black tracking-tighter text-white uppercase md:text-5xl">
                            {t(`services.${service.key}.title`).split(" ")[0]}{" "}
                            <br />
                            <span className="text-ocean-teal">
                              {t(`services.${service.key}.title`)
                                .split(" ")
                                .slice(1)
                                .join(" ")}
                            </span>
                          </h4>
                          <p className="text-muted-foreground mt-6 max-w-md text-sm leading-relaxed">
                            {t(`services.${service.key}.description`)}
                          </p>
                        </div>

                        {/* Tech Stack Grid */}
                        <div className="border-ocean-teal/10 mt-auto grid grid-cols-2 gap-x-6 gap-y-4 border-t pt-8 md:grid-cols-4">
                          {service.techStack.map((tech, idx) => (
                            <motion.div
                              key={tech}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.05 + 0.3 }}
                              className="group/item border-ocean-teal/20 hover:border-ocean-teal relative flex flex-col gap-1 border-l-2 py-1 pl-4 transition-all"
                            >
                              <p className="text-ocean-teal/40 font-mono text-[8px] font-bold tracking-widest uppercase">
                                Stack {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                              </p>
                              <p className="text-foreground group-hover/item:text-ocean-teal font-mono text-[11px] font-black tracking-wider uppercase">
                                {tech}
                              </p>
                              <div className="flex gap-1 pt-1 opacity-30 group-hover/item:opacity-100">
                                <div className="bg-ocean-teal size-0.75 rounded-full" />
                                <div className="bg-ocean-teal/40 size-0.75 rounded-full" />
                                <div className="bg-ocean-teal/10 size-0.75 rounded-full" />
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Mobile Header */}
                {!isActive && (
                  <div className="flex items-center justify-between p-6 md:hidden">
                    <p className="text-ocean-teal font-mono text-xs font-black tracking-widest uppercase">
                      {t(`services.${service.key}.title`)}
                    </p>
                    <p className="text-ocean-teal/20 font-mono text-lg font-black">
                      {`0${index + 1}`}
                    </p>
                  </div>
                )}

                {/* Decorative Scan Line */}
                {isActive && (
                  <motion.div
                    className="bg-ocean-teal/20 shadow-ocean-glow absolute top-0 right-0 h-full w-px"
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
};

export default Services;
