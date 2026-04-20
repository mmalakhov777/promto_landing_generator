# Promto Landing Generator — План реализации

> Генератор SEO-лендингов для types.promto.ai  
> Воронка: поисковый трафик -> лендинг -> CTA -> app.promto.ai -> покупка

---

## Обзор проекта

**Цель:** Система генерации и управления типовыми SEO-лендингами для продвижения платформы Promto по целевым поисковым запросам.

**Домен:** `types.promto.ai`

**MVP scope:** Админка + 62 лендинга категории "ИИ-конструктор сайтов" (1 категорийный + 61 подстраница) + полная SEO-адаптация + Яндекс.Метрика + антибот (SmartCaptcha) + API списка лендингов для promto.ai + локализация RU/EN.

---

## Технологический стек

### Обоснование выбора

Ключевой приоритет — SEO: максимально быстрая отдача HTML, Core Web Vitals в зелёной зоне, полноценная индексация всех страниц.

| Слой | Технология | Почему |
|------|-----------|--------|
| **Frontend/SSR** | **Next.js 14+ (App Router, SSG + ISR)** | Статическая генерация HTML при билде — золотой стандарт для SEO. ISR позволяет обновлять страницы без полной пересборки. Server Components уменьшают JS-бандл. Встроенная оптимизация изображений (WebP, lazy loading). |
| **Стили** | **Tailwind CSS** | Zero-runtime CSS, минимальный бандл, удобно реализовать дизайн-систему по брендбуку. |
| **Backend API** | **FastAPI (Python)** | Совпадает со стеком promto-blog, async-нативный, быстрый (response <50ms), автогенерация OpenAPI. |
| **ORM** | **SQLAlchemy 2.0 + Alembic** | Async через asyncpg, миграции, совпадает с promto-blog. |
| **БД** | **PostgreSQL 16** | JSONB для гибкого хранения контентных блоков, полнотекстовый поиск для админки. |
| **i18n** | **next-intl** | Лёгкая, поддерживает App Router, SSG-совместимая. |
| **SEO** | **next-sitemap, JSON-LD (Schema.org)** | Автогенерация sitemap.xml, структурированные данные. |
| **Антибот** | **Yandex SmartCaptcha** | Невидимая капча, защита от ботов без ухудшения UX. |
| **Аналитика** | **Яндекс.Метрика** | Требование заказчика. |
| **Контейнеризация** | **Docker + docker-compose** | Деплой через промто (type: backend для SSR Next.js + отдельный бэкенд-сервис + managed PostgreSQL). |

### Архитектура деплоя (promto.yaml)

```
┌─────────────────────────────────────────────┐
│              types.promto.ai                │
│         (Next.js SSR — Docker)              │
│   Публичные лендинги + Админ-панель (/admin)│
│              Port: 3000                     │
├─────────────────────────────────────────────┤
│            API Backend (FastAPI)             │
│          CRUD, Auth, Content API            │
│              Port: 8000                     │
├─────────────────────────────────────────────┤
│       PostgreSQL 16 (managed DB)            │
│     Лендинги, контент, пользователи         │
└─────────────────────────────────────────────┘
```

---

## Структура лендинга (оптимальная для SEO-конверсии)

Порядок секций выстроен по принципу AIDA (Attention → Interest → Desire → Action):

| # | Секция | Назначение | Togglable |
|---|--------|-----------|-----------|
| 1 | **Hero** | H1 с ключевым запросом + подзаголовок + поле ввода промта (имитация чата с ИИ) + CTA-кнопка → app.promto.ai | Нет (обязательная) |
| 2 | **Social Proof Bar** | Счётчики: "X сайтов создано", "Y пользователей", рейтинг | Да |
| 3 | **Преимущества** | 4-6 ключевых выгод с иконками | Да |
| 4 | **Как это работает** | 3-4 шага с визуалом | Да |
| 5 | **Примеры работ** | Галерея/карусель готовых сайтов по нише | Да |
| 6 | **CTA-блок (промежуточный)** | Повторное поле ввода промта + кнопка | Да |
| 7 | **Видео** | Демо-видео работы конструктора | Да |
| 8 | **Тарифы** | Карточки тарифов с CTA-кнопками → app.promto.ai | Да |
| 9 | **Отзывы** | Карусель отзывов с Schema.org разметкой Review | Да |
| 10 | **FAQ** | Аккордеон вопросов-ответов с FAQPage Schema.org | Да |
| 11 | **Финальный CTA** | Большой блок с полем ввода промта + сильный призыв к действию | Нет (обязательная) |

