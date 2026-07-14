"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Car, ColorOption, WheelOption } from "@/data/cars";
import { useLocale } from "@/i18n/locale-context";

// Демо-набор, пока не пришлют реальные фото по каждой машине. Показывает саму
// механику выбора; картинка пока одна на все цвета — заменится, когда в
// data/cars.ts у машины появятся собственные `colors` / `wheels` с фото.
const DEMO_HEX = ["#111114", "#e9e9ec", "#9aa0a6"]; // чёрный / белый / серебристый
const DEMO_WHEELS = ['18"', '19"', '20"'];

/**
 * Витрина карточки: главное фото + переключатели цвета кузова и дисков.
 * Если у машины заданы реальные `colors` / `wheels` — берём их; иначе показываем
 * демо-заглушку (3 цвета + 3 диска), чтобы блок выбора был виден уже сейчас.
 */
export function CarGallery({ car }: { car: Car }) {
  const { t } = useLocale();

  const colors: ColorOption[] =
    car.colors?.length
      ? car.colors
      : DEMO_HEX.map((hex, i) => ({ name: t.car.demoColors[i], hex, image: car.image ?? "" }));

  const wheels: WheelOption[] =
    car.wheels?.length ? car.wheels : DEMO_WHEELS.map((name) => ({ name }));

  const defaultSrc = colors[0]?.image || car.image;
  const [activeSrc, setActiveSrc] = useState<string | undefined>(defaultSrc);
  const [activeKey, setActiveKey] = useState("c0");

  // src может отсутствовать (диск-заглушка без фото) — тогда меняем только подсветку.
  const select = (key: string, src?: string) => {
    setActiveKey(key);
    if (src) setActiveSrc(src);
  };

  return (
    <div className="space-y-5">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className={`relative flex aspect-[16/11] items-center justify-center overflow-hidden rounded-3xl border border-border bg-gradient-to-br ${car.gradient}`}
      >
        <span className="text-6xl font-semibold tracking-tight text-white/10">{car.brand}</span>
        {activeSrc && (
          <Image
            key={activeSrc}
            src={activeSrc}
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

      {colors.length > 0 && (
        <div>
          <div className="mb-2.5 flex items-baseline justify-between">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">{t.car.color}</p>
            <p className="text-sm font-medium text-white">
              {colors.find((_, i) => activeKey === `c${i}`)?.name ?? colors[0].name}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {colors.map((c, i) => {
              const key = `c${i}`;
              const on = activeKey === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => select(key, c.image)}
                  aria-label={c.name}
                  aria-pressed={on}
                  title={c.name}
                  className={`h-10 w-10 rounded-full border-2 transition-transform hover:scale-110 ${
                    on
                      ? "border-accent ring-2 ring-accent ring-offset-2 ring-offset-background"
                      : "border-white/25"
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
              );
            })}
          </div>
        </div>
      )}

      {wheels.length > 0 && (
        <div>
          <p className="mb-2.5 text-xs font-medium uppercase tracking-wide text-muted">{t.car.wheels}</p>
          <div className="flex flex-wrap gap-3">
            {wheels.map((w, i) => {
              const key = `w${i}`;
              const on = activeKey === key;
              const ring = on ? "border-accent ring-2 ring-accent" : "border-border";
              return w.image ? (
                <button
                  key={key}
                  type="button"
                  onClick={() => select(key, w.image)}
                  aria-label={w.name}
                  aria-pressed={on}
                  title={w.name}
                  className={`relative h-16 w-16 overflow-hidden rounded-xl border-2 bg-surface transition-transform hover:scale-105 ${ring}`}
                >
                  <Image src={w.image} alt={w.name} fill sizes="64px" className="object-cover" />
                </button>
              ) : (
                <button
                  key={key}
                  type="button"
                  onClick={() => select(key)}
                  aria-pressed={on}
                  className={`h-16 w-16 rounded-xl border-2 bg-surface text-sm font-medium text-white transition-transform hover:scale-105 ${ring}`}
                >
                  {w.name}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
