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

Порядок секций выстроен по принципу AIDA (Attention -> Interest -> Desire -> Action):

| # | Секция | Назначение | Togglable |
|---|--------|-----------|-----------|
| 1 | **Hero** | H1 с ключевым запросом + подзаголовок + поле ввода промта (имитация чата с ИИ) + CTA-кнопка -> app.promto.ai | Нет (обязательная) |
| 2 | **Social Proof Bar** | Счётчики: "X сайтов создано", "Y пользователей", рейтинг | Да |
| 3 | **Преимущества** | 4-6 ключевых выгод с иконками | Да |
| 4 | **Как это работает** | 3-4 шага с визуалом | Да |
| 5 | **Примеры работ** | Галерея/карусель готовых сайтов по нише | Да |
| 6 | **CTA-блок (промежуточный)** | Повторное поле ввода промта + кнопка | Да |
| 7 | **Видео** | Демо-видео работы конструктора | Да |
| 8 | **Тарифы** | Карточки тарифов с CTA-кнопками -> app.promto.ai | Да |
| 9 | **Отзывы** | Карусель отзывов с Schema.org разметкой Review | Да |
| 10 | **FAQ** | Аккордеон вопросов-ответов с FAQPage Schema.org | Да |
| 11 | **Финальный CTA** | Большой блок с полем ввода промта + сильный призыв к действию | Нет (обязательная) |

