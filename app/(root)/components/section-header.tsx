import { cn } from "@/lib/utils";
import {
  motion,
  MotionStyle
} from "motion/react";

interface ISectionHeader {
  title: string;
  subtitle: string;
  align?: "left" | "center" | "right";
  style?: MotionStyle;
  className?: string;
  shouldAnimate?: boolean;
}

const SectionHeader = ({ title, subtitle, align = "left", style, className, shouldAnimate = true }: ISectionHeader) => {
  const splittedTitle = title.split(" ");

  const word =
    splittedTitle.length > 2
      ? splittedTitle.slice(0, splittedTitle.length - 1).join(" ")
      : splittedTitle[0];
  
  const styledWord = splittedTitle[splittedTitle.length - 1];

  return shouldAnimate ? (
    <motion.div
      style={style}
      className={cn("border-ocean-teal/30 mb-24 flex flex-col", className, {
        "items-start border-l-2 pl-6": align === "left",
        "items-center": align === "center",
        "items-end border-r-2 pr-6": align === "right",
      })}
    >
      <div className="mb-2 flex w-fit items-center gap-2">
        <div className="bg-ocean-teal size-1.5 animate-pulse rounded-full shadow-[0_0_8px_#14ffec]" />
        <h2 className="text-ocean-teal font-mono text-xs tracking-[0.3em] uppercase">
          {subtitle}
        </h2>
      </div>
      <h3 className="text-4xl font-bold tracking-tighter text-white uppercase md:text-6xl">
        {word}{" "}
        <span className="text-ocean-teal font-black drop-shadow-[0_0_15px_rgba(20,184,166,0.3)]">
          {styledWord}
        </span>
      </h3>
    </motion.div>
  ) : (
    <div
      className={cn("border-ocean-teal/30 mb-24 flex flex-col", className, {
        "items-start border-l-2 pl-6": align === "left",
        "items-center": align === "center",
        "items-end border-r-2 pr-6": align === "right",
      })}
    >
      <div className="mb-2 flex w-fit items-center gap-2">
        <div className="bg-ocean-teal size-1.5 animate-pulse rounded-full shadow-[0_0_8px_#14ffec]" />
        <h2 className="text-ocean-teal font-mono text-xs tracking-[0.3em] uppercase">
          {subtitle}
        </h2>
      </div>
      <h3 className="text-4xl font-bold tracking-tighter text-white uppercase md:text-6xl">
        {word}{" "}
        <span className="text-ocean-teal font-black drop-shadow-[0_0_15px_rgba(20,184,166,0.3)]">
          {styledWord}
        </span>
      </h3>
    </div>
  );
};

export default SectionHeader;
