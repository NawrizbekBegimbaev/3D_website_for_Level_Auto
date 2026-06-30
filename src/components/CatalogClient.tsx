"use client";

import { useMemo, useState } from "react";
import { CarCard } from "./CarCard";
import { cars, brands, bodies, fuels, type Body, type Fuel } from "@/data/cars";
import { useLocale } from "@/i18n/locale-context";

type Sort = "newest" | "priceAsc" | "priceDesc";

export function CatalogClient() {
  const { t } = useLocale();
  const [brand, setBrand] = useState<string>("");
  const [body, setBody] = useState<Body | "">("");
  const [fuel, setFuel] = useState<Fuel | "">("");
  const [sort, setSort] = useState<Sort>("newest");

  const filtered = useMemo(() => {
    const list = cars.filter(
      (c) =>
        (!brand || c.brand === brand) &&
        (!body || c.body === body) &&
        (!fuel || c.fuel === fuel)
    );
    const sorted = [...list];
    if (sort === "priceAsc") sorted.sort((a, b) => a.priceUsd - b.priceUsd);
    else if (sort === "priceDesc") sorted.sort((a, b) => b.priceUsd - a.priceUsd);
    else sorted.sort((a, b) => b.year - a.year);
    return sorted;
  }, [brand, body, fuel, sort]);

  const hasFilters = brand || body || fuel;
  const reset = () => {
    setBrand("");
    setBody("");
    setFuel("");
  };

  const selectClass =
    "w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-accent appearance-none cursor-pointer";

  return (
    <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
      {/* Filters */}
      <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-2xl border border-border bg-surface/50 p-5">
          <div className="space-y-4">
            <Field label={t.catalog.filters.brand}>
              <select className={selectClass} value={brand} onChange={(e) => setBrand(e.target.value)}>
                <option value="">{t.catalog.filters.all}</option>
                {brands.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </Field>

            <Field label={t.catalog.filters.body}>
              <select className={selectClass} value={body} onChange={(e) => setBody(e.target.value as Body)}>
                <option value="">{t.catalog.filters.all}</option>
                {bodies.map((b) => (
                  <option key={b} value={b}>{t.bodyTypes[b]}</option>
                ))}
              </select>
            </Field>

            <Field label={t.catalog.filters.fuel}>
              <select className={selectClass} value={fuel} onChange={(e) => setFuel(e.target.value as Fuel)}>
                <option value="">{t.catalog.filters.all}</option>
                {fuels.map((f) => (
                  <option key={f} value={f}>{t.fuelTypes[f]}</option>
                ))}
              </select>
            </Field>

            {hasFilters && (
              <button onClick={reset} className="text-xs text-accent hover:text-accent-hover">
                {t.catalog.filters.reset}
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Results */}
      <div>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted">
            {filtered.length} {t.catalog.count}
          </p>
          <Field label="" inline>
            <select className={`${selectClass} w-auto`} value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
              <option value="newest">{t.catalog.sort.newest}</option>
              <option value="priceAsc">{t.catalog.sort.priceAsc}</option>
              <option value="priceDesc">{t.catalog.sort.priceDesc}</option>
            </select>
          </Field>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border py-20 text-center text-muted">
            {t.catalog.empty}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((car, i) => (
              <CarCard key={car.id} car={car} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, children, inline }: { label: string; children: React.ReactNode; inline?: boolean }) {
  if (inline) return <div className="flex items-center gap-2">{children}</div>;
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted">{label}</span>
      {children}
    </label>
  );
}
