"use client";

import { Icons } from "@/components/icons";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "../../i18n/navigation";
import { useEffect, useState } from "react";

const UnderDevelopment = () => {
  const t = useTranslations("UnderDevelopment");
  const locale = useLocale();

  const [bubbles, setBubbles] = useState<{ x: string; delay: number }[]>([]);

  useEffect(() => {
    const newBubbles = [...Array(5)].map(() => ({
      x: Math.random() * 100 + "%",
      delay: Math.random() * 5,
    }));
    setBubbles(newBubbles);
  }, []);

  return (
    <section className="text-ocean-teal relative flex min-h-screen flex-col items-center justify-center overflow-hidden font-sans">
      {/* Soft Background Glow */}
      <div className="bg-ocean-teal/5 pointer-events-none absolute top-1/2 left-1/2 size-125 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]" />

      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: [0, -15, 0], opacity: 1 }}
          transition={{
            y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            opacity: { duration: 1 },
          }}
          className=""
        >
          <Icons.submarine size={200} className="text-ocean-teal" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h3 className="mb-3 text-4xl font-bold tracking-[0.2em] uppercase md:text-5xl">
            {t("title")}
          </h3>
          <p className="text-xs tracking-[0.4em] text-ocean-teal/60 uppercase italic">
            {t("subtitle")}
          </p>
        </motion.div>

        <div className="mt-8 max-w-lg">
          <p className="text-sm leading-relaxed font-light text-muted-foreground">
            {t("description")}
          </p>

          <div className="mt-12">
            <Link
              href="/"
              className="group border-ocean-teal/40 text-ocean-teal hover:bg-ocean-teal hover:text-ocean-deep shadow-glow relative overflow-hidden rounded-full border px-10 py-3 text-[10px] font-bold tracking-[0.3em] uppercase transition-all hover:text-white"
              replace
            >
              {locale === "id" ? "Kembali ke Beranda" : "Back to Base"}
            </Link>
          </div>
        </div>
      </div>

      {/* Bubbles Decoration */}
      {bubbles.map((bubble, i) => (
        <motion.div
          key={i}
          initial={{ y: "100vh", x: bubble.x, opacity: 0 }}
          animate={{ y: "-10vh", opacity: [0, 0.3, 0] }}
          transition={{
            duration: 7,
            repeat: Infinity,
            delay: bubble.delay,
          }}
          className="bg-ocean-teal pointer-events-none absolute h-1 w-1 rounded-full"
        />
      ))}
    </section>
  );
};

export default UnderDevelopment;
