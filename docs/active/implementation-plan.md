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

### ФАЗА 1: Фундамент и инфраструктура

**Цель:** Рабочий скелет проекта — оба сервиса запускаются локально, общаются между собой, i18n-роутинг на месте.

#### 1.1 — Backend: каркас FastAPI
- [ ] Создать структуру `backend/` (FastAPI-приложение)
- [ ] Настроить `pyproject.toml` с зависимостями (fastapi, uvicorn, sqlalchemy, asyncpg, alembic, pydantic-settings, pyjwt, passlib, python-slugify, httpx, openpyxl)
- [ ] Создать `backend/Dockerfile`
- [ ] Настроить `app/core/config.py` (Pydantic Settings — DATABASE_URL, SECRET_KEY, CORS_ORIGINS, FRONTEND_URL, SMARTCAPTCHA_SERVER_KEY)
- [ ] Создать `app/core/database.py` (async SQLAlchemy engine + session factory)
- [ ] Настроить `app/core/logging.py`
- [ ] Настроить `app/core/exceptions.py` (базовые обработчики ошибок)
- [ ] Добавить health-check endpoint: `GET /api/v1/health` (проверка связи с БД)
- [ ] Настроить CORS middleware (origins из конфига)

#### 1.2 — Frontend: каркас Next.js
- [ ] Создать Next.js 14+ приложение в `frontend/` (App Router, TypeScript, `output: "standalone"`)
- [ ] Настроить Tailwind CSS по брендбуку (цвета, шрифты, spacing, breakpoints)
- [ ] Настроить `next-intl`: middleware с определением локали из URL-префикса (`/ru/...`, `/en/...`), дефолтная локаль `ru`
- [ ] Создать файлы переводов UI: `messages/ru.json`, `messages/en.json` (пока пустые шаблоны)
- [ ] Создать `frontend/Dockerfile` (Next.js standalone build)
- [ ] Настроить базовый layout `[locale]/layout.tsx`: viewport meta, favicon (из брендбука), `next/font` для шрифта Onest
- [ ] Создать placeholder-страницу `[locale]/page.tsx` ("Landing Generator — coming soon")
- [ ] Настроить `src/lib/api.ts` — базовый fetch-клиент для обращения к backend API (NEXT_PUBLIC_API_URL)

#### 1.3 — Docker и локальный запуск
- [ ] Создать `docker-compose.yml` (frontend:3000 + backend:8000 + postgres:5432)
- [ ] Создать `docker-compose.dev.yml` (override с volume mounts для hot-reload)
- [ ] Подготовить `.env.example` с описанием всех переменных
- [ ] Проверить, что `docker-compose up` запускает все три сервиса

#### 1.4 — Конфигурация деплоя
- [ ] Создать `/home/user/promto.yaml`:
  - web: type backend, framework docker, root_dir frontend/ (Next.js SSR)
  - api: type backend, framework docker, root_dir backend/ (FastAPI)
  - db: type database, framework postgresql, preset_id 357
- [ ] Проверить соответствие структуре Dockerfile-ов (не в корне, а в поддиректориях)

#### 1.5 — Тесты фазы
- [ ] **Backend:** тест health-check endpoint (pytest + httpx AsyncClient)
- [ ] **Backend:** тест подключения к БД
- [ ] **Frontend:** `npm run build` завершается без ошибок
- [ ] **Infra:** `docker-compose up` — все сервисы стартуют, health-check возвращает 200

**Критерии готовности:**
- `curl http://localhost:8000/api/v1/health` -> `{"status":"ok","db":"ok"}`
- `curl http://localhost:3000/ru/` -> HTML с placeholder-страницей
- `curl http://localhost:3000/en/` -> HTML с placeholder-страницей (EN)
- Все тесты проходят

---

### ФАЗА 2: Backend Core — Модели, Auth, API

**Цель:** Полностью рабочее API для всех операций. Фронтенд на этой фазе не затрагивается.

#### 2.1 — Модели данных (Backend)
- [ ] Модель `User` — пользователи админки
  - `id`, `email`, `hashed_password`, `role` (enum: admin/editor), `is_active`, `created_at`
