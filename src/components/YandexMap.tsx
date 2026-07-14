import { MAP, yandexStaticSrc, yandexMapLink } from "@/data/contacts";

/**
 * Карта салона — статическая картинка из Конструктора Яндекс.Карт (без API-ключа
 * и без единой кнопки). По клику открывается полная интерактивная карта в Яндексе.
 * `loading="lazy"` — картинка грузится, только когда доскроллили до неё.
 *
 * `className` управляет размером/формой обёртки: на страничном футере — компактный
 * квадрат, в футере главной (3D-витрина) — низкая полоска. Картинка вписывается
 * через object-cover, метка «LevelAuto» по центру остаётся видна в любой форме.
 */
export function YandexMap({
  title,
  className = "aspect-square w-full max-w-[240px]",
}: {
  title: string;
  className?: string;
}) {
  return (
    <a
      href={yandexMapLink(MAP)}
      target="_blank"
      rel="noopener noreferrer"
      title={title}
      aria-label={title}
      className={`block overflow-hidden rounded-2xl border border-border bg-surface transition-opacity hover:opacity-90 ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- внешняя карта-картинка Яндекса (302→PNG); next/image потребовал бы remotePatterns на редирект-хост */}
      <img
        src={yandexStaticSrc(MAP)}
        alt={title}
        loading="lazy"
        className="h-full w-full object-cover"
      />
    </a>
  );
}
