/**
 * Каталог LevelAuto — прайс-лист от 30.06.2026.
 *
 * ЗДЕСЬ ТОЛЬКО ТО, ЧТО ЕСТЬ В ПРАЙСЕ: модель, гарантия, опция и цена.
 * Год, пробег, кузов, мощность и цвет НЕ выдумываем — их в прайсе нет,
 * а ошибка в характеристиках на сайте автосалона = претензия от клиента.
 * Появятся реальные данные — расширяйте `Car` и заполняйте.
 */

export type Currency = "usd" | "uzs";
export type Offer = "laminate" | "tint" | "tintLaminate";

/** Вариант цвета кузова. `hex` — кружок-образец в UI; `image` — фото машины
 *  именно в этом цвете (кладём в /public/cars, ставим когда файл на месте). */
export interface ColorOption {
  /** Подпись под образцом: «Чёрный», «Snow White»… */
  name: string;
  /** Цвет кружка-свотча (#rrggbb). Для металликов берём близкий оттенок. */
  hex: string;
  /** Фото всей машины в этом цвете. */
  image: string;
}

/** Вариант дисков — фото самого диска (крупный план). */
export interface WheelOption {
  /** Подпись: «19" аэро», «21 DISK»… */
  name: string;
  /** Фото диска. Нет фото — в UI покажется чип с подписью (демо/заглушка). */
  image?: string;
}

export interface Car {
  id: string;
  brand: string;
  /** Модель с комплектацией, как в прайсе: "001 22 DISK", "M7 FULL". */
  model: string;
  warrantyYears: number;
  offer: Offer;
  price: number;
  currency: Currency;
  /** Градиент-заглушка: видна, пока нет фото (или если фото не загрузилось). */
  gradient: string;
  /**
   * Фото в /public/cars. Ставить ТОЛЬКО когда файл лежит на месте И вы видели,
   * что на нём именно эта машина.
   *
   * ⚠️ Нынешние снимки взяты из открытых источников (Wikimedia, автомобильные
   * издания, пресс-релизы марок) — права на них LevelAuto не принадлежат.
   * Под коммерческий сайт их надо заменить на собственные фото с площадки.
   */
  image?: string;
  featured?: boolean;
  /**
   * Доступные цвета кузова. Пусто, пока не пришлют фото. Заполнять по образцу:
   *   colors: [
   *     { name: "Чёрный", hex: "#111114", image: "/cars/roewe-m7-black.jpg" },
   *     { name: "Белый",  hex: "#e8e8ea", image: "/cars/roewe-m7-white.jpg" },
   *   ]
   * Первый цвет — «основной», показывается по умолчанию (если задан, заменяет `image`).
   */
  colors?: ColorOption[];
  /**
   * Варианты дисков. Пусто, пока не пришлют фото. Заполнять по образцу:
   *   wheels: [{ name: '21"', image: "/cars/zeekr-001-wheel-21.jpg" }]
   */
  wheels?: WheelOption[];
}

/** Дата прайса — показываем в каталоге, чтобы цены не выглядели вечными. */
export const PRICE_LIST_DATE = "30.06.2026";

/**
 * Курс нужен ИСКЛЮЧИТЕЛЬНО для сортировки по цене: в прайсе часть машин
 * в долларах, часть в сумах, и сравнивать их иначе нечем. На экран это
 * число не попадает — цена всегда показывается в той валюте, что в прайсе.
 */
export const UZS_PER_USD = 12_600;

