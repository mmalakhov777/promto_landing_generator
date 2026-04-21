"""
Seed landing structure (categories, landings, contents, sections) from JSON.

Usage:
    DATABASE_URL=postgresql+asyncpg://... python scripts/seed_landings_structure.py

Reads:
    docs/active/landings-content/categories.json
    docs/active/landings-content/landings-meta.json
"""

import asyncio
import json
import os
import sys
from pathlib import Path

sys.path.insert(0, ".")

from sqlalchemy import select, update
from sqlalchemy.orm import selectinload

from app.core.database import async_session_factory, engine, Base
from app.models.landing import Landing, LandingContent, LandingSection, Locale, SectionType
from app.models.category import Category
import app.models  # noqa: F401


async def main():
    base_dir = Path(__file__).parent.parent.parent / "docs" / "active" / "landings-content"
    categories_file = base_dir / "categories.json"
    landings_file = base_dir / "landings-meta.json"

    if not categories_file.exists():
        print(f"ERROR: {categories_file} not found")
        sys.exit(1)
    if not landings_file.exists():
        print(f"ERROR: {landings_file} not found")
        sys.exit(1)

    categories_data = json.loads(categories_file.read_text())
    landings_data = json.loads(landings_file.read_text())

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("Tables created (if not exist)")

    async with async_session_factory() as session:
        # ---- Seed categories ----
        cat_map = {}  # slug -> id
        for cat_data in categories_data:
            existing = (
                await session.execute(select(Category).where(Category.slug == cat_data["slug"]))
            ).scalar_one_or_none()

            if existing:
                cat_map[existing.slug] = existing.id
                print(f"  Category '{existing.slug}' exists")
            else:
                cat = Category(
                    slug=cat_data["slug"],
                    name_ru=cat_data["name_ru"],
                    name_en=cat_data["name_en"],
                    description_ru=cat_data.get("description_ru", ""),
                    description_en=cat_data.get("description_en", ""),
                    meta_title_ru=cat_data.get("meta_title_ru", ""),
                    meta_title_en=cat_data.get("meta_title_en", ""),
                    meta_description_ru=cat_data.get("meta_description_ru", ""),
                    meta_description_en=cat_data.get("meta_description_en", ""),
                    is_active=True,
                )
                session.add(cat)
                await session.flush()
                cat_map[cat.slug] = cat.id
                print(f"  Category '{cat.slug}' created (id={cat.id})")

        await session.flush()

        # ---- Seed landings ----
        created = 0
        skipped = 0
        for landing_data in landings_data:
            cat_slug = landing_data["category_slug"]
            if cat_slug not in cat_map:
                print(f"  SKIP '{landing_data['slug']}': unknown category '{cat_slug}'")
                skipped += 1
                continue

            existing = (
                await session.execute(
                    select(Landing).where(
                        Landing.slug == landing_data["slug"],
                        Landing.category_id == cat_map[cat_slug],
                    )
                )
            ).scalar_one_or_none()

            if existing:
                print(f"  Landing '{existing.slug}' exists")
                skipped += 1
                continue

            landing = Landing(
                category_id=cat_map[cat_slug],
                slug=landing_data["slug"],
                keyword_ru=landing_data["keyword_ru"],
                keyword_en=landing_data["keyword_en"],
                search_volume=landing_data["search_volume"],
                is_published=False,
            )
            session.add(landing)
            await session.flush()

            # RU content
            session.add(LandingContent(landing_id=landing.id, locale=Locale.ru))
            # EN content
            session.add(LandingContent(landing_id=landing.id, locale=Locale.en))
            # All sections (disabled by default)
            for st in SectionType:
                session.add(
                    LandingSection(landing_id=landing.id, section_type=st, is_enabled=False)
                )

            print(f"  Landing '{landing.slug}' created (id={landing.id})")
            created += 1

        await session.commit()
        print(f"\nDone: {created} created, {skipped} skipped")


if __name__ == "__main__":
    asyncio.run(main())
