"use client";

import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { MOBILE_MENU_VARIANTS } from "../constants/variants.constants";
import { ISocialLinks } from "@/app/(dashboard)/types/user";
import { INavItem } from "./navbar";
import { _Translator } from "next-intl";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: (href: string) => void;
  navItems: INavItem[];
  socials: ISocialLinks;
  translator: _Translator<Record<string, any>, "Navbar">;
  isScrolled: boolean;
}

const MobileMenu = ({
  isOpen,
  onClose,
  navItems,
  socials,
  translator,
  isScrolled,
}: MobileMenuProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
          initial="closed"
          animate="open"
          exit="closed"
          variants={MOBILE_MENU_VARIANTS.container}
          className={cn(
            "bg-ocean-surface size-screen fixed inset-0 z-50 flex flex-col justify-start px-8 pt-20 backdrop-blur-3xl max-[865px]:flex",
            {
              "pt-30": isScrolled,
            },
          )}
        >
          {navItems.map((item) => (
            <div
              key={item.key}
              className={cn("flex w-fit flex-col", {
                "mb-8": item.key !== "contact",
              })}
            >
              <motion.button
                onClick={() => onClose(item.href)}
                aria-label={`Go to ${item.key} section`}
                className="group font-display text-foreground hover:text-ocean-teal relative block cursor-pointer text-3xl font-extrabold tracking-tighter uppercase transition-colors md:text-6xl lg:text-7xl"
                variants={MOBILE_MENU_VARIANTS.item}
              >
                <span className="relative">
                  {translator(item.key)}{" "}
                  <span
                    className="text-ocean-teal group-hover:text-foreground -ml-2"
                    aria-hidden="true"
                  >
                    .
                  </span>
                  <span className="bg-ocean-teal absolute -bottom-1 left-0 h-1 w-0 transition-all duration-300 group-hover:w-full" />
                </span>
              </motion.button>
            </div>
          ))}

          {/* Footer Detail */}
          <motion.div
            variants={MOBILE_MENU_VARIANTS.item}
            className="relative flex h-min flex-col flex-nowrap gap-2.5 py-8"
            role="group"
            aria-label="Social Links"
          >
            <Separator
              orientation="horizontal"
              className="bg-ocean-blue/20 data-[orientation=horizontal]:h-0.5"
              aria-hidden="true"
            />
          </motion.div>
          {Object.entries(socials).map(([key, value]) => (
            <motion.a
              key={key}
              href={
                key === "linkedin"
                  ? `https://linkedin.com/in/${value}`
                  : `https://${key}.com/${value}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="group text-foreground hover:text-ocean-teal cursor-pointer text-left font-sans text-sm font-medium tracking-tighter uppercase md:text-lg lg:text-xl"
              aria-label={`Visit Ardhika's ${key}`}
              variants={MOBILE_MENU_VARIANTS.item}
            >
              {key}
            </motion.a>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
