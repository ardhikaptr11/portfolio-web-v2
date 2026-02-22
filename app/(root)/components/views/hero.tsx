"use client";

import { Button } from "@/components/ui/button";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { animate, AnimatePresence, motion } from "framer-motion";
import { XIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ICON_MAP } from "../../constants/items.constants";
import { IHero } from "../../types/data";
import DecryptedText from "../decrypted-text";
import TypingText from "../typing-text";
import { useTranslations } from "next-intl";
import IconWheel from "../icon-wheel";
import CountingNumber from "../counting-number";
import Stats from "../stats";
import { cn } from "@/lib/utils";

const generateRadarPositions = (skills: string[]) => {
  return skills.map((skill, index) => {
    // Define Angle
    // Subtract Math.PI / 2 to start from 12 o'clock
    const angle = (index / skills.length) * 2 * Math.PI - Math.PI / 2;

    // Define Radius
    const radius = 30 + (index % 2 === 0 ? 10 : -5);

    // Calculate Position
    const left = 50 + radius * Math.cos(angle);
    const top = 50 + radius * Math.sin(angle);

    const delay = (index / skills.length) * 8;

    const Icon = ICON_MAP[skill];

    return {
      name: skill === "Vanilla CSS" ? "CSS3" : skill,
      top: `${top}%`,
      left: `${left}%`,
      delay: delay,
      Icon: Icon,
    };
  });
};

interface HeroProps {
  data: IHero;
}

