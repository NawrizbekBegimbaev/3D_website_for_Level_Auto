"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { Car } from "@/data/cars";
import { useLocale } from "@/i18n/locale-context";
import { formatMoney, formatYears } from "@/lib/format";

export function CarCard({ car, index = 0 }: { car: Car; index?: number }) {
  const { t, locale } = useLocale();
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.08 }}
    >
      <Link
        href={`/catalog/${car.id}`}
        className="group block overflow-hidden rounded-2xl border border-border bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:bg-surface-2 hover:shadow-[0_24px_60px_-24px_rgba(0,0,0,0.85)]"
      >
        <div className={`relative aspect-[16/10] overflow-hidden bg-gradient-to-br ${car.gradient}`}>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="px-4 text-center text-4xl font-semibold tracking-tight text-white/10">
              {car.brand}
            </span>
          </div>
          {car.image && (
            <Image
              src={car.image}
              alt={`${car.brand} ${car.model}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}
          {car.featured && (
            <span className="absolute left-3 top-3 rounded-full bg-accent px-2.5 py-1 text-[11px] font-medium text-white">
              {t.featured.title}
            </span>
          )}
          <span className="absolute right-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
            {t.car.warranty} {formatYears(car.warrantyYears, locale, t.car.years)}
          </span>
        </div>

        <div className="space-y-3 p-5">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted">{car.brand}</p>
            <h3 className="mt-0.5 text-base font-medium text-white">{car.model}</h3>
          </div>

          <p className="text-xs text-muted">
            <span className="text-accent">{t.car.offer}:</span> {t.offers[car.offer]}
          </p>

          <div className="flex items-center justify-between border-t border-border pt-3">
            <span className="text-lg font-semibold text-white">
              {formatMoney(car.price, car.currency, t.car.uzs)}
            </span>
            <span className="text-sm text-accent transition-transform duration-200 group-hover:translate-x-1">→</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