- [ ] Модель `Category` — категории конструкторов
  - `id`, `slug`, `name_ru`, `name_en`, `description_ru`, `description_en`, `meta_title_ru`, `meta_title_en`, `meta_description_ru`, `meta_description_en`, `is_active`, `sort_order`, `created_at`, `updated_at`
- [ ] Модель `Landing` — отдельный лендинг
  - `id`, `category_id` (FK), `slug`, `keyword_ru`, `keyword_en`, `search_volume`, `is_published`, `created_at`, `updated_at`
- [ ] Модель `LandingContent` — локализованный контент лендинга
  - `id`, `landing_id` (FK), `locale` (enum: ru/en), unique constraint (landing_id + locale)
  - SEO: `meta_title`, `meta_description`, `h1`, `og_title`, `og_description`, `og_image_url`
  - Hero: `hero_title`, `hero_subtitle`, `hero_cta_text`, `hero_placeholder`
  - Секции (все JSONB):
    - `social_proof` — массив `{label, value}`
    - `advantages` — массив `{icon, title, description}`
    - `how_it_works` — массив `{step, title, description, image_url}`
    - `examples` — массив `{image_url, title, description, url}`
    - `video_url`, `video_title`
    - `pricing` — массив `{name, price, features[], cta_url, is_popular}`
    - `reviews` — массив `{author, text, rating, avatar_url}`
    - `faq` — массив `{question, answer}`
  - CTA: `cta_mid_title`, `cta_mid_subtitle`, `cta_final_title`, `cta_final_subtitle`, `cta_final_button_text`
- [ ] Модель `LandingSection` — включённость секций
  - `id`, `landing_id` (FK), `section_type` (enum: social_proof, advantages, how_it_works, examples, cta_mid, video, pricing, reviews, faq), `is_enabled` (default: true)
  - unique constraint (landing_id + section_type)
- [ ] Модель `SiteSettings` — глобальные настройки (singleton)
  - `id`, `metrika_id`, `smartcaptcha_client_key`, `default_pricing` (JSONB), `default_cta_texts` (JSONB), `platform_url` (default: "https://app.promto.ai"), `social_proof_defaults` (JSONB), `default_video_url`, `updated_at`
- [ ] Создать Alembic-миграцию, применить, проверить схему

#### 2.2 — Auth API (Backend)
- [ ] `POST /api/v1/auth/login` — JWT-авторизация (access + refresh tokens)
- [ ] `POST /api/v1/auth/refresh` — обновление access token
- [ ] `GET /api/v1/auth/me` — текущий пользователь
- [ ] Dependency `get_current_user` для защищённых роутов (проверка JWT)
- [ ] Dependency `require_admin` — только роль admin
- [ ] `scripts/create_admin.py` — CLI-скрипт создания первого admin-пользователя

#### 2.3 — CRUD API категорий (Backend)
- [ ] `GET /api/v1/categories` — список категорий (публичный, с фильтром `?is_active=true`)
- [ ] `POST /api/v1/categories` — создать категорию (admin)
- [ ] `GET /api/v1/categories/{id}` — детали (admin)
- [ ] `PATCH /api/v1/categories/{id}` — обновить (admin)
- [ ] `DELETE /api/v1/categories/{id}` — мягкое удаление / деактивация (admin)

#### 2.4 — CRUD API лендингов (Backend)
- [ ] `GET /api/v1/landings` — список с фильтрацией (category_id, is_published, search), пагинацией, сортировкой (admin)
- [ ] `GET /api/v1/landings/{id}` — полные данные лендинга + контент обеих локалей + секции (admin)
- [ ] `POST /api/v1/landings` — создать лендинг + пустой LandingContent(ru) + LandingContent(en) + все LandingSection (admin)
- [ ] `PATCH /api/v1/landings/{id}` — обновить основные поля лендинга (admin)
- [ ] `PATCH /api/v1/landings/{id}/content/{locale}` — обновить контент для конкретной локали (admin)
- [ ] `PATCH /api/v1/landings/{id}/sections` — массовое обновление is_enabled для секций (admin)
- [ ] `PATCH /api/v1/landings/{id}/publish` — переключить is_published (admin)
- [ ] `DELETE /api/v1/landings/{id}` — удалить лендинг каскадно (admin)

