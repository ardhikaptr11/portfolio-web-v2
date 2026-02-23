"use client";

import { Fragment } from "react";
import CountingNumber from "./counting-number";
import IconWheel from "./icon-wheel";
import { cn } from "@/lib/utils";
import { useLocale } from "next-intl";

const TRANSLATIONS: Record<string, Record<string, string[]>> = {
  en: {
    yoe: ["Years", "of Experience"],
    projects: ["Projects", "Done"],
    tech: ["Favorite", "Technology"],
  },
  id: {
    yoe: ["Tahun", "Pengalaman"],
    projects: ["Proyek", "Selesai"],
    tech: ["Teknologi", "Favorit"],
  },
};

const Stats = () => {
  const locale = useLocale();

  return (
    <Fragment>
      {/* Years of Experience */}
      <div className="group flex min-w-18.75 flex-col items-center justify-center gap-y-1.5 md:min-w-22.5 md:gap-y-2 lg:min-w-27.5 xl:min-w-32.5">
        <div className="flex items-baseline justify-center">
          <CountingNumber
            number={2}
            className={cn(
              "from-ocean-teal to-ocean-surface bg-linear-to-b bg-clip-text font-black tracking-tighter text-transparent dark:from-white dark:to-neutral-400",
              "text-4xl lg:text-5xl xl:text-6xl",
            )}
            transition={{ stiffness: 10, damping: 12, mass: 1 }}
          />
          <span className="text-ocean-teal ml-0.5 text-xl font-bold lg:text-2xl xl:text-3xl">
            +
          </span>
        </div>
        <p className="text-ocean-teal text-center text-[8px] font-bold tracking-widest uppercase opacity-70 md:text-[10px] lg:text-xs">
          {TRANSLATIONS[locale].yoe[0]} <br />
          {TRANSLATIONS[locale].yoe[1]}
        </p>
      </div>

      <div className="via-ocean-teal/30 mx-1 h-16 w-px bg-linear-to-b from-transparent to-transparent xl:hidden" />

      {/* Total Projects */}
      <div className="group flex min-w-18.75 flex-col items-center justify-center gap-y-1.5 md:min-w-22.5 md:gap-y-2 lg:min-w-27.5 xl:min-w-32.5">
        <div className="flex items-baseline justify-center">
          <CountingNumber
            number={5}
            className={cn(
              "from-ocean-teal to-ocean-surface bg-linear-to-b bg-clip-text font-black tracking-tighter text-transparent dark:from-white dark:to-neutral-400",
              "text-4xl lg:text-5xl xl:text-6xl",
            )}
            transition={{ stiffness: 10, damping: 12, mass: 1 }}
          />
          <span className="text-ocean-teal ml-0.5 text-xl font-bold lg:text-2xl xl:text-3xl">
            +
          </span>
        </div>
        <p className="text-ocean-teal text-center text-[8px] font-bold tracking-widest uppercase opacity-70 md:text-[10px] lg:text-xs">
          {TRANSLATIONS[locale].projects[0]} <br />
          {TRANSLATIONS[locale].projects[1]}
        </p>
      </div>

      <div className="via-ocean-teal/30 mx-1 h-16 w-px bg-linear-to-b from-transparent to-transparent xl:hidden" />

      {/* Icon Wheel */}
      <div className="group flex min-w-18.75 flex-col items-center justify-center gap-y-1.5 md:min-w-22.5 md:gap-y-2 lg:min-w-27.5 xl:min-w-32.5">
        <div className="flex h-9 items-center justify-center lg:h-12 xl:h-15">
          <IconWheel targetIndex={5} />
        </div>
        <p className="text-ocean-teal text-center text-[8px] font-bold tracking-widest uppercase opacity-70 md:text-[10px] lg:text-xs">
          {TRANSLATIONS[locale].tech[0]} <br />
          {TRANSLATIONS[locale].tech[1]}
        </p>
      </div>
    </Fragment>
  );
};

export default Stats;
