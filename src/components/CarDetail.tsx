"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Car } from "@/data/cars";
import { useLocale } from "@/i18n/locale-context";
import { formatPrice, formatKm } from "@/lib/format";
import { ContactForm } from "./ContactForm";

export function CarDetail({ car }: { car: Car }) {
  const { t } = useLocale();
  const specs = [
    { l: t.car.year, v: String(car.year) },
    { l: t.car.mileage, v: formatKm(car.mileageKm) },
    { l: t.car.power, v: `${car.power} ${t.car.hp}` },
    { l: t.car.fuel, v: t.fuelTypes[car.fuel] },
    { l: t.car.body, v: t.bodyTypes[car.body] },
    { l: t.car.transmission, v: car.transmission === "automatic" ? t.car.automatic : t.car.manual },
    { l: t.car.color, v: car.color },
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
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className={`relative flex aspect-[16/11] items-center justify-center overflow-hidden rounded-3xl border border-border bg-gradient-to-br ${car.gradient}`}
        >
          <span className="text-6xl font-semibold tracking-tight text-white/10">{car.brand}</span>
          {car.image && (
            <Image
              src={car.image}
              alt={`${car.brand} ${car.model}`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          )}
          {car.featured && (
            <span className="absolute left-4 top-4 rounded-full bg-accent px-3 py-1 text-xs font-medium text-white">
              {t.featured.title}
            </span>
          )}
        </motion.div>

        <div>
          <p className="text-sm uppercase tracking-wide text-accent">{car.brand}</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">{car.model}</h1>
          <p className="mt-4 font-display text-4xl font-semibold text-white">{formatPrice(car.priceUsd)}</p>

          <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3">
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
            <ContactForm subject={`${car.brand} ${car.model} ${car.year}`} />
          </div>
        </div>
      </div>
    </div>
  );
}
