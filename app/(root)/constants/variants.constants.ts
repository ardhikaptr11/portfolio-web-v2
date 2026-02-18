import { Variants } from "motion/react";

export const MOBILE_MENU_VARIANTS = {
  container: {
    closed: {
      y: -100,
      opacity: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
        when: "afterChildren",
      },
    },
    open: {
      y: 0,
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  },
  item: {
    closed: {
      opacity: 0,
      y: 20,
      filter: "blur(10px)",
      transition: { duration: 0.3 },
    },
    open: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  } as Variants,
};

export const GRID_VARIANTS = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

export const STAGGERED_COLUMN_VARIANTS = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.6,
      staggerChildren: 0.2,
    },
  },
};

export const CARD_VARIANTS = {
  projects: {
    hidden: {
      opacity: 0,
      y: 30,
      filter: "blur(8px)",
    },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  } as Variants,
  certifications: {
    hidden: { opacity: 0, y: 50 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.1,
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
    ready: {
      opacity: 1,
      y: -6,
      transition: {
        duration: 0.4,
        ease: "easeOut"
        // ease: [0.22, 1, 0.36, 1],
      }
    }
  } as Variants,
};

export const GIANT_TEXT_VARIANTS = {
  hidden: {
    opacity: 0,
    y: 100,
    filter: "blur(20px)",
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    scale: 1,
    transition: {
      duration: 1.5,
      ease: [0.22, 1, 0.36, 1],
    }
  }
} as Variants