"use client";

import { useLocale } from "@/i18n/locale-context";
import { locales, localeNames } from "@/i18n/dictionaries";

export function LocaleSwitcher() {
  const { locale, setLocale } = useLocale();
  return (
    <div className="inline-flex items-center rounded-full border border-border bg-surface/60 p-0.5 text-xs font-medium">
      {locales.map((l) => (
        <button
          key={l}
          onClick={() => setLocale(l)}
          aria-pressed={l === locale}
          className={`rounded-full px-2.5 py-1 transition-colors ${
            l === locale ? "bg-accent text-white" : "text-muted hover:text-white"
          }`}
        >
          {localeNames[l]}
        </button>
      ))}
    </div>
  );
}
