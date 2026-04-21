# Coding Conventions & Development Rules

Обязательные правила при работе над лендингом Promto. Каждый участник (человек и AI-агент) обязан следовать этим правилам.

**Стек:** Next.js 16.2 / React 19.2 / Tailwind CSS 4.2 / TypeScript 5+

---

## 1. Architecture: Section-Based Structure

### Структура по секциям лендинга

Код организуется вокруг секций лендинга. Каждая секция — отдельный компонент:

```
src/
├── app/
│   ├── layout.tsx              # Root layout (метаданные, шрифты, структура)
│   ├── page.tsx                # Главная страница (композиция секций)
│   ├── fonts.ts                # Определение шрифтов (next/font)
│   ├── globals.css             # Tailwind @import + @theme (дизайн-токены)
│   ├── sitemap.ts              # Генерация sitemap.xml
│   └── robots.ts               # Генерация robots.txt
├── components/
│   ├── sections/               # Секции лендинга (основные блоки страницы)
│   │   ├── header.tsx          # Навигация + лого + бургер
│   │   ├── hero.tsx            # Hero-блок с заголовком, инпутом, CTA
│   │   ├── what-is-promto.tsx  # "Что такое Промто?" + карточки фич
│   │   ├── what-can-do.tsx     # "Что можно сделать?" + список услуг
│   │   ├── four-steps.tsx      # "4 шага" — пошаговые карточки
│   │   ├── advantages.tsx      # "Проще, чем фрилансер" — карточки
│   │   ├── pricing.tsx         # Тарифы — radio-выбор планов
│   │   ├── faq.tsx             # FAQ-аккордеон
│   │   └── footer.tsx          # Футер — навигация, CTA, юр. ссылки
│   ├── ui/                     # Переиспользуемые UI-примитивы
│   │   ├── button.tsx          # Кнопка (gradient-fill и gradient-stroke варианты)
│   │   ├── gradient-text.tsx   # Текст с градиентом
│   │   ├── section-heading.tsx # Заголовок секции (h2)
│   │   ├── card.tsx            # Карточка с тенью и скруглением
│   │   ├── accordion-item.tsx  # Элемент аккордеона (FAQ)
│   │   ├── mobile-menu.tsx     # Мобильное меню (overlay)
│   │   └── ...
│   └── icons/                  # SVG-иконки как React-компоненты
│       ├── logo.tsx
│       ├── arrow-up-right.tsx
│       ├── hamburger.tsx
│       └── ...
├── lib/
│   ├── utils.ts                # cn() и прочие утилиты
│   └── constants.ts            # Тексты, навигация, FAQ-данные, конфигурации
└── public/
    └── images/                 # Иллюстрации, мокапы (webp/svg/png)
```

### Правила:

- **Одна секция — один файл** в `components/sections/`
- Переиспользуемые элементы (кнопки, карточки, градиентный текст) — в `components/ui/`
- SVG-иконки — React-компоненты в `components/icons/` (для поддержки `currentColor` и градиентов)
- Статические тексты, ссылки навигации, FAQ-данные — в `lib/constants.ts`
- Зависимости между секциями запрещены — секции не импортируют друг друга
- Шрифты определяются в `app/fonts.ts` и импортируются в `layout.tsx`
- **Нет папки `public/fonts/`** — `next/font` автоматически хостит шрифты

---

## 2. Component Rules

### 2.1 Переиспользование (DRY)

**Если элемент используется 2+ раз — он ОБЯЗАН быть вынесен в компонент.**

```
Плохо:
  // В 3 секциях одинаковая кнопка с градиентом
  <button className="bg-gradient-to-r from-brand-blue to-brand-green ...">

Хорошо:
  // components/ui/button.tsx
  export function Button({ variant, children, icon }: ButtonProps) { ... }
```

> Правило: увидел дубль — сразу выноси.

### 2.2 Размер компонентов