export const cars: Car[] = [
  // ---------------------------- ROEWE ----------------------------
  {
    id: "roewe-m7",
    brand: "ROEWE",
    model: "M7",
    warrantyYears: 15,
    offer: "laminate",
    price: 22_900,
    currency: "usd",
    gradient: "from-purple-900 via-zinc-900 to-black",
    image: "/cars/roewe-m7.jpg",
  },
  {
    id: "roewe-m7-full",
    brand: "ROEWE",
    model: "M7 FULL",
    warrantyYears: 15,
    offer: "laminate",
    price: 24_900,
    currency: "usd",
    gradient: "from-violet-900 via-zinc-900 to-black",
    // FULL — та же машина, другая комплектация.
    image: "/cars/roewe-m7.jpg",
  },

  // ---------------------------- ZEEKR ----------------------------
  {
    id: "zeekr-001-21-disk",
    brand: "ZEEKR",
    model: "001 21 DISK",
    warrantyYears: 1,
    offer: "laminate",
    price: 63_000,
    currency: "usd",
    gradient: "from-sky-900 via-slate-900 to-black",
    // Три комплектации 001 отличаются дисками — кузов один, фото общее.
    image: "/cars/zeekr-001.jpg",
  },
  {
    id: "zeekr-001-22-disk",
    brand: "ZEEKR",
    model: "001 22 DISK",
    warrantyYears: 1,
    offer: "laminate",
    price: 65_000,
    currency: "usd",
    gradient: "from-blue-900 via-slate-900 to-black",
    image: "/cars/zeekr-001.jpg",
  },
  {
    id: "zeekr-001-22-no-sp",
    brand: "ZEEKR",
    model: "001 22 NO SP",
    warrantyYears: 1,
    offer: "laminate",
    price: 64_500,
    currency: "usd",
    gradient: "from-indigo-900 via-slate-900 to-black",
    image: "/cars/zeekr-001.jpg",
  },
  {
    id: "zeekr-7x-full",
    brand: "ZEEKR",
    model: "7X FULL",
    warrantyYears: 1,
    offer: "laminate",
    price: 57_000,
    currency: "usd",
    gradient: "from-red-900 via-zinc-900 to-black",
    image: "/cars/zeekr-7x.jpg",
    featured: true,
  },

  // ---------------------------- DEEPAL ---------------------------
  {
    id: "deepal-s07-215-max",
    brand: "DEEPAL",
    model: "S07 215 MAX",
    warrantyYears: 1,
    offer: "laminate",
    price: 25_500,
    currency: "usd",
    gradient: "from-cyan-900 via-zinc-900 to-black",
    image: "/cars/deepal-s07.jpg",
  },

  // ---------------------------- XPENG ----------------------------
  {
    id: "xpeng-p7-plus",
    brand: "XPENG",
    model: "P7+",
    warrantyYears: 3,
    offer: "laminate",
    price: 40_000,
    currency: "usd",
    gradient: "from-indigo-900 via-slate-900 to-black",
    image: "/cars/xpeng-p7-plus.jpg",
  },
  {
    id: "xpeng-g7",
    brand: "XPENG",
    model: "G7",
    warrantyYears: 3,
    offer: "laminate",
    price: 41_500,
    currency: "usd",
    gradient: "from-cyan-900 via-slate-900 to-black",
    image: "/cars/xpeng-g7.jpg",
  },

  // -------------------------- LEAPMOTOR --------------------------
  {
    id: "leapmotor-c10",
    brand: "LEAPMOTOR",
    model: "C10",
    warrantyYears: 3,
    offer: "laminate",
    price: 27_900,
    currency: "usd",
    gradient: "from-teal-900 via-zinc-900 to-black",
    image: "/cars/leapmotor-c10.jpg",
  },
  {
    id: "leapmotor-c16",
    brand: "LEAPMOTOR",
    model: "C16",
    warrantyYears: 3,
    offer: "laminate",
    price: 400_000_000,
    currency: "uzs",
    gradient: "from-emerald-900 via-zinc-900 to-black",
    image: "/cars/leapmotor-c16.jpg",
  },

  // ---------------------------- NAMMI ----------------------------
  {
    id: "nammi-06",
    brand: "NAMMI",
    model: "06",
    warrantyYears: 1,
    offer: "tint",
    price: 18_200,
    currency: "usd",
    gradient: "from-rose-900 via-zinc-900 to-black",
    image: "/cars/nammi-06.jpg",
  },
  {
    id: "nammi-06-full",
    brand: "NAMMI",
    model: "06 Full",
    warrantyYears: 1,
    offer: "tint",
    price: 20_500,
    currency: "usd",
    gradient: "from-pink-900 via-zinc-900 to-black",
    image: "/cars/nammi-06.jpg",
  },

  // ---------------------------- VOYAH ----------------------------
  {
    id: "voyah-free-318",
    brand: "VOYAH",
    model: "Free 318",
    warrantyYears: 3,
    offer: "tint",
    price: 504_000_000,
    currency: "uzs",
    gradient: "from-zinc-700 via-zinc-900 to-black",
    // «318» — запас хода гибрида, т.е. это Voyah Free (фейслифт), НЕ Free+.
    image: "/cars/voyah-free-318.jpg",
    featured: true,
  },
  {
    id: "voyah-plus",
    brand: "VOYAH",
    model: "Plus",
    warrantyYears: 3,
    offer: "tint",
    price: 553_000_000,
    currency: "uzs",
    gradient: "from-slate-700 via-slate-900 to-black",
    // ПРЕДПОЛОЖЕНИЕ: «Plus» = Voyah FREE+ (2-е поколение Free, 2025). Сходится
    // по цене — он дороже Free 318. Подтвердить у салона; если не он — снять фото.
    image: "/cars/voyah-plus.jpg",
  },
  {
    id: "voyah-taishan",
    brand: "VOYAH",
    model: "Taishan",
    warrantyYears: 3,
    offer: "tintLaminate",
    price: 87_500,
    currency: "usd",
    gradient: "from-neutral-600 via-neutral-800 to-black",
    image: "/cars/voyah-taishan.jpg",
    featured: true,
  },
  {
    id: "voyah-courage",
    brand: "VOYAH",
    model: "Courage",
    warrantyYears: 3,
    offer: "tint",
    price: 473_000_000,
    currency: "uzs",
    gradient: "from-stone-600 via-stone-800 to-black",
    image: "/cars/voyah-courage.jpg",
  },

  // ----------------------------- BMW -----------------------------
  {
    id: "bmw-i5-40l",
    brand: "BMW",
    model: "i5 40L",
    warrantyYears: 1,
    offer: "tintLaminate",
    price: 61_000,
    currency: "usd",
    gradient: "from-blue-900 via-zinc-900 to-black",
    image: "/cars/bmw-i5-40l.jpg",
  },

  // --------------------------- GAC AION --------------------------
  {
    id: "gac-aion-s7",
    brand: "GAC AION",
    model: "S7",
    warrantyYears: 1,
    offer: "tint",
    price: 42_000,
    currency: "usd",
    gradient: "from-amber-900 via-zinc-900 to-black",
    // В прайсе «GAC AION S7», но это GAC S7 (в Китае Trumpchi Xiangwang S7) —
    // модель GAC, а не суб-бренда Aion.
    image: "/cars/gac-aion-s7.jpg",
  },
  {
    id: "gac-aion-i60",
    brand: "GAC AION",
    model: "i60",
    warrantyYears: 1,
    offer: "tint",
    price: 24_500,
    currency: "usd",
    gradient: "from-orange-900 via-zinc-900 to-black",
    image: "/cars/gac-aion-i60.jpg",
  },
];

export const brands = [...new Set(cars.map((c) => c.brand))].sort();
export const offers: Offer[] = ["laminate", "tint", "tintLaminate"];

/** Единая шкала для сортировки — см. комментарий у UZS_PER_USD. */
export function priceInUsd(car: Car): number {
  return car.currency === "usd" ? car.price : car.price / UZS_PER_USD;
}

export function getCar(id: string): Car | undefined {
  return cars.find((c) => c.id === id);
}
