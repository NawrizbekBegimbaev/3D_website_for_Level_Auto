/** Real LevelAuto contact details. Locale-independent, so they live here
 *  rather than in the dictionaries — only the labels around them are translated. */

export const PHONES = ["+998 90 124 54 55", "+998 50 757 77 27"] as const;

/** `tel:` needs the bare E.164 number. */
export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

export const SOCIALS = [
  { name: "Instagram", handle: "@levelauto_uz", url: "https://instagram.com/levelauto_uz" },
  { name: "YouTube", handle: "@levelauto_uz", url: "https://youtube.com/@levelauto_uz" },
] as const;

/**
 * Салон на Яндекс.Картах — СТАТИЧЕСКАЯ карта из Конструктора Яндекса.
 * Картинка (метка «LevelAuto» на ул. Гавхар, 63) без единой кнопки — интерактивный
 * виджет их не отключает, а конструктор-картинка чистая. По клику открывается
 * полная карта в Яндексе.
 *
 * `id` — идентификатор карты из Конструктора (yandex.ru/map-constructor). Чтобы
 * переставить метку/зум — открыть ту же карту в конструкторе, сохранить, при смене
 * ID вписать новый сюда. Размеры (width/height) задаём с запасом; на сайте картинка
 * обрезается под нужную форму через object-cover, метка по центру остаётся видна.
 */
export const MAP = {
  id: "a4699b2ea897e978a26ae4c0ca48ea7589c56f6524fd240934315086bba6b585",
} as const;

/** URL картинки статической карты (Яндекс сам редиректит на подписанный PNG). */
export const yandexStaticSrc = ({ id }: typeof MAP) =>
  `https://api-maps.yandex.ru/services/constructor/1.0/static/?um=constructor:${id}&width=600&height=450&lang=ru_RU`;

/** Ссылка на полную интерактивную карту — открывается по клику на картинку. */
export const yandexMapLink = ({ id }: typeof MAP) =>
  `https://yandex.ru/maps/?um=constructor:${id}&source=constructorLink`;