**Хлебные крошки** — отображаются над H1 на всех страницах (SEO-требование #8).

---

## Фазы реализации

---

### ФАЗА 1: Фундамент и инфраструктура
**Цель:** Рабочий скелет проекта, запускающийся локально.

#### 1.1 — Инициализация проекта (Backend)
- [ ] Создать структуру `backend/` (FastAPI-приложение)
- [ ] Настроить `pyproject.toml` с зависимостями
- [ ] Настроить `alembic.ini` и папку `alembic/`
- [ ] Создать `backend/Dockerfile`
- [ ] Настроить `app/core/config.py` (Pydantic Settings — DATABASE_URL, SECRET_KEY, CORS, etc.)
- [ ] Создать `app/core/database.py` (async SQLAlchemy engine + session factory)
- [ ] Настроить логирование
- [ ] Добавить health-check endpoint: `GET /api/v1/health`

#### 1.2 — Инициализация проекта (Frontend)
- [ ] Создать Next.js 14 приложение в `frontend/` (App Router, TypeScript)
- [ ] Настроить Tailwind CSS по брендбуку (цвета, шрифты, отступы)
- [ ] Настроить `next-intl` для RU/EN (middleware + routing `/ru/...`, `/en/...`)
- [ ] Настроить `next-sitemap` для автогенерации sitemap.xml
- [ ] Создать `frontend/Dockerfile` (Next.js standalone build)
- [ ] Настроить базовый layout: шрифты, viewport meta, favicon

#### 1.3 — Docker и локальный запуск
- [ ] Создать `docker-compose.yml` (frontend + backend + postgres)
- [ ] Создать `docker-compose.dev.yml` (с volume mounts для hot-reload)
- [ ] Проверить, что всё запускается и health-check проходит
- [ ] Подготовить `.env.example` с описанием всех переменных

#### 1.4 — CI/promto.yaml
- [ ] Создать `/home/user/promto.yaml` (multi-service: web + api + database)
- [ ] Проверить, что структура соответствует требованиям публикации промто

---

### ФАЗА 2: База данных и Backend API
**Цель:** Полностью рабочее API для CRUD лендингов.

#### 2.1 — Модели данных (Backend)
- [ ] Модель `Category` — категории конструкторов (ИИ-конструктор сайтов, чат-ботов и т.д.)
  - `id`, `slug`, `name_ru`, `name_en`, `description_ru`, `description_en`, `is_active`, `sort_order`, `created_at`, `updated_at`
- [ ] Модель `Landing` — отдельный лендинг
  - `id`, `category_id` (FK), `slug`, `keyword_ru`, `keyword_en`, `search_volume`, `is_published`, `created_at`, `updated_at`
- [ ] Модель `LandingContent` — локализованный контент лендинга
  - `id`, `landing_id` (FK), `locale` (ru/en)
  - `meta_title`, `meta_description`, `h1`, `og_title`, `og_description`, `og_image_url`
  - `hero_title`, `hero_subtitle`, `hero_cta_text`, `hero_placeholder`
  - `social_proof` (JSONB — массив {label, value})
  - `advantages` (JSONB — массив {icon, title, description})
  - `how_it_works` (JSONB — массив {step, title, description, image_url})
  - `examples` (JSONB — массив {image_url, title, description, url})
  - `video_url`, `video_title`
  - `pricing` (JSONB — массив {name, price, features[], cta_url, is_popular})
  - `reviews` (JSONB — массив {author, text, rating, avatar_url})
  - `faq` (JSONB — массив {question, answer})
  - `cta_mid_title`, `cta_mid_subtitle`
  - `cta_final_title`, `cta_final_subtitle`, `cta_final_button_text`
- [ ] Модель `LandingSections` — включённость секций
  - `id`, `landing_id` (FK), `section_type` (enum), `is_enabled` (default: true)
- [ ] Модель `User` — пользователи админки
  - `id`, `email`, `hashed_password`, `role` (admin/editor), `is_active`, `created_at`
- [ ] Модель `SiteSettings` — глобальные настройки (счётчик метрики, дефолтные тарифы и т.д.)
- [ ] Создать Alembic-миграцию для всех таблиц
- [ ] Применить миграцию, проверить схему

#### 2.2 — API аутентификации (Backend)
- [ ] `POST /api/v1/auth/login` — JWT-авторизация (access + refresh tokens)
- [ ] `POST /api/v1/auth/refresh` — обновление токена
- [ ] `GET /api/v1/auth/me` — текущий пользователь
- [ ] Middleware проверки JWT для защищённых роутов
- [ ] Скрипт создания первого admin-пользователя (`scripts/create_admin.py`)

#### 2.3 — CRUD API категорий (Backend)
- [ ] `GET /api/v1/categories` — список категорий (публичный)
- [ ] `POST /api/v1/categories` — создать категорию (admin)
- [ ] `PATCH /api/v1/categories/{id}` — обновить (admin)
- [ ] `DELETE /api/v1/categories/{id}` — удалить (admin)

#### 2.4 — CRUD API лендингов (Backend)
- [ ] `GET /api/v1/landings` — список с фильтрацией, пагинацией, поиском (admin)
- [ ] `GET /api/v1/landings/{id}` — детали лендинга с контентом (admin)
- [ ] `POST /api/v1/landings` — создать лендинг (admin)
- [ ] `PATCH /api/v1/landings/{id}` — обновить лендинг + контент (admin)
- [ ] `DELETE /api/v1/landings/{id}` — удалить (admin)
- [ ] `PATCH /api/v1/landings/{id}/sections` — включить/выключить секции (admin)
- [ ] `PATCH /api/v1/landings/{id}/publish` — опубликовать/снять с публикации (admin)

#### 2.5 — Публичное API (Backend)
- [ ] `GET /api/v1/public/landings` — список опубликованных лендингов (для promto.ai)
  - Возвращает: `title`, `slug`, `category_slug`, `full_url`, `keyword`, `locale`
  - Поддержка фильтра по `category` и `locale`
- [ ] `GET /api/v1/public/landings/{category_slug}/{landing_slug}` — данные конкретного лендинга
  - Все секции и контент для рендеринга на фронте
- [ ] `GET /api/v1/public/categories` — категории с количеством лендингов
- [ ] `GET /api/v1/public/sitemap-data` — данные для генерации sitemap.xml

#### 2.6 — Глобальные настройки (Backend)
- [ ] `GET /api/v1/settings` — получить настройки (публичный — metrika ID, дефолтные тарифы и т.д.)
- [ ] `PATCH /api/v1/settings` — обновить настройки (admin)

---

### ФАЗА 3: Админ-панель (Frontend)
**Цель:** Полноценный интерфейс управления лендингами.

#### 3.1 — Каркас админки (Frontend)
- [ ] Роутинг: `/admin/login`, `/admin/dashboard`, `/admin/landings`, `/admin/categories`, `/admin/settings`
- [ ] Layout админки: sidebar навигация, header с именем пользователя, logout
- [ ] Защита роутов (middleware — проверка JWT, редирект на login)
- [ ] API-клиент (fetch-обёртка с автоподстановкой JWT, refresh при 401)
- [ ] Базовые UI-компоненты: таблица, форма, модальное окно, toast-уведомления

#### 3.2 — Управление категориями (Frontend)
- [ ] Страница списка категорий (таблица с сортировкой)
- [ ] Создание/редактирование категории (форма: slug, название RU/EN, описание RU/EN)
- [ ] Удаление категории (с подтверждением)

#### 3.3 — Управление лендингами — список (Frontend)
- [ ] Таблица лендингов с колонками: название, категория, slug, статус (опубликован/черновик), частотность, действия
- [ ] Фильтрация по категории, статусу публикации
- [ ] Поиск по названию/ключевому запросу
- [ ] Пагинация
- [ ] Быстрые действия: опубликовать/снять, удалить

#### 3.4 — Редактор лендинга (Frontend)
- [ ] **Вкладка "Основное":** slug, ключевой запрос, частотность, категория, статус публикации
- [ ] **Вкладка "SEO":** meta title, meta description, H1, OG title, OG description, OG image (для каждой локали)
- [ ] **Вкладка "Контент RU":** редактирование каждой секции:
  - Hero: заголовок, подзаголовок, текст CTA, плейсхолдер ввода
  - Social Proof: добавление/удаление счётчиков (label + value)
  - Преимущества: добавление/удаление карточек (иконка + заголовок + описание)
  - Как это работает: шаги (номер + заголовок + описание + картинка)
  - Примеры: карточки (картинка + заголовок + описание + URL)
  - Видео: URL видео + заголовок
  - Тарифы: карточки (название + цена + фичи[] + URL + флаг популярности)
  - Отзывы: карточки (автор + текст + рейтинг + аватар)
  - FAQ: пары вопрос-ответ
  - CTA блоки: заголовки и текст кнопок
- [ ] **Вкладка "Контент EN":** аналогично RU
- [ ] **Вкладка "Секции":** тоггл-переключатели для каждой секции (вкл/выкл)
- [ ] Кнопка "Сохранить" + автосохранение черновика
- [ ] Кнопка "Предпросмотр" — открывает лендинг в новой вкладке

#### 3.5 — Настройки сайта (Frontend)
- [ ] ID Яндекс.Метрики
- [ ] Дефолтные тарифы (шаблон, который подставляется в новые лендинги)
- [ ] Дефолтные тексты CTA-блоков
- [ ] URL платформы (app.promto.ai)

---

### ФАЗА 4: Публичные лендинги (Frontend)
**Цель:** SEO-оптимизированные страницы, доступные пользователям.

#### 4.1 — Роутинг и SSG (Frontend)
- [ ] Маршрут `/{locale}/{category_slug}/{landing_slug}/` — страница лендинга
- [ ] Маршрут `/{locale}/{category_slug}/` — категорийная страница (листинг лендингов)
- [ ] `generateStaticParams()` — генерация всех статических путей из API
- [ ] ISR (Incremental Static Regeneration) — `revalidate: 3600` (обновление раз в час)
- [ ] Триггер ревалидации из админки при сохранении (`POST /api/v1/revalidate`)
- [ ] Trailing slash в URL (SEO-требование #13: `promto.ai/страница/`)

#### 4.2 — Шаблон лендинга (Frontend)
- [ ] Компонент `HeroSection` — H1, подзаголовок, имитация чат-поля с кнопкой отправки
  - При вводе текста и нажатии "Создать" → редирект на `app.promto.ai?prompt={text}&source={landing_slug}`
- [ ] Компонент `SocialProofBar` — горизонтальная полоса со счётчиками
- [ ] Компонент `AdvantagesSection` — сетка 2x3 или 3x2 карточек с иконками
- [ ] Компонент `HowItWorksSection` — горизонтальные шаги с номерами и стрелками
- [ ] Компонент `ExamplesSection` — карусель/сетка карточек с превью
- [ ] Компонент `CtaBlock` — повторяемый CTA с полем ввода промта
- [ ] Компонент `VideoSection` — embedded видео (lazy load iframe)
- [ ] Компонент `PricingSection` — карточки тарифов, кнопки → app.promto.ai
- [ ] Компонент `ReviewsSection` — карусель отзывов
- [ ] Компонент `FaqSection` — аккордеон (details/summary для SEO)
- [ ] Компонент `Breadcrumbs` — над H1, Schema.org BreadcrumbList

#### 4.3 — Общие компоненты (Frontend)
- [ ] `Header` — логотип (ссылка на promto.ai с nofollow), навигация, переключатель языка RU/EN
  - Логотип кликабелен со всех страниц кроме главной (SEO-требование #27)
- [ ] `Footer` — ссылки на основные разделы, копирайт, ссылки на соц. сети (nofollow)
- [ ] `ScrollToTop` — кнопка "вверх" (SEO-требование #40)
- [ ] Адаптивная вёрстка (mobile-first, no horizontal scroll — SEO мобильное требование #6)

#### 4.4 — Категорийная страница (Frontend)
- [ ] Список лендингов категории с карточками
- [ ] H1 — название категории с ключевым запросом
- [ ] Описание категории
- [ ] Хлебные крошки: Главная → Категория
- [ ] Пагинация с ЧПУ (`/ru/site-generator/page2/`) — SEO-требование #23-24

---

### ФАЗА 5: SEO-оптимизация
**Цель:** Полное соответствие 42 SEO-требованиям из документа.

#### 5.1 — Мета-теги и OpenGraph (Frontend)
- [ ] `generateMetadata()` в каждом route — динамические title, description из контента лендинга
- [ ] Шаблон генерации: `{H1} — Промто` / `{H1} - Promto` (SEO-требование #7)
- [ ] OpenGraph теги: og:title, og:description, og:image, og:url, og:type, og:locale
- [ ] Canonical URL на каждой странице
- [ ] Hreflang теги: `<link rel="alternate" hreflang="ru" ...>` / `<link rel="alternate" hreflang="en" ...>`
- [ ] Пагинация: title "- страница N" для страниц > 1 (SEO-требование #7)

#### 5.2 — Структурированные данные Schema.org (Frontend)
- [ ] `BreadcrumbList` — на всех страницах кроме главной
- [ ] `FAQPage` — на лендингах с включённым FAQ-блоком
- [ ] `Review` / `AggregateRating` — на лендингах с отзывами
- [ ] `Product` / `Offer` — на лендингах с тарифами (SEO-требование #26)
- [ ] `Organization` — в footer (SEO-требование #26)
- [ ] Валидация через Yandex Webmaster tools

#### 5.3 — Технический SEO (Backend + Frontend)
- [ ] `robots.txt` — правильная генерация (закрыть /admin/, разрешить остальное) (SEO-требование #1)
- [ ] `sitemap.xml` — автогенерация через next-sitemap, без lastmod/changefreq/priority (SEO-требование #11)
  - Исключить страницы с кодом != 200 и закрытые в robots.txt
- [ ] ЧПУ URL: только тире, без `_`, `%`, `?`, спецсимволов (SEO-требование #3, 9, 25)
- [ ] 404-страница: H1 "Данная страница не существует!", ссылка на главную (SEO-требование #12)
- [ ] 301 редиректы в Next.js middleware (SEO-требование #13):
  - Убирать множественные слеши
  - Добавлять trailing slash
  - Редирект с URL без locale на дефолтный

#### 5.4 — Производительность (Frontend)
- [ ] Изображения: next/image (автоматический WebP, lazy loading, srcset) (SEO-требование #20)
- [ ] Alt-теги на всех изображениях (SEO-требование #20)
- [ ] Минимизация JS: React Server Components где возможно
- [ ] CSS: Tailwind purge — только используемые классы
- [ ] Font optimization: next/font (preload, display=swap)
- [ ] Целевая метрика: PageSpeed Insights > 90 для мобильной и ПК версий (SEO-требование #33)
- [ ] Время ответа сервера < 200ms, оптимально < 50ms (SEO-требование #34)

#### 5.5 — HTML-валидность и доступность (Frontend)
- [ ] Единственный `<h1>` на странице — только в контенте (SEO-требование #14-15)
- [ ] Заголовки `<h1>`-`<h4>` различаются размером (SEO-требование #16)
- [ ] В тегах `<h*>` нет вложенных тегов (SEO-требование #17)
- [ ] В шапке/подвале НЕ использовать `<h*>` теги (SEO-требование #15)
- [ ] Все ссылки и кнопки интерактивны (hover, active состояния) (SEO-требование #18)
- [ ] Внешние ссылки с `rel="nofollow"` (SEO-требование #37)
- [ ] Валидация по W3C Validator (SEO-требование #36)

---

### ФАЗА 6: Локализация (i18n)
**Цель:** Полная поддержка RU и EN для всех страниц.

#### 6.1 — Инфраструктура i18n (Frontend)
- [ ] Настройка next-intl middleware (определение локали из URL)
- [ ] Роутинг: `/ru/{category}/{landing}/` и `/en/{category}/{landing}/`
- [ ] Дефолтная локаль: `ru`
- [ ] Файлы переводов UI: `messages/ru.json`, `messages/en.json`
  - Статический текст: кнопки, навигация, footer, 404, общие фразы

#### 6.2 — Локализация контента (Backend + Frontend)
- [ ] API: параметр `?locale=ru|en` для публичных эндпоинтов
- [ ] Админка: вкладки "Контент RU" / "Контент EN" в редакторе лендинга
- [ ] Hreflang-теги связывают RU и EN версии одного лендинга
- [ ] Sitemap.xml: отдельные URL для каждой локали

#### 6.3 — Генерация EN-контента
- [ ] Скрипт/задача для генерации английского контента на основе русского (опционально через AI)
- [ ] Возможность ручной правки EN-контента через админку

---

### ФАЗА 7: Интеграции
**Цель:** Яндекс.Метрика, SmartCaptcha, API для promto.ai.

#### 7.1 — Яндекс.Метрика (Frontend)
- [ ] Подключение скрипта Метрики (ID из настроек)
- [ ] Настройка целей:
  - Клик по CTA "Создать" (переход на app.promto.ai)
  - Ввод текста в поле промта
  - Скролл до секции тарифов
- [ ] Вебвизор (запись визитов)
- [ ] Передача UserID если есть
- [ ] Не загружать скрипт в режиме предпросмотра из админки

#### 7.2 — Yandex SmartCaptcha (Frontend)
- [ ] Подключение invisible SmartCaptcha
- [ ] Валидация на стороне бэкенда при подозрении на бота
- [ ] Fallback — показ капчи, если SmartCaptcha определила бота
- [ ] Не блокировать краулеры Yandex/Google (проверка User-Agent)

#### 7.3 — API для promto.ai (Backend)
- [ ] `GET /api/v1/public/landings` — список всех опубликованных лендингов
  ```json
  {
    "items": [
      {
        "title": "Создать сайт для педагога",
        "slug": "pedagoga",
        "category": "site-generator",
        "full_url": "https://types.promto.ai/ru/site-generator/pedagoga/",
        "keyword": "создать сайт для педагога",
        "search_volume": 111,
        "locale": "ru"
      }
    ],
    "total": 62
  }
  ```
- [ ] CORS: разрешить запросы с promto.ai
- [ ] Кеширование ответа (Cache-Control: max-age=3600)

#### 7.4 — CTA-интеграция с app.promto.ai (Frontend)
- [ ] Все CTA-кнопки ведут на `app.promto.ai`
- [ ] Передача контекста в URL: `app.promto.ai?prompt={user_input}&utm_source=types&utm_medium=landing&utm_campaign={category_slug}&utm_content={landing_slug}`
- [ ] Поле ввода промта: placeholder с подсказкой по нише ("Создайте сайт для вашей школы...")

---

### ФАЗА 8: Импорт данных и генерация контента
**Цель:** Наполнить MVP 62 лендингами с AI-сгенерированным контентом.

#### 8.1 — Скрипт импорта структуры (Backend)
- [ ] `scripts/import_from_excel.py` — парсинг Структура Промто.xlsx (строки 1-63)
- [ ] Создание категории "ИИ-конструктор сайтов" (`site-generator`)
- [ ] Создание 62 лендингов с:
  - slug из URL (последний сегмент)
  - keyword из столбца "Запрос"
  - search_volume из столбца "Частотность"

#### 8.2 — Генерация контента (Backend)
- [ ] `scripts/generate_content.py` — AI-генерация контента для каждого лендинга
- [ ] На основе ключевого запроса и информации о Promto генерировать:
  - meta_title, meta_description, H1 (оптимизированные под запрос)
  - hero_title, hero_subtitle
  - 4-6 преимуществ, адаптированных под нишу
  - 3-4 шага "как это работает"
  - 5-6 FAQ вопросов по нише
  - Тексты CTA-блоков
  - Отзывы (шаблонные, адаптированные под нишу)
- [ ] Генерация RU-контента
- [ ] Генерация EN-контента (перевод + адаптация)
- [ ] Review: ручная проверка и правка в админке

#### 8.3 — Дефолтный контент (Backend)
- [ ] Шаблон дефолтных тарифов (из существующих на promto.ai)
- [ ] Дефолтные примеры работ (скриншоты/ссылки)
- [ ] Дефолтное видео (общее демо Promto)
- [ ] Дефолтный social proof (общие цифры платформы)

---

### ФАЗА 9: Тестирование и запуск
**Цель:** Всё работает, SEO-аудит пройден, готово к продакшену.

#### 9.1 — Тестирование Backend
- [ ] Unit-тесты на CRUD операции (pytest + pytest-asyncio)
- [ ] Тесты API эндпоинтов (httpx TestClient)
- [ ] Тесты аутентификации и авторизации
- [ ] Тест импорта из Excel
- [ ] Тест публичного API (проверка формата ответа)

#### 9.2 — Тестирование Frontend
- [ ] Компонентные тесты (Vitest + Testing Library)
- [ ] E2E тесты ключевых сценариев (Playwright):
  - Открытие лендинга → видим H1 и секции
  - Ввод промта → редирект на app.promto.ai
  - Переключение RU/EN
  - Админка: логин → создание лендинга → публикация → проверка на фронте
- [ ] Тест 404-страницы
- [ ] Тест breadcrumbs

#### 9.3 — SEO-аудит
- [ ] PageSpeed Insights: > 90 mobile и desktop (SEO-требование #33)
- [ ] W3C HTML Validator — без ошибок (SEO-требование #36)
- [ ] Проверка микроразметки: Yandex Webmaster tools (SEO-требование #26)
- [ ] Проверка robots.txt и sitemap.xml
- [ ] Проверка всех 301 редиректов
- [ ] Проверка hreflang-тегов
- [ ] Проверка ЧПУ URL (нет `_`, `%`, дублей)
- [ ] Проверка Core Web Vitals (LCP, FID, CLS)
- [ ] Lighthouse аудит

#### 9.4 — Кроссбраузерное тестирование
- [ ] Chrome, Firefox, Safari, Edge (desktop)
- [ ] Chrome, Safari (mobile)
- [ ] Проверка адаптивности на разных разрешениях (320px — 1920px)
- [ ] Нет горизонтального скролла на мобильных

#### 9.5 — Подготовка к деплою
- [ ] Финализация `.env` для продакшена
- [ ] Проверка промто.yaml
- [ ] Настройка домена types.promto.ai
- [ ] Публикация через вкладку Publish

---

## Структура файлов проекта

```
promto_landing_generator/
├── docs/                          # Документация
│   ├── active/                    # Активные планы
│   └── completed/                 # Завершённые
├── backend/
│   ├── Dockerfile
│   ├── pyproject.toml
│   ├── alembic.ini
│   ├── alembic/
│   │   └── versions/
│   ├── scripts/
│   │   ├── create_admin.py
│   │   ├── import_from_excel.py
│   │   └── generate_content.py
│   ├── app/
│   │   ├── main.py
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   ├── database.py
│   │   │   ├── security.py
│   │   │   └── exceptions.py
│   │   ├── models/
│   │   │   ├── category.py
│   │   │   ├── landing.py
│   │   │   ├── landing_content.py
│   │   │   ├── landing_section.py
│   │   │   ├── user.py
│   │   │   └── settings.py
│   │   ├── schemas/
│   │   │   ├── category.py
│   │   │   ├── landing.py
│   │   │   ├── auth.py
│   │   │   └── settings.py
│   │   ├── api/
│   │   │   ├── router.py
│   │   │   ├── deps.py
│   │   │   ├── v1/
│   │   │   │   ├── auth.py
│   │   │   │   ├── categories.py
│   │   │   │   ├── landings.py
│   │   │   │   ├── public.py
│   │   │   │   ├── settings.py
│   │   │   │   └── revalidate.py
│   │   └── services/
│   │       ├── category_service.py
│   │       ├── landing_service.py
│   │       └── auth_service.py
│   └── tests/
│       ├── conftest.py
│       ├── test_auth.py
│       ├── test_categories.py
│       ├── test_landings.py
│       └── test_public_api.py
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   ├── messages/
│   │   ├── ru.json
│   │   └── en.json
│   ├── src/
│   │   ├── app/
│   │   │   ├── [locale]/
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── page.tsx                    # Главная (список категорий)
│   │   │   │   ├── [category]/
│   │   │   │   │   ├── page.tsx                # Категорийная страница
│   │   │   │   │   └── [slug]/
│   │   │   │   │       └── page.tsx            # Лендинг
│   │   │   │   └── not-found.tsx               # 404
│   │   │   └── admin/
│   │   │       ├── layout.tsx
│   │   │       ├── login/page.tsx
│   │   │       ├── dashboard/page.tsx
│   │   │       ├── landings/
│   │   │       │   ├── page.tsx                # Список
│   │   │       │   └── [id]/page.tsx           # Редактор
│   │   │       ├── categories/page.tsx
│   │   │       └── settings/page.tsx
│   │   ├── components/
│   │   │   ├── landing/
│   │   │   │   ├── HeroSection.tsx
│   │   │   │   ├── SocialProofBar.tsx
│   │   │   │   ├── AdvantagesSection.tsx
│   │   │   │   ├── HowItWorksSection.tsx
│   │   │   │   ├── ExamplesSection.tsx
│   │   │   │   ├── CtaBlock.tsx
│   │   │   │   ├── VideoSection.tsx
│   │   │   │   ├── PricingSection.tsx
│   │   │   │   ├── ReviewsSection.tsx
│   │   │   │   ├── FaqSection.tsx
│   │   │   │   └── Breadcrumbs.tsx
│   │   │   ├── layout/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   └── ScrollToTop.tsx
│   │   │   └── admin/
│   │   │       ├── LandingEditor.tsx
│   │   │       ├── SectionToggle.tsx
│   │   │       └── ContentForm.tsx
│   │   ├── lib/
│   │   │   ├── api.ts                         # API-клиент
│   │   │   ├── auth.ts                        # JWT helpers
│   │   │   └── utils.ts
│   │   ├── styles/
│   │   │   └── globals.css
│   │   └── types/
│   │       ├── landing.ts
│   │       ├── category.ts
│   │       └── api.ts
│   └── e2e/
│       ├── landing.spec.ts
│       └── admin.spec.ts
├── docker-compose.yml
├── docker-compose.dev.yml
├── .env.example
└── promto.yaml                                 # В /home/user/ при деплое
```

---

## Порядок и зависимости фаз

```
Фаза 1 (Фундамент)
    │
    ├──→ Фаза 2 (Backend API)
    │        │
    │        ├──→ Фаза 3 (Админка)
    │        │        │
    │        │        └──→ Фаза 8 (Импорт + генерация контента)
    │        │
    │        └──→ Фаза 4 (Публичные лендинги)
    │                 │
    │                 ├──→ Фаза 5 (SEO-оптимизация)
    │                 │
    │                 └──→ Фаза 6 (i18n)
    │
    └──→ Фаза 7 (Интеграции) — параллельно с Фазами 4-6
              │
              └──→ Фаза 9 (Тестирование и запуск)
```

**Параллелизм:** Фазы 3 и 4 можно вести параллельно (разные разработчики). Фаза 7 можно начинать параллельно с Фазой 4. Фаза 8 зависит от Фазы 3 (нужна админка для ревью сгенерированного контента).

---

## Ключевые решения и trade-offs

| Решение | Альтернатива | Почему выбрано |
|---------|-------------|----------------|
| SSG + ISR (не SSR) | Чистый SSR | SSG даёт HTML при деплое → мгновенная загрузка, лучший PageSpeed. ISR обновляет без ребилда. |
| JSONB для контентных блоков | Отдельные таблицы на каждый тип блока | Гибкость: легко добавлять новые поля без миграций. Производительность достаточна при <10K лендингов. |
| next-intl (не next-i18next) | next-i18next | Нативная поддержка App Router, лучше работает с SSG, меньше бандл. |
| Монорепо (frontend + backend) | Отдельные репозитории | Проще деплой через docker-compose, атомарные изменения. |
| Tailwind CSS (не CSS Modules) | CSS Modules, Styled Components | Zero-runtime, лучший PageSpeed, быстрая разработка по брендбуку. |
| Админка внутри Next.js (не отдельный SPA) | Отдельное React SPA | Меньше сервисов, переиспользование компонентов, проще деплой. |
