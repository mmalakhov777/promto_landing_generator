"""
Generate RU landing content using Anthropic API (Claude).

Usage:
    # Generate all landings with empty RU content:
    ANTHROPIC_API_KEY=sk-... python scripts/generate_content.py

    # Generate only a specific landing:
    ANTHROPIC_API_KEY=sk-... python scripts/generate_content.py --slug dlya-biznesa

    # Dry run (print content without saving):
    ANTHROPIC_API_KEY=sk-... python scripts/generate_content.py --dry-run

    # Resume from last progress:
    ANTHROPIC_API_KEY=sk-... python scripts/generate_content.py --resume

Requires: pip install anthropic
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
from app.models.settings import SiteSettings
import app.models  # noqa: F401 — ensure all models registered


ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY", "")
MODEL = "claude-sonnet-4-20250514"
PROGRESS_FILE = Path("generation_progress.json")
PAUSE_SECONDS = 1.5
MAX_RETRIES = 3

# Unsplash image pool per category slug prefix
EXAMPLE_IMAGES = {
    "default": [
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
        "https://images.unsplash.com/photo-1559028012-481c04fa702d?w=800&q=80",
        "https://images.unsplash.com/photo-1542744094-24638eff58bb?w=800&q=80",
    ],
    "restaurant": [
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
        "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80",
    ],
    "cafe": [
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd0c4a?w=800&q=80",
        "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80",
        "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&q=80",
    ],
    "shop": [
        "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&q=80",
        "https://images.unsplash.com/photo-1553481187-be93c21490a9?w=800&q=80",
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
    ],
    "portfolio": [
        "https://images.unsplash.com/photo-1545235617-9465d2a76198?w=800&q=80",
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
        "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&q=80",
    ],
    "clinic": [
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c6b?w=800&q=80",
        "https://images.unsplash.com/photo-1519494026892-80bbd2d0b76d?w=800&q=80",
    ],
    "beauty": [
        "https://images.unsplash.com/photo-1560065984-3dec5e4c8a42?w=800&q=80",
        "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80",
        "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80",
    ],
}


def get_example_images(category_slug: str) -> list[dict]:
    """Return 3 example images for a category."""
    for key, urls in EXAMPLE_IMAGES.items():
        if key in category_slug:
            images = urls[:3]
            break
    else:
        images = EXAMPLE_IMAGES["default"][:3]

    titles = [
        "Пример сайта, созданного на Промто",
        "Интерфейс конструктора Промто",
        "Опубликованный лендинг",
    ]
    return [
        {"image_url": url, "title": titles[i], "description": "Сайт, созданный с помощью ИИ на платформе Промто", "url": "https://promto.ai"}
        for i, url in enumerate(images)
    ]


def build_generation_prompt(keyword: str, niche: str) -> str:
    template = SYSTEM_PROMPT.format(keyword=keyword, niche=niche, json="{}")
    # We'll ask for the full structure as JSON without a template
    return f"""You are an expert landing page copywriter for the Promto AI website builder platform (promto.ai).

Generate comprehensive, SEO-optimized Russian landing page content for the keyword: {keyword}

Platform context: Promto is an AI-powered website builder that creates websites from a text prompt in 2 minutes. Target audience: Russian-speaking business owners, professionals, and entrepreneurs who need a website but lack technical skills.

Return ONLY valid JSON (no markdown fences), with these exact keys:
meta_title, meta_description, h1, og_title, og_description, hero_title, hero_subtitle, hero_cta_text, hero_placeholder, social_proof, advantages, how_it_works, examples, video_url, video_title, pricing, reviews, faq, cta_mid_title, cta_mid_subtitle, cta_final_title, cta_final_subtitle, cta_final_button_text

Field requirements:
- meta_title: under 60 characters, includes the keyword
- meta_description: under 160 characters, compelling, includes keyword
- h1: includes keyword, clear value proposition (max 60 chars)
- og_title: under 60 chars
- og_description: under 160 chars
- hero_title: matches h1
- hero_subtitle: 1-2 sentences about the key benefit (60-120 chars)
- hero_cta_text: "Создать сайт" or similar action phrase
- hero_placeholder: "Опишите, какой сайт для {niche} вы хотите создать..."
- social_proof: MUST be null
- advantages: array of 4-6 objects with keys: icon (choose from "zap","shield","star","clock","globe","lock","check","award","trending","users"), title, description
- how_it_works: array of 3-4 objects with keys: step, title, description, image_url (must be empty string "")
- examples: MUST be null
- video_url: "" (empty)
- video_title: "" (empty)
- pricing: MUST be null
- reviews: array of 4-5 objects with keys: author, text, rating (4-5), avatar_url (must be empty string "")
- faq: array of 5-6 objects with keys: question, answer
- cta_mid_title: max 60 chars
- cta_mid_subtitle: max 100 chars
- cta_final_title: max 60 chars
- cta_final_subtitle: max 100 chars
- cta_final_button_text: action phrase

