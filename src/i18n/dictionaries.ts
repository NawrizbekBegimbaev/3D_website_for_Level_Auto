export type Locale = "ru" | "uz" | "en";

export const locales: Locale[] = ["ru", "uz", "en"];
export const defaultLocale: Locale = "ru";
export const localeNames: Record<Locale, string> = { ru: "RU", uz: "UZ", en: "EN" };

export type Dict = {
  nav: { catalog: string; about: string; contact: string };
  hero: { eyebrow: string; title: string; titleAccent: string; subtitle: string; cta: string; secondary: string; stat1: string; stat1l: string; stat2: string; stat2l: string; stat3: string; stat3l: string };
  showcase: { eyebrow: string; title: string; hint: string; details: string; statsTitle: string };
  featured: { title: string; subtitle: string; viewAll: string };
  about: { title: string; body: string; p1t: string; p1b: string; p2t: string; p2b: string; p3t: string; p3b: string };
  catalog: {
    title: string;
    subtitle: string;
    count: string;
    filters: { brand: string; body: string; fuel: string; all: string; reset: string };
    sort: { label: string; priceAsc: string; priceDesc: string; newest: string };
    empty: string;
    from: string;
  };
  bodyTypes: Record<"sedan" | "suv" | "coupe" | "crossover", string>;
  fuelTypes: Record<"petrol" | "diesel" | "hybrid" | "electric", string>;
  car: { mileage: string; power: string; fuel: string; year: string; transmission: string; body: string; color: string; automatic: string; manual: string; hp: string; request: string; back: string };
  contact: { title: string; subtitle: string; name: string; phone: string; message: string; send: string; success: string; sending: string };
  footer: { tagline: string; rights: string; address: string; phone: string };
};

