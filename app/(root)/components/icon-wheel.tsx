"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { ICON_MAP } from "../constants/items.constants";
import { cn } from "@/lib/utils";

const COLOR_MAP: Record<string, string> = {
  HTML: "text-orange-500",
  Javascript: "text-yellow-400",
  "Vanilla CSS": "text-blue-500",
  Python: "text-blue-400",
  React: "text-[#61DAFB]",
  "Next.js": "text-white/80",
  "Tailwind CSS": "text-cyan-400",
  Typescript: "text-blue-600",
  "Express.js": "text-neutral-300",
  "Node.js": "text-[#339933]",
  "Mongo DB": "text-green-500",
};

const ICONS = Object.entries(ICON_MAP).map(([name, IconComponent]) => ({
  name: name,
  icon: (
    <IconComponent
      className={cn(
        "size-8.5 drop-shadow-sm transition-colors duration-300 xl:size-12",
        COLOR_MAP[name],
      )}
    />
  ),
}));

interface IconWheelProps {
  targetIndex?: number;
}

const IconWheel = ({ targetIndex = 5 }: IconWheelProps) => {
  const controls = useAnimation();
  const [itemHeight, setItemHeight] = useState(0);
  const measureRef = useRef<HTMLDivElement>(null);

  const icons = [...ICONS, ...ICONS, ...ICONS];

  useEffect(() => {
    const handleResize = () => {
      if (measureRef.current) {
        setItemHeight(measureRef.current.offsetHeight);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (itemHeight === 0) return;

    const targetPositionIndex = ICONS.length * 2 + targetIndex;
    const startY = -(targetPositionIndex * itemHeight);
    const stopY = -(targetIndex * itemHeight);

    controls.set({ y: startY });

    controls.start({
      y: stopY,
      transition: {
        duration: 2.5,
        ease: [0.15, 0, 0, 1],
      },
    });
  }, [controls, targetIndex, ICONS.length, itemHeight]);

  return (
    <div
      className={cn(
        "relative overflow-hidden transition-all duration-500",
        "w-12 md:w-16 xl:w-20",
      )}
      style={{ height: itemHeight || "auto" }}
    >
      <motion.div animate={controls} className="flex flex-col items-center">
        {icons.map((item, idx) => (
          <div
            key={idx}
            ref={idx === 0 ? measureRef : null}
            className={cn(
              "flex h-fit shrink-0 flex-col items-center justify-center",
              "w-12 md:w-16 xl:w-20",
            )}
          >
            {item.icon}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default IconWheel;
