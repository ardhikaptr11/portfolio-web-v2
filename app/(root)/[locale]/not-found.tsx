"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Fragment, useEffect } from "react";
import GlitchText from "../components/glitch-text";
import "../globals.css";

const NotFound = () => {
  const MotionButton = motion.create(Button);
  const router = useRouter();

  useEffect(() => {
    document.title = "404 | Ardhika Putra";
  }, []);

  return (
    <Fragment>
      <div className="pointer-events-none absolute inset-0 z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-size-[100%_4px,3px_100%]" />

      <div
        className="absolute inset-0 z-0 opacity-5 mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div
        className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle at center, #1e293b 1.5px, transparent 1.5px)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 flex h-screen w-full flex-col items-center justify-center px-4">
        <div className="relative flex flex-col items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex flex-col items-center justify-center"
          >
            <GlitchText speed={1} enableShadows enableOnHover={false}>
              404
            </GlitchText>

            <h2 className="text-ocean-teal/80 mb-8 text-sm font-black tracking-[0.8em] uppercase md:text-2xl">
              Page Not Found
            </h2>

            <div className="max-w-lg space-y-5 px-6 text-center">
              <p className="text-[10px] leading-[2.2] font-light tracking-[0.25em] text-teal-100/40 uppercase">
                "Not all those who wander are lost; <br />
                some are just finding a path the sea has yet to reveal."
              </p>

              <div className="flex flex-col items-center justify-center gap-2">
                <div className="bg-ocean-teal h-4 w-px opacity-20" />
                <p className="text-ocean-teal text-[8px] tracking-[0.5em] uppercase italic opacity-60">
                  J.R.R Tolkien
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-center">
          <MotionButton
            onClick={() => router.replace("/")}
            whileTap={{ scale: 0.95 }}
            className="hover:border-ocean-teal/80 hover:bg-ocean-teal border-ocean-teal/10 bg-ocean-deep/10 text-ocean-teal/80 h-auto cursor-pointer rounded-none border px-16 py-4 font-mono text-sm tracking-widest uppercase transition-all duration-300 hover:text-white md:text-xs"
          >
            Back to Home
          </MotionButton>

          <div className="mt-4 flex justify-center gap-1 opacity-30">
            <div className="bg-ocean-teal size-1 animate-pulse rounded-full" />
            <div className="bg-ocean-teal/20 h-1 w-8 rounded-full" />
          </div>
        </div>

        <div className="absolute bottom-10 flex w-full max-w-5xl items-end justify-between px-10 text-[7px] tracking-[0.3em] uppercase opacity-30">
          <div className="space-y-1">
            <p>Buffer: 0%</p>
            <p>Oxygen: 92%</p>
          </div>
          <div className="space-y-1 text-right">
            <p>Log_ID: 0xCF990</p>
            <p>Module: Root_App</p>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default NotFound;
