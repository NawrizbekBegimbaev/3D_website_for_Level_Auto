export type Locale = "ru" | "uz" | "en";

export const locales: Locale[] = ["ru", "uz", "en"];
export const defaultLocale: Locale = "ru";
export const localeNames: Record<Locale, string> = { ru: "RU", uz: "UZ", en: "EN" };

export type Dict = {
  nav: { catalog: string; about: string; contact: string };
  hero: { eyebrow: string; title: string; titleAccent: string; subtitle: string; cta: string; secondary: string; stat1: string; stat1l: string; stat2: string; stat2l: string; stat3: string; stat3l: string };
  showcase: { eyebrow: string; title: string; hint: string; details: string; statsTitle: string };
  featured: { title: string; subtitle: string; viewAll: string };
  about: { title: string; body: string; p1t: string; p1b: string; p2t: string; p2b: string; p3t: string; p3b: string; p4t: string; p4b: string; p5t: string; p5b: string };
  catalog: {
    title: string;
    subtitle: string;
    count: string;
    /** «Цены на 30.06.2026» — дата подставляется в {date} */
    priceDate: string;
    filters: { brand: string; offer: string; all: string; reset: string };
    sort: { label: string; priceAsc: string; priceDesc: string };
    empty: string;
    from: string;
  };
  /** Опции из прайса: ламинация салона / тонировка / и то и другое. */
  offers: Record<"laminate" | "tint" | "tintLaminate", string>;
  car: {
    power: string;
    year: string;
    hp: string;
    request: string;
    back: string;
    warranty: string;
    offer: string;
    /** Заголовки блоков в карточке: выбор цвета кузова и дисков. */
    color: string;
    wheels: string;
    /** Демо-названия цветов (чёрный/белый/серебристый), пока нет реальных фото. */
    demoColors: [string, string, string];
    /** Валюта прайса для сумовых цен. */
    uzs: string;
    /** Формы слова «год» для Intl.PluralRules (ru: год/года/лет). */
    years: { one: string; few: string; many: string };
  };
  contact: { title: string; subtitle: string; name: string; phone: string; message: string; send: string; success: string; sending: string; error: string };
  footer: { tagline: string; rights: string; address: string; social: string };
};

