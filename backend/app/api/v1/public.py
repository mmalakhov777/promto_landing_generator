"""Public API for frontend rendering and external consumers."""

from fastapi import APIRouter, Depends, Query
from fastapi.responses import JSONResponse
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.core.exceptions import NotFoundException
from app.models.category import Category
from app.models.landing import Landing, LandingContent, Locale

router = APIRouter(prefix="/public", tags=["public"])


@router.get("/categories")
async def public_categories(db: AsyncSession = Depends(get_db)):
    stmt = (
        select(
            Category.id, Category.slug,
            Category.name_ru, Category.name_en,
            Category.description_ru, Category.description_en,
            Category.meta_title_ru, Category.meta_title_en,
            Category.meta_description_ru, Category.meta_description_en,
            func.count(Landing.id).label("landing_count"),
        )
        .outerjoin(Landing, (Landing.category_id == Category.id) & (Landing.is_published == True))
        .where(Category.is_active == True)
        .group_by(Category.id)
        .order_by(Category.sort_order, Category.id)
    )
    result = await db.execute(stmt)
    return [
        {
            "id": r.id, "slug": r.slug,
            "name_ru": r.name_ru, "name_en": r.name_en,
            "description_ru": r.description_ru, "description_en": r.description_en,
            "meta_title_ru": r.meta_title_ru, "meta_title_en": r.meta_title_en,
            "meta_description_ru": r.meta_description_ru, "meta_description_en": r.meta_description_en,
            "landing_count": r.landing_count,
        }
        for r in result.all()
    ]


@router.get("/landings")
async def public_landings(
    category: str | None = Query(None),
    locale: str = Query("ru"),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    stmt = (
        select(Landing).join(Category)
        .where(Landing.is_published == True, Category.is_active == True)
        .options(selectinload(Landing.contents), selectinload(Landing.category))
    )
    count_stmt = (
        select(func.count(Landing.id)).join(Category)
        .where(Landing.is_published == True, Category.is_active == True)
    )
    if category:
        stmt = stmt.where(Category.slug == category)
        count_stmt = count_stmt.where(Category.slug == category)

    total = (await db.execute(count_stmt)).scalar() or 0
    stmt = stmt.order_by(Landing.search_volume.desc()).offset((page - 1) * per_page).limit(per_page)
    landings = (await db.execute(stmt)).scalars().all()

    items = []
    for l in landings:
        content = next((c for c in l.contents if c.locale.value == locale), None)
        items.append({
            "title": content.h1 if content and content.h1 else l.keyword_ru,
            "slug": l.slug, "category_slug": l.category.slug,
            "full_url": f"/{l.slug}-{locale}",
            "keyword": l.keyword_ru if locale == "ru" else l.keyword_en,
            "search_volume": l.search_volume, "locale": locale,
        })

    resp = JSONResponse(content={"items": items, "total": total, "page": page, "per_page": per_page})
    resp.headers["Cache-Control"] = "public, max-age=3600"
    return resp


@router.get("/landing/{category_slug}/{landing_slug}")
async def public_landing_detail(
    category_slug: str, landing_slug: str,
    locale: str = Query("ru"),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Landing).join(Category)
        .where(Category.slug == category_slug, Landing.slug == landing_slug,
               Landing.is_published == True, Category.is_active == True)
        .options(selectinload(Landing.contents), selectinload(Landing.sections))
    )
    landing = result.scalar_one_or_none()
    if not landing:
        raise NotFoundException("Landing not found")

    content = next((c for c in landing.contents if c.locale.value == locale), None)
    if not content:
        raise NotFoundException(f"Content not found for locale '{locale}'")

    enabled = [s.section_type.value for s in landing.sections if s.is_enabled]
    return {
        "slug": landing.slug, "category_slug": category_slug,
        "meta_title": content.meta_title, "meta_description": content.meta_description,
        "h1": content.h1, "og_title": content.og_title, "og_description": content.og_description,
        "og_image_url": content.og_image_url,
        "hero_title": content.hero_title, "hero_subtitle": content.hero_subtitle,
        "hero_cta_text": content.hero_cta_text, "hero_placeholder": content.hero_placeholder,
        "social_proof": content.social_proof, "advantages": content.advantages,
        "how_it_works": content.how_it_works, "examples": content.examples,
        "video_url": content.video_url, "video_title": content.video_title,
        "pricing": content.pricing, "reviews": content.reviews, "faq": content.faq,
        "cta_mid_title": content.cta_mid_title, "cta_mid_subtitle": content.cta_mid_subtitle,
        "cta_final_title": content.cta_final_title, "cta_final_subtitle": content.cta_final_subtitle,
        "cta_final_button_text": content.cta_final_button_text,
        "enabled_sections": enabled,
    }


@router.get("/landing-by-slug/{slug}")
async def public_landing_by_slug(
    slug: str,
    locale: str = Query("ru"),
    db: AsyncSession = Depends(get_db),
):
    """Lookup a landing by its slug alone (globally unique)."""
    result = await db.execute(
        select(Landing).join(Category)
        .where(Landing.slug == slug, Landing.is_published == True, Category.is_active == True)
        .options(selectinload(Landing.contents), selectinload(Landing.sections), selectinload(Landing.category))
    )
    landing = result.scalar_one_or_none()
    if not landing:
        raise NotFoundException("Landing not found")

    content = next((c for c in landing.contents if c.locale.value == locale), None)
    if not content:
        raise NotFoundException(f"Content not found for locale '{locale}'")

    enabled = [s.section_type.value for s in landing.sections if s.is_enabled]
    return {
        "slug": landing.slug, "category_slug": landing.category.slug,
        "meta_title": content.meta_title, "meta_description": content.meta_description,
        "h1": content.h1, "og_title": content.og_title, "og_description": content.og_description,
        "og_image_url": content.og_image_url,
        "hero_title": content.hero_title, "hero_subtitle": content.hero_subtitle,
        "hero_cta_text": content.hero_cta_text, "hero_placeholder": content.hero_placeholder,
        "social_proof": content.social_proof, "advantages": content.advantages,
        "how_it_works": content.how_it_works, "examples": content.examples,
        "video_url": content.video_url, "video_title": content.video_title,
        "pricing": content.pricing, "reviews": content.reviews, "faq": content.faq,
        "cta_mid_title": content.cta_mid_title, "cta_mid_subtitle": content.cta_mid_subtitle,
        "cta_final_title": content.cta_final_title, "cta_final_subtitle": content.cta_final_subtitle,
        "cta_final_button_text": content.cta_final_button_text,
        "enabled_sections": enabled,
    }


@router.get("/sitemap-data")
async def sitemap_data(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Landing).join(Category)
        .where(Landing.is_published == True, Category.is_active == True)
        .options(selectinload(Landing.contents), selectinload(Landing.category))
    )
    landings = result.scalars().all()
    return [
        {
            "slug": l.slug,
            "category_slug": l.category.slug, "landing_slug": l.slug,
            "updated_at": l.updated_at.isoformat() if l.updated_at else None,
            "locales": [c.locale.value for c in l.contents if c.h1] or ["ru", "en"],
        }
        for l in landings
    ]
