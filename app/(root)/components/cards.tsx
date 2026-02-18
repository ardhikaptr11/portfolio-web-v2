"use client";

import { Icons } from "@/components/icons";
import { Spotlight } from "@/app/(root)/components/spotlight";
import { Tilt } from "@/app/(root)/components/tilt";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { ICON_MAP } from "../constants/items.constants";
import { CARD_VARIANTS } from "../constants/variants.constants";
import { ICertificate, IExperience, IProject } from "../types/data";
import { useLocale, useTranslations } from "next-intl";
import { id } from "date-fns/locale";

const ProjectCard = ({
  project,
  index,
}: {
  project: IProject;
  index: number;
}) => {
  const router = useRouter();
  const locale = useLocale();

  const description =
    locale === "id" ? project.description_id : project.description;

  return (
    <motion.div
      variants={CARD_VARIANTS.projects}
      className="size-full"
      onClick={() => router.push(`/projects/${project.slug}`)}
    >
      <Tilt rotationFactor={8} isReverse className="group relative size-full">
        <div className="border-border dark:bg-secondary/40 hover:border-ocean-teal/50 hover:shadow-ocean-glow flex h-full flex-col overflow-hidden rounded-xl border bg-white/60 backdrop-blur-sm transition-all duration-300">
          <Spotlight
            className={cn(
              "z-0 blur-3xl transition-opacity duration-500",
              "from-ocean-teal/15 via-ocean-teal/5 to-transparent",
              "dark:from-ocean-teal/20 dark:via-ocean-teal/10",
            )}
            size={280}
          />

          <div className="relative z-10 flex h-full flex-col p-4">
            <div className="mb-6 flex items-center justify-between font-mono">
              <p className="text-[10px] font-black">
                <span className="text-muted-foreground/40 tracking-widest uppercase">
                  {locale === "id" ? "Proyek" : "Project"}
                </span>
                <span className="text-ocean-teal/40 ml-1 tracking-tighter">
                  # {String(index + 1).padStart(2, "0")}
                </span>
              </p>

              <div className="relative flex size-2 items-center justify-center">
                <div className="bg-ocean-teal/30 absolute inset-0 size-full animate-ping rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="group-hover:bg-ocean-teal bg-border relative size-1.5 rounded-full transition-all duration-300 group-hover:shadow-[0_0_10px_oklch(var(--ocean-teal))]" />
              </div>
            </div>

            <h4 className="group-hover:text-ocean-teal dark:group-hover:text-ocean-teal text-muted-foreground/60 dark:text-foreground mb-4 text-xl font-bold tracking-tight transition-colors">
              {project.title}
            </h4>

            <div
              className={cn(
                "group bg-ocean-deep relative mb-6 aspect-video overflow-hidden rounded-xl border",
                "border-border group-hover:border-ocean-teal/30",
              )}
            >
              <div className="bg-ocean-teal/40 absolute inset-0 z-10 mix-blend-overlay transition-opacity duration-700 group-hover:opacity-0" />

              <Image
                fill
                src={project.thumbnail_url}
                alt={project.title}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover grayscale transition-all duration-700 group-hover:scale-110 group-hover:grayscale-0"
              />
            </div>

            <p className="text-muted-foreground line-clamp-2 grow text-sm leading-relaxed">
              {description}
            </p>

            <div className="my-4 flex flex-wrap gap-1.5">
              {project.tech_stack.slice(0, 3).map((stack: string) => {
                const Icon = ICON_MAP[stack];

                return (
                  <div
                    key={stack}
                    className={cn(
                      "flex items-center gap-1 rounded border px-2 py-0.5 font-mono text-[8px] transition-colors",
                      "border-border bg-secondary/50 text-muted-foreground group-hover:border-ocean-teal/30 group-hover:text-foreground",
                    )}
                  >
                    {Icon && <Icon className="size-3.5" />}
                    <p>{stack}</p>
                  </div>
                );
              })}
              <div className="border-border bg-secondary/50 text-muted-foreground group-hover:border-ocean-teal/30 group-hover:text-foreground flex items-center gap-1 rounded border px-2 py-0.5 font-mono text-[8px]">
                <p>+{project.tech_stack.length - 3} more</p>
              </div>
            </div>

            <div className="border-border/50 flex items-center justify-start gap-4 border-t pt-4">
              <motion.a
                whileHover={{ scale: 1.2 }}
                href={project.urls.github}
                target="_blank"
                className="text-muted-foreground hover:text-ocean-teal transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <Icons.github className="size-4.5" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.2 }}
                href={project.urls.demo}
                target="_blank"
                className="text-muted-foreground hover:text-ocean-teal transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <Icons.externalLink className="size-4.5" />
              </motion.a>
            </div>
          </div>
        </div>
      </Tilt>
    </motion.div>
  );
};

const PERIODS_MAP = {
  year: "Tahun",
  month: "Bulan",
  week: "Minggu",
  day: "Hari",
} as { [key: string]: string };

