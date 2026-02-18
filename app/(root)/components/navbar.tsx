"use client";

import { ModeToggle } from "@/app/(dashboard)/components/themes/theme-toggle";
import { useIsMobile } from "@/hooks/use-mobile";
import { ISocialLinks } from "@/app/(dashboard)/types/user";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import AnimatedHamburger from "./animated-hamburger";
import MobileNavMenu from "./mobile-nav-menu";
import { useTranslations } from "next-intl";

export interface INavItem {
  href: string;
  key: string;
}

const Navbar = ({
  items,
  socials,
}: {
  items: INavItem[];
  socials: ISocialLinks;
}) => {
  const t = useTranslations("Common.NavLink");

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isMobile) {
      setIsMenuOpen(false);
    }
  }, [isMobile]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const scrollToSection = (href: string) => {
    setIsMenuOpen(false);

    const element = document.querySelector(href);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Fragment>
      <motion.header
        initial={false}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 25,
        }}
        animate={{
          width: isScrolled ? "90%" : "100%",
          maxWidth: isScrolled ? "800px" : "100%",
          top: isScrolled ? "1.5rem" : "0rem",
          borderRadius: isScrolled ? "100px" : "0px",
          boxShadow: isScrolled
            ? "0 0 35px -2px oklch(0.7 0.15 185 / 0.4)"
            : "0 0 0px 0px oklch(0.7 0.15 185 / 0)",
        }}
        className={cn(
          "fixed left-1/2 z-60 flex -translate-x-1/2 flex-col items-center justify-between backdrop-blur-xl lg:flex-row lg:items-start lg:gap-6 lg:px-12 lg:py-5",
          "overflow-visible",
          {
            "border-ocean-teal/20 border py-2! pr-3! pl-5!": isScrolled,
          },
        )}
      >
        {/* Menu & Actions */}
        <nav
          aria-label="Main Navigation"
          className={cn(
            "flex w-full items-center justify-between gap-4 p-5 md:gap-8 lg:p-0",
            {
              "p-0": isScrolled,
            },
          )}
        >
          <Link href="/" className="group shrink-0" aria-label="Home">
            <span className="font-display text-foreground logo-tracking text-2xl font-bold">
              AP
              <span className="text-ocean-teal ml-0.5" aria-hidden="true">
                .
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-0 md:gap-2">
            {items.map((item) => (
              <Button
                key={item.key}
                variant="ghost"
                onClick={() => scrollToSection(item.href)}
                className={cn(
                  "text-muted-foreground hover:text-foreground group relative font-sans text-sm font-medium transition-colors hover:bg-transparent! max-[865px]:hidden",
                  {
                    hidden: item.key === "contact",
                  },
                )}
              >
                <p className="relative">
                  {t(item.key)}
                  <span className="bg-ocean-teal absolute -bottom-1 left-0 h-0.5 w-0 transition-all duration-300 group-hover:w-full" />
                </p>
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <ModeToggle />

            <Button
              type="button"
              onClick={() => scrollToSection("#contact")}
              className="bg-ocean-teal rounded-full px-4 py-2 font-sans text-xs font-bold whitespace-nowrap text-white transition-all hover:scale-105 active:scale-95 max-[865px]:hidden md:text-sm"
            >
              {isScrolled ? t("btn-contact-scrolled") : t("btn-contact")}
            </Button>

            <AnimatedHamburger
              isOpen={isMenuOpen}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            />
          </div>
        </nav>
      </motion.header>
      <MobileNavMenu
        isOpen={isMenuOpen}
        onClose={(href) => scrollToSection(href)}
        navItems={items}
        socials={socials}
        translator={t}
        isScrolled={isScrolled}
      />
    </Fragment>
  );
};

export default Navbar;
