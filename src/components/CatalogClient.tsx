"use client";

import { useMemo, useState } from "react";
import { CarCard } from "./CarCard";
import { cars, brands, offers, priceInUsd, PRICE_LIST_DATE, type Offer } from "@/data/cars";
import { useLocale } from "@/i18n/locale-context";

type Sort = "priceAsc" | "priceDesc";

export function CatalogClient() {
  const { t } = useLocale();
  const [brand, setBrand] = useState<string>("");
  const [offer, setOffer] = useState<Offer | "">("");
  const [sort, setSort] = useState<Sort>("priceAsc");

  const filtered = useMemo(() => {
    const list = cars.filter((c) => (!brand || c.brand === brand) && (!offer || c.offer === offer));
    // Прайс смешанный (доллары + сумы), поэтому сравниваем по единой шкале.
    const sorted = [...list].sort((a, b) => priceInUsd(a) - priceInUsd(b));
    return sort === "priceDesc" ? sorted.reverse() : sorted;
  }, [brand, offer, sort]);

  const hasFilters = brand || offer;
  const reset = () => {
    setBrand("");
    setOffer("");
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

            <Field label={t.catalog.filters.offer}>
              <select className={selectClass} value={offer} onChange={(e) => setOffer(e.target.value as Offer)}>
                <option value="">{t.catalog.filters.all}</option>
                {offers.map((o) => (
                  <option key={o} value={o}>{t.offers[o]}</option>
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
          <div>
            <p className="text-sm text-muted">
              {filtered.length} {t.catalog.count}
            </p>
            <p className="mt-0.5 text-xs text-muted/70">
              {t.catalog.priceDate.replace("{date}", PRICE_LIST_DATE)}
            </p>
          </div>
          <Field label="" inline>
            <select className={`${selectClass} w-auto`} value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
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
