"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import useEmblaCarousel from "embla-carousel-react";
import {
  motion,
  useScroll,
  UseScrollOptions,
  useTransform,
} from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import { IProject } from "../../types/data";
import { ProjectCard } from "../cards";
import SectionHeader from "../section-header";
import { GRID_VARIANTS } from "../../constants/variants.constants";
import { Link } from "../../i18n/navigation";

const groupSlides = (slides: IProject[], size: number) => {
  const grouped = [];
  for (let i = 0; i < slides.length; i += size) {
    grouped.push(slides.slice(i, i + size));
  }
  return grouped;
};

const Projects = ({ projects }: { projects: IProject[] }) => {
  const t = useTranslations("Projects");
  const locale = useLocale();
  const containerRef = useRef<HTMLDivElement>(null);

  const offset: UseScrollOptions["offset"] = ["start end", "end start"];

  const [current, setCurrent] = useState(0);
  const [groupSize, setGroupSize] = useState(1);

  // Update group size and dots on window resize
  useEffect(() => {
    const updateSize = () => {
      if (window.innerWidth >= 1024)
        setGroupSize(3); // LG: 1 group = 3 cards (6 cards = 2 dots)
      else if (window.innerWidth >= 768)
        setGroupSize(2); // MD: 1 group = 2 cards (6 cards = 3 dots)
      else setGroupSize(1); // SM: 1 group = 1 card (6 cards = 6 dots)
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Re-calculate group size
  const groupedProjects = useMemo(
    () => groupSlides(projects, groupSize),
    [projects, groupSize],
  );

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
  });

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCurrent(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  // Reset slide position to zero while group size changes
  useEffect(() => {
    if (emblaApi) emblaApi.scrollTo(0);
  }, [groupSize, emblaApi]);

  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi],
  );
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset,
  });
  const ambientLightOpacity = useTransform(
    scrollYProgress,
    [0.15, 0.25, 0.5],
    [0, 1, 0.4],
  );
  const pathLengthTop = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden px-4 pt-0 sm:px-6"
      id="projects"
    >
      <motion.div
        style={{
          opacity: ambientLightOpacity,
          background:
            "radial-gradient(circle at 50% 0%, rgba(20, 255, 236, 0.15) 0%, transparent 70%)",
        }}
        className="pointer-events-none absolute inset-x-0 top-0 h-150"
      />

      {/* Seamless connector pillar */}
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

      <div className="relative mx-auto max-w-6xl pt-40 pb-16">
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
          className="mt-12 mb-12! text-center"
        />

        <div className="relative">
          <Fragment>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={scrollPrev}
              className="absolute top-1/2 -left-4 z-40 hidden -translate-y-1/2 sm:flex md:-left-8"
            >
              <Icons.chevronLeft className="text-muted-foreground size-6" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={scrollNext}
              className="absolute top-1/2 -right-4 z-40 hidden -translate-y-1/2 sm:flex md:-right-8"
            >
              <Icons.chevronRight className="text-muted-foreground size-6" />
            </Button>
          </Fragment>

          <div
            className="overflow-hidden"
            ref={emblaRef}
            key={`carousel-${groupSize}`}
          >
            <div className="flex">
              {groupedProjects.map((group, groupIndex) => (
                <div key={groupIndex} className="min-w-0 flex-[0_0_100%] px-2">
                  <motion.div
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    variants={GRID_VARIANTS}
                    className={cn("grid gap-6 py-8", {
                      "grid-cols-1": groupSize === 1,
                      "grid-cols-2": groupSize === 2,
                      "grid-cols-3": groupSize === 3,
                    })}
                  >
                    {group.map((project, index) => (
                      <ProjectCard
                        key={index}
                        project={project}
                        index={index}
                      />
                    ))}

                    {/* Empty slots if total card is less than groupSize */}
                    {group.length < groupSize &&
                      Array.from({ length: groupSize - group.length }).map(
                        (_, i) => (
                          <div
                            key={`empty-${i}`}
                            className="invisible"
                            aria-hidden="true"
                          />
                        ),
                      )}
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dot Indicators */}
        <div className="relative z-50 mb-8 flex justify-center gap-3">
          {groupedProjects.map((_, index) => (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              key={index}
              onClick={() => scrollTo(index)}
              className={cn(
                "h-1.5 cursor-pointer rounded-full transition-all duration-300 ease-in-out",
                index === current
                  ? "bg-ocean-teal w-8 shadow-[0_0_8px_#14ffec] hover:bg-ocean-teal!"
                  : "w-2 bg-slate-700 hover:bg-slate-700!",
              )}
            />
          ))}
        </div>
      </div>

      {/* CTA */}
      <div
        className={cn(
          "relative z-50 -mt-24 flex justify-center py-8",
          "xl:absolute xl:top-1/2 xl:right-4 xl:m-0 xl:block xl:-translate-y-1/2 xl:p-0",
        )}
      >
        <Link
          href="/projects"
          className="text-ocean-teal xl:text-muted-foreground/40 xl:hover:text-ocean-teal flex items-center gap-4 transition-colors xl:[writing-mode:vertical-lr]"
        >
          <p className="font-mono text-[10px] tracking-[0.4em] uppercase">
            {locale === "id" ? "Telusuri lebih banyak" : "Explore more"}
          </p>
          <div className="bg-ocean-teal/20 relative hidden h-20 w-px xl:block">
            <div className="bg-ocean-teal animate-scan-vertical absolute top-0 left-0 h-3/10 w-full" />
          </div>
        </Link>
      </div>
    </section>
  );
};

export default Projects;
