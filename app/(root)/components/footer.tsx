"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { IHero } from "../types/data";
import { INavItem } from "./navbar";

const Footer = ({
  items,
  profile,
}: {
  items: INavItem[];
  profile: Pick<IHero, "name" | "tagline" | "tagline_id" | "social_links">;
}) => {
  const t = useTranslations("Common");
  const currentYear = new Date().getFullYear();

  const locale = useLocale();

  const tagline = locale === "id" ? profile.tagline_id : profile.tagline;

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-ocean-surface border-foreground/5 w-full border-t pt-20 pb-8 font-sans">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 flex flex-col items-center">
          <Icons.brandLogo className="text-ocean-blue dark:text-foreground" size={72} />

          <p className="text-muted-foreground mt-6 w-full max-w-lg text-center text-base leading-relaxed">
            {tagline}
          </p>
        </div>

        {/* Navigation Links */}
        <nav className="mb-10 flex flex-col items-center justify-center gap-x-8 gap-y-4 md:flex-row">
          {items.map((link) => (
            <Button
              key={link.key}
              variant="ghost"
              onClick={() => scrollToSection(link.href)}
              className="hover:text-ocean-teal text-muted-foreground text-sm font-medium transition-colors"
            >
              {t(`NavLink.${link.key}`)}
            </Button>
          ))}
        </nav>

        {/* Social Icons*/}
        <div className="mb-12 flex justify-center gap-5">
          {Object.entries(profile.social_links).map(([key, value]) => {
            const Icon = Icons[key as keyof typeof Icons];

            return (
              <Link
                key={key}
                href={
                  key === "linkedin"
                    ? `https://linkedin.com/in/${value}`
                    : `https://${key}.com/${value}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="group hover:border-ocean-teal/20 hover:bg-ocean-teal/10 hover:text-ocean-teal text-muted-foreground border-ocean-teal/20 flex size-10 items-center justify-center rounded-full border bg-white/2 transition-all hover:scale-110 dark:border-white/5"
                aria-label={`Go to developer's ${key} profile`}
              >
                <Icon className="size-5" />
              </Link>
            );
          })}
        </div>

        <div className="text-muted-foreground flex flex-col items-center justify-center gap-y-1 border-t border-white/5 pt-8 text-center text-[10px] tracking-widest uppercase md:flex-row md:gap-y-0">
          <div className="flex items-center justify-center gap-1">
            <Icons.copyright className="size-3.5" />
            <p>{currentYear}</p>
            <Icons.brandLogo size={16} />
            <p>{t("Footer.copyright")}</p>
          </div>
          <span className="mx-1 hidden md:block">-</span>
          <p className="text-muted-foreground flex items-center justify-center text-[10px] leading-none tracking-widest uppercase">
            {t("Footer.decorators.text1")}{" "}
            <Icons.love className="text-ocean-teal mx-0.5 size-3 animate-pulse" />{" "}
            by{" "}
            <Link
              href={`https://linkedin.com/in/${profile.social_links.linkedin}`}
              className="text-ocean-blue inline-flex items-center gap-0.5 font-bold dark:text-white"
            >
              <span>{profile.name.split(" ")[0]}</span>
              <span className="text-ocean-teal">
                {profile.name.split(" ")[1]}
              </span>
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
