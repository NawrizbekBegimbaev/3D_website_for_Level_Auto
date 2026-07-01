"use client";

import { motion } from "framer-motion";
import { useLocale } from "@/i18n/locale-context";
import { locales, localeNames } from "@/i18n/dictionaries";

export function LocaleSwitcher() {
  const { locale, setLocale } = useLocale();
  return (
    <div className="relative inline-flex items-center rounded-full border border-border bg-surface/60 p-0.5 text-xs font-medium">
      {locales.map((l) => {
        const active = l === locale;
        return (
          <motion.button
            key={l}
            onClick={() => setLocale(l)}
            aria-pressed={active}
            whileTap={{ scale: 0.85 }}
            className={`relative rounded-full px-2.5 py-1 transition-colors ${
              active ? "text-white" : "text-muted hover:text-white"
            }`}
          >
            {active && (
              <motion.span
                layoutId="locale-active"
                className="absolute inset-0 rounded-full bg-accent"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{localeNames[l]}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