#### 2.5 — Публичное API (Backend)
- [ ] `GET /api/v1/public/categories` — активные категории с количеством опубликованных лендингов
- [ ] `GET /api/v1/public/landings` — список опубликованных лендингов (для promto.ai)
  - Параметры: `?category=slug&locale=ru|en&page=1&per_page=20`
  - Ответ: `{items: [{title, slug, category_slug, full_url, keyword, search_volume, locale}], total, page, per_page}`
  - CORS: разрешить запросы с promto.ai
  - Cache-Control: max-age=3600
- [ ] `GET /api/v1/public/landing/{category_slug}/{landing_slug}` — полные данные для рендера
  - Параметр: `?locale=ru|en`
  - Включает: контент, включённые секции, мета-теги
- [ ] `GET /api/v1/public/sitemap-data` — slug-и всех опубликованных лендингов для генерации sitemap.xml
  - Ответ: `[{category_slug, landing_slug, updated_at, locales: ["ru","en"]}]`

#### 2.6 — Служебные эндпоинты (Backend)
- [ ] `GET /api/v1/settings` — получить глобальные настройки (публичный — metrika_id, smartcaptcha_client_key, platform_url)
- [ ] `PATCH /api/v1/settings` — обновить настройки (admin)
- [ ] `POST /api/v1/revalidate` — webhook для триггера ISR-ревалидации (вызывается из админки при сохранении лендинга; отправляет запрос на Next.js revalidate endpoint)
- [ ] `POST /api/v1/captcha/verify` — серверная валидация SmartCaptcha-токена (принимает token, отправляет запрос к Yandex API, возвращает ok/fail)

#### 2.7 — Импорт структуры из Excel (Backend)
- [ ] `scripts/import_from_excel.py` — парсинг `docs/Структура Промто.xlsx` (строки 2-63)
  - Создание категории "ИИ-конструктор сайтов" (`site-generator`)
  - Создание 62 лендингов: slug из URL (последний сегмент), keyword_ru из столбца "Запрос", search_volume из столбца "Частотность"
  - Для каждого лендинга: пустые LandingContent(ru) + LandingContent(en) + все LandingSection(enabled=true)
  - Идемпотентный (можно запускать повторно без дублей)
- [ ] `scripts/seed_data.py` — создание 3-5 тестовых лендингов с заполненным контентом (для разработки фронтенда)

#### 2.8 — Тесты фазы (Backend)
- [ ] Тесты моделей: создание/чтение/обновление/удаление каждой модели
- [ ] Тесты auth API: login, refresh, me, невалидный токен, истёкший токен
- [ ] Тесты CRUD категорий: создание, список, обновление, удаление, валидация slug
- [ ] Тесты CRUD лендингов: создание, список с фильтрацией, обновление контента, переключение секций, публикация
- [ ] Тесты публичного API: список лендингов, фильтрация по категории/локали, данные для рендера, sitemap-data
- [ ] Тест импорта из Excel: проверка количества созданных записей, корректность slug-ов, идемпотентность

**Критерии готовности:**
- Все API-эндпоинты отвечают корректно (проверка через OpenAPI docs `/api/docs`)
- `scripts/import_from_excel.py` создаёт 62 лендинга в БД
- `scripts/seed_data.py` создаёт тестовые лендинги с полным контентом
- Все тесты проходят (pytest)

---

### ФАЗА 3: Админ-панель

**Цель:** Полноценный интерфейс управления лендингами. Бэкенд на этой фазе не затрагивается (API готово из Фазы 2).

**Зависимости:** Фаза 2 (API должно быть готово)

#### 3.1 — Каркас админки (Frontend)
- [ ] Роутинг: `/admin/login`, `/admin/dashboard`, `/admin/landings`, `/admin/landings/[id]`, `/admin/categories`, `/admin/settings`
- [ ] Layout админки: sidebar навигация (Dashboard, Лендинги, Категории, Настройки), header с именем пользователя + logout
- [ ] Защита роутов: Next.js middleware проверяет JWT в cookie, редирект на `/admin/login` при отсутствии
- [ ] API-клиент для админки: fetch-обёртка с автоподстановкой JWT из cookie, автоматический refresh при 401
- [ ] Базовые UI-компоненты: DataTable (сортировка, пагинация), FormField, Modal, Toast, Badge (статус), ConfirmDialog

