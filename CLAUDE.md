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

## Дизайн-система (`src/app/globals.css`)

Тёмный люкс. Токены через `@theme inline` → доступны как Tailwind-классы:

- `--background: #08080a` (фон сайта), `--surface: #111114`, `--surface-2: #17171b`, `--border: #26262c`
- `--foreground: #f4f4f5`, `--muted: #a1a1aa`
- **Акцент красный** `--accent: #dc2626` (`bg-accent`/`text-accent`), `--accent-hover: #ef4444`
- Вторичный синий `--secondary: #2563eb`
- Хелперы: `.text-gradient`, `.glow-accent`, `.hero-grid`
- Логотип LevelAuto: красный/синий/белый на чёрном (`src/components/Logo.tsx`)

## i18n — RU / UZ / EN

- **Не через route-сегменты.** React-контекст `src/i18n/locale-context.tsx` (`useLocale()` → `{ locale, setLocale, t }`), выбор хранится в `localStorage`, `<html lang>` обновляется эффектом.
- Все строки — в `src/i18n/dictionaries.ts` (типизированный `Dict`). Новый текст добавлять в тип `Dict` И во все три локали (`ru`/`uz`/`en`), иначе TS-ошибка.
- Компоненты с текстом — клиентские (`"use client"`), берут `t` из `useLocale()`.

## Структура

```
src/
  app/
    layout.tsx            # root: html/body, Inter, LocaleProvider, Header, Footer, metadata
    page.tsx              # главная: CarShowcase → FeaturedCars → About → ContactSection
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
  i18n/dictionaries.ts i18n/locale-context.tsx
  lib/format.ts           # formatPrice, formatKm
public/models/zeekr_7x_2025.glb   # 3D-модель (~31 МБ)
```

## 3D-витрина — `src/components/CarShowcase.tsx`

**Это первая (входная) секция главной**; сайт идёт после неё. Стиль — концепт «collectcar».

- Закреплённая (`sticky`) full-screen секция высотой **320vh**; машина по центру на весь экран.
- В покое (p=0) — машина строго **в профиль** (`REST_Y = π/2`).
- **Тумблинг по скроллу**, привязка к прогрессу 0→1 (НЕ к скорости), реверсивно: вращение 360° по Y + наклон по X (`sin(p·π)·0.5`, видна крыша). Сглаживание `THREE.MathUtils.damp` (инерция).
- **Собственный rAF-хук scroll-прогресса** (не `ScrollControls`) — одной шкалой управляются и 3D-вращение (через `progress` ref в `useFrame`), и DOM: цвет фона + номер позиции + активный этап.
- **Фон**: плавный градиент по скроллу `COLOR_STOPS` = `#08080a` (фон сайта) → красный (`hexLerp`, прямая мутация DOM-слоя). Canvas — `alpha:true`, фон-слой просвечивает.
- **4 этапа** (= 4 цвета/позиции `01–04`): `stage = floor(p·4)`. На каждом этапе crossfade сменяется центральный текст (бывший Hero): этап 1 — заголовок+подзаголовок+eyebrow, этапы 2-4 — статы 12+/500+/100% (из `t.hero`).
- HUD: настоящий глобальный `<Header/>` сверху (фейковую панель collectcar убрали); справа — `ZEEKR 7X / $62,000 / Tashkent`; слева — `0X/04` + стрелки; снизу — характеристики + «Подробнее»; CTA-кнопки постоянные.
- Освещение: ambient + 2 directional + `Environment preset="studio"` + `ContactShadows`. `<Suspense>` + drei `<Loader>` на время загрузки GLB.
- Модель: `useGLTF(url, true)` (Draco), авто-центрируется и нормализуется (`FIT=6.4`). **Пол `carplane_floor_0` удаляется из сцены до замера габаритов** (иначе машина мелкая и виден белый подиум).

### Если меняешь витрину
- Скорость/обороты — множитель в `targetY`; сила наклона — коэффициент в `targetX`; длина секции — `h-[320vh]`.
- Число этапов завязано на длину `COLOR_STOPS` и массив `slides`.
- Чтобы подставить другую модель: положить glb в `public/models/`, поправить `MODEL_URL`; проверить ось профиля (`REST_Y`).

## Готчи / важное

- **Параллельные `npm install` в одном проекте бьют `node_modules/three`** → Turbopack падает с `Unterminated block comment` в `three.core.js`. Ставить пакеты по одному; при странных ошибках three: `rm -rf .next` + перезапуск дева (файл при этом обычно целый — проверять `node -e "require('three')"`).
- Tailwind v4: цвета берутся из `@theme` в `globals.css`, отдельного `tailwind.config` нет.
- Папка проекта называется `ClaudeLearn` (с заглавными) — npm не даёт так назвать пакет; имя пакета в `package.json` = `levelauto`.

## TODO / возможные шаги

- Реальные фото и данные авто (сейчас заглушки + градиенты), бэкенд формы (сейчас демо `setTimeout`).
- Отдельная страница «О нас», реальный файл логотипа, деплой.
- Опционально удалить неиспользуемый `Hero.tsx`.
