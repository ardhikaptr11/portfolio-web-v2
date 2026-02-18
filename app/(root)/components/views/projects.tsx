"use client";

import {
  motion,
  useScroll,
  UseScrollOptions,
  useTransform,
} from "framer-motion";
import { useRef } from "react";
import { GRID_VARIANTS } from "../../constants/variants.constants";
import { IProject } from "../../types/data";
import { ProjectCard } from "../cards";
import SectionHeader from "../section-header";
import { useTranslations } from "next-intl";

const Projects = ({ projects }: { projects: IProject[] }) => {
  const t = useTranslations("Projects");
  const containerRef = useRef<HTMLDivElement>(null);

  // The animation start when the top of the element just appears from the bottom of the screen
  const offset: UseScrollOptions["offset"] = ["start end", "end start"];

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset,
  });

  const pathLengthTop = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  const ambientLightOpacity = useTransform(
    scrollYProgress,
    [0.15, 0.25, 0.5],
    [0, 1, 0.4],
  );
  const lightRayScale = useTransform(scrollYProgress, [0.15, 0.3], [0.8, 1]);

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden px-6 pt-0"
      id="projects"
    >
      {/* AMBIENT LIGHT */}
      <motion.div
        style={{
          opacity: ambientLightOpacity,
          scale: lightRayScale,
          background:
            "radial-gradient(circle at 50% 0%, rgba(20, 255, 236, 0.15) 0%, transparent 70%)",
        }}
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-150"
      />

      {/* SEAMLESS CONNECTOR PILLAR */}
      <div className="absolute top-0 left-1/2 h-40 w-2 -translate-x-1/2">
        <svg
          className="size-full"
          viewBox="0 0 2 100"
          preserveAspectRatio="none"
        >
          <rect
            x="0"
            y="0"
            width="2"
            height="100"
            className="fill-slate-800/40"
          />
          <motion.rect
            x="0"
            y="0"
            width="2"
            height="100"
            className="fill-ocean-teal"
            style={{
              scaleY: pathLengthTop,
              originY: 0,
              filter: "drop-shadow(0 0 12px #14ffec)",
            }}
          />
        </svg>
      </div>

      <div className="mx-auto max-w-6xl pt-40 pb-16">
        {/* HEADER */}
        <SectionHeader
          title={t("title")}
          subtitle={t("subtitle")}
          style={{
            opacity: useTransform(scrollYProgress, [0.1, 0.25], [0, 1]),
            y: useTransform(scrollYProgress, [0.1, 0.25], [40, 0]),
            filter: useTransform(
              scrollYProgress,
              [0.1, 0.25],
              ["blur(10px)", "blur(0px)"],
            ),
          }}
          align="center"
          className="mt-12 mb-12!"
        />

        {/* PROJECTS GRID */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ margin: "-100px" }}
          variants={GRID_VARIANTS}
          className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
