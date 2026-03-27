# Промто — Landing Page

Лендинг AI-конструктора сайтов [Промто](https://promto.ai). Pixel-perfect реализация по Figma-макету.

## Стек

- **Next.js 16** (App Router, Static Export)
- **React 19**
- **Tailwind CSS 4** (design tokens через `@theme inline`, без `tailwind.config`)
- **TypeScript 5**
- **Шрифт**: Onest (переменный, `--font-sans`)

## Быстрый старт

```bash
npm install
npm run dev        # dev-сервер на http://localhost:3000
npm run build      # production-сборка
npm run start      # запуск production-сервера
npm run lint       # ESLint
```

## Структура проекта

```
src/
├── app/
│   ├── layout.tsx          # RootLayout, SEO meta, JSON-LD, шрифт Onest
│   ├── page.tsx            # Композиция всех секций (обёрнуты в FadeIn)
│   ├── globals.css         # Design tokens (@theme inline), кастомные анимации
│   ├── fonts.ts            # Конфигурация шрифта Onest
│   ├── sitemap.ts          # /sitemap.xml
│   └── robots.ts           # /robots.txt
├── components/
│   ├── sections/           # 9 секций лендинга
│   │   ├── header.tsx      # Sticky header + mobile menu
│   │   ├── hero.tsx        # Hero с RotatingWord + ChatInput
│   │   ├── what-is-promto.tsx  # «Что такое Промто?» — 4 карточки (2×2 grid)
│   │   ├── what-can-do.tsx     # «Что можно сделать» — кейсы использования
│   │   ├── four-steps.tsx      # «От идеи до продукта за 4 шага»
│   │   ├── advantages.tsx      # «С Промто работать легче» — 4 карточки
│   │   ├── pricing.tsx         # Тарифы (Junior / Middle / Senior)
│   │   ├── faq.tsx             # FAQ-аккордеон (13 вопросов)
│   │   └── footer.tsx          # Подвал с навигацией и CTA
│   ├── ui/                 # Переиспользуемые UI-компоненты
│   │   ├── button.tsx          # Primary / Outline с анимированным shimmer + glow
│   │   ├── card.tsx            # Базовая карточка
│   │   ├── accordion-item.tsx  # Раскрывающийся элемент FAQ
│   │   ├── chat-input.tsx      # Чат-инпут с typewriter, дропдаунами агентов и интеграций
│   │   ├── rotating-word.tsx   # Анимированная ротация слов в Hero (bg-clip-text)
│   │   ├── fade-in.tsx         # Scroll-анимация появления (IntersectionObserver)
│   │   ├── background-blobs.tsx # Анимированные фоновые блобы
│   │   ├── gradient-border.tsx # Анимированная градиентная рамка (CSS mask-composite)
│   │   ├── gradient-text.tsx   # Градиентный текст
│   │   ├── icon-box.tsx        # Иконка в цветном квадрате (5 цветов)
│   │   ├── section-container.tsx # Обёртка секций (max-w-1440, адаптивный padding)
│   │   ├── section-heading.tsx
│   │   ├── mobile-menu.tsx     # Мобильное меню (fullscreen overlay)
│   │   ├── pricing-plan-card.tsx # Карточка тарифа
│   │   ├── step-card.tsx       # Карточка шага
│   │   └── service-row.tsx     # Строка кейса использования
│   └── icons/              # 21 SVG-иконка как React-компоненты
└── lib/
    ├── constants.ts        # Данные: навигация, фичи, тарифы, FAQ, агенты
    └── utils.ts            # cn() (clsx + tailwind-merge)
```

## Дизайн-токены

| Токен | Значение |
|-------|----------|
| `--color-brand-blue` | `#464EFF` |
| `--color-brand-green` | `#5EFF6E` |
| `--color-bg-page` | `#FAFAFA` |

Все цвета, тени и радиусы определены через `@theme inline` в `globals.css`.

## Адаптивность

- **Mobile-first** подход
- **Breakpoints**: `sm` (640px), `lg` (1024px), `xl` (1280px), `2xl` (1536px)
- **Desktop**: max-w-1440px, padding `lg:60px → xl:120px`
- **Средние экраны** (~1024–1279px): уменьшенные gap и padding, 2-col grid вместо 4-col
- **Мобильная версия**: горизонтальный скролл карточек, отдельные размеры текста

## Анимации

- **RotatingWord** — плавная ротация слов в заголовке Hero (fade in/out, 3.5с цикл)
- **Typewriter** — эффект печати текста в чат-инпуте (60ms/символ)
- **Shimmer + Glow** — переливание градиента на CTA-кнопках + пульсирующее свечение
- **Gradient shift** — анимация градиентной обводки чата и кнопок
- **Blob breathe** — плавное «дыхание» фоновых блобов (18с цикл)
- **Scroll fade-in** — появление секций при скролле (IntersectionObserver, threshold 0.08)

Все кастомные анимации обёрнуты в `@layer utilities` (требование Tailwind 4).

## Архитектурные решения

- **Server-first**: Hero, WhatIsPromto, WhatCanDo, Advantages, Footer — Server Components (0 KB JS)
- **Client только по необходимости**: Header, Pricing, FAQ, FourSteps, ChatInput — `'use client'` для useState/useEffect
- **Без barrel exports**: все импорты напрямую к файлу
- **Без cross-section imports**: секции не импортируют друг друга
- **Design tokens**: все цвета/тени через `@theme inline` в `globals.css`
- **Accessibility**: `aria-label`, `focus-visible:ring`, `cursor-pointer` на интерактивных элементах
- **SEO**: `lang="ru"`, OpenGraph, Twitter Cards, JSON-LD (SoftwareApplication), sitemap, robots

## Figma

Figma file key: `QGyXPhyr4XoJpXipKkvKGG`