- Компонент > 150 строк — рассмотреть декомпозицию
- Один компонент — одна ответственность
- Вложенные компоненты определяются в отдельных файлах, не внутри родительского
- Секции лендинга могут быть длиннее 150 строк (допустимое исключение), но внутренние повторяющиеся блоки выносятся в отдельные компоненты

### 2.3 Именование

| Тип | Формат | Пример |
|-----|--------|--------|
| Файл компонента | kebab-case | `accordion-item.tsx` |
| React-компонент | PascalCase | `AccordionItem` |
| Хук | camelCase с `use` | `useAccordion` |
| Тип/Интерфейс | PascalCase + Props | `AccordionItemProps` |
| Константы | UPPER_SNAKE_CASE | `FAQ_ITEMS` |
| CSS-токены (Tailwind) | kebab-case с `--` | `--color-brand-blue` |

### 2.4 Props

```typescript
// Всегда типизировать через interface
interface ButtonProps {
  variant: 'primary' | 'outline';
  children: React.ReactNode;
  icon?: React.ReactNode;
  href?: string;
  className?: string;
}

// Деструктуризация в параметрах
export function Button({ variant, children, icon, href, className }: ButtonProps) {
```

### 2.5 Responsive Design

Каждый компонент ОБЯЗАН поддерживать оба представления:
- **Mobile-first:** базовые стили для 375px
- **Desktop:** адаптация через `md:` / `lg:` breakpoints для 1440px
- Тестировать на обоих: мобильный (375px) и десктоп (1440px)

```tsx
// Пример responsive layout
<div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
  <div className="w-full lg:w-1/2">Текст</div>
  <div className="w-full lg:w-1/2">Карточки</div>
</div>
```

---

## 3. TypeScript Rules

### 3.1 Строгая типизация

- **Запрещено:** `any`, `as any`, `@ts-ignore`, `@ts-nocheck`
- **Обязательно:** Типизация всех props, return types хуков
- **Данные секций:** Типизируются через интерфейсы в `lib/constants.ts` или отдельный `types.ts`

### 3.2 Типы vs Interfaces

- `interface` — для props, объектных структур (FAQ item, pricing plan, nav link)
- `type` — для unions, утилитарных типов

```typescript
// Interface для структурных типов
interface FaqItem {
  question: string;
  answer: string;
}

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
}

// Type для unions
type ButtonVariant = 'primary' | 'outline';
type PricingTier = 'junior' | 'middle' | 'senior';
```

### 3.3 Null safety

- Использовать optional chaining (`?.`) и nullish coalescing (`??`)
- Не предполагать наличие данных — всегда проверять

---

## 4. State Management

### 4.1 Минимальный state

Лендинг — преимущественно статический контент. State нужен только для:
- **FAQ аккордеон** — `useState` для открытого элемента
- **Мобильное меню** — `useState` для open/close
- **Выбор тарифа** — `useState` для активного плана
- **Счётчики агентов** (секция "4 шага") — `useState` для количества

### 4.2 Правило: не усложнять

- **Нет Redux, Zustand, React Query** — для статического лендинга это overkill
- Весь state — локальный через `useState`
- Если появится форма обратной связи или API-интеграция — пересмотреть

---

## 5. SEO & Metadata (критически важно)

### 5.1 Next.js Metadata API

```typescript
// app/layout.tsx
export const metadata: Metadata = {
  title: 'Промто — создайте сайт за пару минут с помощью ИИ',
  description: 'ИИ-сервис для создания сайтов, сервисов и чат-ботов. От идеи до рабочего продукта за 5 минут.',
  openGraph: {
    title: 'Промто — создайте сайт за пару минут с помощью ИИ',
    description: 'ИИ-сервис для создания сайтов, сервисов и чат-ботов.',
    url: 'https://promto.ai',
    siteName: 'Промто',
    locale: 'ru_RU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Промто — создайте сайт за пару минут',
    description: 'ИИ-сервис для создания сайтов и сервисов.',
  },
  alternates: { canonical: 'https://promto.ai' },
  robots: { index: true, follow: true },
};
```