#### 3.2 — Страница логина (Frontend)
- [ ] Форма: email + password
- [ ] Валидация на клиенте
- [ ] Сохранение JWT в httpOnly cookie
- [ ] Редирект на dashboard после успешного входа

#### 3.3 — Dashboard (Frontend)
- [ ] Виджеты: всего лендингов, опубликовано, черновиков, категорий
- [ ] Последние изменённые лендинги (топ-5)
- [ ] Быстрые действия: создать лендинг, создать категорию

#### 3.4 — Управление категориями (Frontend)
- [ ] Таблица категорий: название (RU/EN), slug, кол-во лендингов, статус (активна/неактивна), действия
- [ ] Создание категории: модальная форма (slug, название RU, название EN, описание RU, описание EN, meta title RU/EN, meta description RU/EN)
- [ ] Редактирование категории: та же форма, предзаполненная
- [ ] Деактивация/удаление: с подтверждением через ConfirmDialog

#### 3.5 — Управление лендингами — список (Frontend)
- [ ] Таблица: H1 (RU), категория, slug, статус (badge: опубликован/черновик), частотность, дата обновления, действия
- [ ] Фильтры: выпадающий список категорий, переключатель статуса (все/опубликованы/черновики)
- [ ] Поиск: по H1, keyword, slug (debounced input)
- [ ] Пагинация (server-side)
- [ ] Быстрые действия в строке: опубликовать/снять, редактировать, удалить

#### 3.6 — Редактор лендинга (Frontend)
- [ ] **Вкладка "Основное":** slug (editable), категория (выпадающий список), ключевой запрос RU, ключевой запрос EN, частотность, статус публикации (toggle)
- [ ] **Вкладка "SEO":** для каждой локали (вложенные табы RU/EN): meta title, meta description, H1, OG title, OG description, OG image URL. Счётчик символов для title (<60) и description (<160)
- [ ] **Вкладка "Контент RU":** редактирование каждой секции в виде раскладываемых панелей (Collapsible):
  - Hero: заголовок, подзаголовок, текст кнопки CTA, плейсхолдер ввода промта
  - Social Proof: динамический список (добавить/удалить) пар {label, value}
  - Преимущества: динамический список карточек {выбор иконки, заголовок, описание}
  - Как это работает: динамический список шагов {номер, заголовок, описание, URL картинки}
  - Примеры: динамический список {URL картинки, заголовок, описание, URL}
  - Видео: URL видео + заголовок секции
  - Тарифы: динамический список {название, цена, список фич (вложенный динамический список), URL кнопки, флаг "популярный"}
  - Отзывы: динамический список {имя автора, текст, рейтинг (1-5), URL аватара}
  - FAQ: динамический список пар {вопрос, ответ}
  - CTA промежуточный: заголовок, подзаголовок
  - CTA финальный: заголовок, подзаголовок, текст кнопки
- [ ] **Вкладка "Контент EN":** аналогичная структура для EN-локали
- [ ] **Вкладка "Секции":** список всех togglable-секций с переключателями вкл/выкл
- [ ] Кнопка "Сохранить" (отправляет PATCH-запросы на соответствующие эндпоинты)
- [ ] Кнопка "Предпросмотр" — открывает `/{locale}/{category_slug}/{landing_slug}/` в новой вкладке

#### 3.7 — Настройки сайта (Frontend)
- [ ] ID Яндекс.Метрики (текстовое поле)
- [ ] Клиентский ключ SmartCaptcha (текстовое поле)
- [ ] URL платформы (default: `https://app.promto.ai`)
- [ ] Дефолтные тарифы (JSON-редактор — шаблон, подставляемый в новые лендинги)
- [ ] Дефолтные тексты CTA-блоков (текстовые поля)
- [ ] Дефолтный Social Proof (динамический список)
- [ ] URL дефолтного видео (текстовое поле)

