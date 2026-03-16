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
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { IProject } from "../../types/data";
import { ProjectCard } from "../cards";
import SectionHeader from "../section-header";
import { GRID_VARIANTS } from "../../constants/variants.constants";
import { Link } from "../../i18n/navigation";
import { ArrowUpRight } from "lucide-react";

const Projects = ({ projects }: { projects: IProject[] }) => {
  const t = useTranslations("Projects");
  const locale = useLocale();

  const containerRef = useRef<HTMLDivElement>(null);

  const MotionLink = motion(Link);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll: "auto",
    loop: true,
    breakpoints: {
      "(max-width: 640px)": { slidesToScroll: 1 },
    },
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi],
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi],
  );
  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi],
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  const isCarousel = projects.length > 3;

  const offset: UseScrollOptions["offset"] = ["start end", "end start"];
  const { scrollYProgress } = useScroll({ target: containerRef, offset });
  const ambientLightOpacity = useTransform(
    scrollYProgress,
    [0.15, 0.25, 0.5],
    [0, 1, 0.4],
  );

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
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-150"
      />

      <div className="relative mx-auto max-w-7xl pt-32 pb-16 sm:pt-40">
        <SectionHeader
          title={t("title")}
          subtitle={t("subtitle")}
          align="center"
          className="mb-10 sm:mb-16"
        />

        <div className="relative">
          {/* Navigation Buttons */}
          {isCarousel && (
            <Fragment>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={scrollPrev}
                className="absolute top-1/2 -left-4 z-20 hidden -translate-y-1/2 items-center justify-center active:scale-90 sm:flex lg:-left-12 lg:size-12"
                aria-label="Previous page"
              >
                <Icons.chevronLeft className="size-5 text-slate-400 lg:size-6" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={scrollNext}
                className="absolute top-1/2 -right-4 z-20 hidden -translate-y-1/2 items-center justify-center active:scale-90 sm:flex lg:-right-12 lg:size-12"
                aria-label="Next page"
              >
                <Icons.chevronRight className="size-5 text-slate-400 lg:size-6" />
              </Button>
            </Fragment>
          )}

          {/* Carousel */}
          <div className="overflow-hidden" ref={emblaRef}>
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ margin: "-100px", once: true }}
              variants={GRID_VARIANTS}
              className="flex py-8"
            >
              {projects.map((project, index) => (
                <div
                  key={index}
                  className="min-w-0 flex-[0_0_100%] pl-4 sm:flex-[0_0_50%] sm:pl-6 lg:flex-[0_0_33.333%]"
                >
                  <ProjectCard project={project} index={index} />
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Dot Indicators */}
        {isCarousel && (
          <div className="mt-8 flex flex-wrap justify-center gap-2 sm:mt-12 sm:gap-3">
            {scrollSnaps.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  selectedIndex === index
                    ? "bg-ocean-teal w-6 shadow-[0_0_8px_#14ffec] sm:w-8"
                    : "w-1.5 bg-slate-700 hover:bg-slate-500 sm:w-2",
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="absolute top-1/2 right-4 hidden -translate-y-1/2 lg:block">
        <MotionLink
          href="/projects"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          whileTap={{ scale: 0.95 }}
          className="text-muted-foreground/40 hover:text-ocean-teal flex items-center gap-4 transition-colors [writing-mode:vertical-lr]"
        >
          <p className="font-mono text-[10px] tracking-[0.4em] uppercase">
            {locale === "id" ? "Telusuri lebih banyak" : "Explore more"}
          </p>
          <div className="bg-ocean-teal/20 relative h-20 w-px">
            <div className="bg-ocean-teal animate-scan-vertical absolute top-0 left-0 h-3/10 w-full" />
          </div>
        </MotionLink>
      </div>
    </section>
  );
};

export default Projects;
