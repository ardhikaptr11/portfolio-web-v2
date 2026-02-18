"use client";

import { ISocialLinks } from "@/app/(dashboard)/types/user";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/lib/helpers";
import Link from "next/link";
import { INavItem } from "./navbar";
import { useTranslations } from "next-intl";

const Footer = ({
  items,
  profile,
}: {
  items: INavItem[];
  profile: { name: string; tagline: string; social_links: ISocialLinks };
}) => {
  const t = useTranslations("Common");
  const currentYear = new Date().getFullYear();

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-ocean-surface border-foreground/5 w-full border-t pt-20 pb-8 font-sans">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 flex flex-col items-center text-center">
          <p className="font-display text-3xl font-bold tracking-tighter text-white">
            {getInitials(profile.name)}
            <span className="text-ocean-teal">.</span>
          </p>

          {/* Tagline */}
          <p className="text-muted-foreground mt-6 max-w-md text-base leading-relaxed">
            {profile.tagline}
          </p>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="mb-10 flex flex-wrap justify-center gap-x-8 gap-y-4">
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

        {/* 3. SOCIAL ICONS */}
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
                className="group hover:border-ocean-teal/20 hover:bg-ocean-teal/10 hover:text-ocean-teal flex size-10 items-center justify-center rounded-full border border-white/5 bg-white/2 text-gray-400 transition-all hover:scale-110"
              >
                <Icon className="size-5" />
              </Link>
            );
          })}
        </div>

        <div className="flex flex-col items-center gap-4 border-t border-white/5 pt-8 text-center">
          <p className="text-muted-foreground text-[10px] leading-none tracking-widest uppercase">
            &copy; {currentYear} {t("Footer.copyright")} -{" "}
            {t("Footer.decorators.text1")}{" "}
            <span className="animate-pulse">💙</span>{" "}
            {t("Footer.decorators.text2")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
