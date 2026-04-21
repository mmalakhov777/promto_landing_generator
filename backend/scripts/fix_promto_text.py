"""Replace 'Promto' with 'Промто' in all landing content text fields."""

import asyncio
import sys

sys.path.insert(0, ".")

from sqlalchemy import select
from app.core.database import async_session_factory
from app.models.landing import LandingContent
import app.models  # noqa: F401

# Text fields that may contain "Promto"
TEXT_FIELDS = [
    "h1", "hero_title", "hero_subtitle", "hero_cta_text", "hero_placeholder",
    "meta_title", "meta_description", "og_title", "og_description",
    "cta_mid_title", "cta_mid_subtitle",
    "cta_final_title", "cta_final_subtitle", "cta_final_button_text",
    "video_title",
]


def replace_promto(obj):
    """Recursively replace 'Promto' -> 'Промто' in strings within obj."""
    if isinstance(obj, str):
        return obj.replace("Promto", "Промто")
    if isinstance(obj, dict):
        return {k: replace_promto(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [replace_promto(item) for item in obj]
    return obj


async def main():
    async with async_session_factory() as session:
        result = await session.execute(select(LandingContent))
        contents = result.scalars().all()
        print(f"Found {len(contents)} landing contents")

        updated = 0
        for content in contents:
            modified = False

            # Check and update text fields
            for field in TEXT_FIELDS:
                val = getattr(content, field, None)
                if val and "Promto" in val:
                    setattr(content, field, val.replace("Promto", "Промто"))
                    modified = True

            # Check JSON/list fields (faq, advantages, how_it_works, etc.)
            json_fields = ["faq", "advantages", "how_it_works", "examples",
                           "pricing", "reviews", "social_proof"]
            for field in json_fields:
                val = getattr(content, field, None)
                if val is None:
                    continue
                new_val = replace_promto(val)
                if new_val != val:
                    setattr(content, field, new_val)
                    modified = True

            if modified:
                updated += 1
                print(f"  Updated {content.locale} (id={content.id})")

        await session.commit()
        print(f"\nUpdated {updated} landing contents")


if __name__ == "__main__":
    asyncio.run(main())
