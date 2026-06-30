"use client";

import Link from "next/link";
import { CarCard } from "./CarCard";
import { Reveal } from "./Reveal";
import { cars } from "@/data/cars";
import { useLocale } from "@/i18n/locale-context";

export function FeaturedCars() {
  const { t } = useLocale();
  const featured = cars.filter((c) => c.featured).slice(0, 3);

  return (
    <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
      <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-accent">{t.featured.subtitle}</p>
          <h2 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">{t.featured.title}</h2>
        </div>
        <Link href="/catalog" className="text-sm text-muted transition-colors hover:text-white">
          {t.featured.viewAll} →
        </Link>
      </Reveal>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((car, i) => (
          <CarCard key={car.id} car={car} index={i} />
        ))}
      </div>
    </section>
  );
}
