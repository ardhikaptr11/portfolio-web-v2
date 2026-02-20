"use client";

import { cn } from "@/lib/utils";
import {
  motion,
  MotionValue,
  useMotionValueEvent,
  useTransform,
} from "framer-motion";
import { useTranslations } from "next-intl";
import { useState } from "react";

export interface IStepItem {
  id: string;
  status: string;
}

const StepItem = ({
  step,
  index,
  total,
  scrollYProgress,
}: {
  step: IStepItem;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}) => {
  const t = useTranslations("Journey.steps");

  const [hasFlowReached, setHasFlowReached] = useState(false);
  const isEven = index % 2 === 0;

  const smoothRange = 0.08;
  const lineStart = 0.2;
  const startGap = 0.05;
  const activationPoint =
    lineStart + startGap + (index / (total - 1)) * (1 - lineStart - startGap);

  useMotionValueEvent(scrollYProgress, "change", (latest: number) => {
    setHasFlowReached(latest >= activationPoint);
  });

  const contentOpacity = useTransform(
    scrollYProgress,
    [activationPoint - smoothRange, activationPoint],
    [0, 1],
  );

  const contentX = useTransform(
    scrollYProgress,
    [activationPoint - smoothRange, activationPoint],
    [isEven ? -30 : 30, 0],
  );

  const isCompleted = step.status === "Completed";
  const isActive = step.status === "Active";
  const isPlanned = step.status === "Planned";
  const shouldShowLight = hasFlowReached && (isCompleted || isActive);

  return (
    <div
      className={cn(
        "relative z-10 flex w-full flex-col items-center justify-center gap-8 md:gap-0",
        isEven ? "md:flex-row" : "md:flex-row-reverse",
      )}
    >
      <motion.div
        initial={{ opacity: 0, x: isEven ? -30 : 30 }}
        style={{ opacity: contentOpacity, x: contentX }}
        className={cn(
          "w-full px-4 text-left max-md:z-50 max-md:max-w-md max-md:rounded-lg max-md:border max-md:py-4 max-md:text-center max-md:backdrop-blur-xl md:w-1/2",
          "max-md:bg-card/40 max-md:border-border max-md:shadow-sm",
          isEven ? "md:pr-16 md:text-right" : "md:pl-16 md:text-left",
          {
            "mb-8": index === total - 1,
            "max-md:border-ocean-teal/30 max-md:shadow-glow":
              hasFlowReached,
          },
        )}
      >
        {!isPlanned && (
          <span className="text-ocean-teal/70 mb-1 block font-mono text-[9px] tracking-widest uppercase">
            {t(`${step.id}.time`)}
          </span>
        )}

        <span className="text-muted-foreground font-mono text-[10px] tracking-widest uppercase transition-colors">
          {t(`${step.id}.period`)} —{" "}
          <span
            className={cn("transition-colors", {
              "text-ocean-teal underline decoration-dotted underline-offset-4":
                isActive && hasFlowReached,
            })}
          >
            {t(`${step.id}.status`)}
          </span>
        </span>
        <h4
          className={cn(
            "mt-1 mb-3 text-xl font-semibold tracking-tight uppercase transition-colors",
            hasFlowReached ? "text-foreground" : "text-muted-foreground/50",
          )}
        >
          {t(`${step.id}.title`)}
        </h4>
        <p className="text-muted-foreground mx-auto text-sm leading-relaxed md:mx-0">
          {t(`${step.id}.description`)}
        </p>
      </motion.div>

      <div className="absolute left-1/2 flex -translate-x-1/2 items-center justify-center">
        <div
          className={cn(
            "bg-ocean-surface relative z-20 flex size-10 items-center justify-center rounded-full border-2 transition-all duration-300",
            shouldShowLight
              ? "border-ocean-teal shadow-glow scale-110"
              : "border-border scale-100",
          )}
        >
          {isActive && hasFlowReached && (
            <motion.div
              animate={{
                scale: [1, 1.8, 1],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                repeat: Infinity,
                duration: 2.5,
                ease: "easeInOut",
              }}
              className="bg-ocean-teal absolute inset-0 rounded-full blur-xs"
            />
          )}

          <div
            className={cn(
              "size-3.5 rounded-full transition-all duration-300",
              shouldShowLight
                ? "bg-ocean-teal shadow-glow"
                : "bg-ocean-teal/10",
            )}
          />
        </div>
      </div>

      <div className="hidden md:block md:w-1/2" />
    </div>
  );
};

export default StepItem;