const Hero = ({ data }: HeroProps) => {
  const t = useTranslations("Hero");

  const { name, motto, roles, skills, cv_asset, hero_img } = data;

  const [lastName, firstName] = name.split(" ");

  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const [showResume, setShowResume] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowResume(false);
      }
    };

    if (showResume) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [showResume]);

  const handleDeepDive = () => {
    const contactSection = document.getElementById("contact");
    if (!contactSection) return;

    const offset = 80;

    const targetPosition =
      contactSection.getBoundingClientRect().bottom +
      window.scrollY -
      window.innerHeight -
      offset;

    const controls = animate(window.scrollY, targetPosition, {
      duration: 45,
      ease: "linear",
      onUpdate: (latest) => window.scrollTo(0, latest),
    });

    const stopAnimation = () => {
      controls.stop();
      window.removeEventListener("wheel", stopAnimation);
      window.removeEventListener("touchstart", stopAnimation);
      window.removeEventListener("mousedown", stopAnimation);
      window.removeEventListener("keydown", stopAnimation);
    };

    window.addEventListener("wheel", stopAnimation, { once: true });
    window.addEventListener("touchstart", stopAnimation, { once: true });
    window.addEventListener("mousedown", stopAnimation, { once: true });
    window.addEventListener("keydown", stopAnimation, { once: true });
  };

  const roleTexts = useMemo(() => {
    return roles.map((role) => role.text);
  }, [roles]);

  const radarSkills = useMemo(() => {
    return generateRadarPositions(skills);
  }, [skills]);

  return (
    <section className="bg-ocean-surface relative flex min-h-screen flex-col items-center justify-center overflow-hidden pt-20 md:pt-0">
      {/* Background Layer (Radar) */}
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-50">
        {[...Array(3)].map((_, i) => (
          <div
            key={`grid-${i}`}
            className="border-ocean-teal/10 absolute rounded-full border"
            style={{
              width: `${(i + 1) * 300}px`,
              height: `${(i + 1) * 300}px`,
            }}
          />
        ))}

        <div className="relative flex size-175 items-center justify-center">
          <motion.div
            className="absolute inset-0 z-20"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <div
              className="from-ocean-teal/40 via-ocean-teal/20 absolute top-0 left-1/2 h-1/2 w-0.5 origin-bottom -translate-x-1/2 bg-linear-to-t to-transparent"
              style={{
                boxShadow:
                  "0 0 8px color-mix(in oklch, var(--ocean-teal), transparent 70%)",
              }}
            />
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  "conic-gradient(from 0deg at 50% 50%, oklch(var(--ocean-teal) / 0.15) 0%, transparent 25%)",
              }}
            />
          </motion.div>

          {radarSkills.map(({ name, top, left, delay, Icon }, idx) => (
            <motion.div
              key={idx}
              style={{ top, left }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.5, 0], scale: [0.5, 1.1, 1, 0.8] }}
              transition={{
                duration: 8,
                repeat: Infinity,
                delay,
                times: [0, 0.05, 0.5, 1],
              }}
              className="pointer-events-none absolute flex flex-col items-center"
            >
              <div className="bg-ocean-surface/60 border-ocean-teal/30 shadow-glow flex items-center justify-center backdrop-blur-md">
                <Icon className="text-ocean-teal size-6" />
              </div>
              <p className="text-ocean-teal/80 mt-1 font-mono text-[8px] font-bold tracking-widest uppercase">
                {name}
              </p>
            </motion.div>
          ))}
          <div
            className="bg-ocean-teal/30 relative z-30 size-4 rounded-full"
            style={{
              boxShadow: "0 0 20px var(--ocean-teal)",
            }}
          />
        </div>

        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`pulse-${i}`}
            className="border-ocean-teal/20 bg-ocean-teal/5 absolute rounded-full border"
            initial={{ width: 0, height: 0, opacity: 0 }}
            animate={{ width: 1200, height: 1200, opacity: [0, 0.3, 0] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 3,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <div className="relative z-40 grid min-h-screen grid-cols-1 px-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="z-40 flex flex-col justify-center py-12 text-start md:h-full md:py-0"
        >
          <h1 className="font-display inline-flex flex-col gap-y-1.5 text-5xl leading-[0.8] font-black tracking-tighter text-white uppercase drop-shadow-sm sm:text-9xl xl:flex-row xl:gap-0">
            <span>{lastName}</span>
            <span className="text-ocean-teal">{firstName}</span>
          </h1>

          <div className="border-ocean-teal/30 mt-6 flex flex-col gap-1 border-l pl-6">
            <TypingText
              text={roleTexts}
              className="text-ocean-teal font-mono text-xs tracking-[0.3em] uppercase md:text-sm md:tracking-[0.5em]"
              variableSpeed={{ min: 100, max: 450 }}
              typingSpeed={150}
              deletingSpeed={50}
              pauseDuration={1500}
              cursorCharacter="█"
              cursorClassName="ml-1 text-ocean-teal"
              cursorBlinkDuration={0.5}
            />
            <DecryptedText
              text={motto}
              animateOn="both"
              parentClassName="mt-2 font-mono text-[9px] tracking-widest text-slate-400 uppercase md:text-[10px]"
              sequential
            />
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="bg-ocean-teal relative overflow-hidden px-6 py-2 font-mono font-bold tracking-widest text-white! uppercase md:text-xs"
              onClick={handleDeepDive}
            >
              <motion.div
                initial={{ x: "-150%" }}
                animate={{ x: "150%" }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  repeatDelay: 1,
                  ease: "linear",
                }}
                className="absolute inset-0 z-10 skew-x-12 bg-linear-to-r from-transparent via-white/40 to-transparent"
              />
              {t("dive-deeper")}
            </motion.button>
            <motion.button
              onClick={() => setShowResume(true)}
              whileTap={{ scale: 0.95 }}
              className="hover:border-ocean-teal/80 hover:bg-ocean-teal! border-ocean-teal/30 dark:bg-ocean-deep/10 shadow-ocean-teal text-ocean-blue relative h-auto cursor-pointer rounded-none border bg-transparent px-6 py-2 font-mono text-sm font-bold tracking-widest uppercase transition-all duration-300 hover:text-white md:text-xs dark:text-white"
            >
              {t("read-resume")}
            </motion.button>
          </div>
        </motion.div>

        {/* Stats */}
        <div
          className={cn(
            "max-md:relative max-md:flex max-md:justify-center",
            "md:absolute md:top-auto md:right-auto md:bottom-6 md:left-6 md:translate-y-0 md:flex-row",
            "xl:top-1/2 xl:right-10 xl:bottom-auto xl:left-auto xl:-translate-y-1/2 xl:flex-col xl:gap-8",
            "z-50 flex items-end transition-all duration-500",
          )}
        >
          <Stats />
        </div>

        <div className="relative z-10 flex h-full items-end justify-center md:justify-end">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-none relative h-[55vh] w-full max-w-100 md:h-full md:max-w-162.5"
          >
            <Image
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
              src={hero_img}
              alt="The Silhouette"
              className="drop-shadow-silhouette object-cover object-bottom"
              priority
            />
          </motion.div>
        </div>
      </div>

      {/* 3. TECHNICAL DECORATION */}
      <div className="text-ocean-teal/40 absolute right-6 bottom-6 z-50 hidden text-end font-mono text-[9px] tracking-widest uppercase lg:block">
        <p>Location: 0.1102° S, 110.1234° E</p>
        <p>Status: Deploying Portfolio v2.0</p>
        <p>Signal: Encrypted</p>
      </div>

      <AnimatePresence>
        {showResume && (
          <div className="fixed inset-0 z-70 flex items-center justify-center p-6 md:p-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowResume(false)}
              className="bg-ocean-deep/40 absolute inset-0 backdrop-blur-md"
            />

            <Button
              variant="ghost"
              onClick={() => setShowResume(false)}
              className="hover:text-primary absolute top-0 right-0 flex items-center gap-2 bg-transparent! text-white/50 transition-colors hover:border-transparent! max-md:hidden"
            >
              <p className="text-[10px] font-black tracking-[0.2em] uppercase">
                Close (ESC)
              </p>
              <XIcon className="size-4" />
            </Button>

            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="bg-ocean-deep relative z-80 h-full w-full max-w-5xl border border-white/10 shadow-2xl"
            >
              <div className="oceanic-pdf-previewer h-full overflow-hidden">
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                  <Viewer
                    fileUrl={cv_asset}
                    plugins={[defaultLayoutPluginInstance]}
                    theme="dark"
                  />
                </Worker>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Hero;
