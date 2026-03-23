"use client";

import { ModeToggle } from "@/app/(dashboard)/components/themes/theme-toggle";
import { ICON_MAP } from "@/app/(root)/constants/items.constants";
import { IProjectExtended } from "@/app/(root)/types/data";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format, formatDistance, formatDistanceStrict } from "date-fns";
import { id } from "date-fns/locale";
import { motion } from "framer-motion";
import { InfoIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { ReactNode } from "react";

interface ContentAreaProps {
  project: IProjectExtended;
  children: ReactNode;
}

export const ContentArea = ({ project, children }: ContentAreaProps) => {
  const locale = useLocale();
  const t = useTranslations("ProjectDetails");

  const description =
    locale === "id" ? project.description_id : project.description;

  const regexp = locale === "id" ? /\d+\s/g : /\d+(st|nd|rd|th),/g;

  const formattedStartDate = format(project.start_date, "PPP", {
    ...(locale === "id" ? { locale: id } : {}),
  }).replace(regexp, "");

  const formattedEndDate = project.end_date
    ? format(project.end_date, "PPP", {
        ...(locale === "id" ? { locale: id } : {}),
      }).replace(regexp, "")
    : locale === "id"
      ? "Saat ini"
      : "Present";

  const duration = project.end_date
    ? formatDistance(project.end_date, project.start_date as Date, {
        ...(locale === "id" ? { locale: id } : {}),
      })
    : formatDistanceStrict(new Date(), project.start_date as Date, {
        ...(locale === "id" ? { locale: id } : {}),
      });

  return (
    <section className="px-6 py-12 md:px-12">
      <div className="font-display grid grid-cols-1 items-start gap-12 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="border-border dark:bg-ocean-surface order-2 overflow-hidden rounded-lg border bg-white shadow-sm lg:order-1 lg:col-span-2"
        >
          <div className="text-muted-foreground border-border bg-muted/30 flex items-center justify-between border-b px-6 py-4">
            <div className="flex items-center gap-2">
              <Icons.book className="size-4" />
              <p className="text-xs">{t("title")}</p>
            </div>
            <ModeToggle />
          </div>
          <article className="rt-content">{children}</article>
        </motion.div>

        <motion.aside
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="border-ocean-teal/20 from-ocean-surface/30 via-background to-background text-muted-foreground order-1 overflow-hidden rounded-lg border bg-linear-to-br p-8 shadow-2xl lg:sticky lg:top-5 lg:order-2 lg:col-span-1"
        >
          {/* Header  */}
          <div className="mb-10 flex items-center">
            <div className="flex items-center gap-3">
              <div className="bg-ocean-teal/10 text-ocean-teal flex h-8 w-8 items-center justify-center rounded-xl">
                <InfoIcon className="size-4" />
              </div>
              <div className="space-y-1">
                <p className="text-ocean-teal/70 text-[10px] font-black tracking-[0.2em] uppercase">
                  {t("aside.title")}
                </p>
                <h5 className="flex items-baseline gap-2 text-xs">
                  <span className="text-foreground/30 font-light">Status:</span>

                  <p
                    className={cn(
                      "text-ocean-teal font-black tracking-tight uppercase",
                      {
                        "animate-pulse": project.project_status === "live",
                      },
                    )}
                  >
                    {project.project_status === "under_development"
                      ? locale === "id"
                        ? "Masih Dikembangkan"
                        : "Under Development"
                      : project.project_status}
                  </p>
                </h5>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-10">
            <p className="grow text-sm leading-relaxed">{description}</p>

            {/* Assigned Role */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h5 className="text-ocean-teal text-[10px] font-black tracking-widest uppercase">
                  01 / {t("aside.subtitles.subtitle1")}
                </h5>
                <div className="bg-ocean-teal/10 h-px flex-1" />
              </div>
              <div className="flex flex-wrap gap-2">
                {project.roles.map((role, index) => (
                  <div key={role.id} className="flex items-center gap-2">
                    <span
                      className={cn("bg-ocean-teal/30 size-1", {
                        hidden: index === 0,
                      })}
                    />
                    <p className="text-sm">{role.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tech Stack */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h5 className="text-ocean-teal text-[10px] font-black tracking-widest uppercase">
                  02 / {t("aside.subtitles.subtitle2")}
                </h5>
                <div className="bg-ocean-teal/10 h-px flex-1" />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {project.tech_stack.map((stack: string) => {
                  const Icon = ICON_MAP[stack] ?? Icons.blocks;
                  return (
                    <div
                      key={stack}
                      className={cn(
                        "flex items-center gap-2 rounded-full border px-3 py-1 transition-all duration-300",
                        "border-ocean-teal/10 bg-ocean-teal/5 text-muted-foreground hover:border-ocean-teal/40 hover:text-ocean-teal hover:scale-105",
                      )}
                    >
                      <Icon className="size-3" />
                      <span className="text-[9px] font-medium">{stack}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h5 className="text-ocean-teal text-[10px] font-black tracking-widest uppercase">
                  03 / {t("aside.subtitles.subtitle3")}
                </h5>
                <div className="bg-ocean-teal/10 h-px flex-1" />
              </div>

              <div className="flex items-baseline gap-4 text-xs">
                <div className="flex flex-col gap-1">
                  <p className="text-ocean-teal/40 text-[9px] font-bold tracking-tighter uppercase">
                    {t("aside.contents.timeline.content1")}
                  </p>
                  <p>{formattedStartDate}</p>
                </div>

                <div className="bg-ocean-teal/20 mb-1 h-4 w-px self-end" />

                <div className="flex flex-col gap-1">
                  <p className="text-ocean-teal/40 text-[9px] font-bold tracking-tighter uppercase">
                    {t("aside.contents.timeline.content2")}
                  </p>
                  <p>{formattedEndDate}</p>
                </div>

                <div className="bg-ocean-teal/20 mb-1 h-4 w-px self-end" />

                <div className="flex flex-col gap-1">
                  <p className="text-ocean-teal/40 text-[9px] font-bold tracking-tighter uppercase">
                    {t("aside.contents.timeline.content3")}
                  </p>
                  <p>{duration}</p>
                </div>
              </div>
            </div>

            {/* Related Links */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h5 className="text-ocean-teal text-[10px] font-black tracking-widest uppercase">
                  04 / {t("aside.subtitles.subtitle4")}
                </h5>
                <div className="bg-ocean-teal/10 h-px flex-1" />
              </div>

              <div className="flex flex-row gap-2">
                {Object.entries(project.urls).map(([key, value]) => {
                  const Icon =
                    Icons[key as keyof typeof Icons] ?? Icons["home"];

                  return value && (
                    <Button
                      key={key}
                      asChild
                      variant="outline"
                      className="group border-ocean-teal/20 bg-ocean-teal/5 hover:border-ocean-teal/50 relative h-auto flex-1 rounded-none border transition-all duration-300"
                    >
                      <Link
                        href={value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-3"
                      >
                        <Icon className="text-ocean-teal/60 group-hover:text-ocean-teal size-4 transition-colors" />

                        <p className="text-foreground/70 group-hover:text-foreground text-[10px] font-bold tracking-widest uppercase">
                          {key === "demo"
                            ? "Live Demo"
                            : locale === "id"
                              ? "Repositori"
                              : "Repository"}
                        </p>
                      </Link>
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer Decoration */}
          <div className="mt-8 flex justify-center opacity-10">
            <div className="via-foreground h-px w-full bg-linear-to-r from-transparent to-transparent" />
          </div>
        </motion.aside>
      </div>
    </section>
  );
};