#### 3.8 — Тесты фазы (Frontend)
- [ ] Компонентные тесты (Vitest + Testing Library): DataTable, FormField, Modal, Toast, ConfirmDialog
- [ ] E2E тест (Playwright): логин -> dashboard -> переход к списку лендингов -> открытие редактора -> изменение контента -> сохранение -> проверка обновлённых данных
- [ ] E2E тест: создание новой категории -> создание лендинга в ней -> публикация -> проверка в списке
- [ ] E2E тест: удаление лендинга с подтверждением

**Критерии готовности:**
- Можно залогиниться, увидеть 62 импортированных лендинга из Фазы 2
- Можно отредактировать контент лендинга (все секции), сохранить, увидеть изменения
- Можно создать новый лендинг, опубликовать, снять с публикации, удалить
- Можно управлять категориями и настройками сайта
- Все тесты проходят

---

### ФАЗА 4: Публичные лендинги и SEO

**Цель:** SEO-оптимизированные лендинги, доступные для индексации. SEO — не отдельная фаза, а неотъемлемая часть каждого компонента.

**Зависимости:** Фаза 2 (API + seed data для разработки), Фаза 1 (i18n-роутинг)

> **Примечание:** Эту фазу можно вести параллельно с Фазой 3, используя seed data из `scripts/seed_data.py` для визуальной разработки.

#### 4.1 — Роутинг и SSG (Frontend)
- [ ] Маршрут `/{locale}/{category_slug}/{landing_slug}/` — страница лендинга
- [ ] Маршрут `/{locale}/{category_slug}/` — категорийная страница (листинг лендингов категории)
- [ ] `generateStaticParams()` — генерация всех статических путей из `/api/v1/public/sitemap-data`
- [ ] ISR: `revalidate: 3600` (обновление раз в час) + on-demand revalidation через secret token
- [ ] Trailing slash enforcement в `next.config.ts` (`trailingSlash: true`) — SEO-требование #13

#### 4.2 — Ревалидация при сохранении (Backend + Frontend)
- [ ] **Backend:** `POST /api/v1/revalidate` при сохранении лендинга в админке отправляет запрос на Next.js `GET /api/revalidate?tag={landing_slug}&secret={REVALIDATE_SECRET}`
- [ ] **Frontend:** API Route `app/api/revalidate/route.ts` — принимает запрос, вызывает `revalidateTag()`, проверяет secret

#### 4.3 — Компоненты секций лендинга (Frontend)
Каждый компонент — React Server Component (RSC), рендерится на сервере, минимальный JS на клиенте.