export const dictionaries: Record<Locale, Dict> = {
  ru: {
    nav: { catalog: "Каталог", about: "О нас", contact: "Контакты" },
    hero: {
      eyebrow: "LevelAuto · Ташкент",
      title: "Премиальные автомобили",
      titleAccent: "нового уровня",
      subtitle: "Эксклюзивный подбор, проверка и доставка автомобилей класса люкс по всему Узбекистану.",
      cta: "Смотреть каталог",
      secondary: "Связаться с нами",
      stat1: "12+", stat1l: "лет на рынке",
      stat2: "500+", stat2l: "довольных клиентов",
      stat3: "100%", stat3l: "проверка истории",
    },
    showcase: { eyebrow: "Zeekr 7X · 2025", title: "Рассмотрите каждую деталь", hint: "Прокрутите, чтобы повернуть", details: "Подробнее", statsTitle: "LevelAuto в цифрах" },
    featured: { title: "Избранное", subtitle: "Автомобили в наличии", viewAll: "Весь каталог" },
    about: {
      title: "Почему LevelAuto",
      body: "Мы привозим автомобили, которым доверяем сами.",
      p1t: "Проверка истории", p1b: "Полная диагностика и юридическая чистота каждого автомобиля.",
      p2t: "Подбор под ключ", p2b: "Найдём и доставим нужную комплектацию из-за рубежа.",
      p3t: "Сопровождение", p3b: "Оформление, страховка и сервис после покупки.",
    },
    catalog: {
      title: "Каталог автомобилей",
      subtitle: "Актуальное наличие премиум-сегмента",
      count: "автомобилей",
      filters: { brand: "Марка", body: "Кузов", fuel: "Топливо", all: "Все", reset: "Сбросить фильтры" },
      sort: { label: "Сортировка", priceAsc: "Сначала дешевле", priceDesc: "Сначала дороже", newest: "Сначала новее" },
      empty: "По вашему запросу ничего не найдено",
      from: "от",
    },
    bodyTypes: { sedan: "Седан", suv: "Внедорожник", coupe: "Купе", crossover: "Кроссовер" },
    fuelTypes: { petrol: "Бензин", diesel: "Дизель", hybrid: "Гибрид", electric: "Электро" },
    car: { mileage: "Пробег", power: "Мощность", fuel: "Топливо", year: "Год", transmission: "КПП", body: "Кузов", color: "Цвет", automatic: "Автомат", manual: "Механика", hp: "л.с.", request: "Оставить заявку", back: "Назад к каталогу" },
    contact: { title: "Оставьте заявку", subtitle: "Перезвоним в течение 15 минут в рабочее время.", name: "Имя", phone: "Телефон", message: "Сообщение (необязательно)", send: "Отправить заявку", success: "Спасибо! Мы свяжемся с вами в ближайшее время.", sending: "Отправляем…" },
    footer: { tagline: "Премиальные автомобили нового уровня.", rights: "Все права защищены.", address: "Ташкент, Узбекистан", phone: "+998 71 200 00 00" },
  },
  uz: {
    nav: { catalog: "Katalog", about: "Biz haqimizda", contact: "Aloqa" },
    hero: {
      eyebrow: "LevelAuto · Toshkent",
      title: "Premium avtomobillar —",
      titleAccent: "yangi daraja",
      subtitle: "Hashamatli avtomobillarni eksklyuziv tanlash, tekshirish va O‘zbekiston bo‘ylab yetkazib berish.",
      cta: "Katalogni ko‘rish",
      secondary: "Biz bilan bog‘laning",
      stat1: "12+", stat1l: "yillik tajriba",
      stat2: "500+", stat2l: "mamnun mijoz",
      stat3: "100%", stat3l: "tarix tekshiruvi",
    },
    showcase: { eyebrow: "Zeekr 7X · 2025", title: "Har bir detalni ko‘ring", hint: "Aylantirish uchun pastga suring", details: "Batafsil", statsTitle: "LevelAuto raqamlarda" },
    featured: { title: "Tanlangan", subtitle: "Mavjud avtomobillar", viewAll: "Butun katalog" },
    about: {
      title: "Nega LevelAuto",
      body: "Biz o‘zimiz ishonadigan avtomobillarni olib kelamiz.",
      p1t: "Tarix tekshiruvi", p1b: "Har bir avtomobilning to‘liq diagnostikasi va yuridik tozaligi.",
      p2t: "Kalit topshiriqli tanlov", p2b: "Kerakli komplektatsiyani chet eldan topib yetkazamiz.",
      p3t: "Hamrohlik", p3b: "Rasmiylashtirish, sug‘urta va sotuvdan keyingi xizmat.",
    },
    catalog: {
      title: "Avtomobillar katalogi",
      subtitle: "Premium segment dolzarb mavjudligi",
      count: "avtomobil",
      filters: { brand: "Marka", body: "Kuzov", fuel: "Yoqilg‘i", all: "Barchasi", reset: "Filtrlarni tozalash" },
      sort: { label: "Saralash", priceAsc: "Avval arzon", priceDesc: "Avval qimmat", newest: "Avval yangi" },
      empty: "So‘rovingiz bo‘yicha hech narsa topilmadi",
      from: "dan",
    },
    bodyTypes: { sedan: "Sedan", suv: "Yo‘ltanlamas", coupe: "Kupe", crossover: "Krossover" },
    fuelTypes: { petrol: "Benzin", diesel: "Dizel", hybrid: "Gibrid", electric: "Elektr" },
    car: { mileage: "Yurgan masofa", power: "Quvvat", fuel: "Yoqilg‘i", year: "Yil", transmission: "Uzatma", body: "Kuzov", color: "Rang", automatic: "Avtomat", manual: "Mexanika", hp: "o.k.", request: "Ariza qoldirish", back: "Katalogga qaytish" },
    contact: { title: "Ariza qoldiring", subtitle: "Ish vaqtida 15 daqiqada qo‘ng‘iroq qilamiz.", name: "Ism", phone: "Telefon", message: "Xabar (ixtiyoriy)", send: "Ariza yuborish", success: "Rahmat! Tez orada bog‘lanamiz.", sending: "Yuborilmoqda…" },
    footer: { tagline: "Yangi darajadagi premium avtomobillar.", rights: "Barcha huquqlar himoyalangan.", address: "Toshkent, O‘zbekiston", phone: "+998 71 200 00 00" },
  },
  en: {
    nav: { catalog: "Catalog", about: "About", contact: "Contact" },
    hero: {
      eyebrow: "LevelAuto · Tashkent",
      title: "Premium cars on",
      titleAccent: "a new level",
      subtitle: "Exclusive sourcing, inspection and delivery of luxury vehicles across Uzbekistan.",
      cta: "Browse catalog",
      secondary: "Get in touch",
      stat1: "12+", stat1l: "years on the market",
      stat2: "500+", stat2l: "happy clients",
      stat3: "100%", stat3l: "history checked",
    },
    showcase: { eyebrow: "Zeekr 7X · 2025", title: "Explore every detail", hint: "Scroll to rotate", details: "Full details", statsTitle: "LevelAuto in numbers" },
    featured: { title: "Featured", subtitle: "Available now", viewAll: "Full catalog" },
    about: {
      title: "Why LevelAuto",
      body: "We import only the cars we trust ourselves.",
      p1t: "History check", p1b: "Full diagnostics and clean legal status for every car.",
      p2t: "Turnkey sourcing", p2b: "We find and deliver the exact spec from abroad.",
      p3t: "Full support", p3b: "Paperwork, insurance and after-sales service.",
    },
    catalog: {
      title: "Car catalog",
      subtitle: "Current premium-segment availability",
      count: "cars",
      filters: { brand: "Brand", body: "Body", fuel: "Fuel", all: "All", reset: "Reset filters" },
      sort: { label: "Sort", priceAsc: "Price: low to high", priceDesc: "Price: high to low", newest: "Newest first" },
      empty: "Nothing found for your query",
      from: "from",
    },
    bodyTypes: { sedan: "Sedan", suv: "SUV", coupe: "Coupe", crossover: "Crossover" },
    fuelTypes: { petrol: "Petrol", diesel: "Diesel", hybrid: "Hybrid", electric: "Electric" },
    car: { mileage: "Mileage", power: "Power", fuel: "Fuel", year: "Year", transmission: "Transmission", body: "Body", color: "Color", automatic: "Automatic", manual: "Manual", hp: "hp", request: "Request a quote", back: "Back to catalog" },
    contact: { title: "Request a quote", subtitle: "We call back within 15 minutes during business hours.", name: "Name", phone: "Phone", message: "Message (optional)", send: "Send request", success: "Thank you! We will contact you shortly.", sending: "Sending…" },
    footer: { tagline: "Premium cars on a new level.", rights: "All rights reserved.", address: "Tashkent, Uzbekistan", phone: "+998 71 200 00 00" },
  },
};
