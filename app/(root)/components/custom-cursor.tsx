"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  motion,
  useSpring,
  useMotionValue,
  AnimatePresence,
} from "framer-motion";
import { useEffect, useState, useCallback } from "react";

const CustomCursor = () => {
  const isMobile = useIsMobile();
  const [cursorMode, setCursorMode] = useState<"default" | "morph" | "text">(
    "default",
  );
  const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(
    null,
  );
  const [textSize, setTextSize] = useState(20);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 28, stiffness: 600, mass: 0.1 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isMobile) return;

      const target = e.target as HTMLElement;
      const interactiveEl = target?.closest(
        "a, button, .magnetic-item",
      ) as HTMLElement;
      const computedStyle = window.getComputedStyle(target);
      const isText =
        computedStyle.cursor === "text" ||
        [
          "P",
          "SPAN",
          "H1",
          "H2",
          "H3",
          "H4",
          "H5",
          "H6",
          "LI",
          "INPUT",
          "TEXTAREA",
        ].includes(target.tagName);

      if (interactiveEl) {
        setCursorMode("morph");
        setHoveredElement(interactiveEl);
        const rect = interactiveEl.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const pullFactor = 0.12;
        mouseX.set(centerX + (e.clientX - centerX) * pullFactor);
        mouseY.set(centerY + (e.clientY - centerY) * pullFactor);
      } else {
        setHoveredElement(null);
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
        if (isText) {
          setCursorMode("text");
          const fontSize = parseFloat(computedStyle.fontSize);
          setTextSize(fontSize > 0 ? fontSize * 1.2 : 20);
        } else {
          setCursorMode("default");
        }
      }
    },
    [mouseX, mouseY],
  );

  useEffect(() => {
    if (isMobile) return;

    const handleScroll = () => {
      setCursorMode("default");
      setHoveredElement(null);
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseMove);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleMouseMove, isMobile]);

  if (isMobile) return null;

  const getWrapperVariant = () => {
    if (cursorMode === "morph" && hoveredElement) {
      return {
        width: hoveredElement.offsetWidth + 12,
        height: hoveredElement.offsetHeight + 8,
        borderRadius: getComputedStyle(hoveredElement).borderRadius || "4px",
        backgroundColor: "rgba(20, 184, 166, 0.1)",
        borderWidth: "1px",
        borderColor: "rgba(20, 184, 166, 0.4)",
      };
    }
    return {
      width: cursorMode === "text" ? 2 : 28,
      height: cursorMode === "text" ? textSize : 28,
      borderRadius: "50%",
      backgroundColor: "rgba(20, 184, 166, 0)",
      borderWidth: "0px",
      borderColor: "rgba(20, 184, 166, 0)",
    };
  };

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-9999 flex items-center justify-center overflow-visible"
      style={{ x, y, translateX: "-50%", translateY: "-50%" }}
      animate={getWrapperVariant()}
      transition={{ type: "spring", ...springConfig }}
    >
      <AnimatePresence mode="wait">
        {cursorMode === "default" && (
          <motion.div
            key="default"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="bg-ocean-teal size-3 rounded-full shadow-[0_0_10px_rgba(20,184,166,0.8)]"
          />
        )}

        {cursorMode === "text" && (
          <motion.div
            key="text"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: textSize }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-ocean-teal shadow-ocean-glow w-0.5"
            style={{ borderRadius: "2px" }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CustomCursor;