- [ ] `HeroSection` — единственный `<h1>` на странице (SEO-требование #14), подзаголовок `<p>`, поле ввода промта с placeholder по нише + CTA-кнопка "Создать"
  - Client-компонент `PromptInput`: при вводе текста и submit -> redirect на `{platform_url}?prompt={encodeURIComponent(text)}&utm_source=types&utm_medium=landing&utm_campaign={category_slug}&utm_content={landing_slug}`
  - Placeholder адаптирован под нишу (из контента: "Опишите, какой сайт для школы вы хотите создать...")
- [ ] `SocialProofBar` — горизонтальная полоса, `<div>` без `<h*>` тегов (SEO-требование #15), счётчики с анимацией при скролле (Intersection Observer, client)
- [ ] `AdvantagesSection` — заголовок `<h2>`, сетка 2x3 карточек `<h3>` + `<p>` + иконка
- [ ] `HowItWorksSection` — заголовок `<h2>`, горизонтальные шаги с номерами, `<h3>` + `<p>`
- [ ] `ExamplesSection` — заголовок `<h2>`, сетка карточек с `next/image` (WebP, lazy loading, alt из контента — SEO-требование #20)
- [ ] `CtaBlock` — `<div>` (без `<h*>` в обёртках), текст + повторное поле промта
- [ ] `VideoSection` — заголовок `<h2>`, lazy-loaded iframe (загрузка по клику на poster — для PageSpeed)
- [ ] `PricingSection` — заголовок `<h2>`, карточки тарифов, CTA-кнопки -> app.promto.ai. Schema.org `Product` + `Offer` (SEO-требование #26)
- [ ] `ReviewsSection` — заголовок `<h2>`, карусель отзывов (client). Schema.org `Review` + `AggregateRating` (SEO-требование #26)
- [ ] `FaqSection` — заголовок `<h2>`, `<details>/<summary>` аккордеон (нативный HTML, без JS). Schema.org `FAQPage` (SEO-требование #26)
- [ ] `Breadcrumbs` — над `<h1>`, на всех страницах кроме главной (SEO-требование #8). Schema.org `BreadcrumbList`. Последний элемент — текущая страница, не ссылка.
- [ ] Условный рендер: секция рендерится только если `is_enabled=true` в LandingSection

#### 4.4 — Общие компоненты layout (Frontend)
- [ ] `Header` — логотип (ссылка на promto.ai, `rel="nofollow"` — SEO-требование #37). На текущей странице пункт меню некликабелен (SEO-требование #29). Переключатель языка RU/EN. **Без `<h*>` тегов** (SEO-требование #15). Мобильное бургер-меню.
- [ ] `Footer` — ссылки на разделы, копирайт, ссылки на соцсети (`rel="nofollow"` — SEO-требование #37). **Без `<h*>` тегов** (SEO-требование #15).
- [ ] `ScrollToTop` — кнопка "вверх" в правом нижнем углу (SEO-требование #40), появляется при скролле (client).
- [ ] Адаптивная вёрстка: mobile-first, `<meta name="viewport" content="width=device-width, initial-scale=1.0">` (SEO мобильное требование #1), нет горизонтального скролла (SEO мобильное требование #6).

#### 4.5 — Категорийная страница (Frontend)
- [ ] Список лендингов категории в виде карточек (название + ключевой запрос + ссылка)
- [ ] `<h1>` — название категории с ключевым запросом
- [ ] Описание категории
- [ ] Хлебные крошки: Главная -> Категория (Schema.org `BreadcrumbList`)
- [ ] Серверная пагинация с ЧПУ: `/{locale}/{category}/page2/`, `/{locale}/{category}/page3/` (SEO-требование #23-24)
- [ ] Первая страница ведёт на `/{locale}/{category}/` без `/page1/` (SEO-требование #23)
- [ ] Meta title для страниц > 1: "{title} - страница {N}" (SEO-требование #7)

#### 4.6 — SEO: мета-теги и OpenGraph (Frontend)
- [ ] `generateMetadata()` в каждом route segment — динамические title, description из контента
- [ ] Шаблон title: `{H1} — Промто` (RU) / `{H1} — Promto` (EN) (SEO-требование #7)
- [ ] OpenGraph: `og:title`, `og:description`, `og:image`, `og:url`, `og:type=website`, `og:locale`
- [ ] Canonical URL: `<link rel="canonical" href="..." />`
- [ ] Hreflang: `<link rel="alternate" hreflang="ru" ...>`, `<link rel="alternate" hreflang="en" ...>`, `<link rel="alternate" hreflang="x-default" ...>` (-> ru)

#### 4.7 — SEO: технический (Frontend)
- [ ] `robots.txt` через `app/robots.ts` — закрыть `/admin/`, разрешить остальное (SEO-требование #1)
- [ ] `sitemap.xml` через `app/sitemap.ts` — генерация из `/api/v1/public/sitemap-data`, отдельные URL для каждой локали, без lastmod/changefreq/priority (SEO-требование #11)
- [ ] 404-страница `not-found.tsx`: шапка + подвал сайта, `<h1>Данная страница не существует!</h1>`, ссылка на главную (SEO-требование #12)
- [ ] 301 редиректы в `middleware.ts`:
  - Множественные слеши -> одинарный (`///page///` -> `/page/`)
  - URL без trailing slash -> с trailing slash (SEO-требование #13)
  - URL без locale-префикса -> `/ru/...` (дефолтная локаль)
- [ ] ЧПУ URL: только латиница, только тире, без `_`, `%`, `?`, спецсимволов (SEO-требование #3, 9, 25). Валидация slug при создании в админке (Фаза 3).

#### 4.8 — Производительность (Frontend)
- [ ] Изображения: `next/image` везде (авто WebP, lazy loading, srcset, responsive sizes) (SEO-требование #20)
- [ ] Alt-теги на всех `<img>` — из контента лендинга (SEO-требование #20)
- [ ] React Server Components: все секции лендинга — RSC, кроме интерактивных (PromptInput, SocialProofBar анимация, ScrollToTop, ReviewsSection карусель, мобильное меню)
- [ ] CSS: Tailwind purge — только используемые классы в продакшен-бандле
- [ ] Шрифт: `next/font` (preload, display=swap, subset=latin+cyrillic)
- [ ] Видео: poster + загрузка iframe по клику (не при загрузке страницы)
- [ ] Заголовки `<h1>`-`<h4>` различаются размером, `<h4>` чуть больше обычного текста (SEO-требование #16)
- [ ] В `<h*>` тегах нет вложенных тегов (`<span>`, `<a>` и т.д.) (SEO-требование #17)
- [ ] Все ссылки и кнопки интерактивны: hover, active, focus-visible состояния (SEO-требование #18)
- [ ] Внешние ссылки: `rel="nofollow noopener"` (SEO-требование #37)

#### 4.9 — Структурированные данные Schema.org (Frontend)
- [ ] JSON-LD скрипт в `<head>` каждого лендинга:
  - `BreadcrumbList` — на всех страницах кроме главной
  - `FAQPage` — если секция FAQ включена
  - `Product` + `Offer` — если секция тарифов включена (SEO-требование #26)
  - `Review` + `AggregateRating` — если секция отзывов включена
- [ ] `Organization` — в layout (footer) для всех страниц (SEO-требование #26)

#### 4.10 — Тесты фазы (Backend + Frontend)
- [ ] **Frontend unit:** компонентные тесты (Vitest + Testing Library) для каждой секции: HeroSection, AdvantagesSection, FaqSection, Breadcrumbs, PricingSection — рендер с моковыми данными, проверка HTML-структуры
- [ ] **Frontend unit:** тест generateMetadata — корректный title, description, og-теги
- [ ] **Frontend unit:** тест robots.ts — /admin/ закрыт, остальное открыто
- [ ] **Frontend unit:** тест sitemap.ts — генерирует корректные URL для обеих локалей
- [ ] **Frontend E2E (Playwright):**
  - Открытие лендинга -> видим H1, хлебные крошки, все включённые секции
  - Ввод промта в hero -> redirect на app.promto.ai с корректными UTM
  - 404 страница при несуществующем slug
  - Переключение RU/EN -> URL и контент меняются
  - Категорийная страница -> список лендингов, пагинация работает
- [ ] **SEO audit (автоматизированный):** Lighthouse CI или скрипт проверки:
  - Единственный `<h1>` на странице
  - Нет `<h*>` тегов в header/footer
  - Все `<img>` имеют alt
  - Schema.org JSON-LD валиден
  - Canonical URL присутствует
  - Hreflang теги корректны

**Критерии готовности:**
- Лендинги из seed data рендерятся со всеми секциями на `/{locale}/{category}/{slug}/`
- PageSpeed Insights >= 90 (mobile + desktop)
- Schema.org разметка валидна (проверка через валидатор)
- robots.txt и sitemap.xml корректны
- 404-страница работает
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
- [ ] Rate limiting: пауза между запросами к API, обработка ошибок, возможность продолжить с места остановки
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
│   │   │   └── settings.py
│   │   ├── schemas/
│   │   │   ├── auth.py
│   │   │   ├── category.py
│   │   │   ├── landing.py
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
│   │   │   │   └── revalidate/
│   │   │   │       └── route.ts
│   │   │   ├── [locale]/
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── page.tsx
│   │   │   │   ├── not-found.tsx
│   │   │   │   └── [category]/
│   │   │   │       ├── page.tsx
│   │   │   │       ├── [[...page]]/  # Пагинация /page2/, /page3/
│   │   │   │       └── [slug]/
│   │   │   │           └── page.tsx
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
