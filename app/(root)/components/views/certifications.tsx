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

const Certifications = ({
  certificates,
}: {
  certificates?: ICertificate[];
  }) => {
  const t = useTranslations("Certifications")
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

        {/* STAGGERED COLUMN */}
        <motion.div
          variants={STAGGERED_COLUMN_VARIANTS}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12"
        >
          {/* LEFT */}
          <div className="flex flex-col gap-8 md:gap-12">
            {certificates
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

          {/* RIGHT */}
          <div className="flex flex-col gap-8 md:mt-32 md:gap-12">
            {certificates
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

        <div className="absolute top-1/2 right-4 hidden -translate-y-1/2 lg:block">
          <motion.a
            href="https://linkedin.com/in/ardhikaptr11/details/certifications"
            target="_blank"
            rel="noopener noreferrer"
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
          </motion.a>
        </div>

        <AnimatePresence>
          {selectedPdf && (
            <div className="bg-ocean-deep/10 fixed inset-0 z-70 flex items-center justify-center p-4 backdrop-blur-sm">
              <Button
                variant="ghost"
                onClick={() => setSelectedPdf(null)}
                className="hover:text-ocean-teal absolute top-5 right-5 flex items-center gap-2 bg-transparent! text-white hover:border-transparent!"
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
