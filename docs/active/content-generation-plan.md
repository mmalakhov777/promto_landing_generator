# План наполнения Promto Landing Generator

## Контекст

**База данных:** существующий PostgreSQL (176.53.163.226:5432, база `default_db`)
**Пароль:** `n@!fOXG|P*lQ9`
**Контент генерируется вручную в рамках чата** в JSON-файлы, затем заливается напрямую в БД через SQL.

---

## Структура хранения контента

```
docs/active/landings-content/
├── categories.json          # Категории
├── landings-meta.json       # Метаданные всех лендингов (slug, keyword, category)
├── ru/
│   ├── dlya-biznesa.json    # Контент RU для каждого лендинга
│   ├── dlya-restoranov.json
│   └── ...
└── en/
    ├── dlya-biznesa.json    # Контент EN
    └── ...
```

Каждый `.json` — полный контент для одного лендинга.

---

## Фаза A: Подключение к БД

1. Проверить существующие таблицы в БД (не задеть таблицы блога)
2. Создать Alembic миграции для таблиц проекта
3. Подключить backend к БД (DATABASE_URL)
4. Запустить миграции

---

## Фаза B: Структура лендингов

1. Создать `docs/active/landings-content/landings-meta.json` — все 62 лендинга (slug, keyword_ru, keyword_en, category_slug, search_volume)
2. Создать `docs/active/landings-content/categories.json` — 7 категорий
3. Создать `backend/scripts/seed_landings_structure.py` — читает JSON, создаёт записи в БД (категории, лендинги, пустые LandingContent, LandingSection)
4. Запустить скрипт — проверить что 62 лендинга созданы

---

## Фаза C: Генерация контента RU (в чате, в JSON)

Для каждого из 62 лендингов — создать файл `docs/active/landings-content/ru/{slug}.json`:

```json
{
  "slug": "dlya-restoranov",
  "category_slug": "restaurants",
  "meta_title": "...",
  "meta_description": "...",
  "h1": "...",
  "og_title": "...",
  "og_description": "...",
  "hero_title": "...",
  "hero_subtitle": "...",
  "hero_cta_text": "Создать сайт",
  "hero_placeholder": "Опишите, какой сайт для ресторана...",
  "social_proof": [...],
  "advantages": [...],
  "how_it_works": [...],
  "examples": [...],
  "video_url": "",
  "video_title": "",
  "pricing": [...],
  "reviews": [...],
  "faq": [...],
  "cta_mid_title": "...",
  "cta_mid_subtitle": "...",
  "cta_final_title": "...",
  "cta_final_subtitle": "...",
  "cta_final_button_text": "Создать сайт бесплатно"
}
```

---

## Фаза D: Генерация контента EN (в чате, в JSON)

Аналогично Фаза C, но для EN. Переводит RU контент с адаптацией.

---

## Фаза E: Заливка в БД

Создать `backend/scripts/load_landings_content.py`:

```bash
python scripts/load_landings_content.py ru    # залить все RU JSON
python scripts/load_landings_content.py en    # залить все EN JSON
```

Скрипт:
- Читает все `.json` из `docs/active/landings-content/ru/`
- Для каждого файла: `UPDATE landing_contents SET ... WHERE landing_id=X AND locale='ru'`
- Выводит прогресс: "dlya-biznesa — OK, dlya-restoranov — OK"

---

## Фаза F: Публикация

1. `UPDATE landings SET is_published=True` — все 62 лендинга
2. Задеплоить frontend через Publish tab
3. Проверить что отображаются на types.promto.ai

---

## Порядок работы в чате

Для КАЖДОГО лендинга я делаю:
1. Генерирую RU JSON → сохраняю в файл
2. Генерирую EN JSON → сохраняю в файл
3. Отчётываю что сделано

Когда все 62 лендинга готовы в JSON — запускаем `load_landings_content.py`.

---

## Категории

1. `site-generator` — ИИ-конструктор сайтов
2. `restaurants` — Рестораны и кафе
3. `beauty` — Салоны красоты
4. `health` — Клиники и медицина
5. `shops` — Интернет-магазины
6. `portfolio` — Портфолио и творчество
7. `education` — Образование
