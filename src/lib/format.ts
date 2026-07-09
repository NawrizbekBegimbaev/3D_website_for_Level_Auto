import type { Currency } from "@/data/cars";
import type { Locale } from "@/i18n/dictionaries";

/** Цена показывается в валюте прайса — доллары не конвертируются в сумы и наоборот. */
export function formatMoney(price: number, currency: Currency, uzsLabel: string): string {
  if (currency === "usd") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  }
  return `${new Intl.NumberFormat("ru-RU").format(price)} ${uzsLabel}`;
}

/**
 * "1 год" / "3 года" / "15 лет" — русский требует три формы, узбекский и
 * английский обходятся одной-двумя. Формы приходят из словаря.
 */
export function formatYears(
  years: number,
  locale: Locale,
  forms: { one: string; few: string; many: string }
): string {
  const rule = new Intl.PluralRules(locale).select(years);
  const word = rule === "one" ? forms.one : rule === "few" ? forms.few : forms.many;
  return `${years} ${word}`;
}