export const dictionaries: Record<Locale, Dict> = {
  ru: {
    nav: { catalog: "Каталог", about: "О нас", contact: "Контакты" },
    hero: {
      eyebrow: "LevelAuto · Ташкент",
      title: "Автомобиль",
      titleAccent: "вашего уровня",
      subtitle: "Премиум — это не ценник, а стандарт. Находим, проверяем и привозим машину, которая ему соответствует.",
      cta: "Смотреть каталог",
      secondary: "Связаться с нами",
      stat1: "4+", stat1l: "лет на рынке",
      stat2: "500+", stat2l: "довольных клиентов",
      stat3: "100%", stat3l: "проверка истории",
    },
    showcase: { eyebrow: "Zeekr 7X · 2025", title: "Уровень виден в деталях", hint: "Прокрутите, чтобы повернуть", details: "Подробнее", statsTitle: "LevelAuto в цифрах" },
    featured: { title: "Избранное", subtitle: "Автомобили в наличии", viewAll: "Весь каталог" },
    about: {
      title: "Почему LevelAuto",
      body: "Мы привозим автомобили, которым доверяем сами.",
      p1t: "Проверка истории", p1b: "Полная диагностика и юридическая чистота каждого автомобиля.",
      p2t: "Подбор под ключ", p2b: "Найдём и доставим нужную комплектацию из-за рубежа.",
      p3t: "Сопровождение", p3b: "Оформление, страховка и сервис после покупки.",
      p4t: "Автокредит от 16%", p4b: "Рассрочка и кредит от банков-партнёров — оформим за один визит.",
      p5t: "Trade-in", p5b: "Примем ваш автомобиль в зачёт: оценка и обмен в день обращения.",
    },
    catalog: {
      title: "Каталог автомобилей",
      subtitle: "Актуальное наличие премиум-сегмента",
      count: "автомобилей",
      priceDate: "Цены на {date}",
      filters: { brand: "Марка", offer: "Опция", all: "Все", reset: "Сбросить фильтры" },
      sort: { label: "Сортировка", priceAsc: "Сначала дешевле", priceDesc: "Сначала дороже" },
      empty: "По вашему запросу ничего не найдено",
      from: "от",
    },
    offers: { laminate: "Ламинат салона", tint: "Тонировка", tintLaminate: "Тонировка + ламинат" },
    car: {
      power: "Мощность", year: "Год", hp: "л.с.",
      request: "Оставить заявку", back: "Назад к каталогу",
      warranty: "Гарантия", offer: "В подарок", uzs: "сум",
      color: "Цвет кузова", wheels: "Диски",
      demoColors: ["Чёрный", "Белый", "Серебристый"],
      years: { one: "год", few: "года", many: "лет" },
    },
    contact: { title: "Оставьте заявку", subtitle: "Перезвоним в течение 15 минут в рабочее время.", name: "Имя", phone: "Телефон", message: "Сообщение (необязательно)", send: "Отправить заявку", success: "Спасибо! Мы свяжемся с вами в ближайшее время.", sending: "Отправляем…", error: "Не удалось отправить заявку. Позвоните нам: +998 90 124 54 55" },
    footer: { tagline: "Ваш уровень. Ваш автомобиль.", rights: "Все права защищены.", address: "Ташкент, ул. Гавхар, 63", social: "Мы в сети" },
  },
  uz: {
    nav: { catalog: "Katalog", about: "Biz haqimizda", contact: "Aloqa" },
    hero: {
      eyebrow: "LevelAuto · Toshkent",
      title: "Sizning darajangizdagi",
      titleAccent: "avtomobil",
      subtitle: "Premium — bu narx emas, bu daraja. Shu darajaga mos mashinani topamiz, tekshiramiz va yetkazamiz.",
      cta: "Katalogni ko‘rish",
      secondary: "Biz bilan bog‘laning",
      stat1: "4+", stat1l: "yillik tajriba",
      stat2: "500+", stat2l: "mamnun mijoz",
      stat3: "100%", stat3l: "tarix tekshiruvi",
    },
    showcase: { eyebrow: "Zeekr 7X · 2025", title: "Daraja detallarda ko‘rinadi", hint: "Aylantirish uchun pastga suring", details: "Batafsil", statsTitle: "LevelAuto raqamlarda" },
    featured: { title: "Tanlangan", subtitle: "Mavjud avtomobillar", viewAll: "Butun katalog" },
    about: {
      title: "Nega LevelAuto",
      body: "Biz o‘zimiz ishonadigan avtomobillarni olib kelamiz.",
      p1t: "Tarix tekshiruvi", p1b: "Har bir avtomobilning to‘liq diagnostikasi va yuridik tozaligi.",
      p2t: "Kalit topshiriqli tanlov", p2b: "Kerakli komplektatsiyani chet eldan topib yetkazamiz.",
      p3t: "Hamrohlik", p3b: "Rasmiylashtirish, sug‘urta va sotuvdan keyingi xizmat.",
      p4t: "Avtokredit 16% dan", p4b: "Hamkor banklar krediti va bo‘lib to‘lash — bir tashrifda rasmiylashtiramiz.",
      p5t: "Trade-in", p5b: "Avtomobilingizni hisobga olamiz: baholash va almashuv shu kuni.",
    },
    catalog: {
      title: "Avtomobillar katalogi",
      subtitle: "Premium segment dolzarb mavjudligi",
      count: "avtomobil",
      priceDate: "{date} holatiga narxlar",
      filters: { brand: "Marka", offer: "Sovg‘a", all: "Barchasi", reset: "Filtrlarni tozalash" },
      sort: { label: "Saralash", priceAsc: "Avval arzon", priceDesc: "Avval qimmat" },
      empty: "So‘rovingiz bo‘yicha hech narsa topilmadi",
      from: "dan",
    },
    offers: { laminate: "Salon laminati", tint: "Tonirovka", tintLaminate: "Tonirovka + laminat" },
    car: {
      power: "Quvvat", year: "Yil", hp: "o.k.",
      request: "Ariza qoldirish", back: "Katalogga qaytish",
      warranty: "Kafolat", offer: "Sovg‘aga", uzs: "so‘m",
      color: "Kuzov rangi", wheels: "Disklar",
      demoColors: ["Qora", "Oq", "Kumushrang"],
      years: { one: "yil", few: "yil", many: "yil" },
    },
    contact: { title: "Ariza qoldiring", subtitle: "Ish vaqtida 15 daqiqada qo‘ng‘iroq qilamiz.", name: "Ism", phone: "Telefon", message: "Xabar (ixtiyoriy)", send: "Ariza yuborish", success: "Rahmat! Tez orada bog‘lanamiz.", sending: "Yuborilmoqda…", error: "Arizani yuborib bo‘lmadi. Qo‘ng‘iroq qiling: +998 90 124 54 55" },
    footer: { tagline: "Sizning darajangiz. Sizning avtomobilingiz.", rights: "Barcha huquqlar himoyalangan.", address: "Toshkent, Gavhar ko‘chasi, 63", social: "Ijtimoiy tarmoqlarda" },
  },
  en: {
    nav: { catalog: "Catalog", about: "About", contact: "Contact" },
    hero: {
      eyebrow: "LevelAuto · Tashkent",
      title: "A car worthy of",
      titleAccent: "your level",
      subtitle: "Premium isn't a price tag — it's a standard. We find, inspect and deliver the car that lives up to it.",
      cta: "Browse catalog",
      secondary: "Get in touch",
      stat1: "4+", stat1l: "years on the market",
      stat2: "500+", stat2l: "happy clients",
      stat3: "100%", stat3l: "history checked",
    },
    showcase: { eyebrow: "Zeekr 7X · 2025", title: "The level is in the details", hint: "Scroll to rotate", details: "Full details", statsTitle: "LevelAuto in numbers" },
    featured: { title: "Featured", subtitle: "Available now", viewAll: "Full catalog" },
    about: {
      title: "Why LevelAuto",
      body: "We import only the cars we trust ourselves.",
      p1t: "History check", p1b: "Full diagnostics and clean legal status for every car.",
      p2t: "Turnkey sourcing", p2b: "We find and deliver the exact spec from abroad.",
      p3t: "Full support", p3b: "Paperwork, insurance and after-sales service.",
      p4t: "Car loans from 16%", p4b: "Financing from partner banks — arranged in a single visit.",
      p5t: "Trade-in", p5b: "We take your current car in part-exchange, valued and swapped the same day.",
    },
    catalog: {
      title: "Car catalog",
      subtitle: "Current premium-segment availability",
      count: "cars",
      priceDate: "Prices as of {date}",
      filters: { brand: "Brand", offer: "Included", all: "All", reset: "Reset filters" },
      sort: { label: "Sort", priceAsc: "Price: low to high", priceDesc: "Price: high to low" },
      empty: "Nothing found for your query",
      from: "from",
    },
    offers: { laminate: "Interior lamination", tint: "Window tinting", tintLaminate: "Tinting + lamination" },
    car: {
      power: "Power", year: "Year", hp: "hp",
      request: "Request a quote", back: "Back to catalog",
      warranty: "Warranty", offer: "Included", uzs: "UZS",
      color: "Body colour", wheels: "Wheels",
      demoColors: ["Black", "White", "Silver"],
      years: { one: "year", few: "years", many: "years" },
    },
    contact: { title: "Request a quote", subtitle: "We call back within 15 minutes during business hours.", name: "Name", phone: "Phone", message: "Message (optional)", send: "Send request", success: "Thank you! We will contact you shortly.", sending: "Sending…", error: "Could not send your request. Please call us: +998 90 124 54 55" },
    footer: { tagline: "Your level. Your car.", rights: "All rights reserved.", address: "Tashkent, Gavhar St, 63", social: "Follow us" },
  },
};