**Правила:**
- **НЕ использовать `keywords`** — Google игнорирует мета-тег keywords с 2009 года
- `title` + `description` + Open Graph + Twitter Card — обязательный минимум
- Metadata определяется через статический экспорт `metadata` (не `generateMetadata`, т.к. нет динамических данных)

### 5.2 Семантическая HTML-разметка

**Обязательно использовать семантические теги:**

```tsx
<header>         // Навигация
<main>           // Основной контент
  <section>      // Каждая секция лендинга
    <h2>         // Заголовок секции
  </section>
</main>
<footer>         // Подвал
```

**Правила:**
- Один `<h1>` на странице (в Hero-секции)
- Каждая секция — `<section>` с `aria-labelledby` или `<h2>`
- Иерархия заголовков: `h1` → `h2` → `h3` (без пропусков)
- Навигация — `<nav>` с `aria-label`
- Списки — `<ul>/<li>`, не `<div>`
- Интерактивные элементы — `<button>` или `<a>`, не `<div onClick>`

### 5.3 Structured Data (JSON-LD)

**Обязательно:** использовать `dangerouslySetInnerHTML` с XSS-защитой через замену `<` на `\u003c`:

```tsx
// app/page.tsx или app/layout.tsx
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Промто',
  description: 'ИИ-сервис для создания сайтов и сервисов',
  applicationCategory: 'WebApplication',
  offers: {
    '@type': 'AggregateOffer',
    lowPrice: '2000',
    highPrice: '10000',
    priceCurrency: 'RUB',
  },
};

<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
  }}
/>
```

### 5.4 Core Web Vitals

- **LCP** (Largest Contentful Paint) < 2.5s
- **INP** (Interaction to Next Paint) < 200ms — заменил FID в марте 2024
- **CLS** (Cumulative Layout Shift) < 0.1
- Шрифт Onest: `next/font/local` с `display: 'swap'` и `variable` для Tailwind
- Изображения: `next/image` с `priority` для above-the-fold
- Минимизация JS: максимум Server Components, `'use client'` только где необходимо

### 5.5 Прочие SEO-требования

- `<html lang="ru">` — язык страницы
- Canonical URL
- Open Graph теги (title, description, image, url, locale)
- Twitter Card теги
- Favicon и Apple Touch Icon
- `app/sitemap.ts` и `app/robots.ts` — через Next.js file conventions

---

## 6. Styling (Tailwind CSS 4)

### 6.1 Конфигурация Tailwind v4

**В Tailwind v4 нет `tailwind.config.ts`.** Вся конфигурация — через CSS-директиву `@theme` в `globals.css`:

```css
/* app/globals.css */
@import 'tailwindcss';

@theme inline {
  /* Шрифты */
  --font-onest: var(--font-onest);

  /* Цвета бренда */
  --color-brand-blue: #464EFF;
  --color-brand-green: #5EFF6E;

  /* Цвета текста */
  --color-text-primary: #111111;
  --color-text-secondary: #858585;
  --color-text-placeholder: #BCBCBD;
  --color-text-muted: #959595;

  /* Цвета фона */
  --color-bg-page: #FAFAFA;
  --color-bg-card: #FFFFFF;
  --color-bg-inactive: #ECECEC;

  /* Тени */
  --shadow-card: 0px 4px 12px rgba(149, 149, 149, 0.08);
  --shadow-card-md: 0px 4px 12px rgba(149, 149, 149, 0.12);
  --shadow-card-lg: 0px 4px 24px rgba(149, 149, 149, 0.24);
}
```

**PostCSS-конфигурация** (`postcss.config.mjs`):

```js
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
```

### 6.2 Правила:

