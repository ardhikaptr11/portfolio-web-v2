"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { Icons } from "@/components/icons"; // Pastikan path benar
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const FloatingBackToTopButton =() => {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div
      className={cn(
        "fixed right-8 bottom-8 z-50 transition-all duration-500",
        isVisible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-10 opacity-0",
      )}
    >
      <Button
        size="sm"
        onClick={scrollToTop}
        className="group bg-ocean-surface/80 relative flex size-12 items-center justify-center rounded-full border border-white/5 shadow-2xl backdrop-blur-md transition-transform hover:scale-110 active:scale-95"
      >
        <svg className="absolute size-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            className="stroke-white/10"
            strokeWidth="6"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            className="stroke-ocean-teal"
            strokeWidth="6"
            strokeLinecap="round"
            style={{
              pathLength: scaleX,
            }}
          />
        </svg>

        <Icons.arrowUp className="text-ocean-teal size-5 transition-transform group-hover:-translate-y-1" />
      </Button>
    </div>
  );
}

export default FloatingBackToTopButton