Rules:
- All text in Russian, natural marketing tone
- Do NOT include any image URLs — use empty strings ""
- social_proof, examples, pricing must be exactly null (not empty array)
- Return ONLY the JSON object, no markdown fences or explanatory text"""


def extract_content_dict(content: LandingContent) -> dict:
    """Extract fields that can be updated from LandingContent."""
    return {
        "meta_title": content.meta_title,
        "meta_description": content.meta_description,
        "h1": content.h1,
        "og_title": content.og_title,
        "og_description": content.og_description,
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


def apply_content_dict(content: LandingContent, data: dict, category_slug: str) -> None:
    """Apply generated dict to LandingContent, filling non-generated sections from defaults."""
    for key, value in data.items():
        if hasattr(content, key):
            setattr(content, key, value)

    # Fill examples from image pool
    if content.examples is None:
        content.examples = get_example_images(category_slug)


def has_meaningful_content(content: LandingContent) -> bool:
    return bool(content.h1 and content.h1.strip())


async def generate_content(keyword: str, niche: str) -> dict:
    """Call Anthropic API to generate content."""
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
                messages=[
                    {"role": "user", "content": build_generation_prompt(keyword, niche)},
                ],
            )
            text = response.content[0].text.strip()

            # Strip markdown code fences if present
            if text.startswith("```"):
                lines = text.split("\n")
                lines = [l for l in lines if not l.strip().startswith("```")]
                text = "\n".join(lines)

            return json.loads(text)
        except json.JSONDecodeError as e:
            print(f"  Attempt {attempt}/{MAX_RETRIES} failed (JSON error: {e})")
            if attempt == MAX_RETRIES:
                raise
        except Exception as e:
            print(f"  Attempt {attempt}/{MAX_RETRIES} failed: {e}")
            if attempt == MAX_RETRIES:
                raise
        await asyncio.sleep(2 ** attempt)  # exponential backoff


def load_progress() -> dict[str, int]:
    if PROGRESS_FILE.exists():
        return json.loads(PROGRESS_FILE.read_text())
    return {}


def save_progress(progress: dict[str, int]) -> None:
    PROGRESS_FILE.write_text(json.dumps(progress, indent=2))


async def main():
    parser = argparse.ArgumentParser(description="Generate RU landing content via Claude")
    parser.add_argument("--slug", help="Generate only this landing slug")
    parser.add_argument("--dry-run", action="store_true", help="Print content without saving")
    parser.add_argument("--resume", action="store_true", help="Resume from last progress")
    args = parser.parse_args()

    if not ANTHROPIC_API_KEY:
        print("ERROR: ANTHROPIC_API_KEY environment variable is required")
        sys.exit(1)

    progress = load_progress() if args.resume else {}

    async with async_session_factory() as session:
        # Load SiteSettings defaults
        settings_row = (await session.execute(select(SiteSettings).limit(1))).scalar_one_or_none()
        default_pricing = settings_row.default_pricing if settings_row else None
        default_social_proof = settings_row.social_proof_defaults if settings_row else None

        query = (
            select(Landing)
            .options(selectinload(Landing.contents), selectinload(Landing.category))
            .where(Landing.is_published == True)  # noqa: E712
        )
        if args.slug:
            query = query.where(Landing.slug == args.slug)

        result = await session.execute(query)
        landings = result.scalars().all()

        if not landings:
            print("No landings found.")
            return

        generated = 0
        skipped = 0
        errors = 0

        for landing in landings:
            ru_content = next((c for c in landing.contents if c.locale == Locale.ru), None)
            if not ru_content:
                print(f"  SKIP {landing.slug}: no RU content record")
                skipped += 1
                continue

            if has_meaningful_content(ru_content) and not args.resume:
                print(f"  SKIP {landing.slug}: content exists (use --resume to overwrite)")
                skipped += 1
                continue

            if str(landing.id) in progress and has_meaningful_content(ru_content):
                print(f"  SKIP {landing.slug}: already processed in progress file")
                skipped += 1
                continue

            keyword = landing.keyword_ru or ""
            # Infer niche from keyword (simple heuristic)
            niche = keyword.split()[0] if keyword else "бизнес"

            print(f"  Generating {landing.slug} (keyword: {keyword[:50]})...", end=" ", flush=True)

            try:
                data = await generate_content(keyword, niche)

                # Fill null fields from defaults
                if data.get("social_proof") is None and default_social_proof:
                    data["social_proof"] = default_social_proof
                if data.get("pricing") is None and default_pricing:
                    data["pricing"] = default_pricing

                if args.dry_run:
                    print("OK (dry run)")
                    print(json.dumps(data, ensure_ascii=False, indent=2)[:500] + "...")
                else:
                    apply_content_dict(ru_content, data, landing.category.slug if landing.category else "")
                    progress[str(landing.id)] = landing.id
                    save_progress(progress)
                    print("OK")

                generated += 1
            except json.JSONDecodeError as e:
                print(f"FAIL (invalid JSON: {e})")
                errors += 1
            except Exception as e:
                print(f"FAIL ({e})")
                errors += 1

            # Rate limiting pause between requests
            if not args.dry_run:
                await asyncio.sleep(PAUSE_SECONDS)

        if not args.dry_run and generated > 0:
            await session.commit()

        print(f"\nDone: {generated} generated, {skipped} skipped, {errors} errors")
        print(f"Progress saved to {PROGRESS_FILE}")


if __name__ == "__main__":
    asyncio.run(main())
