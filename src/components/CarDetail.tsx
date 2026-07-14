"use client";

import Link from "next/link";
import type { Car } from "@/data/cars";
import { useLocale } from "@/i18n/locale-context";
import { formatMoney, formatYears } from "@/lib/format";
import { ContactForm } from "./ContactForm";
import { CarGallery } from "./CarGallery";

export function CarDetail({ car }: { car: Car }) {
  const { t, locale } = useLocale();
  // Только то, что есть в прайсе. Характеристики не выдумываем — см. data/cars.ts.
  const specs = [
    { l: t.car.warranty, v: formatYears(car.warrantyYears, locale, t.car.years) },
    { l: t.car.offer, v: t.offers[car.offer] },
  ];

  return (
    <div className="mx-auto max-w-7xl px-5 pt-28 pb-20 sm:px-8 sm:pt-32">
      <Link
        href="/catalog"
        className="group mb-6 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-white"
      >
        <span className="transition-transform duration-200 group-hover:-translate-x-1">←</span>
        <span className="link-underline">{t.car.back}</span>
      </Link>

      <div className="grid gap-10 lg:grid-cols-2">
        <CarGallery car={car} />

        <div>
          <p className="text-sm uppercase tracking-wide text-accent">{car.brand}</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">{car.model}</h1>
          <p className="mt-4 font-display text-4xl font-semibold text-white">
            {formatMoney(car.price, car.currency, t.car.uzs)}
          </p>

          <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border">
            {specs.map((s) => (
              <div key={s.l} className="bg-surface p-4">
                <dt className="text-xs uppercase tracking-wide text-muted">{s.l}</dt>
                <dd className="mt-1 text-sm font-medium text-white">{s.v}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 rounded-2xl border border-border bg-surface/50 p-6">
            <h2 className="text-lg font-medium text-white">{t.contact.title}</h2>
            <p className="mb-4 mt-1 text-sm text-muted">{t.contact.subtitle}</p>
            <ContactForm subject={`${car.brand} ${car.model}`} />
          </div>
        </div>
      </div>
    </div>
  );
}