- **Только Tailwind utility classes** — без кастомного CSS (кроме сложных градиентов и keyframe-анимаций)
- **cn() для условных классов** (из `lib/utils.ts`)
- **Все цвета, тени, шрифты — через `@theme` токены**, не хардкодить

```typescript
// Хорошо
<div className={cn("rounded-3xl p-8 shadow-card", isActive && "border-brand-blue")}>

// Плохо
<div style={{ backgroundColor: '#464EFF', padding: '32px' }}>
```

### 6.3 Breakpoints:

- **default** — 375px (mobile-first)
- `md:` — 768px (tablet)
- `lg:` — 1440px (desktop)

### 6.4 Градиенты

Бренд-градиент `#464EFF` → `#5EFF6E` используется повсеместно. Реализация:

```tsx
// Градиентный текст
<span className="bg-gradient-to-r from-brand-blue to-brand-green bg-clip-text text-transparent">

// Градиентная кнопка (fill)
<button className="bg-gradient-to-b from-brand-green to-brand-blue text-white rounded-full">

// Градиентная обводка (через wrapper с padding = толщина обводки)
<div className="p-[1.5px] rounded-full bg-gradient-to-b from-brand-green to-brand-blue">
  <button className="bg-white rounded-full w-full h-full">
```

### 6.5 Контейнеры и отступы

- **Mobile:** горизонтальные отступы `px-6` (24px)
- **Desktop:** горизонтальные отступы `px-[120px]` или `max-w-[1200px] mx-auto`
- **Вертикальные отступы между секциями:** `py-[72px]` mobile / `py-[100px]` desktop
- **Gap внутри секций:** `gap-[60px]` mobile / `gap-20` desktop

---

## 7. Шрифты (next/font)

### 7.1 Определение шрифтов

Шрифт Onest определяется в отдельном файле и экспортируется для переиспользования:

```typescript
// app/fonts.ts
import localFont from 'next/font/local';

export const onest = localFont({
  src: [
    { path: './onest-regular.woff2', weight: '400', style: 'normal' },
    { path: './onest-medium.woff2', weight: '500', style: 'normal' },
  ],
  display: 'swap',
  variable: '--font-onest',    // CSS-переменная для Tailwind @theme
  fallback: ['system-ui', 'arial'],
});
```

### 7.2 Подключение в layout

```tsx
// app/layout.tsx
import { onest } from './fonts';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${onest.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
```

### 7.3 Правила:

- Шрифты определяются в `app/fonts.ts`, импортируются в `layout.tsx`
- **Обязательно:** `display: 'swap'` для предотвращения FOIT
- **Обязательно:** `variable` для интеграции с Tailwind v4 `@theme`
- **Обязательно:** `fallback` для уменьшения CLS
- Подключать только нужные начертания: 400 (Regular) и 500 (Medium)
- `next/font` автоматически хостит файлы — никаких внешних запросов к CDN

---

## 8. SVG & Images

### 8.1 SVG-иконки → React-компоненты

Все иконки реализуются как React-компоненты для поддержки:
- `currentColor` (наследование цвета)
- Градиентных заливок через `<linearGradient>`
- Типизации props (`className`, `size`)

```tsx
// components/icons/arrow-up-right.tsx
interface IconProps {
  className?: string;
  size?: number;
}

export function ArrowUpRightIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="..." stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
```

### 8.2 Иллюстрации и мокапы

```tsx
import Image from 'next/image';

// Above-the-fold — с priority
<Image src="/images/hero-mockup.webp" alt="" width={600} height={400} priority />

// Below-the-fold — lazy по умолчанию (не нужен loading="lazy", это дефолт)
<Image src="/images/macbook-mockup.webp" alt="" width={600} height={400} />
```

### 8.3 Форматы изображений

