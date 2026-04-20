"""
Load landings content from JSON files into the database.

Usage:
    DATABASE_URL=postgresql+asyncpg://... python scripts/load_landings_content.py ru
    DATABASE_URL=postgresql+asyncpg://... python scripts/load_landings_content.py en

Reads:
    docs/active/landings-content/{locale}/*.json
"""

import argparse
import asyncio
import json
import os
import sys
from pathlib import Path

sys.path.insert(0, ".")

from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.core.database import async_session_factory
from app.models.landing import Landing, LandingContent, Locale
import app.models  # noqa: F401


async def main():
    parser = argparse.ArgumentParser(description="Load landings content from JSON")
    parser.add_argument(
        "locale",
        choices=["ru", "en"],
        help="Locale to load (ru or en)",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Print what would be updated without updating",
    )
    args = parser.parse_args()

    base_dir = Path(__file__).parent.parent.parent / "docs" / "active" / "landings-content" / args.locale

    if not base_dir.exists():
        print(f"ERROR: {base_dir} not found")
        sys.exit(1)

    json_files = sorted(base_dir.glob("*.json"))
    if not json_files:
        print(f"No JSON files found in {base_dir}")
        return

    print(f"Found {len(json_files)} JSON files for locale '{args.locale}'")

    locale = Locale.ru if args.locale == "ru" else Locale.en

    updated = 0
    skipped = 0
    errors = 0

    async with async_session_factory() as session:
        for json_file in json_files:
            slug = json_file.stem
            data = json.loads(json_file.read_text())

            # Find landing by slug
            result = await session.execute(
                select(Landing)
                .options(selectinload(Landing.contents))
                .where(Landing.slug == slug)
            )
            landing = result.scalar_one_or_none()

            if not landing:
                print(f"  SKIP {slug}: landing not found")
                skipped += 1
                continue

            content = next((c for c in landing.contents if c.locale == locale), None)
            if not content:
                print(f"  SKIP {slug}: no {args.locale} content record")
                skipped += 1
                continue

            # Map JSON fields to model
            fields = [
                "meta_title", "meta_description", "h1",
                "og_title", "og_description", "og_image_url",
                "hero_title", "hero_subtitle", "hero_cta_text", "hero_placeholder",
                "social_proof", "advantages", "how_it_works", "examples",
                "video_url", "video_title", "pricing", "reviews", "faq",
                "cta_mid_title", "cta_mid_subtitle",
                "cta_final_title", "cta_final_subtitle", "cta_final_button_text",
            ]

            for field in fields:
                if field in data and hasattr(content, field):
                    setattr(content, field, data[field])

            if args.dry_run:
                print(f"  DRY-RUN {slug}: would update {len(fields)} fields")
            else:
                print(f"  OK {slug}")

            updated += 1

        if not args.dry_run and updated > 0:
            await session.commit()
            print(f"\nCommitted {updated} landings")

    print(f"\nDone: {updated} updated, {skipped} skipped, {errors} errors")


if __name__ == "__main__":
    asyncio.run(main())