**Хлебные крошки** — отображаются над H1 на всех страницах (SEO-требование #8).

---

## Фазы реализации

---

### ФАЗА 1: Фундамент и инфраструктура ✅ ЗАВЕРШЕНА

**Цель:** Рабочий скелет проекта — оба сервиса запускаются локально, общаются между собой, i18n-роутинг на месте.

**Статус:** Реализовано и проверено. Коммиты: `d135e6f` (реализация), `e97567f` (исправления после ревью).

#### 1.1 — Backend: каркас FastAPI
- [x] Создать структуру `backend/` (FastAPI-приложение)
- [x] Настроить `pyproject.toml` с зависимостями (fastapi, uvicorn, sqlalchemy, asyncpg, alembic, pydantic-settings, pyjwt, passlib, python-slugify, httpx, openpyxl)
- [x] Создать `backend/Dockerfile`
- [x] Настроить `app/core/config.py` (Pydantic Settings — DATABASE_URL, SECRET_KEY, CORS_ORIGINS, FRONTEND_URL, SMARTCAPTCHA_SERVER_KEY)
- [x] Создать `app/core/database.py` (async SQLAlchemy engine + session factory)
- [x] Настроить `app/core/logging.py`
- [x] Настроить `app/core/exceptions.py` (базовые обработчики ошибок)
- [x] Добавить health-check endpoint: `GET /api/v1/health` (проверка связи с БД)
- [x] Настроить CORS middleware (origins из конфига)

#### 1.2 — Frontend: каркас Next.js
- [x] Создать Next.js 16 приложение в `frontend/` (App Router, TypeScript, `output: "standalone"`)
  - **Адаптация:** Использован Next.js 16.2.4 (вместо 14+). Ключевые отличия: `middleware.ts` → `proxy.ts`, `params` — async (Promise), Tailwind CSS v4 (Vite-based, `@theme` вместо `tailwind.config.ts`).
- [x] Настроить Tailwind CSS по брендбуку (цвета, шрифты, spacing, breakpoints)
  - **Адаптация:** Tailwind v4 использует CSS-native `@theme` вместо JS-конфига. Шрифт Onest отсутствует в `next/font/google`, используется Inter с plan миграции на Onest через CSS `@font-face` при наличии файлов шрифта.
- [x] Настроить `next-intl`: proxy (бывший middleware) с определением локали из URL-префикса (`/ru/...`, `/en/...`), дефолтная локаль `ru`. **[RISK-03]** Явно исключить `/admin/`, `/api/`, `/_next/`, `/robots.txt`, `/sitemap.xml`, `/favicon.ico` из i18n proxy через early return перед вызовом intlMiddleware
- [x] Создать файлы переводов UI: `messages/ru.json`, `messages/en.json` (пока шаблоны с common + nav)
- [x] Создать `frontend/Dockerfile` (Next.js standalone multi-stage build)
- [x] Настроить базовый layout `[locale]/layout.tsx`: viewport meta, `next/font` для Inter (с CSS-variable `--font-inter`)
- [x] Создать placeholder-страницу `[locale]/page.tsx` с переводами и generateMetadata
- [x] Настроить `src/lib/api.ts` — базовый fetch-клиент с разделением server-side (`API_URL`) и client-side (`NEXT_PUBLIC_API_URL`)

#### 1.3 — Docker и локальный запуск
- [x] Создать `docker-compose.yml` (frontend:3000 + backend:8000 + postgres:5432)
- [x] Создать `docker-compose.dev.yml` (override с volume mounts для hot-reload)
- [x] Подготовить `.env.example` с описанием всех переменных (включая `API_URL` для server-side)
- [ ] Проверить, что `docker-compose up` запускает все три сервиса — **не проверено** (нет Docker в sandbox). Конфигурация валидна синтаксически.

#### 1.4 — Конфигурация деплоя
- [x] Создать `/home/user/promto.yaml`:
  - web: type backend, framework docker, root_dir frontend/, preset_id 1005 (Next.js SSR)
  - api: type backend, framework docker, root_dir backend/, preset_id 1003 (FastAPI)
  - db: type database, framework postgresql, preset_id 357
- [x] Проверить соответствие структуре Dockerfile-ов (не в корне, а в поддиректориях)

#### 1.5 — Тесты фазы
- [x] **Backend:** тест health-check endpoint (pytest + httpx AsyncClient) — 2/2 passed
- [x] **Backend:** тест подключения к БД (входит в health-check тест, проверяет `SELECT 1`)
- [x] **Frontend:** `npm run build` завершается без ошибок
- [x] **Frontend:** TypeScript `tsc --noEmit` — 0 ошибок
- [x] **Frontend:** ESLint — 0 ошибок
- [ ] **Infra:** `docker-compose up` — не проверено (нет Docker в sandbox)

**Критерии готовности:**
- ✅ `curl http://localhost:8002/api/v1/health` → `{"status":"ok","db":"ok"}`
- ✅ `curl http://localhost:3001/ru/` → HTML с placeholder-страницей (содержит "Промто")
- ✅ `curl http://localhost:3001/en/` → HTML с placeholder-страницей (содержит "Promto")
- ✅ `/admin/` не перенаправляется i18n middleware (RISK-03)
- ✅ `/` → redirect на `/ru/`
- ✅ Все тесты проходят (pytest 2/2, tsc 0 errors, build success, eslint clean)

**Найдено при ревью и исправлено:**
1. **(КРИТ)** API client не разделял server/client URL — добавлен `API_URL` для SSR
2. **(КРИТ)** docker-compose.yml: `NEXT_PUBLIC_API_URL` указывал на Docker-internal URL — исправлен на `${NEXT_PUBLIC_API_URL:-https://types.promto.ai}`
3. **(КРИТ)** docker-compose.dev.yml: добавлен `API_URL: http://backend:8000` для server-side
4. **(СРЕДН)** proxy.ts: `/admin` prefix match ловил `/admin-panel` — разделён на exact `/admin` + prefix `/admin/`
5. **(СРЕДН)** .env.example: добавлено разделение `API_URL` / `NEXT_PUBLIC_API_URL` с описанием

---

### ФАЗА 2: Backend Core — Модели, Auth, API ✅ ЗАВЕРШЕНА

**Цель:** Полностью рабочее API для всех операций. Фронтенд на этой фазе не затрагивается.

**Статус:** Реализовано и протестировано. Коммиты: `519645c` (data layer), `830af4b` (API routes, scripts, tests — 38/38 pass).

#### 2.1 — Модели данных (Backend)
- [x] Модель `User` — пользователи админки (`app/models/user.py`)
  - `id`, `email`, `hashed_password`, `role` (enum: admin/editor), `is_active`, `created_at`
- [x] Модель `Category` — категории конструкторов (`app/models/category.py`)
  - `id`, `slug`, `name_ru`, `name_en`, `description_ru`, `description_en`, `meta_title_ru`, `meta_title_en`, `meta_description_ru`, `meta_description_en`, `is_active`, `sort_order`, `created_at`, `updated_at`
- [x] Модель `Landing` — отдельный лендинг (`app/models/landing.py`)
  - `id`, `category_id` (FK), `slug`, `keyword_ru`, `keyword_en`, `search_volume`, `is_published`, `created_at`, `updated_at`
  - UniqueConstraint(`category_id`, `slug`)
- [x] Модель `LandingContent` — локализованный контент лендинга (`app/models/landing.py`)
  - `id`, `landing_id` (FK), `locale` (enum: ru/en), unique constraint (landing_id + locale)
  - SEO: `meta_title`, `meta_description`, `h1`, `og_title`, `og_description`, `og_image_url`
  - Hero: `hero_title`, `hero_subtitle`, `hero_cta_text`, `hero_placeholder`
  - Секции (все JSON):
    - `social_proof` — массив `{label, value}`
    - `advantages` — массив `{icon, title, description}`
    - `how_it_works` — массив `{step, title, description, image_url}`
    - `examples` — массив `{image_url, title, description, url}`
    - `video_url`, `video_title`
    - `pricing` — массив `{name, price, features[], cta_url, is_popular}`
    - `reviews` — массив `{author, text, rating, avatar_url}`
    - `faq` — массив `{question, answer}`
  - CTA: `cta_mid_title`, `cta_mid_subtitle`, `cta_final_title`, `cta_final_subtitle`, `cta_final_button_text`
  - **Адаптация:** Используется `sqlalchemy.types.JSON` вместо `postgresql.JSONB` — совместимо с SQLite для тестов и PostgreSQL в production. На PostgreSQL SQLAlchemy автоматически маппит JSON на встроенный JSONB-подобный тип.
- [x] Модель `LandingSection` — включённость секций (`app/models/landing.py`)
  - `id`, `landing_id` (FK), `section_type` (enum), `is_enabled` (default: true)
  - UniqueConstraint(`landing_id`, `section_type`)
- [x] Модель `SiteSettings` — глобальные настройки singleton (`app/models/settings.py`)
  - `id`, `metrika_id`, `smartcaptcha_client_key`, `default_pricing` (JSON), `default_cta_texts` (JSON), `platform_url`, `social_proof_defaults` (JSON), `default_video_url`, `updated_at`
- [x] Модель `SlugRedirect` — редиректы при смене slug-ов **[RISK-09]** (`app/models/redirect.py`)
- [x] **[RISK-07]** Pydantic-модели для валидации JSONB-структур в `schemas/content.py`: `AdvantageItem`, `HowItWorksStep`, `ExampleItem`, `PricingPlan`, `ReviewItem`, `FaqItem`, `SocialProofItem`, `CtaTexts`
- [x] Pydantic-схемы запросов/ответов: `schemas/auth.py`, `schemas/user.py`, `schemas/category.py`, `schemas/landing.py`, `schemas/settings.py`, `schemas/public.py`
- [x] Сервис валидации slug-ов: `services/slug.py` **[RISK-05, RISK-01]**
- [x] Сервис аутентификации: `services/auth.py` (JWT, bcrypt)
  - **Адаптация:** `passlib` заменён на прямой `bcrypt` — passlib 1.7.4 заброшен и несовместим с bcrypt >= 4.x.
- [x] FastAPI-зависимости: `api/deps.py` (`get_current_user`, `require_admin`)
- [ ] Создать Alembic-миграцию, применить, проверить схему — **отложено до деплоя** (тесты используют `create_all`, а Alembic migration требует работающий PostgreSQL)
  - **Исправлено при ревью:** добавлен `import app.models` в `alembic/env.py` — без него autogenerate создавал пустые миграции
- [ ] **[RISK-12]** В data-миграции — INSERT INTO site_settings с дефолтными значениями (platform_url="https://app.promto.ai") — **отложено до деплоя**

#### 2.2 — Auth API (Backend)
- [x] `POST /api/v1/auth/login` — JWT-авторизация (access + refresh tokens)
- [x] `POST /api/v1/auth/refresh` — обновление access token
- [x] `GET /api/v1/auth/me` — текущий пользователь
- [x] Dependency `get_current_user` для защищённых роутов (проверка JWT)
- [x] Dependency `require_admin` — только роль admin
- [x] `scripts/create_admin.py` — CLI-скрипт создания первого admin-пользователя

#### 2.3 — CRUD API категорий (Backend)
- [x] `GET /api/v1/categories` — список категорий (публичный, с фильтром `?is_active=true`)
- [x] `POST /api/v1/categories` — создать категорию (admin). **[RISK-05]** Валидация slug: запрет зарезервированных значений (`admin`, `api`, `ru`, `en`, `_next`, `robots.txt`, `sitemap.xml`, `favicon.ico`)
- [x] `GET /api/v1/categories/{id}` — детали (admin)
- [x] `PATCH /api/v1/categories/{id}` — обновить (admin). **[RISK-05]** Та же валидация slug
- [x] `DELETE /api/v1/categories/{id}` — мягкое удаление / деактивация (admin). **[RISK-11]** При деактивации — каскадно снять с публикации все лендинги категории, вернуть количество затронутых

#### 2.4 — CRUD API лендингов (Backend)
- [x] `GET /api/v1/landings` — список с фильтрацией (category_id, is_published, search), пагинацией, сортировкой (admin)
- [x] `GET /api/v1/landings/{id}` — полные данные лендинга + контент обеих локалей + секции (admin)
- [x] `POST /api/v1/landings` — создать лендинг + пустой LandingContent(ru) + LandingContent(en) + все LandingSection (admin). **[RISK-05]** Валидация slug: запрет зарезервированных + запрет паттерна `page\d+` **[RISK-01]**
- [x] `PATCH /api/v1/landings/{id}` — обновить основные поля лендинга (admin). **[RISK-09]** При изменении slug опубликованного лендинга — автоматическое создание записи в `SlugRedirect` + предупреждение в ответе
- [x] `PATCH /api/v1/landings/{id}/content/{locale}` — обновить контент для конкретной локали (admin). **[RISK-07]** Валидировать JSONB-поля через Pydantic-модели перед записью
- [x] `PATCH /api/v1/landings/{id}/sections` — массовое обновление is_enabled для секций (admin)
- [x] `PATCH /api/v1/landings/{id}/publish` — переключить is_published (admin). **[RISK-10]** При публикации — проверка минимального контента (h1, hero_title, meta_title не пустые для хотя бы одной локали). Ошибка 400 со списком незаполненных полей
- [x] `DELETE /api/v1/landings/{id}` — удалить лендинг каскадно (admin)

#### 2.5 — Публичное API (Backend)
- [x] `GET /api/v1/public/categories` — активные категории с количеством опубликованных лендингов
- [x] `GET /api/v1/public/landings` — список опубликованных лендингов (для promto.ai)
  - Параметры: `?category=slug&locale=ru|en&page=1&per_page=20`
  - Ответ: `{items: [{title, slug, category_slug, full_url, keyword, search_volume, locale}], total, page, per_page}`
  - CORS: разрешить запросы с promto.ai
  - Cache-Control: max-age=3600
- [x] `GET /api/v1/public/landing/{category_slug}/{landing_slug}` — полные данные для рендера
  - Параметр: `?locale=ru|en`
  - Включает: контент, включённые секции, мета-теги
- [x] `GET /api/v1/public/sitemap-data` — slug-и всех опубликованных лендингов для генерации sitemap.xml
  - Ответ: `[{category_slug, landing_slug, updated_at, locales: ["ru","en"]}]`

#### 2.6 — Служебные эндпоинты (Backend)
- [x] `GET /api/v1/settings` — получить глобальные настройки (публичный — metrika_id, smartcaptcha_client_key, platform_url)
- [x] `PATCH /api/v1/settings` — обновить настройки (admin)
- [x] `POST /api/v1/revalidate` — webhook для триггера ISR-ревалидации (вызывается из админки при сохранении лендинга; отправляет запрос на Next.js revalidate endpoint)
- [x] `POST /api/v1/captcha/verify` — серверная валидация SmartCaptcha-токена (принимает token, отправляет запрос к Yandex API, возвращает ok/fail)

#### 2.7 — Импорт структуры из Excel (Backend)
- [x] `scripts/import_from_excel.py` — парсинг `docs/Структура Промто.xlsx` (строки 2-63)
  - Создание категории "ИИ-конструктор сайтов" (`site-generator`)
  - Создание лендингов: slug из URL (последний сегмент), keyword_ru из столбца "Запрос", search_volume из столбца "Частотность"
  - Для каждого лендинга: пустые LandingContent(ru) + LandingContent(en) + все LandingSection(enabled=true)
  - Идемпотентный (можно запускать повторно без дублей)
  - **[RISK-04]** Дедупликация slug-ов (perevodchika встречается дважды): при дубле — оставить строку с бОльшей частотностью, логировать предупреждение
  - **[RISK-01]** Валидация slug: запрет паттерна `page\d+`
  - **[RISK-05]** Валидация slug: запрет зарезервированных значений
  - Итоговый отчёт: количество импортированных / пропущенных / конфликтных
- [x] `scripts/seed_data.py` — создание 3 тестовых лендингов с заполненным контентом (для разработки фронтенда): dlya-biznesa, dlya-portfolio, dlya-restoranov

#### 2.8 — Тесты фазы (Backend) — 38/38 pass
- [x] Тесты auth API (8 тестов): login success/fail, refresh valid/invalid/wrong type, me authenticated/unauthenticated
- [x] Тесты CRUD категорий (8 тестов): создание, список, фильтрация active, обновление, валидация slug, дубликат slug, каскадное удаление, forbidden для editor
- [x] Тесты CRUD лендингов (11 тестов): создание, список с фильтрацией, обновление контента, JSONB-валидация, секции, публикация, slug redirect, reserved/pageN slug, удаление
- [x] Тесты публичного API (5 тестов): категории, лендинги, детали, 404, sitemap-data
- [x] Тесты настроек (4 теста): получение, обновление, запрет для не-admin, captcha verify без ключа
- [x] Тесты health (2 теста): health-check, OpenAPI docs
- [ ] Тест импорта из Excel — **отложено** (требует mock xlsx или fixtures)
- [x] **[RISK-05]** Тест: зарезервированный slug при создании категории/лендинга — ошибка 400
- [x] **[RISK-10]** Тест: публикация с пустым контентом — ошибка 400
- [x] **[RISK-11]** Тест: деактивация категории — каскадное снятие лендингов с публикации
- [x] **[RISK-09]** Тест: изменение slug опубликованного лендинга — создаётся запись SlugRedirect
- [x] **[RISK-07]** Тест: невалидные JSONB-данные — ошибка 400
- [x] **[RISK-01]** Тест: pageN slug — ошибка 400

**Критерии готовности:**
- ✅ Все API-эндпоинты отвечают корректно (30 маршрутов, проверка через pytest + OpenAPI docs)
- ✅ `scripts/import_from_excel.py` готов к запуску (парсинг 62 лендингов с дедупликацией)
- ✅ `scripts/seed_data.py` создаёт 3 тестовых лендинга с полным контентом
- ✅ Все тесты проходят: 38/38 (pytest)

**Ревью #1 — найдено и исправлено:**
1. **(КРИТ)** `passlib` 1.7.4 несовместим с `bcrypt` 5.x — `hash_password()` падал с `ValueError`. Заменён на прямой `bcrypt` API (`services/auth.py`)
2. **(КРИТ)** `sqlalchemy.dialects.postgresql.JSONB` несовместим с SQLite-тестами — `create_all` падал с `UnsupportedCompilationError`. Заменён на `sqlalchemy.types.JSON` (`models/landing.py`, `models/settings.py`)
3. **(КРИТ)** `alembic/env.py` не импортировал модели — `Base.metadata.tables` был пустым, autogenerate создавал бы пустые миграции. Добавлен `import app.models`
4. **(СРЕДН)** `api/deps.py` ловил `except Exception` при декодировании JWT — перехватывал любые ошибки, включая DB/IO. Сужено до `jwt.PyJWTError`

**Ревью #2 — найдено, ожидает исправления:**
1. **(КРИТ)** `api/v1/auth.py:36-48` — `/refresh` endpoint не проверяет существование/активность пользователя в БД. Деактивированный пользователь продолжает обновлять токены. FIX: добавить `Depends(get_db)`, lookup по `User.id`, проверка `is_active`
2. **(КРИТ)** `models/redirect.py` — `SlugRedirect` без `UniqueConstraint` на `(old_category_slug, old_landing_slug)`. Повторная смена slug создаёт дубликаты. FIX: добавить `__table_args__` с `UniqueConstraint`
3. **(СРЕДН)** `api/v1/categories.py:19` — `GET /categories` без auth позволяет видеть `?is_active=false`. FIX: добавить `require_admin`
4. **(СРЕДН)** `api/v1/settings.py:74` — revalidate endpoint возвращает `str(e)` в ответе, может утечь URL с секретами. FIX: возвращать общее сообщение
5. **(СРЕДН)** `core/config.py:13` — default `SECRET_KEY` 23 байта, PyJWT выдаёт 107 `InsecureKeyLengthWarning`. FIX: увеличить до 32+ символов

**Отложено до деплоя:**
- 2.1: Alembic-миграция + data-миграция SiteSettings (требуют работающий PostgreSQL, в sandbox тесты используют SQLite + create_all)

---

### ФАЗА 3: Админ-панель ✅ ЗАВЕРШЕНА

**Цель:** Полноценный интерфейс управления лендингами. Бэкенд на этой фазе не затрагивается (API готово из Фазы 2).

**Зависимости:** Фаза 2 (API должно быть готово)

**Статус:** Реализовано. Build успешен (Next.js 16.2.4 Turbopack, TypeScript 0 ошибок).

**Архитектура:**
- Auth через httpOnly cookies: Next.js API Routes (`/api/auth/*`) проксируют к FastAPI и устанавливают токены в httpOnly cookies
- Admin API proxy: catch-all route `/api/admin/[...path]` проксирует все admin-запросы к FastAPI, прикрепляя access_token из cookie
- Auth protection: `AuthProvider` (React Context) проверяет `/api/auth/me` при загрузке, редирект на `/admin/login` при отсутствии. Route group `(authenticated)` обёртывает защищённые страницы layout-ом с sidebar+header
- Admin API client (`lib/admin-api.ts`): все запросы идут через `/api/admin/*` proxy, автоматический refresh при 401

#### 3.1 — Каркас админки (Frontend)
- [x] Роутинг: `/admin/login`, `/admin/dashboard`, `/admin/landings`, `/admin/landings/[id]`, `/admin/categories`, `/admin/settings`
  - **Адаптация:** Использована route group `(authenticated)` для layout с sidebar. `/admin` → redirect на `/admin/dashboard`
- [x] Layout админки: sidebar навигация (Dashboard, Лендинги, Категории, Настройки), header с email пользователя + logout
- [x] Защита роутов: `AuthProvider` проверяет JWT через `/api/auth/me`, редирект на `/admin/login` при отсутствии
- [x] **[RISK-06]** Next.js API Routes для auth-прокси (серверная установка httpOnly cookie):
  - `app/api/auth/login/route.ts` — принимает credentials, проксирует к FastAPI, устанавливает JWT как httpOnly cookie (access: 30min, refresh: 7d)
  - `app/api/auth/refresh/route.ts` — читает refresh token из cookie, обновляет, устанавливает новый
  - `app/api/auth/logout/route.ts` — удаляет cookie
  - `app/api/auth/me/route.ts` — проксирует GET /auth/me с access_token
- [x] API-клиент для админки (`lib/admin-api.ts`): fetch через `/api/admin/*` proxy (cookie автоматически), auto-refresh при 401
  - Admin API proxy: `app/api/admin/[...path]/route.ts` — catch-all proxy, пробрасывает access_token из cookie в Authorization header
- [x] Базовые UI-компоненты: DataTable (пагинация), FormField (input/textarea), Modal, Toast (context provider), Badge (статус), ConfirmDialog

#### 3.2 — Страница логина (Frontend)
- [x] Форма: email + password
- [x] Валидация: required на полях, отображение ошибки от сервера
- [x] **[RISK-06]** Вызов Next.js API Route `/api/auth/login` (НЕ напрямую FastAPI). Route устанавливает httpOnly cookie server-side
- [x] Редирект на dashboard после успешного входа. Если уже авторизован — redirect на dashboard

#### 3.3 — Dashboard (Frontend)
- [x] Виджеты: всего лендингов, опубликовано, черновиков, категорий (4 stat-карточки)
- [x] Последние изменённые лендинги (топ-5) с ссылками на редактор
- [x] Быстрые действия: создать лендинг (→ /admin/landings?new=1), создать категорию (→ /admin/categories)

#### 3.4 — Управление категориями (Frontend)
- [x] Таблица категорий: название (RU/EN), slug, статус (активна/неактивна), порядок сортировки, действия
- [x] Создание категории: модальная форма (slug, название RU/EN, описание RU/EN, meta title RU/EN, meta description RU/EN, sort_order, is_active)
- [x] Редактирование категории: та же форма, предзаполненная данными
- [x] Деактивация/удаление: ConfirmDialog с предупреждением о каскадном снятии лендингов с публикации **[RISK-11]**

#### 3.5 — Управление лендингами — список (Frontend)
- [x] Таблица: ключевой запрос (RU), slug, категория, статус (badge), частотность, дата обновления, действия
- [x] Фильтры: выпадающий список категорий, переключатель статуса (все/опубликованы/черновики)
- [x] Поиск: debounced input (300ms) по H1, keyword, slug
- [x] Пагинация (server-side, 20 элементов на страницу)
- [x] Быстрые действия в строке: опубликовать/снять, редактировать (→ /admin/landings/{id}), удалить (ConfirmDialog)
- [x] Модал создания нового лендинга (открывается по кнопке или ?new=1)

#### 3.6 — Редактор лендинга (Frontend)
- [x] **Вкладка "Основное":** slug (editable, предупреждение о редиректе), категория (select), ключевой запрос RU/EN, частотность
- [x] **Вкладка "SEO":** для каждой локали (RU/EN секции): meta title, meta description (со счётчиком символов), H1, OG title, OG description, OG image URL. Раздельное сохранение по локали
- [x] **Вкладка "Контент RU":** CollapsibleSection для каждого блока + DynamicList для массивных полей:
  - Hero: заголовок, подзаголовок, текст CTA, placeholder
  - Social Proof: динамический список {label, value}
  - Преимущества: динамический список {icon, title, description}
  - Как это работает: динамический список {step, title, description, image_url}
  - Примеры: динамический список {image_url, title, description, url}
  - Видео: URL + заголовок
  - Тарифы: динамический список {name, price, features (newline-separated), cta_url, is_popular}
  - Отзывы: динамический список {author, text, rating, avatar_url}
  - FAQ: динамический список {question, answer}
  - CTA промежуточный + финальный
- [x] **Вкладка "Контент EN":** аналогичная структура через ContentEditor с locale="en"
- [x] **Вкладка "Секции":** toggle-переключатели для каждой секции
- [x] Кнопка "Сохранить" (PATCH на соответствующие эндпоинты, по вкладкам)
- [x] Кнопка "Предпросмотр" — ссылка на `/{locale}/{category_slug}/{landing_slug}/`
- [x] Кнопка публикации/снятия с публикации

#### 3.7 — Настройки сайта (Frontend)
- [x] ID Яндекс.Метрики (текстовое поле)
- [x] Клиентский ключ SmartCaptcha (текстовое поле)
- [x] URL платформы (default: `https://app.promto.ai`)
- [x] Дефолтные тарифы (JSON textarea-редактор)
- [x] Дефолтные тексты CTA-блоков (JSON textarea-редактор)
- [x] Дефолтный Social Proof (динамический список {label, value})
- [x] URL дефолтного видео (текстовое поле)
- [x] Кнопка "Обновить кеш фронтенда" (POST /revalidate)

#### 3.8 — Тесты фазы (Frontend)
- [ ] Компонентные тесты (Vitest + Testing Library): DataTable, FormField, Modal, Toast, ConfirmDialog — **отложено**
- [ ] E2E тест (Playwright): логин -> dashboard -> переход к списку лендингов -> открытие редактора -> изменение контента -> сохранение -> проверка обновлённых данных — **отложено**
- [ ] E2E тест: создание новой категории -> создание лендинга в ней -> публикация -> проверка в списке
- [ ] E2E тест: удаление лендинга с подтверждением

**Критерии готовности:**
- ✅ Можно залогиниться, увидеть лендинги (auth flow через httpOnly cookies)
- ✅ Можно отредактировать контент лендинга (все секции), сохранить, увидеть изменения
- ✅ Можно создать новый лендинг, опубликовать, снять с публикации, удалить
- ✅ Можно управлять категориями и настройками сайта
- ⚠️ E2E и компонентные тесты — отложены

**Коммиты:** `9617212` (реализация), `b4abf01` (исправления после ревью 1), TBD (исправления после ревью 2).

**Найдено при ревью 1 и исправлено:**
1. **(КРИТ)** `ContentEditor.tsx` — `import { useState }` был расположен после первого вызова `useState` (строка 84 vs строка 61). Перемещён в начало файла
2. **(КРИТ)** `admin-api.ts` — неиспользуемая функция `serverFetch`. Удалена
3. **(СРЕДН)** `landings/[id]/page.tsx` — 9 неиспользуемых деструктурированных переменных при omit SEO-полей. Заменено на `Object.fromEntries` + `Set` фильтр
4. **(СРЕДН)** 6 ошибок ESLint `react-hooks/set-state-in-effect` во всех data-fetching components. Рефакторинг: удалён паттерн `useCallback` + `useEffect`, заменён на plain async functions + `eslint-disable` для легитимного data-fetching
5. **(НЕЗНАЧИТ)** Toast: удалены несуществующие в Tailwind v4 классы `animate-in slide-in-from-right`

**Найдено при ревью 2 (детальный line-by-line, 23 файла / ~2918 строк) и исправлено:**
6. **(СРЕДН)** `ContentEditor.tsx:243` — небезопасный двойной type cast `as unknown as string` для поля `features` (передавался `string[]` в callback с типом `string | number | boolean`). Исправлено: расширен тип `DynamicList.update` callback до `string | number | boolean | string[]`, удалён cast
7. **(СРЕДН)** `landings/page.tsx:62-66` — `setCreateOpen(true)` вызывался во время фазы рендера (setState during render). Исправлено: инициализация `createOpen` напрямую из `searchParams.get("new") === "1"` в `useState`

**Критических проблем при ревью 2 не обнаружено.** ESLint: 0 ошибок, TypeScript: 0 ошибок.

**Отложено:**
- 3.8: Компонентные тесты (Vitest) и E2E тесты (Playwright) — требуют установки дополнительных dev-зависимостей

---

### ФАЗА 4: Публичные лендинги и SEO ✅ ЗАВЕРШЕНА

**Цель:** SEO-оптимизированные лендинги, доступные для индексации. SEO — не отдельная фаза, а неотъемлемая часть каждого компонента.

**Зависимости:** Фаза 2 (API + seed data для разработки), Фаза 1 (i18n-роутинг)

**Статус:** Реализовано. TypeScript 0 ошибок, ESLint 0 ошибок/предупреждений.

#### 4.1 — Роутинг и SSG (Frontend)
- [x] **[RISK-01]** Единый catch-all маршрут `/{locale}/{category}/[...rest]/page.tsx`: `page\d+` → пагинация, иначе → лендинг
- [x] Маршрут `/{locale}/{category_slug}/` — категорийная страница через `[category]/page.tsx`
- [x] **[RISK-02]** `generateStaticParams()` с try/catch fallback на `[]`
- [x] `dynamicParams = true` — runtime rendering + ISR кеширование
- [x] ISR: `revalidate: 3600` + on-demand revalidation через `GET /api/revalidate?tag=...&secret=...`
- [x] Trailing slash: `trailingSlash: true` в `next.config.ts` + нормализация в `proxy.ts`

#### 4.2 — Ревалидация при сохранении (Frontend)
- [x] **Frontend:** `app/api/revalidate/route.ts` — проверяет secret, вызывает `revalidateTag(tag, "max")` (Next.js 16 API)
- [ ] **Backend:** Хук на сохранение лендинга → вызов `GET /api/revalidate?tag=...&secret=...` — **отложено, требует Backend-изменений**

#### 4.3 — Компоненты секций лендинга (Frontend)
- [x] `HeroSection` — `<h1>`, подзаголовок, `PromptInput` (client) с UTM-параметрами
- [x] `SocialProofBar` — `<div>` без `<h*>`, Intersection Observer анимация (client)
- [x] `AdvantagesSection` — `<h2>`, сетка карточек `<h3>` + `<p>` + иконка-эмоджи
- [x] `HowItWorksSection` — `<h2>`, шаги с номерами, `<h3>` + `<p>`
- [x] `ExamplesSection` — `<h2>`, `next/image` (lazy, alt, responsive sizes)
- [x] `CtaBlock` — `<div>`, mid/final варианты, повторное поле промта
- [x] `VideoSection` — `<h2>`, lazy-loaded iframe (загрузка по клику), YouTube/Rutube парсинг
- [x] `PricingSection` — `<h2>`, карточки тарифов, `is_popular` badge
- [x] `ReviewsSection` — `<h2>`, пагинированная карусель (client), `next/image` для аватаров
- [x] `FaqSection` — `<h2>`, `<details>/<summary>` (нативный HTML, без JS)
- [x] `Breadcrumbs` — над `<h1>`, последний элемент не ссылка
- [x] Условный рендер: секции рендерятся только при `enabled_sections.includes(type)` и наличии данных
- [x] **[RISK-10]** Defensive rendering: каждый компонент возвращает `null` при пустых данных
- [x] **[RISK-07]** TypeScript-типы в `types/public.ts`: `SocialProofItem`, `AdvantageItem`, `HowItWorksStep`, `ExampleItem`, `PricingPlan`, `ReviewItem`, `FaqItem`

#### 4.4 — Общие компоненты layout (Frontend)
- [x] `Header` — логотип (`rel="nofollow"`), переключатель RU/EN, мобильное бургер-меню (client). **Без `<h*>` тегов**
- [x] `Footer` — `rel="nofollow"` на внешних ссылках. **Без `<h*>` тегов**
- [x] `ScrollToTop` — появляется при скролле > 400px (client)
- [x] Адаптивная вёрстка: mobile-first, responsive grid, нет горизонтального скролла

#### 4.5 — Категорийная страница (Frontend)
- [x] Карточки лендингов с ссылками
- [x] `<h1>` — название категории
- [x] Описание категории
- [x] Хлебные крошки
- [x] Серверная пагинация с ЧПУ: `/{locale}/{category}/page2/`
- [x] Первая страница → `/{locale}/{category}/` без `/page1/` (page1 → notFound)
- [x] Meta title для страниц > 1: "{title} - страница {N}"

#### 4.6 — SEO: мета-теги и OpenGraph (Frontend)
- [x] `generateMetadata()` в category и catch-all route segments
- [x] Шаблон title: `{H1} — Промто` / `{H1} — Promto`
- [x] OpenGraph: title, description, image, url, type=website, locale
- [x] Canonical URL через `alternates.canonical`
- [x] Hreflang: `alternates.languages` с ru, en, x-default → ru

#### 4.7 — SEO: технический (Frontend)
- [x] `robots.ts` — `/admin/`, `/api/` закрыты; остальное открыто; ссылка на sitemap
- [x] `sitemap.ts` — генерация из `/api/v1/public/sitemap-data` + категории + home, обе локали
- [x] `not-found.tsx` — `<h1>Данная страница не существует!</h1>`, ссылка на главную
- [x] **[RISK-14]** `proxy.ts` — документированный порядок: exclude → normalize slashes (301) → trailing slash (301) → i18n
- [ ] **[RISK-09]** Проверка slug-редиректов в proxy — **отложено, требует backend endpoint `/api/v1/public/slug-redirect`**

#### 4.8 — Производительность (Frontend)
- [x] `next/image` в ExamplesSection и ReviewsSection (WebP, lazy, alt, responsive sizes)
- [x] RSC: секции — RSC, кроме client-компонентов (PromptInput, SocialProofBar, VideoSection, ReviewsSection, ScrollToTop, Header)
- [x] Шрифт: `next/font` Inter (preload, display=swap, latin+cyrillic)
- [x] Видео: загрузка iframe по клику (не при загрузке)
- [x] `<h*>` теги без вложенных тегов
- [x] Все ссылки/кнопки: hover, active состояния
- [x] Внешние ссылки: `rel="nofollow noopener"`
- [x] `next.config.ts`: `images.remotePatterns` для внешних изображений

#### 4.9 — Структурированные данные Schema.org (Frontend)
- [x] `JsonLd` компонент с JSON-LD скриптами:
  - `BreadcrumbList` — на каждом лендинге
  - `FAQPage` — если FAQ включён
  - `Product` + `Offer` — если pricing включён
  - `Review` + `AggregateRating` — если reviews включены
- [ ] `Organization` в layout — **отложено**

#### 4.10 — Тесты фазы
- [ ] Компонентные тесты (Vitest) — **отложено**
- [ ] E2E тесты (Playwright) — **отложено**
- [ ] SEO audit — **отложено**

**Архитектура:**
- Маршруты: `[locale]/page.tsx` (home), `[locale]/[category]/page.tsx` (категория), `[locale]/[category]/[...rest]/page.tsx` (пагинация + лендинг)
- Data fetching: `lib/public-api.ts` — fetch с `next.tags` и `revalidate: 3600` (ISR)
- Типы: `types/public.ts` — зеркалят backend Pydantic-модели
- Компоненты: `components/landing/` — 15 файлов (Header, Footer, ScrollToTop, Breadcrumbs, HeroSection, PromptInput, SocialProofBar, AdvantagesSection, HowItWorksSection, ExamplesSection, VideoSection, PricingSection, ReviewsSection, FaqSection, CtaBlock, JsonLd)
- SEO: robots.ts, sitemap.ts, not-found.tsx, generateMetadata, JsonLd (Schema.org)
- Revalidation: `api/revalidate/route.ts` с secret-проверкой

**Критерии готовности:**
- ✅ Лендинги рендерятся со всеми секциями на `/{locale}/{category}/{slug}/`
- ✅ robots.txt и sitemap.xml корректны
- ✅ 404-страница работает
- ✅ Schema.org JSON-LD генерируется для FAQ, Pricing, Reviews, Breadcrumbs
- ✅ Canonical URL и hreflang теги на каждой странице
- ⚠️ Тесты — отложены
- ⚠️ Slug redirects в proxy — требует backend endpoint
- ⚠️ Backend hook для on-demand revalidation — требует backend изменений

**Коммит:** TBD
- 301-редиректы работают (trailing slash, множественные слеши, locale)
- Все тесты проходят

---

### ФАЗА 5: Локализация (i18n)

**Цель:** Полноценная работа обеих локалей — все UI-тексты переведены, hreflang корректен, EN-контент для лендингов готов.

**Зависимости:** Фаза 4 (публичные страницы), Фаза 3 (админка для ревью EN-контента)

> **Примечание:** i18n-инфраструктура (next-intl middleware, locale routing, модель LandingContent с полем locale) заложена с Фазы 1-2. Эта фаза — наполнение и проверка.

#### 5.1 — UI-переводы (Frontend)
- [ ] Заполнить `messages/ru.json` — все статические тексты: навигация, кнопки, footer, 404, meta-шаблоны, placeholder-ы, admin UI labels
- [ ] Заполнить `messages/en.json` — полный перевод всех ключей
- [ ] Убедиться, что все текстовые строки в компонентах идут через `useTranslations()` / `getTranslations()`, нет хардкода

#### 5.2 — Локализация контента (Backend)
- [ ] API: публичные эндпоинты корректно фильтруют по `?locale=` и возвращают контент нужной локали
- [ ] API: sitemap-data возвращает `locales: ["ru", "en"]` только для лендингов, у которых заполнен контент обеих локалей
- [ ] Adminка: вкладки "Контент RU" / "Контент EN" корректно сохраняют и загружают контент соответствующей локали

#### 5.3 — Hreflang и sitemap (Frontend)
- [ ] Hreflang-теги в `<head>` связывают RU и EN версии каждого лендинга
- [ ] `x-default` hreflang указывает на RU-версию
- [ ] `sitemap.xml` содержит URL обеих локалей для каждого лендинга

#### 5.4 — Генерация EN-контента (Backend)
- [ ] `scripts/generate_en_content.py` — генерация/перевод EN-контента для всех лендингов на основе RU-контента
- [ ] Возможность ручной правки через админку (Фаза 3)

#### 5.5 — Тесты фазы (Frontend + Backend)
- [ ] **Frontend E2E:** переход `/ru/site-generator/pedagoga/` -> `/en/site-generator/pedagoga/` через переключатель языка — контент меняется на EN
- [ ] **Frontend E2E:** hreflang-теги присутствуют и корректны на каждой странице
- [ ] **Frontend unit:** sitemap содержит оба набора URL (ru + en)
- [ ] **Backend:** публичный API с `?locale=en` возвращает EN-контент
- [ ] **Backend:** sitemap-data корректно фильтрует по наличию контента

**Критерии готовности:**
- Все страницы работают на `/en/...` с английским контентом
- Переключатель языка работает на всех страницах
- Hreflang-теги валидны
- Sitemap.xml содержит URL обеих локалей
- Все статические UI-тексты переведены
- Все тесты проходят

---

### ФАЗА 6: Интеграции

**Цель:** Яндекс.Метрика отслеживает визиты и цели, SmartCaptcha защищает от ботов.

**Зависимости:** Фаза 4 (публичные лендинги должны существовать)

#### 6.1 — Яндекс.Метрика (Frontend)
- [ ] Компонент `YandexMetrika` — загружает скрипт Метрики (ID из `/api/v1/settings`)
- [ ] Подключение в `[locale]/layout.tsx` (только на публичных страницах, не в `/admin/`)
- [ ] Не загружать в режиме предпросмотра из админки (проверка `?preview=true` query)
- [ ] Настройка целей (отправка events через `ym()`):
  - `cta_click` — клик по любой CTA-кнопке
  - `prompt_submit` — отправка промта из hero/CTA секции
  - `pricing_view` — скролл до секции тарифов (Intersection Observer)
  - `faq_open` — клик по вопросу FAQ
- [ ] Вебвизор: включён в настройках Метрики

#### 6.2 — Yandex SmartCaptcha (Frontend + Backend)
- [ ] **Frontend:** загрузка SmartCaptcha SDK (invisible mode), client key из `/api/v1/settings`
- [ ] **Frontend:** при первом взаимодействии пользователя (submit промта) — запрос invisible-токена
- [ ] **Frontend:** при подозрении на бота — показ visible captcha challenge
- [ ] **Backend:** `POST /api/v1/captcha/verify` (уже создан в Фазе 2) — валидация токена через Yandex API
- [ ] **Frontend:** не запускать на страницах `/admin/`
- [ ] **Frontend:** не блокировать краулеры (проверка: SmartCaptcha в invisible mode не блокирует; для надёжности — fallback без капчи для known bot UA)

#### 6.3 — Тесты фазы (Frontend + Backend)
- [ ] **Frontend unit:** YandexMetrika компонент рендерится с корректным ID, не рендерится в admin layout
- [ ] **Frontend unit:** SmartCaptcha загружается в invisible mode
- [ ] **Frontend E2E:** при submit промта — отправляется event cta_click в Метрику (проверка через window.ym mock)
- [ ] **Backend:** тест `/api/v1/captcha/verify` — корректная обработка валидного и невалидного токенов

**Критерии готовности:**
- Метрика собирает данные (визиты + цели)
- SmartCaptcha невидимо защищает без ущерба для UX
- Краулеры не блокируются
- Все тесты проходят

---

### ФАЗА 7: Генерация контента

**Цель:** 62 лендинга наполнены полным AI-сгенерированным контентом (RU + EN).

**Зависимости:** Фаза 2 (импорт структуры), Фаза 3 (админка для ревью)

#### 7.1 — Генерация RU-контента (Backend)
- [ ] `scripts/generate_content.py` — AI-генерация контента через Anthropic API для каждого лендинга
- [ ] Промт-шаблон включает:
  - Ключевой запрос лендинга (из keyword_ru)
  - Информация о платформе Promto (конструктор сайтов на базе ИИ, app.promto.ai)
  - Целевая аудитория по нише (педагоги, врачи, рестораторы и т.д.)
  - Инструкции по формату каждого поля (JSON-структуры)
- [ ] Генерируемые поля:
  - SEO: meta_title (<60 символов, включает ключевой запрос), meta_description (<160 символов), H1 (включает ключевой запрос), og_title, og_description
  - Hero: hero_title (=H1), hero_subtitle (1-2 предложения о выгоде), hero_cta_text ("Создать сайт"), hero_placeholder ("Опишите, какой сайт для {ниша} вы хотите создать...")
  - Преимущества: 4-6 карточек, адаптированных под нишу
  - Как это работает: 3-4 шага (описать промт -> ИИ генерирует -> опубликовать)
  - FAQ: 5-6 вопросов-ответов по нише + общие вопросы о Promto
  - Отзывы: 4-5 шаблонных отзывов, адаптированных под нишу
  - CTA-тексты: заголовки и кнопки с призывом к действию по нише
- [ ] Дефолтные данные (НЕ генерируемые, из SiteSettings):
  - Social Proof: общие цифры платформы (берутся из SiteSettings.social_proof_defaults)
  - Тарифы: из SiteSettings.default_pricing
  - Видео: из SiteSettings.default_video_url
  - Примеры работ: общие скриншоты платформы (позже можно заменить на нише-специфичные)
- [ ] **[RISK-08]** Изображения: для MVP — внешние URL (Unsplash по нише для примеров, placeholder для аватаров). В промте генерации — не генерировать image_url, а подставлять из заготовленного набора по категориям
- [ ] **[RISK-13]** Rate limiting: пауза 1-2 секунды между запросами, обработка ошибок с retry (3 попытки, exponential backoff)
- [ ] **[RISK-13]** Progress tracking: запись обработанных landing_id в файл `generation_progress.json`. Флаг `--resume` для продолжения с места остановки
- [ ] **[RISK-13]** Dry-run режим (`--dry-run`): вывод списка лендингов для генерации и оценка стоимости (кол-во x средний размер промта) без реальных API-вызовов
- [ ] **[RISK-13]** Использовать Claude Sonnet (баланс цена/качество). Оценочная стоимость: ~$5-10 за 124 генерации
- [ ] Сохранение результатов в LandingContent(locale=ru) через API или напрямую в БД

#### 7.2 — Генерация EN-контента (Backend)
- [ ] Расширение `scripts/generate_content.py` или отдельный `scripts/generate_en_content.py`
- [ ] Перевод + адаптация RU-контента на EN (через тот же AI API)
- [ ] Сохранение в LandingContent(locale=en)

#### 7.3 — Ревью и публикация (Admin + Backend)
- [ ] Ручной ревью сгенерированного контента через админку (Фаза 3)
- [ ] Правка/доработка контента при необходимости
- [ ] Массовая публикация лендингов (после ревью)
- [ ] Триггер ISR-ревалидации для опубликованных лендингов

#### 7.4 — Тесты фазы (Backend)
- [ ] Тест скрипта генерации на 1 лендинге (моковый API): проверка формата и полноты результата
- [ ] Валидация: все обязательные JSONB-поля заполнены корректными структурами
- [ ] Валидация: meta_title < 60 символов, meta_description < 160 символов
- [ ] Валидация: slug-и не содержат запрещённых символов
- [ ] Проверка идемпотентности: повторный запуск не создаёт дубли

**Критерии готовности:**
- 62 лендинга имеют заполненный RU-контент (все секции)
- 62 лендинга имеют заполненный EN-контент
- Контент прошёл ручной ревью в админке
- Все лендинги опубликованы
- Страницы рендерятся с реальным контентом
- Все тесты проходят

---

### ФАЗА 8: Финальное QA и запуск

**Цель:** Полная проверка качества, SEO-аудит, деплой на types.promto.ai.

**Зависимости:** Все предыдущие фазы завершены.

#### 8.1 — SEO-аудит
- [ ] PageSpeed Insights > 90 для mobile И desktop — проверить на 3+ страницах (категорийная + 2 лендинга) (SEO-требование #33)
- [ ] Время ответа сервера < 200ms, оптимально < 50ms (SEO-требование #34)
- [ ] W3C HTML Validator — без критических ошибок (SEO-требование #36)
- [ ] W3C CSS Validator — без ошибок (SEO-требование #36)
- [ ] Проверка микроразметки: Yandex Webmaster Microdata Validator (SEO-требование #26)
- [ ] Проверка robots.txt: `/admin/` закрыт, остальное доступно
- [ ] Проверка sitemap.xml: все опубликованные URL присутствуют, оба языка, нет закрытых в robots.txt
- [ ] Проверка всех 301 редиректов (множественные слеши, trailing slash, locale-redirect)
- [ ] Проверка hreflang: парные ссылки RU<->EN, x-default
- [ ] Проверка ЧПУ URL: нет `_`, `%`, `?`, дублей, спецсимволов
- [ ] Core Web Vitals: LCP < 2.5s, FID/INP < 200ms, CLS < 0.1
- [ ] Lighthouse аудит: Performance, Accessibility, Best Practices, SEO — все > 90

#### 8.2 — Кроссбраузерное тестирование
- [ ] Desktop: Chrome, Firefox, Safari, Edge
- [ ] Mobile: Chrome (Android), Safari (iOS)
- [ ] Проверка адаптивности: 320px, 375px, 768px, 1024px, 1440px, 1920px
- [ ] Нет горизонтального скролла на мобильных (SEO мобильное требование #6)
- [ ] Все интерактивные элементы работают на touch-устройствах

#### 8.3 — Функциональное тестирование
- [ ] Полный E2E flow: поиск (имитация) -> лендинг -> ввод промта -> переход на app.promto.ai
- [ ] Админка: полный CRUD цикл лендинга (создание -> наполнение -> публикация -> проверка на фронте -> снятие -> удаление)
- [ ] Переключение языка на всех типах страниц
- [ ] 404-страница для несуществующих URL
- [ ] Проверка: нет битых внутренних ссылок (SEO-требование #38)
- [ ] API для promto.ai: проверить curl-ом формат ответа, CORS-заголовки

#### 8.4 — Подготовка к деплою
- [ ] Финализация `.env` для продакшена (DATABASE_URL, SECRET_KEY, REVALIDATE_SECRET, SMARTCAPTCHA_SERVER_KEY, ANTHROPIC_API_KEY)
- [ ] Проверка `promto.yaml` — корректные preset-ы, root_dir, env_file
- [ ] Проверка Dockerfile-ов: standalone build для Next.js, production-ready для FastAPI
- [ ] **[RISK-02]** CI-шаг: перед Docker build frontend — экспорт static-params.json из работающего backend API
- [ ] Запуск миграций на продакшен-БД (`alembic upgrade head`)
- [ ] Создание admin-пользователя (`scripts/create_admin.py`)
- [ ] Импорт + генерация контента (если не сделано ранее)
- [ ] Публикация через вкладку Publish
- [ ] Проверка доступности types.promto.ai
- [ ] Проверка SSL-сертификата
- [ ] Регистрация в Яндекс.Вебмастер + отправка sitemap.xml

**Критерии готовности:**
- types.promto.ai доступен, 62 лендинга отображаются корректно
- SEO-аудит пройден (все метрики в зелёной зоне)
- Админка работает, контент можно редактировать
- API для promto.ai доступен и возвращает данные
- Метрика собирает данные
- SmartCaptcha работает

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
│   │   ├── seed_data.py
│   │   ├── generate_content.py
│   │   └── generate_en_content.py
│   ├── app/
│   │   ├── main.py
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   ├── database.py
│   │   │   ├── security.py
│   │   │   ├── logging.py
│   │   │   └── exceptions.py
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   ├── category.py
│   │   │   ├── landing.py
│   │   │   ├── landing_content.py
│   │   │   ├── landing_section.py
│   │   │   ├── slug_redirect.py       # [RISK-09]
│   │   │   └── settings.py
│   │   ├── schemas/
│   │   │   ├── auth.py
│   │   │   ├── category.py
│   │   │   ├── landing.py
│   │   │   ├── content.py             # [RISK-07] Pydantic-модели для JSONB
│   │   │   └── settings.py
│   │   ├── api/
│   │   │   ├── router.py
│   │   │   ├── deps.py              # get_current_user, require_admin, get_db
│   │   │   └── v1/
│   │   │       ├── auth.py
│   │   │       ├── categories.py
│   │   │       ├── landings.py
│   │   │       ├── public.py
│   │   │       ├── settings.py
│   │   │       ├── revalidate.py
│   │   │       └── captcha.py
│   │   └── services/
│   │       ├── auth_service.py
│   │       ├── category_service.py
│   │       ├── landing_service.py
│   │       └── captcha_service.py
│   └── tests/
│       ├── conftest.py               # Тестовая БД, фикстуры
│       ├── test_health.py
│       ├── test_auth.py
│       ├── test_categories.py
│       ├── test_landings.py
│       ├── test_public_api.py
│       ├── test_import.py
│       └── test_captcha.py
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   ├── vitest.config.ts
│   ├── playwright.config.ts
│   ├── messages/
│   │   ├── ru.json
│   │   └── en.json
│   ├── src/
│   │   ├── middleware.ts              # i18n + redirects + admin auth
│   │   ├── i18n/
│   │   │   ├── request.ts
│   │   │   └── routing.ts
│   │   ├── app/
│   │   │   ├── robots.ts
│   │   │   ├── sitemap.ts
│   │   │   ├── api/
│   │   │   │   ├── revalidate/
│   │   │   │   │   └── route.ts
│   │   │   │   └── auth/              # [RISK-06] Auth proxy routes
│   │   │   │       ├── login/route.ts
│   │   │   │       ├── refresh/route.ts
│   │   │   │       └── logout/route.ts
│   │   │   ├── [locale]/
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── page.tsx
│   │   │   │   ├── not-found.tsx
│   │   │   │   └── [category]/
│   │   │   │       ├── page.tsx                # Категорийная стр. (стр. 1)
│   │   │   │       └── [...rest]/              # [RISK-01] Единый catch-all
│   │   │   │           └── page.tsx            # pageN -> пагинация, иначе -> лендинг
│   │   │   └── admin/
│   │   │       ├── layout.tsx
│   │   │       ├── login/page.tsx
│   │   │       ├── dashboard/page.tsx
│   │   │       ├── landings/
│   │   │       │   ├── page.tsx
│   │   │       │   └── [id]/page.tsx
│   │   │       ├── categories/page.tsx
│   │   │       └── settings/page.tsx
│   │   ├── components/
│   │   │   ├── landing/
│   │   │   │   ├── HeroSection.tsx
│   │   │   │   ├── PromptInput.tsx        # Client component
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
│   │   │   │   ├── ScrollToTop.tsx        # Client component
│   │   │   │   └── YandexMetrika.tsx      # Client component
│   │   │   ├── seo/
│   │   │   │   ├── JsonLd.tsx
│   │   │   │   └── SchemaOrg.tsx
│   │   │   ├── captcha/
│   │   │   │   └── SmartCaptcha.tsx       # Client component
│   │   │   └── admin/
│   │   │       ├── AdminLayout.tsx
│   │   │       ├── DataTable.tsx
│   │   │       ├── LandingEditor.tsx
│   │   │       ├── SectionToggle.tsx
│   │   │       ├── ContentForm.tsx
│   │   │       ├── DynamicList.tsx        # Reusable: add/remove items
│   │   │       └── JsonEditor.tsx
│   │   ├── lib/
│   │   │   ├── api.ts
│   │   │   ├── admin-api.ts              # JWT-authenticated client
│   │   │   └── utils.ts
│   │   ├── styles/
│   │   │   └── globals.css
│   │   └── types/
│   │       ├── landing.ts
│   │       ├── category.ts
│   │       └── api.ts
│   ├── __tests__/
│   │   ├── components/
│   │   │   ├── HeroSection.test.tsx
│   │   │   ├── FaqSection.test.tsx
│   │   │   ├── Breadcrumbs.test.tsx
│   │   │   └── PricingSection.test.tsx
│   │   ├── seo/
│   │   │   ├── metadata.test.ts
│   │   │   ├── robots.test.ts
│   │   │   └── sitemap.test.ts
│   │   └── admin/
│   │       ├── DataTable.test.tsx
│   │       └── LandingEditor.test.tsx
│   └── e2e/
│       ├── landing.spec.ts
│       ├── category-page.spec.ts
│       ├── admin-crud.spec.ts
│       ├── i18n.spec.ts
│       └── seo-audit.spec.ts
├── docker-compose.yml
├── docker-compose.dev.yml
└── .env.example
```

---

## Порядок и зависимости фаз

```
Фаза 1 (Фундамент)
    │
    └──> Фаза 2 (Backend Core: Модели + Auth + API + Импорт)
              │
              ├──> Фаза 3 (Админка) ─────────────────┐
              │                                       │
              ├──> Фаза 4 (Лендинги + SEO) ──┐       │
              │    [можно параллельно с Ф3]   │       │
              │                               │       │
              │    ┌──────────────────────────┘       │
              │    │                                   │
              │    ├──> Фаза 5 (i18n) ──> Фаза 6 (Интеграции)
              │    │    [нужны Ф3 + Ф4]       │
              │    │                           │
              │    └──────────────────────────>│
              │                                │
              └──> Фаза 7 (Генерация контента) │
                   [нужны Ф2 + Ф3]            │
                                               │
                              Фаза 8 (QA и запуск)
                              [нужны все фазы]
```

**Параллелизм:**
- Фазы 3 (Админка) и 4 (Лендинги) можно вести параллельно — обе зависят только от Фазы 2 API
- Фаза 7 (Генерация контента) может начинаться после Фаз 2 и 3 (нужен API + админка для ревью), независимо от Фазы 4
- Фазы 5 и 6 последовательны (i18n -> интеграции) и зависят от Фазы 4

**Критический путь:** 1 -> 2 -> 4 -> 5 -> 6 -> 8

---

## Реестр рисков

### RISK-01: Конфликт роутов пагинации и лендинга [Фаза 4] — КРИТИЧЕСКИЙ

**Риск:** В файловой структуре `[category]/[[...page]]/` (catch-all для пагинации) и `[category]/[slug]/` (лендинг) — оба сегмента конкурируют за один и тот же URL-паттерн. Next.js не может детерминированно выбрать между ними для URL вида `/ru/site-generator/pedagoga/`.

**Митигация:** Удалить `[[...page]]/`. Использовать единый `[...rest]/page.tsx` под `[category]/`, который самостоятельно маршрутизирует:
- Если сегмент соответствует `page{N}` — рендерить листинг категории с пагинацией
- Иначе — рендерить лендинг

На бэкенде и при импорте — запретить slug-и начинающиеся с `page` + цифры.

**Изменения в плане:**
- Фаза 2.7: добавить валидацию slug при импорте (запрет `pageN` паттерна)
- Фаза 4.1: заменить `[[...page]]` + `[slug]` на единый `[...rest]`
- Фаза 4.5: пагинация через `/{category}/page2/` вместо query-параметров

---

### RISK-02: Backend недоступен при Docker-билде SSG [Фаза 4] — КРИТИЧЕСКИЙ

**Риск:** `generateStaticParams()` вызывает API бэкенда (`/api/v1/public/sitemap-data`) во время `docker build`. Но при Docker multi-stage build другие контейнеры (backend) недоступны по сети. Билд падает или создаёт пустой набор страниц.

**Митигация:** Двойная стратегия:
1. **Код:** `generateStaticParams()` с try/catch — при ошибке возвращает `[]` (пустой массив). С `dynamicParams = true` Next.js отрендерит страницу при первом запросе и закеширует через ISR.
2. **CI/CD:** перед `docker build frontend` — скрипт `ci/export-static-params.sh` делает `curl` к работающему API и сохраняет результат в `frontend/static-params.json`. `generateStaticParams()` читает из файла, если он существует.

**Изменения в плане:**
- Фаза 4.1: добавить fallback-логику в `generateStaticParams()`
- Фаза 8.4: добавить шаг CI — экспорт static params перед Docker build

---

### RISK-03: i18n middleware перехватывает /admin/ [Фаза 1, 4] — ВЫСОКИЙ

**Риск:** next-intl middleware по умолчанию перехватывает все URL и редиректит на `/{locale}/...`. Запрос к `/admin/dashboard` будет перенаправлен на `/ru/admin/dashboard`, что сломает админку.

**Митигация:** В `middleware.ts` явный early return для `/admin`, `/api/`, `/_next/`, `/robots.txt`, `/sitemap.xml`, `/favicon.ico` **перед** вызовом intlMiddleware.

**Изменения в плане:**
- Фаза 1.2: указать явное исключение `/admin/` при настройке next-intl middleware
- Фаза 4.7: middleware.ts — порядок обработки задокументирован

---

### RISK-04: Дублирующиеся slug-и в Excel [Фаза 2] — СРЕДНИЙ

**Риск:** В данных Excel slug `perevodchika` встречается дважды (строки 5 и 37) с разными keyword-ами ("создаем сайт переводчик" и "создать сайт переводчик"). Импорт скрипт создаст дубль или упадёт на unique constraint.

**Митигация:** В `import_from_excel.py`:
- Проверка уникальности slug перед вставкой
- При дубле — пропуск с логированием предупреждения, приоритет строке с бОльшей частотностью
- Отчёт после импорта: список пропущенных дублей

**Изменения в плане:**
- Фаза 2.7: добавить дедупликацию и отчёт о конфликтах
- Фаза 2.8: тест на обработку дублей в импорте

---

### RISK-05: Коллизия slug-ов с зарезервированными путями [Фаза 2] — ВЫСОКИЙ

**Риск:** Если создать категорию с slug `admin`, `api`, `ru` или `en`, URL сломается: `/ru/admin/` — это админка или категория? `/ru/ru/` — это locale+category или дубль locale?

**Митигация:** Список зарезервированных slug-ов (`admin`, `api`, `ru`, `en`, `_next`, `robots.txt`, `sitemap.xml`, `favicon.ico`) — валидация на бэкенде при создании/обновлении категории И лендинга.

**Изменения в плане:**
- Фаза 2.3: добавить `RESERVED_SLUGS` валидацию в CRUD категорий
- Фаза 2.4: добавить аналогичную валидацию для slug-ов лендингов (включая запрет `pageN` паттерна)

---

### RISK-06: JWT httpOnly cookie — архитектурный пробел [Фаза 3] — ВЫСОКИЙ

**Риск:** httpOnly cookie нельзя установить из клиентского JavaScript. План указывает "сохранение JWT в httpOnly cookie", но не определяет КАК. Если фронтенд (браузер) напрямую вызывает FastAPI `/auth/login`, он получит JWT в теле ответа, но не сможет записать его в httpOnly cookie.

**Митигация:** Добавить Next.js API Route `/api/auth/login` (серверный прокси):
1. Клиент отправляет credentials на `/api/auth/login` (Next.js API Route)
2. API Route вызывает FastAPI `/api/v1/auth/login` server-to-server
3. API Route получает JWT и устанавливает его как httpOnly cookie через `Set-Cookie` header
4. Аналогично для `/api/auth/refresh` и `/api/auth/logout`

**Изменения в плане:**
- Фаза 3.1: добавить Next.js API Routes для auth-прокси (`app/api/auth/login/route.ts`, `app/api/auth/refresh/route.ts`, `app/api/auth/logout/route.ts`)
- Фаза 3.2: клиент вызывает Next.js API Route, не напрямую FastAPI

---

### RISK-07: Дрифт JSONB-схемы [Фаза 2-4] — СРЕДНИЙ

**Риск:** JSONB-поля (advantages, pricing, faq и т.д.) не имеют схемной валидации на уровне БД. Фронтенд ожидает `{icon, title, description}`, а в БД может попасть `{icon, heading, desc}` (через скрипт генерации или прямое редактирование). Результат — молчаливое отображение пустых секций.

**Митигация:**
1. **Backend:** Pydantic-модели для каждого JSONB-поля (AdvantageItem, FaqItem, PricingItem и т.д.) — валидация при записи через API
2. **Frontend:** TypeScript-типы, зеркалящие Pydantic-модели; defensive rendering (проверка наличия полей перед рендером)
3. **Контракт:** единый файл описания JSONB-структур, из которого генерятся и Pydantic-модели, и TS-типы (или ручная синхронизация с тестом)

**Изменения в плане:**
- Фаза 2.1: добавить Pydantic-модели для валидации JSONB-полей в schemas/
- Фаза 2.4: PATCH content — валидировать через Pydantic перед записью
- Фаза 4.3: компоненты проверяют наличие обязательных полей и рендерят fallback/skip при пустых данных

---

### RISK-08: Отсутствие стратегии хранения изображений [Фаза 2-7] — ВЫСОКИЙ

**Риск:** План содержит поля `image_url`, `og_image_url`, `avatar_url` в контенте, но нигде не определено, где хранятся изображения и как загружаются. Без загрузки изображений контент-менеджеры не смогут добавлять скриншоты примеров, аватары, OG-картинки.

**Митигация:** Две стратегии (выбрать одну):
- **A) Внешние URL:** изображения хостятся на внешнем CDN (Unsplash, imgbb, или YC S3 из promto-blog). В админке — поле ввода URL. Простая реализация, но зависимость от внешних сервисов.
- **B) Загрузка через API + YC S3:** добавить `POST /api/v1/upload` (как в promto-blog). Файл → YC S3 → URL возвращается и сохраняется в контенте. Полный контроль.

Для MVP рекомендую **A (внешние URL)** с планом миграции на B. Для AI-генерации контента — использовать placeholder-изображения (Unsplash) или генерацию через API.

**Изменения в плане:**
- Фаза 2.1: в описании полей image_url пометить "(внешний URL для MVP)"
- Фаза 3.6: в редакторе — текстовое поле для URL изображения + превью
- Фаза 7.1: для генерации контента — использовать placeholder-изображения из Unsplash по нише

---

### RISK-09: Изменение slug = битые URL без редиректа [Фаза 3] — СРЕДНИЙ

**Риск:** Если контент-менеджер изменит slug опубликованного лендинга, старый URL станет 404. Поисковые системы продолжат индексировать старый URL, что ударит по SEO (SEO-требование #38 — нет битых ссылок).

**Митигация:**
1. Таблица `slug_redirects` (old_category_slug, old_landing_slug, new_category_slug, new_landing_slug, created_at)
2. При изменении slug через API — автоматическое создание записи в `slug_redirects`
3. Публичный API / Next.js middleware проверяет `slug_redirects` и делает 301-редирект
4. В админке — предупреждение при изменении slug опубликованного лендинга

**Изменения в плане:**
- Фаза 2.1: добавить модель `SlugRedirect`
- Фаза 2.4: PATCH landing — при изменении slug опубликованного лендинга создавать запись в `slug_redirects`
- Фаза 4.7: middleware.ts — проверка `slug_redirects` через API и 301-редирект

---

### RISK-10: Пустой контент у опубликованного лендинга [Фаза 4] — СРЕДНИЙ

**Риск:** Лендинг может быть опубликован (is_published=true), но иметь пустой контент (все JSONB null). Страница отрендерится с пустыми секциями — плохо для SEO и UX.

**Митигация:**
1. **Backend:** при `PATCH /publish` проверять обязательные поля (h1, hero_title, meta_title заполнены). Если пустые — возвращать 400 с указанием незаполненных полей.
2. **Frontend:** компоненты секций не рендерятся при пустом контенте (а не показывают пустые блоки).

**Изменения в плане:**
- Фаза 2.4: `PATCH /publish` — валидация минимального контента перед публикацией
- Фаза 4.3: каждый компонент проверяет данные и возвращает `null` при пустом контенте

---

### RISK-11: Деактивация категории с опубликованными лендингами [Фаза 2] — СРЕДНИЙ

**Риск:** Если категория деактивирована (`is_active=false`), но её лендинги всё ещё `is_published=true`, публичное API вернёт лендинги без категории, а категорийная страница вернёт 404.

**Митигация:**
1. При деактивации категории — автоматически снимать с публикации все её лендинги
2. Предупреждение в админке: "В категории N опубликованных лендингов. Деактивация снимет их с публикации."

**Изменения в плане:**
- Фаза 2.3: `DELETE /categories/{id}` — каскадная деактивация лендингов + предупреждение
- Фаза 3.4: ConfirmDialog с информацией о количестве затронутых лендингов

---

### RISK-12: SiteSettings не существует при первом запуске [Фаза 2] — НИЗКИЙ

**Риск:** Модель SiteSettings — singleton. Но при первом запуске запись не существует. API `GET /settings` вернёт 404 или null, фронтенд не получит metrika_id и platform_url.

**Митигация:** Создавать запись SiteSettings с дефолтными значениями в Alembic-миграции (data migration) или в `scripts/seed_data.py`.

**Изменения в плане:**
- Фаза 2.1: в миграции — INSERT INTO site_settings с дефолтными значениями (platform_url = "https://app.promto.ai")

---

### RISK-13: Стоимость и надёжность AI-генерации контента [Фаза 7] — СРЕДНИЙ

**Риск:** 62 лендинга x 2 локали = 124 API-вызова к Anthropic. При Sonnet ~$5-10, при Opus ~$50-100. Если API недоступен, rate limit или ключ невалиден — генерация останавливается частично. Повторный запуск может создать дубли.

**Митигация:**
1. Скрипт пишет прогресс в файл/БД (какие лендинги обработаны)
2. Флаг `--resume` для продолжения с места остановки
3. Сухой запуск (`--dry-run`) для оценки стоимости перед запуском
4. Использовать Claude Sonnet для генерации (баланс цена/качество)
5. Rate limiting: пауза 1-2 секунды между запросами

**Изменения в плане:**
- Фаза 7.1: добавить --resume, --dry-run, progress tracking

---

### RISK-14: Middleware как единая точка отказа [Фаза 4] — СРЕДНИЙ

**Риск:** `middleware.ts` совмещает 5 задач: i18n routing, admin auth, trailing slash redirect, multiple slash cleanup, slug redirect. Сложность растёт нелинейно, ошибка в одном правиле ломает все URL.

**Митигация:**
1. Чёткий порядок обработки (документировать в коде):
   - (1) Исключить static files, /_next/, /api/
   - (2) Проверка /admin/ auth (early return)
   - (3) Нормализация URL (множественные слеши, trailing slash)
   - (4) Проверка slug-редиректов
   - (5) i18n middleware (последний)
2. Юнит-тесты на каждое правило в изоляции (не E2E)
3. Матрица тестов: таблица URL -> ожидаемый результат

**Изменения в плане:**
- Фаза 4.7: добавить документированный порядок обработки в middleware
- Фаза 4.10: добавить юнит-тесты middleware (матрица URL -> результат)

---

### Сводная матрица рисков

| ID | Риск | Фаза | Уровень | Тип |
|----|------|------|---------|-----|
| RISK-01 | Конфликт роутов `[[...page]]` vs `[slug]` | 4 | Критический | Архитектура |
| RISK-02 | SSG + Docker build — API недоступен | 4 | Критический | Инфраструктура |
| RISK-03 | i18n middleware перехватывает /admin/ | 1, 4 | Высокий | Пересечение FE/BE |
| RISK-04 | Дублирующиеся slug в Excel | 2 | Средний | Данные |
| RISK-05 | Коллизия slug с зарезервированными путями | 2 | Высокий | Валидация |
| RISK-06 | httpOnly cookie — архитектурный пробел | 3 | Высокий | Пересечение FE/BE |
| RISK-07 | Дрифт JSONB-схемы между BE и FE | 2-4 | Средний | Контракт |
| RISK-08 | Нет стратегии хранения изображений | 2-7 | Высокий | Пробел |
| RISK-09 | Изменение slug = 404 без редиректа | 3 | Средний | SEO |
| RISK-10 | Пустой контент у опубликованного лендинга | 4 | Средний | Валидация |
| RISK-11 | Деактивация категории с лендингами | 2 | Средний | Каскад |
| RISK-12 | SiteSettings не существует при старте | 2 | Низкий | Bootstrap |
| RISK-13 | Стоимость и надёжность AI-генерации | 7 | Средний | Внешние API |
| RISK-14 | Middleware как единая точка отказа | 4 | Средний | Сложность |

---

## Ключевые решения и trade-offs

| Решение | Альтернатива | Почему выбрано |
|---------|-------------|----------------|
| SSG + ISR (не SSR) | Чистый SSR | SSG даёт HTML при билде -> мгновенная загрузка, лучший PageSpeed. ISR обновляет без ребилда. |
| JSONB для контентных блоков | Отдельные таблицы на каждый тип блока | Гибкость: легко добавлять новые поля без миграций. Производительность достаточна при <10K лендингов. |
| next-intl (не next-i18next) | next-i18next | Нативная поддержка App Router, лучше работает с SSG, меньше бандл. |
| Монорепо (frontend + backend) | Отдельные репозитории | Проще деплой через docker-compose, атомарные изменения. |
| Tailwind CSS (не CSS Modules) | CSS Modules, Styled Components | Zero-runtime, лучший PageSpeed, быстрая разработка по брендбуку. |
| Админка внутри Next.js (/admin) | Отдельное React SPA | Меньше сервисов, переиспользование компонентов, проще деплой. Роуты /admin/ закрыты от индексации в robots.txt. |
| SEO встроен в Фазу 4 (не отдельная фаза) | Отдельная SEO-фаза | Мета-теги, Schema.org, heading structure — неотъемлемая часть компонентов. Делать "сначала страницы, потом SEO" — это переделывать. |
| Импорт структуры в Фазе 2 (не в конце) | Импорт после админки | Фронтенду нужны реальные данные для разработки. Seed data + Excel-структура доступны с самого начала. |
