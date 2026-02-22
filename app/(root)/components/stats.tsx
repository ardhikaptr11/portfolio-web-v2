import { Fragment } from "react";
import CountingNumber from "./counting-number";
import IconWheel from "./icon-wheel";
import { cn } from "@/lib/utils";

const Stats = () => {
  return (
    <Fragment>
      {/* Years of Experience */}
      <div className="group flex min-w-18.75 flex-col items-center justify-center gap-y-1.5 md:min-w-22.5 md:gap-y-2 lg:min-w-27.5 xl:min-w-32.5">
        <div className="flex items-baseline justify-center">
          <CountingNumber
            number={2}
            className={cn(
              "bg-linear-to-b from-white to-neutral-400 bg-clip-text font-black tracking-tighter text-transparent",
              "text-4xl lg:text-5xl xl:text-6xl",
            )}
            transition={{ stiffness: 10, damping: 12, mass: 1 }}
          />
          <span className="text-ocean-teal ml-0.5 text-xl font-bold lg:text-2xl xl:text-3xl">
            +
          </span>
        </div>
        <p className="text-ocean-teal text-center text-[8px] font-bold tracking-widest uppercase opacity-70 md:text-[10px] lg:text-xs">
          Years <br /> of Experience
        </p>
      </div>

      <div className="via-ocean-teal/30 h-16 w-px bg-linear-to-b from-transparent to-transparent xl:hidden mx-1" />

      {/* Total Projects */}
      <div className="group flex min-w-18.75 flex-col items-center justify-center gap-y-1.5 md:min-w-22.5 md:gap-y-2 lg:min-w-27.5 xl:min-w-32.5">
        <div className="flex items-baseline justify-center">
          <CountingNumber
            number={5}
            className={cn(
              "bg-linear-to-b from-white to-neutral-400 bg-clip-text font-black tracking-tighter text-transparent",
              "text-4xl lg:text-5xl xl:text-6xl",
            )}
            transition={{ stiffness: 10, damping: 12, mass: 1 }}
          />
          <span className="text-ocean-teal ml-0.5 text-xl font-bold lg:text-2xl xl:text-3xl">
            +
          </span>
        </div>
        <p className="text-ocean-teal text-center text-[8px] font-bold tracking-widest uppercase opacity-70 md:text-[10px] lg:text-xs">
          Projects <br /> Done
        </p>
      </div>

      <div className="via-ocean-teal/30 h-16 w-px bg-linear-to-b from-transparent to-transparent xl:hidden mx-1" />

      {/* Icon Wheel */}
      <div className="group flex min-w-18.75 flex-col items-center justify-center gap-y-1.5 md:min-w-22.5 md:gap-y-2 lg:min-w-27.5 xl:min-w-32.5">
        <div className="flex h-9 items-center justify-center lg:h-12 xl:h-15">
          <IconWheel targetIndex={5} />
        </div>
        <p className="text-ocean-teal text-center text-[8px] font-bold tracking-widest uppercase opacity-70 md:text-[10px] lg:text-xs">
          Favorite <br /> Technology
        </p>
      </div>
    </Fragment>
  );
};

export default Stats;
