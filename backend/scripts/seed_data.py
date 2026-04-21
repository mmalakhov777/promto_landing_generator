"""Create test landings with full content for frontend development."""

import asyncio
import sys

sys.path.insert(0, ".")

from sqlalchemy import select
from app.core.database import async_session_factory, engine, Base
from app.models.category import Category
from app.models.landing import Landing, LandingContent, LandingSection, Locale, SectionType
from app.models.settings import SiteSettings
from app.models.user import User, UserRole
from app.services.auth import hash_password
import app.models  # noqa: F401

SEED_LANDINGS = [
    {
        "slug": "dlya-biznesa", "keyword_ru": "конструктор сайтов для бизнеса",
        "keyword_en": "website builder for business", "search_volume": 5400,
        "content_ru": {
            "meta_title": "ИИ-конструктор сайтов для бизнеса — Промто",
            "meta_description": "Создайте профессиональный сайт для бизнеса за 2 минуты с помощью ИИ.",
            "h1": "Конструктор сайтов для бизнеса на базе ИИ",
            "hero_title": "Создайте сайт для бизнеса за 2 минуты",
            "hero_subtitle": "Опишите свой бизнес — ИИ сделает сайт под ключ",
            "hero_cta_text": "Создать сайт", "hero_placeholder": "Опишите ваш бизнес...",
            "social_proof": [{"label": "Сайтов создано", "value": "12 500+"}, {"label": "Пользователей", "value": "8 000+"}],
            "advantages": [
                {"icon": "zap", "title": "Быстро", "description": "Готовый сайт за 2 минуты"},
                {"icon": "code", "title": "Без кода", "description": "Не нужны технические знания"},
                {"icon": "palette", "title": "Красиво", "description": "Профессиональный дизайн"},
            ],
            "how_it_works": [
                {"step": 1, "title": "Опишите", "description": "Расскажите ИИ о вашем бизнесе"},
                {"step": 2, "title": "Генерация", "description": "ИИ создаёт сайт за секунды"},
                {"step": 3, "title": "Публикация", "description": "Опубликуйте сайт"},
            ],
            "faq": [
                {"question": "Сколько стоит?", "answer": "Есть бесплатный тариф. Платные от 490 руб/мес."},
                {"question": "Нужны ли навыки?", "answer": "Нет, достаточно описать что вы хотите."},
            ],
            "cta_final_title": "Готовы создать сайт?",
            "cta_final_subtitle": "Начните прямо сейчас — бесплатно",
            "cta_final_button_text": "Создать сайт бесплатно",
        },
    },
    {
        "slug": "dlya-portfolio", "keyword_ru": "конструктор сайтов портфолио",
        "keyword_en": "portfolio website builder", "search_volume": 3200,
        "content_ru": {
            "meta_title": "ИИ-конструктор портфолио — Промто",
            "meta_description": "Создайте стильное портфолио за 2 минуты.",
            "h1": "Конструктор сайтов-портфолио на базе ИИ",
            "hero_title": "Создайте портфолио за 2 минуты",
            "hero_subtitle": "ИИ подберёт идеальный дизайн",
            "hero_cta_text": "Создать портфолио", "hero_placeholder": "Опишите портфолио...",
            "faq": [{"question": "Можно загрузить работы?", "answer": "Да, добавляйте изображения и описания."}],
            "cta_final_title": "Покажите миру свои работы",
            "cta_final_subtitle": "Создайте портфолио прямо сейчас",
            "cta_final_button_text": "Создать портфолио",
        },
    },
    {
        "slug": "dlya-restoranov", "keyword_ru": "конструктор сайтов для ресторанов",
        "keyword_en": "restaurant website builder", "search_volume": 1800,
        "content_ru": {
            "meta_title": "ИИ-конструктор для ресторанов — Промто",
            "meta_description": "Сайт ресторана с меню за 2 минуты.",
            "h1": "Конструктор сайтов для ресторанов",
            "hero_title": "Сайт для ресторана за 2 минуты",
            "hero_subtitle": "С меню, фото и онлайн-бронированием",
            "hero_cta_text": "Создать сайт ресторана", "hero_placeholder": "Опишите ресторан...",
            "cta_final_title": "Привлекайте больше гостей",
            "cta_final_subtitle": "Создайте сайт ресторана бесплатно",
            "cta_final_button_text": "Начать бесплатно",
        },
    },
]


async def main():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session_factory() as session:
        # Seed SiteSettings
        if not (await session.execute(select(SiteSettings).limit(1))).scalar_one_or_none():
            session.add(SiteSettings(platform_url="https://app.promto.ai"))
            print("SiteSettings seeded")

        # Seed admin
        if not (await session.execute(select(User).where(User.role == UserRole.admin))).scalar_one_or_none():
            session.add(User(email="admin@promto.ai", password_hash=hash_password("admin123"), role=UserRole.admin))
            print("Admin seeded: admin@promto.ai / admin123")

        # Seed category
        cat = (await session.execute(select(Category).where(Category.slug == "site-generator"))).scalar_one_or_none()
        if not cat:
            cat = Category(slug="site-generator", name_ru="ИИ-конструктор сайтов", name_en="AI Website Builder",
                           meta_title_ru="ИИ-конструктор сайтов — Промто", meta_title_en="AI Website Builder — Promto")
            session.add(cat); await session.flush()
            print(f"Category seeded: {cat.slug}")

        for data in SEED_LANDINGS:
            if (await session.execute(select(Landing).where(Landing.category_id == cat.id, Landing.slug == data["slug"]))).scalar_one_or_none():
                print(f"  '{data['slug']}' exists, skip"); continue
            landing = Landing(category_id=cat.id, slug=data["slug"], keyword_ru=data["keyword_ru"],
                              keyword_en=data["keyword_en"], search_volume=data["search_volume"], is_published=True)
            session.add(landing); await session.flush()
            session.add(LandingContent(landing_id=landing.id, locale=Locale.ru, **data["content_ru"]))
            session.add(LandingContent(landing_id=landing.id, locale=Locale.en))
            for st in SectionType:
                session.add(LandingSection(landing_id=landing.id, section_type=st))
            print(f"  Seeded: {data['slug']}")

        await session.commit()
        print("\nDone!")


if __name__ == "__main__":
    asyncio.run(main())
