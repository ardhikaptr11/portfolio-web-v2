"use client";

import { Breadcrumbs } from "@/app/(dashboard)/components/breadcrumbs";
import { HERO_VARIANTS } from "@/app/(root)/constants/variants.constants";
import { Link } from "@/app/(root)/i18n/navigation";
import { IProject } from "@/app/(root)/types/data";
import { IconSlash } from "@tabler/icons-react";
import { motion } from "motion/react";
import { useLocale } from "next-intl";
import Image from "next/image";

const Hero = ({
  title,
  url,
}: {
  title: IProject["title"];
  url: IProject["thumbnail_url"];
}) => {
  const locale = useLocale();

  return (
    <section className="font-display relative h-[65vh] w-full overflow-hidden">
      <motion.div
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1 }}
        className="size-full"
      >
        <Image
          src={url}
          alt="Thumbnail"
          fill
          priority
          className="object-center opacity-50 grayscale-25"
        />
        <div className="from-background via-background/60 absolute inset-0 bg-linear-to-t to-transparent after:absolute after:inset-0 after:bg-black/3 dark:after:bg-black/20" />
      </motion.div>

      {/* Floating Title Overlay */}
      <motion.div
        className="absolute inset-0 z-10 flex flex-col items-center justify-center space-y-8 p-6 text-center"
        initial="hidden"
        animate="visible"
        variants={HERO_VARIANTS}
      >
        <motion.h1
          variants={{
            hidden: { y: 30, opacity: 0 },
            visible: { y: 0, opacity: 1 },
          }}
          className="dark:text-foreground max-w-5xl text-4xl font-bold tracking-tight text-gray-800 uppercase md:text-6xl lg:text-7xl"
        >
          {title}
        </motion.h1>

        <motion.div
          variants={{
            hidden: { width: 0, opacity: 0 },
            visible: { width: 100, opacity: 1, transition: { duration: 0.6 } },
          }}
          className="bg-foreground dark:bg-ocean-teal h-1 rounded-full"
        />

        <motion.div
          variants={{
            hidden: { y: 30, opacity: 0 },
            visible: { y: 0, opacity: 1 },
          }}
        >
          <Breadcrumbs />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