| Формат | Когда использовать | Куда класть |
|--------|-------------------|-------------|
| **SVG** | Иконки, логотип, простая графика | `components/icons/` |
| **WebP** | Мокапы, фотографии, сложные иллюстрации | `public/images/` |
| **PNG** | Изображения с прозрачностью (если WebP не подходит) | `public/images/` |

### 8.4 Декоративные фоновые эллипсы

Размытые градиентные круги реализуются через абсолютно позиционированные `<div>`:

```tsx
<div
  className="absolute w-[300px] h-[300px] rounded-full opacity-50 blur-[80px] pointer-events-none"
  style={{ background: 'linear-gradient(200deg, #464EFF 21%, #5EFF6E 88%)' }}
/>
```

---

## 9. Server vs Client Components (Next.js 16 App Router)

### 9.1 Принцип: Server-first (критически для SEO)

По умолчанию все компоненты — серверные. `'use client'` добавляется ТОЛЬКО для интерактивности.

### 9.2 Карта Server / Client компонентов

| Компонент | Тип | Причина |
|-----------|-----|---------|
| `layout.tsx` | Server | Метаданные, шрифты, структура |
| `page.tsx` | Server | Композиция секций |
| `header.tsx` | **Client** | Мобильное меню (useState), scroll-эффекты |
| `hero.tsx` | Server | Статический контент (инпут — Client Island) |
| `what-is-promto.tsx` | Server | Статический контент |
| `what-can-do.tsx` | Server | Статический контент |
| `four-steps.tsx` | **Client** | Счётчики агентов, интерактивные карточки |
| `advantages.tsx` | Server | Статический контент (горизонтальный скролл — нативный CSS) |
| `pricing.tsx` | **Client** | Radio-выбор тарифа |
| `faq.tsx` | **Client** | Аккордеон (expand/collapse) |
| `footer.tsx` | Server | Статический контент |

### 9.3 Паттерн: Client Island

Минимизировать `'use client'` boundary. Выносить интерактивную часть:

```tsx
// hero.tsx (Server Component)
export function Hero() {
  return (
    <section>
      <h1>Сайт за пару минут...</h1>
      <p>Промто превращает вашу идею...</p>
      <ChatInput />  {/* Client Island — 'use client' */}
      <HeroCTA />    {/* Server — статические кнопки */}
    </section>
  );
}
```

### 9.4 Next.js 16: Async params (breaking change)

В Next.js 16 `params` и `searchParams` стали асинхронными. Если понадобится динамический роут:

```tsx
// Было (Next.js 14)
export default function Page({ params }: { params: { slug: string } }) {
  const slug = params.slug;
}

// Стало (Next.js 16)
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
}
```

> Для нашего лендинга это не актуально (нет динамических роутов), но важно знать при расширении.

### 9.5 React Compiler

Next.js 16 + React 19.2 поддерживают React Compiler (стабильный). Автоматически оптимизирует ре-рендеры без ручного `React.memo`, `useMemo`, `useCallback`.

Включение (опционально, при необходимости):
```typescript
// next.config.ts
const config = { reactCompiler: true };
```

---

## 10. Accessibility (a11y)

### 10.1 Обязательные правила

- **Семантический HTML:** `<button>`, `<nav>`, `<main>`, `<section>`, `<article>` вместо `<div>` с onClick
- **Интерактивные элементы:** кликабельные элементы — `<button>` или `<a>`, не `<div onClick>`
- **Alt-текст:** контентные изображения — осмысленный `alt`, декоративные — `alt=""`
- **Фокус:** интерактивные элементы доступны через Tab, видимый focus ring (`focus-visible:ring-2`)

### 10.2 ARIA (когда нужно)

```tsx
// FAQ аккордеон
<button aria-expanded={isOpen} aria-controls={`faq-${id}`}>
  {question}
</button>
<div id={`faq-${id}`} role="region" aria-labelledby={`faq-btn-${id}`} hidden={!isOpen}>
  {answer}
</div>

// Мобильное меню
<div role="dialog" aria-modal="true" aria-label="Навигация">

// Кнопка-иконка без текста
<button aria-label="Открыть меню">
  <HamburgerIcon />
</button>
```

