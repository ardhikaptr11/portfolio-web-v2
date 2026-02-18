"use client";

import { cn } from "@/lib/utils";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Step, { IStepItem } from "../step-item";
import SectionHeader from "../section-header";
import { useTranslations } from "next-intl";

const Timeline = ({
  steps,
  isContinuation,
}: {
  steps: IStepItem[];
  isContinuation?: boolean;
}) => {
  const t = useTranslations("Journey");
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.5", "end end"],
  });

  const pathLength = useTransform(scrollYProgress, [0.2, 1], [0, 1]);

  return (
    <section
      ref={containerRef}
      className={cn("bg-ocean-surface overflow-hidden px-6 py-0", {
        "pt-32": !isContinuation,
      })}
      style={{ position: "relative" }}
      {...(!isContinuation && { id: "about" })}
    >
      <div className="mx-auto max-w-6xl">
        {!isContinuation && (
          <SectionHeader
            title={t("title")}
            subtitle={t("subtitle")}
            style={{
              opacity: useTransform(scrollYProgress, [0, 0.18], [0, 1]),
              y: useTransform(scrollYProgress, [0, 0.18], [25, 0]),
              filter: useTransform(
                scrollYProgress,
                [0, 0.14],
                ["blur(10px)", "blur(0px)"],
              ),
            }}
          />
        )}

        <div className="relative pt-24 md:pt-40">
          <svg
            className="absolute top-0 left-1/2 z-0 h-full w-2 -translate-x-1/2"
            viewBox="0 0 2 100"
            preserveAspectRatio="none"
          >
            <rect
              x="0"
              y="0"
              width="2"
              height="100"
              className="fill-slate-800/40"
            />

            <motion.rect
              x="0"
              y="0"
              width="2"
              height="105"
              className="fill-ocean-teal"
              style={{
                scaleY: pathLength,
                originY: 0,
                filter: "drop-shadow(0 0 12px #14ffec)",
              }}
            />
          </svg>

          <div className="space-y-40">
            {steps.map((step, index) => (
              <Step
                key={index}
                step={step}
                index={index}
                total={steps.length}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Timeline;
