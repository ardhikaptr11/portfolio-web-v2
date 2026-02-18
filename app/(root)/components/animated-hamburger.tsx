"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const AnimatedHamburger = ({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
}) => {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className="relative z-70 hidden size-10 items-center justify-center transition-colors max-[865px]:flex"
    >
      <div className="flex flex-col items-center justify-center gap-2">
        <motion.span
          animate={isOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="bg-foreground block h-0.5 w-6 rounded-full"
        />

        <motion.span
          animate={isOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="bg-foreground block h-0.5 w-6 rounded-full"
        />
      </div>
    </Button>
  );
};

export default AnimatedHamburger;
