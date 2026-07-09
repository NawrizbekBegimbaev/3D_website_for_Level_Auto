# LevelAuto — premium car dealership website

Сайт автосалона **LevelAuto** (levelauto.uz, Ташкент) — тёмный люкс, мультиязычный, с 3D-витриной авто.

## Стек

- **Next.js 16** (App Router, `src/`, **Turbopack**) + **React 19** + **TypeScript**
- **Tailwind CSS v4** (конфиг через `@theme` в CSS, не `tailwind.config`)
- **framer-motion** — анимации UI (reveal при скролле, hero)
- **React Three Fiber 9 + @react-three/drei 10 + three 0.185** — 3D-витрина
- Шрифт **Inter** (next/font, subsets latin+cyrillic)

## Команды

```bash
npm run dev      # дев-сервер (порт 3000; конфиг в .claude/launch.json как "levelauto-dev")
npm run build    # прод-сборка (всегда прогонять перед завершением задачи)
npm run lint
```

Дев-сервер запускать через preview-инструмент по имени `levelauto-dev`, не плодить параллельные `next dev`.

Форма работает и в `npm run dev` — нужен только `.env.local` (см. `.env.example`).

Шрифты на самом деле **Montserrat** (заголовки) + **Manrope** (текст), не Inter.

## Дизайн-система (`src/app/globals.css`)

Тёмный люкс. Токены через `@theme inline` → доступны как Tailwind-классы:

- `--background: #08080a` (фон сайта), `--surface: #111114`, `--surface-2: #17171b`, `--border: #26262c`
- `--foreground: #f4f4f5`, `--muted: #a1a1aa`
- **Акцент красный** `--accent: #dc2626` (`bg-accent`/`text-accent`), `--accent-hover: #ef4444`
- Вторичный синий `--secondary: #2563eb`
- Хелперы: `.text-gradient`, `.glow-accent`, `.hero-grid`
- Логотип LevelAuto: красный/синий/белый на чёрном (`src/components/Logo.tsx`).
  Настоящий знак, векторизованный из фирменной картинки: пути строго симметричны
  относительно `x=314`, цвета берутся из токенов (`--accent`/`--secondary`/`--foreground`).
  `<Logo variant="mark">` — только шеврон «LEVEL» (для хедера, где строка «AUTO» нечитаема);
  `variant="full"` (по умолчанию) добавляет линейки и «AUTO» (подпись — текст шрифтом Manrope,
  не путь, чтобы оставаться чёткой). Копия для favicon/OG — `public/logo.svg`.

## i18n — RU / UZ / EN

- **Не через route-сегменты.** React-контекст `src/i18n/locale-context.tsx` (`useLocale()` → `{ locale, setLocale, t }`), выбор хранится в `localStorage`, `<html lang>` обновляется эффектом.
- Все строки — в `src/i18n/dictionaries.ts` (типизированный `Dict`). Новый текст добавлять в тип `Dict` И во все три локали (`ru`/`uz`/`en`), иначе TS-ошибка.
- Компоненты с текстом — клиентские (`"use client"`), берут `t` из `useLocale()`.

## Структура

```
src/
  app/
    layout.tsx            # root: html/body, Inter, LocaleProvider, Header, Footer, metadata
    page.tsx              # главная = ТОЛЬКО <CarShowcase/> (форма и футер — его последние этапы)
    catalog/page.tsx      # каталог (фильтры + сортировка)
    catalog/[id]/page.tsx # карточка авто (SSG, generateStaticParams)
    contact/page.tsx
  components/
    Header.tsx Footer.tsx Logo.tsx LocaleSwitcher.tsx
    Hero.tsx              # НЕ используется (тексты переехали в CarShowcase) — можно удалить
    CarShowcase.tsx       # 3D-витрина (см. ниже)
    CarCard.tsx FeaturedCars.tsx CatalogClient.tsx CatalogHeader.tsx
    CarDetail.tsx ContactForm.tsx ContactSection.tsx About.tsx Reveal.tsx
  data/cars.ts            # каталог-заглушка (6 авто) — под замену на реальный фид/CMS
  data/contacts.ts        # реальные телефоны + Instagram/YouTube (не в словарях: не переводятся)
  i18n/dictionaries.ts i18n/locale-context.tsx
  lib/format.ts           # formatPrice, formatKm
public/models/zeekr_7x_2025_v4.glb  # 3D-модель, meshopt-сжатая (~5.6 МБ)
public/hdri/studio.hdr              # локальная студийная HDRI (~1.6 МБ)
```

## 3D-витрина — `src/components/CarShowcase.tsx`

**Это первая (входная) секция главной**; сайт идёт после неё. Стиль — концепт «collectcar».