### 10.3 Цветовой контраст

- Текст `#111111` на `#FAFAFA` — контраст 17.4:1 (проходит AAA)
- Текст `#858585` на `#FAFAFA` — контраст 3.9:1 (проходит AA для 14px+ medium)
- Градиентный текст: убедиться, что самая светлая часть (`#5EFF6E`) читаема на фоне

---

## 11. File Organization

### 11.1 Один компонент — один файл

```
components/sections/
├── header.tsx
├── hero.tsx
├── what-is-promto.tsx
├── what-can-do.tsx
├── four-steps.tsx
├── advantages.tsx
├── pricing.tsx
├── faq.tsx
└── footer.tsx
```

### 11.2 Index файлы — НЕ использовать

Прямые импорты по имени файла. Без `index.ts` barrel exports.

### 11.3 Константы и данные

Все статические данные лендинга хранятся в `lib/constants.ts`:

```typescript
// lib/constants.ts
export const NAV_LINKS = [
  { label: 'Возможности', href: '#features' },
  { label: 'Как это работает', href: '#how-it-works' },
  ...
];

export const FAQ_ITEMS: FaqItem[] = [
  { question: 'Что такое Промто?', answer: '...' },
  ...
];

export const PRICING_PLANS: PricingPlan[] = [
  { id: 'junior', name: 'Джуниор разработчик', price: 2000, ... },
  ...
];

export const FEATURES = [ ... ];
export const SERVICES = [ ... ];
export const STEPS = [ ... ];
export const ADVANTAGES = [ ... ];
```

---

## 12. Git & Code Review

### 12.1 Коммиты

- Маленькие, атомарные коммиты (одна логическая единица)
- Описательные commit messages на английском
- Формат: `<type>: <description>` — `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`, `style:`

### 12.2 Ветки

- `main` — стабильная ветка (production-ready)
- `feature/<name>` — для фич
- `fix/<name>` — для багфиксов

### 12.3 Перед коммитом

- TypeScript: без ошибок (`npm run build`)
- Lint: `npm run lint` (ESLint запускается отдельно, не через `next build`)
- Все компоненты — responsive (проверить 375px + 1440px)
- Нет `console.log`
- Нет закомментированного кода

---

## 13. Performance Guidelines

### 13.1 Сборка (Turbopack)

- Next.js 16 использует **Turbopack по умолчанию** (не Webpack)
- `next dev` и `next build` автоматически используют Turbopack
- Кастомная конфигурация Turbopack — через `turbopack` (верхний уровень) в `next.config.ts`, **не** через `experimental.turbopack`

### 13.2 Bundle Size

- Минимум зависимостей. Для лендинга нужны: Next.js, React, Tailwind — и всё
- Анимации: через CSS (`transition`, `@keyframes`), не через JS-библиотеки
- Никаких тяжёлых UI-библиотек (Material UI, Ant Design и т.д.)
- Анализ бандла: `@next/bundle-analyzer` при необходимости

### 13.3 Шрифт

- Onest загружается через `next/font/local` с `display: 'swap'`
- Подключать только используемые начертания: 400 (Regular) и 500 (Medium)
- `variable: '--font-onest'` для интеграции с Tailwind v4 `@theme`
- `fallback: ['system-ui', 'arial']` для уменьшения CLS

### 13.4 Изображения

- `next/image` с указанием `width` / `height` (предотвращает CLS)
- `priority` для above-the-fold изображений (Hero)
- Below-the-fold — lazy loading по умолчанию (ничего не указывать)
- WebP формат по умолчанию
- Учитывать: `minimumCacheTTL` в Next.js 16 теперь 4 часа (14400с) вместо 60с

### 13.5 Сторонние скрипты

Если нужна аналитика (Яндекс.Метрика, Google Analytics) — использовать `next/script`:

```tsx
import Script from 'next/script';

<Script src="https://mc.yandex.ru/metrika/tag.js" strategy="lazyOnload" />
```

Стратегии: `beforeInteractive` | `afterInteractive` | `lazyOnload` | `worker`

### 13.6 Анимации

- `prefers-reduced-motion` — уважать настройки пользователя
- CSS `will-change` — только при необходимости
- Intersection Observer для scroll-triggered анимаций
- React 19.2 поддерживает **View Transitions API** — можно использовать для плавных переходов между состояниями

### 13.7 Мониторинг

- Lighthouse: прогонять перед деплоем (Performance, Accessibility, SEO, Best Practices)
- `useReportWebVitals` из `next/web-vitals` — для отправки метрик в аналитику

---

## 14. Security

- Никаких секретов в клиентском коде
- Санитизация user input (XSS prevention) — если появится форма
- `dangerouslySetInnerHTML` — **только** для JSON-LD с обязательной XSS-защитой (`.replace(/</g, '\\u003c')`)
- Внешние ссылки: `target="_blank"` (браузеры автоматически добавляют `rel="noopener"`)
- Зависимости: минимум, регулярно проверять `npm audit`

---

## 15. Import Organization

### 15.1 Порядок импортов (сверху вниз)

```typescript
// 1. React / Next.js
import { useState } from 'react';
import Image from 'next/image';

// 2. Внешние библиотеки (если есть)

// 3. Внутренние модули — типы
import type { FaqItem } from '@/lib/constants';

// 4. Внутренние модули — утилиты, константы
import { cn } from '@/lib/utils';
import { FAQ_ITEMS } from '@/lib/constants';

// 5. Компоненты
import { Button } from '@/components/ui/button';
import { ArrowUpRightIcon } from '@/components/icons/arrow-up-right';
```

### 15.2 Правила

- Группы разделены пустой строкой
- `type` импорты — через `import type`
- Path aliases: всегда `@/` вместо относительных путей

---

## 16. Environment Variables

### 16.1 Правила

- `.env.local` — локальные переменные (не коммитится)
- `.env.example` — шаблон с пустыми значениями (коммитится)
- `NEXT_PUBLIC_` — только для данных, безопасных для клиента
- На данном этапе env переменные не нужны (статический лендинг)

---

## 17. Анимации и интерактивность

### 17.1 Приоритет реализации интерактивных элементов

| Приоритет | Элемент | Подход |
|-----------|---------|--------|
| **P0** | FAQ аккордеон | `useState` + CSS `transition` для высоты |
| **P0** | Мобильное меню | `useState` + CSS `transition` + `backdrop-filter: blur(60px)` |
| **P0** | Выбор тарифа | `useState` для активного плана |
| **P1** | Smooth scroll к секциям | `scroll-behavior: smooth` + anchor links |
| **P1** | Hover-эффекты на карточках | CSS `transition` + `hover:` |
| **P1** | Горизонтальный скролл (Advantages, mobile) | Нативный CSS `overflow-x-auto` + snap |
| **P2** | Scroll-triggered появление секций | Intersection Observer + CSS `opacity`/`transform` |
| **P2** | Счётчики агентов (4 шага) | `useState` + кнопки +/- |
| **P2** | Sticky header при скролле | Intersection Observer или `scroll` event |

### 17.2 Правила анимаций

- **CSS-first:** все анимации через Tailwind transitions и CSS keyframes
- **Нет JS-анимационных библиотек** (Framer Motion, GSAP) без явной необходимости
- `transition-all duration-300 ease-in-out` — стандартная transition
- Аккордеон: `grid-rows` анимация для плавного раскрытия (или `max-height`)
- Уважать `prefers-reduced-motion`: `motion-reduce:transition-none`
- **View Transitions API** (React 19.2) — допустим для переходов между состояниями (тариф, меню)
