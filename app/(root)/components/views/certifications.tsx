"use client";

import { Button } from "@/components/ui/button";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import {
  AnimatePresence,
  motion,
  useScroll,
  UseScrollOptions,
  useTransform,
} from "framer-motion";
import { XIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { STAGGERED_COLUMN_VARIANTS } from "../../constants/variants.constants";
import { ICertificate } from "../../types/data";
import { CertificationCard } from "../cards";
import SectionHeader from "../section-header";
import Link from "next/link";
import { cn } from "@/lib/utils";

const Certifications = ({ data }: { data: ICertificate[] }) => {
  const t = useTranslations("Certifications");
  const locale = useLocale();

  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // The animation start when the top of the element just appears from the bottom of the screen
  const offset: UseScrollOptions["offset"] = ["start end", "end start"];

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedPdf(null);
      }
    };

    if (selectedPdf) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [selectedPdf]);

  return (
    <section
      id="certifications"
      ref={containerRef}
      className="relative px-6 pt-32 pb-24"
    >
      {/* Header */}
      <div className="mx-auto max-w-5xl">
        <SectionHeader
          title={t("title")}
          subtitle={t("subtitle")}
          style={{
            opacity: useTransform(scrollYProgress, [0, 0.18], [0, 1]),
            y: useTransform(scrollYProgress, [0, 0.18], [25, 0]),
            filter: useTransform(
              scrollYProgress,
              [0, 0.14],
              ["blur(10px)", "blur(0px)"],
            ),
          }}
          align="left"
          shouldAnimate
        />

        {/* Staggered Column */}
        <motion.div
          variants={STAGGERED_COLUMN_VARIANTS}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12"
        >
          {/* Left */}
          <div className="flex flex-col gap-8 md:gap-12">
            {data
              ?.filter((_, i) => i % 2 === 0)
              .map((certification, index) => (
                <CertificationCard
                  key={index}
                  certification={certification}
                  index={index * 2}
                  onOpenPdf={setSelectedPdf}
                />
              ))}
          </div>

          {/* Right */}
          <div className="flex flex-col gap-8 md:mt-32 md:gap-12">
            {data
              ?.filter((_, i) => i % 2 !== 0)
              .map((certification, index) => (
                <CertificationCard
                  key={index}
                  certification={certification}
                  index={index * 2 + 1}
                  onOpenPdf={setSelectedPdf}
                />
              ))}
          </div>
        </motion.div>

        <div
          className={cn(
            "relative flex justify-center pt-8",
            "xl:absolute xl:top-1/2 xl:right-4 xl:m-0 xl:block xl:-translate-y-1/2 xl:p-0",
          )}
        >
          <Link
            href="https://linkedin.com/in/ardhikaptr11/details/certifications"
            target="_blank"
            rel="noopener noreferrer"
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

        <AnimatePresence>
          {selectedPdf && (
            <div className="fixed inset-0 z-70 flex items-center justify-center p-6 md:p-10">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedPdf(null)}
                className="bg-ocean-deep/40 absolute inset-0 backdrop-blur-md"
              />

              <Button
                variant="ghost"
                onClick={() => setSelectedPdf(null)}
                className="hover:text-primary absolute top-0 right-0 flex items-center gap-2 bg-transparent! text-white/50 transition-colors hover:border-transparent! max-md:hidden"
              >
                <p className="text-[10px] font-black tracking-widest uppercase">
                  {locale === "id" ? "Tutup" : "Close"} (ESC)
                </p>
                <XIcon className="size-5" />
              </Button>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-ocean-deep relative h-[90vh] w-full max-w-5xl border border-white/10"
              >
                {/* PDF Core Viewer */}
                <div className="oceanic-pdf-previewer h-full overflow-hidden">
                  <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                    <Viewer
                      fileUrl={selectedPdf}
                      plugins={[defaultLayoutPluginInstance]}
                      theme="dark"
                    />
                  </Worker>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Certifications;