const CATEGORY_MAP = {
  full_time: "Penuh Waktu",
  contract: "Kontrak",
  internship: "Magang",
} as { [key: string]: string };

const ExperienceCard = ({ experience }: { experience: IExperience }) => {
  const locale = useLocale();

  const [duration, periods] = experience.duration.split(" ");

  const regexp = locale === "id" ? /\d+\s/g : /\d+(st|nd|rd|th),/g;

  const formattedStartDate = format(experience.start_date, "PPP", {
    ...(locale === "id" ? { locale: id } : {}),
  }).replace(regexp, "");

  const formattedEndDate = experience.end_date
    ? format(experience.end_date, "PPP", {
        ...(locale === "id" ? { locale: id } : {}),
      }).replace(regexp, "")
    : "Present";

  const responsibilities =
    locale === "id"
      ? experience.responsibilities_id
      : experience.responsibilities;

  return (
    <div className="group border-ocean-teal/50 from-ocean-teal/10 hover:from-ocean-teal/15 relative my-8 flex flex-col gap-5 overflow-hidden rounded-r-xl border-l-4 bg-linear-to-r to-transparent p-5 shadow-[20px_0_30px_-15px_oklch(var(--ocean-teal)/0.05)] transition-all md:p-7">
      {/* Log Header Decoration */}
      <p className="text-ocean-teal/30 absolute top-2 right-2 font-mono text-[8px] tracking-widest uppercase">
        &gt; TX_LOG_{new Date(experience.start_date).getFullYear()} // VERIFIED
      </p>

      {/* Header */}
      <div className="flex flex-col gap-3">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="relative flex size-2 items-center justify-center">
              <span className="bg-ocean-teal absolute inline-flex size-full animate-ping rounded-full opacity-75" />
              <span className="bg-ocean-teal relative inline-flex size-2 rounded-full" />
            </div>
            <h2 className="text-xl leading-none font-black tracking-tighter text-white/90 uppercase md:text-2xl">
              {experience.role}
            </h2>
          </div>

          <div className="text-ocean-teal/90 ml-5 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[11px] font-bold tracking-tight uppercase">
            <div className="hover:text-ocean-teal flex items-center gap-1.5 transition-colors">
              <Icons.building className="text-ocean-teal/60 size-4" />
              <p className="leading-0">{experience.organization}</p>
            </div>
            <div className="hover:text-ocean-teal flex items-center gap-1.5 transition-colors">
              <Icons.briefcase className="text-ocean-teal/60 size-4" />
              <p className="leading-0">
                {locale === "id"
                  ? (CATEGORY_MAP[experience.work_category] ??
                    experience.work_category)
                  : experience.work_category}
              </p>
            </div>
            <div className="hover:text-ocean-teal flex items-center gap-1.5 transition-colors">
              <Icons.location className="text-ocean-teal/60 size-4" />
              <p className="leading-0">{experience.location}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Responsibilities List */}
      <div className="border-ocean-teal/10 bg-card/60 relative space-y-2 rounded-lg border p-4 font-mono">
        <div className="border-primary/20 bg-secondary absolute -top-2 left-3 border px-2 py-0.5 shadow-sm">
          <p className="text-primary/80 dark:text-primary/60 text-[9px] font-black tracking-tighter uppercase">
            {locale === "id" ? "Tanggung Jawab" : "Responsibilities"}
          </p>
        </div>
        <div className="space-y-1.5 text-[11px] leading-relaxed text-white/80 md:text-xs">
          {responsibilities.map((responsibility: string, idx: number) => (
            <div key={idx} className="flex gap-2">
              <p className="text-ocean-teal/40 shrink-0">[{idx + 1}]</p>
              <p>{responsibility}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Section: Timeline & Action */}
      <div className="border-ocean-teal/20 bg-ocean-teal/5 flex flex-col justify-between gap-5 rounded-lg border p-3 md:flex-row md:items-center">
        <div className="flex items-center gap-6 font-mono">
          <div className="space-y-0.5">
            <p className="text-muted-foreground text-[9px] tracking-widest uppercase">
              {locale === "id" ? "Lini masa" : "Timeline"}
            </p>
            <div className="flex items-center gap-2 text-xs text-white/90">
              <Icons.calendar className="text-ocean-teal/60 size-3.5" />
              <p>
                {formattedStartDate}{" "}
                <span className="text-ocean-teal/30">—</span> {formattedEndDate}
              </p>
            </div>
          </div>

          <div className="bg-ocean-teal/10 hidden h-8 w-px md:block"></div>

          <div className="space-y-0.5">
            <p className="text-muted-foreground text-[9px] tracking-widest uppercase">
              {locale === "id" ? "Durasi" : "Duration"}
            </p>
            <p className="dark:text-ocean-teal text-xs font-bold">
              {locale === "id"
                ? `${duration} ${PERIODS_MAP[periods.slice(0, periods.length - 1)]}`
                : experience.duration}
            </p>
          </div>

          <div className="bg-ocean-teal/10 hidden h-8 w-px md:block"></div>

          <div className="space-y-0.5">
            <p className="text-muted-foreground text-[9px] tracking-widest uppercase">
              {locale === "id" ? "Skenario Kerja" : "Work Scenario"}
            </p>
            <p className="dark:text-ocean-teal text-xs font-bold">
              {experience.work_type === "online" ? "Remote" : "Onsite"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const CertificationCard = ({
  certification,
  index,
  onOpenPdf,
}: {
  certification: ICertificate;
  index: number;
  onOpenPdf: Dispatch<SetStateAction<string | null>>;
}) => {
  const locale = useLocale();

  const [status, setStatus] = useState<"locked" | "scanning" | "ready">(
    "locked",
  );

  const startScanning = () => {
    if (status !== "ready") setStatus("scanning");
  };

  const stopScanning = () => {
    if (status !== "ready") setStatus("locked");
  };

  const handleComplete = () => {
    setStatus("ready");
  };

  return (
    <motion.div
      custom={index}
      variants={CARD_VARIANTS.certifications}
      initial="hidden"
      animate={status === "ready" ? "ready" : undefined}
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className={cn(
        "group border-border bg-card/40 relative flex flex-col justify-between overflow-hidden border-2 p-8 transition-colors duration-500 md:p-12",
        status === "ready"
          ? "border-ocean-teal/40 bg-ocean-teal/3"
          : "hover:border-ocean-teal/20",
      )}
    >
      <div className="relative mb-16">
        <h4
          className={cn(
            "text-3xl leading-[0.9] font-black tracking-tighter uppercase transition-colors duration-500 md:text-5xl",
            status === "ready" ? "text-ocean-teal" : "text-muted-foreground/50",
          )}
        >
          {certification.name}
        </h4>
        <div className="mt-8 flex items-center gap-6">
          <div
            className={cn(
              "h-0.5 transition-all duration-700",
              status === "ready" ? "bg-ocean-teal w-20" : "bg-border w-12",
            )}
          />
          <p className="text-muted-foreground text-[10px] font-black tracking-[0.3em] uppercase italic">
            {locale === "id" ? "Sertifikat" : "Certificate"} No.{" "}
            {String(index + 1).padStart(2, "0")}
          </p>
        </div>
      </div>

      <div className="border-border relative mt-auto border-t pt-10">
        <div className="flex flex-col items-stretch justify-between gap-6 md:flex-row md:items-end">
          <div className="flex flex-col">
            <p className="text-muted-foreground/60 text-[9px] font-black tracking-[0.3em] uppercase">
              Format
            </p>
            <p
              className={cn(
                "text-xs font-black uppercase",
                status === "ready"
                  ? "text-ocean-teal/70"
                  : "text-muted-foreground",
              )}
            >
              {locale === "id" ? "Dokumen PDF" : "PDF Document"}
            </p>
          </div>

          {status === "ready" ? (
            <Button
              size="sm"
              className="bg-ocean-teal flex h-12 w-40 items-center justify-center rounded-none text-[10px] font-black tracking-widest text-white uppercase transition-all hover:opacity-90 active:scale-95"
              onClick={() => onOpenPdf(certification.url)}
            >
              {locale === "id" ? "Lihat Dokumen" : "View Document"}
            </Button>
          ) : (
            <Button
              size="sm"
              onMouseDown={startScanning}
              onMouseUp={stopScanning}
              onMouseLeave={stopScanning}
              onTouchStart={startScanning}
              onTouchEnd={stopScanning}
              className="border-border bg-secondary relative h-12 w-40 cursor-pointer overflow-hidden rounded-none border transition-transform active:scale-95"
            >
              <motion.div
                className="bg-ocean-teal/20 absolute bottom-0 left-0 h-full"
                initial={{ width: 0 }}
                animate={{ width: status === "scanning" ? "100%" : "0%" }}
                transition={{
                  duration: status === "scanning" ? 1.5 : 0.3,
                  ease: "linear",
                }}
                onUpdate={(latest) => {
                  if (latest.width === "100%" && status === "scanning") {
                    handleComplete();
                  }
                }}
              />

              <div className="relative flex h-full items-center justify-center px-4">
                <p className="text-muted-foreground text-[10px] font-black tracking-widest uppercase">
                  {status === "scanning"
                    ? locale === "id"
                      ? "Memindai..."
                      : "Scanning..."
                    : locale === "id"
                      ? "Tahan untuk Membuka"
                      : "Hold to Unlock"}
                </p>
              </div>

              {status === "scanning" && (
                <motion.div
                  className="bg-ocean-teal absolute top-0 h-full w-0.5 shadow-[0_0_15px_oklch(var(--ocean-teal))]"
                  animate={{ left: ["0%", "100%"] }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              )}
            </Button>
          )}
        </div>
      </div>

      <div className="bg-ocean-teal/0 group-hover:bg-ocean-teal/5 absolute inset-0 -z-10 opacity-0 blur-3xl transition-all duration-700 group-hover:opacity-100" />
    </motion.div>
  );
};

export { CertificationCard, ExperienceCard, ProjectCard };
