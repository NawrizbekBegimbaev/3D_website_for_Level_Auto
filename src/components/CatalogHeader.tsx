"use client";

import { useLocale } from "@/i18n/locale-context";

export function CatalogHeader() {
  const { t } = useLocale();
  return (
    <div className="mb-10">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{t.catalog.title}</h1>
      <p className="mt-2 text-muted">{t.catalog.subtitle}</p>
    </div>
  );
}
