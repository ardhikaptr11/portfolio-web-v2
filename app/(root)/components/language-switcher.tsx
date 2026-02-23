"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Locale, useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { useEffect, useTransition } from "react";
import { usePathname, useRouter } from "../i18n/navigation";

const LANGUAGES = [
  { code: "en", flag: "us", name: "English" },
  { code: "id", flag: "id", name: "Bahasa Indonesia" },
];

const LanguageSwitcher = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const params = useParams();
  const currentLanguage = useLocale();

  useEffect(() => {
    document.documentElement.setAttribute("lang", currentLanguage);
  }, [currentLanguage]);

  const handleSwitch = (nextLocale: Locale) => {
    if (nextLocale === currentLanguage) return;

    startTransition(() => {
      router.replace(
        // @ts-expect-error
        { pathname, params },
        { locale: nextLocale },
      );
    });
  };

  return (
    <div className="bg-background/50 fixed top-1/2 right-0 z-50 flex -translate-y-1/2 flex-col items-center rounded-l-sm py-0.75 pr-1.25 pl-1 shadow-lg backdrop-blur-sm">
      {LANGUAGES.map((lang) => {
        const isActive = currentLanguage === lang.code;

        return (
          <Button
            key={lang.code}
            variant="ghost"
            onClick={() => handleSwitch(lang.code)}
            disabled={isPending || isActive}
            className={cn(
              "flex size-7 items-center justify-center rounded-full p-0 transition-all duration-300 ease-in-out hover:bg-transparent",
              isActive
                ? "cursor-default opacity-100!"
                : "cursor-pointer opacity-50 hover:scale-110 hover:opacity-100",
            )}
            aria-label={`Change language to ${lang.name}`}
          >
            <span className={`fi fi-${lang.flag}`}></span>
          </Button>
        );
      })}
    </div>
  );
};

export default LanguageSwitcher;
