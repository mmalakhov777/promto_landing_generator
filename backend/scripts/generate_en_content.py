"""
Translate RU landing content to EN using the Anthropic API (Claude).

Usage:
    # Translate all landings with empty EN content:
    ANTHROPIC_API_KEY=sk-... python scripts/generate_en_content.py

    # Translate a specific landing by slug:
    ANTHROPIC_API_KEY=sk-... python scripts/generate_en_content.py --slug dlya-biznesa

    # Dry run (print translations without saving):
    ANTHROPIC_API_KEY=sk-... python scripts/generate_en_content.py --dry-run

    # Force re-translate even if EN content exists:
    ANTHROPIC_API_KEY=sk-... python scripts/generate_en_content.py --force

Requires: pip install anthropic
"""

import argparse
import asyncio
import json
import os
import sys

sys.path.insert(0, ".")

from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.core.database import async_session_factory
from app.models.landing import Landing, LandingContent, Locale
import app.models  # noqa: F401 — ensure all models registered


ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY", "")
MODEL = "claude-sonnet-4-20250514"
MAX_RETRIES = 3

SYSTEM_PROMPT = """You are a professional translator specializing in marketing and SEO content.
Translate the provided Russian landing page content into natural, fluent English.

Rules:
- Preserve all JSON structure exactly. Return valid JSON only.
- Keep brand names untranslated: "Промто" → "Promto", "Промто.AI" → "Promto.AI"
- Adapt marketing tone for English-speaking audience (not literal translation)
- SEO: meta_title must be under 60 characters, meta_description under 160 characters
- Keep emoji/icon identifiers (e.g. "zap", "shield") unchanged
- URLs must remain unchanged
- If a field is empty string "", keep it as empty string
- Do NOT add or remove JSON keys
"""


def build_translation_prompt(ru_content: dict) -> str:
    return f"""Translate this Russian landing page content to English. Return ONLY valid JSON, no markdown fences.

{json.dumps(ru_content, ensure_ascii=False, indent=2)}"""


def extract_content_dict(content: LandingContent) -> dict:
    """Extract translatable fields from LandingContent into a dict."""
    return {
        "meta_title": content.meta_title,
        "meta_description": content.meta_description,
        "h1": content.h1,
        "og_title": content.og_title,
        "og_description": content.og_description,
        "og_image_url": content.og_image_url,
        "hero_title": content.hero_title,
        "hero_subtitle": content.hero_subtitle,
        "hero_cta_text": content.hero_cta_text,
        "hero_placeholder": content.hero_placeholder,
        "social_proof": content.social_proof,
        "advantages": content.advantages,
        "how_it_works": content.how_it_works,
        "examples": content.examples,
        "video_url": content.video_url,
        "video_title": content.video_title,
        "pricing": content.pricing,
        "reviews": content.reviews,
        "faq": content.faq,
        "cta_mid_title": content.cta_mid_title,
        "cta_mid_subtitle": content.cta_mid_subtitle,
        "cta_final_title": content.cta_final_title,
        "cta_final_subtitle": content.cta_final_subtitle,
        "cta_final_button_text": content.cta_final_button_text,
    }


def apply_content_dict(content: LandingContent, data: dict) -> None:
    """Apply translated dict back to LandingContent model."""
    for key, value in data.items():
        if hasattr(content, key):
            setattr(content, key, value)


async def translate_content(ru_dict: dict) -> dict:
    """Call Anthropic API to translate content."""
    try:
        import anthropic
    except ImportError:
        print("ERROR: anthropic package not installed. Run: pip install anthropic")
        sys.exit(1)

    client = anthropic.AsyncAnthropic(api_key=ANTHROPIC_API_KEY)

    for attempt in range(1, MAX_RETRIES + 1):
        try:
            response = await client.messages.create(
                model=MODEL,
                max_tokens=4096,
                system=SYSTEM_PROMPT,
                messages=[
                    {"role": "user", "content": build_translation_prompt(ru_dict)},
                ],
            )

            response_text = response.content[0].text.strip()

            # Strip markdown code fences if present
            if response_text.startswith("```"):
                lines = response_text.split("\n")
                lines = [l for l in lines if not l.strip().startswith("```")]
                response_text = "\n".join(lines)

            return json.loads(response_text)
        except json.JSONDecodeError as e:
            print(f"  Attempt {attempt}/{MAX_RETRIES} failed (JSON error: {e})")
            if attempt == MAX_RETRIES:
                raise
        except Exception as e:
            print(f"  Attempt {attempt}/{MAX_RETRIES} failed: {e}")
            if attempt == MAX_RETRIES:
                raise
        await asyncio.sleep(2 ** attempt)  # exponential backoff


def has_content(content: LandingContent) -> bool:
    """Check if content has meaningful data (not just defaults)."""
    return bool(content.h1 and content.h1.strip())


async def main():
    parser = argparse.ArgumentParser(description="Translate RU landing content to EN")
    parser.add_argument("--slug", help="Translate only this landing slug")
    parser.add_argument("--dry-run", action="store_true", help="Print translations without saving")
    parser.add_argument("--force", action="store_true", help="Re-translate even if EN content exists")
    args = parser.parse_args()

    if not ANTHROPIC_API_KEY:
        print("ERROR: ANTHROPIC_API_KEY environment variable is required")
        sys.exit(1)

    async with async_session_factory() as session:
        query = (
            select(Landing)
            .options(selectinload(Landing.contents))
            .where(Landing.is_published == True)  # noqa: E712
        )
        if args.slug:
            query = query.where(Landing.slug == args.slug)

        result = await session.execute(query)
        landings = result.scalars().all()

        if not landings:
            print("No landings found.")
            return

        translated = 0
        skipped = 0
        errors = 0

        for landing in landings:
            ru_content = next((c for c in landing.contents if c.locale == Locale.ru), None)
            en_content = next((c for c in landing.contents if c.locale == Locale.en), None)

            if not ru_content or not has_content(ru_content):
                print(f"  SKIP {landing.slug}: no RU content")
                skipped += 1
                continue

            if en_content and has_content(en_content) and not args.force:
                print(f"  SKIP {landing.slug}: EN content exists (use --force to overwrite)")
                skipped += 1
                continue

            print(f"  Translating {landing.slug}...", end=" ", flush=True)

            try:
                ru_dict = extract_content_dict(ru_content)
                en_dict = await translate_content(ru_dict)

                if args.dry_run:
                    print("OK (dry run)")
                    print(json.dumps(en_dict, ensure_ascii=False, indent=2)[:500] + "...")
                else:
                    if not en_content:
                        en_content = LandingContent(landing_id=landing.id, locale=Locale.en)
                        session.add(en_content)
                    apply_content_dict(en_content, en_dict)
                    print("OK")

                translated += 1
            except json.JSONDecodeError as e:
                print(f"FAIL (invalid JSON: {e})")
                errors += 1
            except Exception as e:
                print(f"FAIL ({e})")
                errors += 1

        if not args.dry_run and translated > 0:
            await session.commit()

        print(f"\nDone: {translated} translated, {skipped} skipped, {errors} errors")


if __name__ == "__main__":
    asyncio.run(main())