- Закреплённая (`sticky`) full-screen секция высотой **320vh**; машина по центру на весь экран.
- В покое (p=0) — машина строго **в профиль** (`REST_Y = π/2`).
- **Тумблинг по скроллу**, привязка к прогрессу 0→1 (НЕ к скорости), реверсивно: вращение 360° по Y + наклон по X (`sin(p·π)·0.5`, видна крыша). Сглаживание `THREE.MathUtils.damp` (инерция).
- **Собственный rAF-хук scroll-прогресса** (не `ScrollControls`) — одной шкалой управляются и 3D-вращение (через `progress` ref в `useFrame`), и DOM: цвет фона + номер позиции + активный этап.
- **Фон**: плавный градиент по скроллу `COLOR_STOPS` = `#08080a` (фон сайта) → красный (`hexLerp`, прямая мутация DOM-слоя). Canvas — `alpha:true`, фон-слой просвечивает.
- **5 этапов** (= длина `COLOR_STOPS`, позиции `01–05`): `stage = floor(p·5)` — интро → «Почему LevelAuto» (5 карточек: проверка, подбор, сопровождение, **автокредит от 16%**, **trade-in**) → цифры (4+/500+/100%) → форма → футер. На каждом crossfade'ом сменяется слой текста.
- **Производительность.** Канвас в `frameloop="demand"`: кадр рисуется, только когда `CarModel` ещё не «доехал» до целевой позы (проверка `settled` в `useFrame`) либо когда scroll-тикер дёргает `invalidate()`. В покое сцена **не рендерит ничего** (было ~730 draw-call/с). Там же: `dpr={[1,1.5]}`, `ContactShadows resolution={256}`, а фон — сплошной `backgroundColor` + **статичный** слой-виньетка `VIGNETTE` (альфа-композитинг поверх заливки математически равен прежнему пересчёту `radial-gradient` каждый кадр). Неактивные `<Stage>` уходят в `visibility:hidden` после фейда, иначе их `backdrop-blur` пересчитывался бы на каждом кадре.
- HUD: настоящий глобальный `<Header/>` сверху (фейковую панель collectcar убрали); справа — `ZEEKR 7X / $62,000 / Tashkent`; слева — `0X/04` + стрелки; снизу — характеристики + «Подробнее»; CTA-кнопки постоянные.
- Освещение: ambient + 2 directional + `Environment preset="studio"` + `ContactShadows`. `<Suspense>` + drei `<Loader>` на время загрузки GLB.
- Модель: `useGLTF(url, false, true)` (**meshopt**, не Draco), авто-центрируется и нормализуется (`FIT=6.4`). **Пол `carplane_floor_0` удаляется из сцены до замера габаритов** (иначе машина мелкая и виден белый подиум). Часть материалов принудительно чернится (`BLACKEN`).

### Если меняешь витрину
- Скорость/обороты — множитель в `targetY`; сила наклона — коэффициент в `targetX`; длина секции — `h-[320vh]`.
- Число этапов завязано на длину `COLOR_STOPS`, на блоки `<Stage active={stage === N}>` и на якоря scroll-snap внизу секции.
- Если правишь анимацию — не забудь `invalidate()`: при `frameloop="demand"` кадр без него просто не отрисуется.
- Чтобы подставить другую модель: положить glb в `public/models/`, поправить `MODEL_URL`; проверить ось профиля (`REST_Y`).

## Хостинг — Vercel

Раньше был Cloudflare Workers + `output: "export"`. Ушли с него: панель `dash.cloudflare.com`
недоступна из Ташкента (403), а без неё нет ни OAuth, ни API-токена — деплоить нечем.

Сейчас `next.config.ts` **без** `output: "export"`. Страницы всё равно пререндерятся (SSG/static),
динамический ровно один роут — `/api/lead`. В выводе `npm run build` он помечен `ƒ (Dynamic)`.

## Форма заявки → Telegram (`src/app/api/lead/route.ts`)

- `ContactForm` шлёт `POST /api/lead` (JSON: `name`, `phone`, `message`, `subject`, `locale`, `page`, `company`).
- Роут валидирует, экранирует HTML и вызывает `api.telegram.org/bot<TOKEN>/sendMessage`.
- **Токен только на сервере**, в браузер не попадает: класть его в клиентский код нельзя
  (`NEXT_PUBLIC_*` — тем более). Переменные: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`.
  Локально — `.env.local` (gitignored, шаблон `.env.example`); на Vercel — Project → Settings →
  Environment Variables.
- Заявки идут в группу «Level Auto Uz: Заявки» (бот `@level_auto_uz_bot`). Её `chat_id` — id
  **обычной** группы; если её повысят до супергруппы, id сменится на `-100…` и заявки молча
  перестанут приходить. Тогда: `getUpdates` → новый id → обновить переменную.
- Антиспам: honeypot-поле `company` (скрытое; если заполнено — заявка молча отбрасывается, 200),
  лимиты длин, проверка телефона. Turnstile пока не подключён.
- Новый текст ошибок формы — `t.contact.error` (во всех трёх локалях).

## Готчи / важное

- **Параллельные `npm install` в одном проекте бьют `node_modules/three`** → Turbopack падает с `Unterminated block comment` в `three.core.js`. Ставить пакеты по одному; при странных ошибках three: `rm -rf .next` + перезапуск дева (файл при этом обычно целый — проверять `node -e "require('three')"`).
- Tailwind v4: цвета берутся из `@theme` в `globals.css`, отдельного `tailwind.config` нет.
- Папка проекта называется `ClaudeLearn` (с заглавными) — npm не даёт так назвать пакет; имя пакета в `package.json` = `levelauto`.

## TODO / возможные шаги

- Реальные фото и данные авто (сейчас заглушки + градиенты).
- Антиспам посерьёзнее: капча (Turnstile / hCaptcha) перед `/api/lead` (сейчас только honeypot).
- Отдельная страница «О нас», деплой.
- Подключить `public/logo.svg` как favicon / OG-картинку (сейчас файл есть, но не используется).
- Опционально удалить неиспользуемый `Hero.tsx`.
