"""Landings CRUD API."""

from fastapi import APIRouter, Depends, Query
from sqlalchemy import select, func, or_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.api.deps import require_admin
from app.core.database import get_db
from app.core.exceptions import BadRequestException, NotFoundException
from app.models.category import Category
from app.models.landing import Landing, LandingContent, LandingSection, Locale, SectionType
from app.models.redirect import SlugRedirect
from app.models.user import User
from app.schemas.content import (
    AdvantageItem, ExampleItem, FaqItem, HowItWorksStep,
    PricingPlan, ReviewItem, SocialProofItem,
)
from app.schemas.landing import (
    LandingContentUpdate, LandingCreate, LandingDetailRead, LandingListResponse,
    LandingRead, LandingUpdate, SectionsUpdate,
)
from app.services.slug import validate_slug

router = APIRouter(prefix="/landings", tags=["landings"])

JSONB_VALIDATORS = {
    "social_proof": SocialProofItem,
    "advantages": AdvantageItem,
    "how_it_works": HowItWorksStep,
    "examples": ExampleItem,
    "pricing": PricingPlan,
    "reviews": ReviewItem,
    "faq": FaqItem,
}


def _validate_jsonb_fields(data: dict) -> list[str]:
    errors = []
    for field_name, model_cls in JSONB_VALIDATORS.items():
        if field_name in data and data[field_name] is not None:
            for i, item in enumerate(data[field_name]):
                try:
                    model_cls(**item)
                except Exception as e:
                    errors.append(f"{field_name}[{i}]: {e}")
    return errors


@router.get("", response_model=LandingListResponse)
async def list_landings(
    category_id: int | None = Query(None),
    is_published: bool | None = Query(None),
    search: str | None = Query(None),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    stmt = select(Landing)
    count_stmt = select(func.count(Landing.id))

    if category_id is not None:
        stmt = stmt.where(Landing.category_id == category_id)
        count_stmt = count_stmt.where(Landing.category_id == category_id)
    if is_published is not None:
        stmt = stmt.where(Landing.is_published == is_published)
        count_stmt = count_stmt.where(Landing.is_published == is_published)
    if search:
        like = f"%{search}%"
        search_filter = or_(
            Landing.slug.ilike(like),
            Landing.keyword_ru.ilike(like),
            Landing.keyword_en.ilike(like),
        )
        stmt = stmt.where(search_filter)
        count_stmt = count_stmt.where(search_filter)

    total = (await db.execute(count_stmt)).scalar() or 0
    stmt = stmt.order_by(Landing.updated_at.desc()).offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(stmt)

    return LandingListResponse(
        items=[LandingRead.model_validate(l) for l in result.scalars().all()],
        total=total, page=page, per_page=per_page,
    )


@router.get("/{landing_id}", response_model=LandingDetailRead)
async def get_landing(
    landing_id: int,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    result = await db.execute(
        select(Landing).where(Landing.id == landing_id)
        .options(selectinload(Landing.contents), selectinload(Landing.sections), selectinload(Landing.category))
    )
    landing = result.scalar_one_or_none()
    if not landing:
        raise NotFoundException("Landing not found")
    detail = LandingDetailRead.model_validate(landing)
    detail.category_slug = landing.category.slug
    return detail


@router.post("", response_model=LandingDetailRead, status_code=201)
async def create_landing(
    body: LandingCreate,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    errors = validate_slug(body.slug)
    if errors:
        raise BadRequestException("; ".join(errors))

    cat_result = await db.execute(select(Category).where(Category.id == body.category_id))
    category = cat_result.scalar_one_or_none()
    if not category:
        raise BadRequestException("Category not found")

    existing = await db.execute(
        select(Landing).where(Landing.category_id == body.category_id, Landing.slug == body.slug)
    )
    if existing.scalar_one_or_none():
        raise BadRequestException(f"Landing with slug '{body.slug}' already exists in this category")

    landing = Landing(**body.model_dump())
    db.add(landing)
    await db.flush()

    for locale in Locale:
        db.add(LandingContent(landing_id=landing.id, locale=locale))
    for section_type in SectionType:
        db.add(LandingSection(landing_id=landing.id, section_type=section_type))
    await db.flush()

    result = await db.execute(
        select(Landing).where(Landing.id == landing.id)
        .options(selectinload(Landing.contents), selectinload(Landing.sections), selectinload(Landing.category))
    )
    landing = result.scalar_one()
    detail = LandingDetailRead.model_validate(landing)
    detail.category_slug = landing.category.slug
    return detail


@router.patch("/{landing_id}", response_model=LandingDetailRead)
async def update_landing(
    landing_id: int, body: LandingUpdate,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    result = await db.execute(
        select(Landing).where(Landing.id == landing_id)
        .options(selectinload(Landing.contents), selectinload(Landing.sections), selectinload(Landing.category))
    )
    landing = result.scalar_one_or_none()
    if not landing:
        raise NotFoundException("Landing not found")

    update_data = body.model_dump(exclude_unset=True)
    warning = None

    if "slug" in update_data:
        errors = validate_slug(update_data["slug"])
        if errors:
            raise BadRequestException("; ".join(errors))
        if landing.is_published and update_data["slug"] != landing.slug:
            cat_id = update_data.get("category_id", landing.category_id)
            cat_result = await db.execute(select(Category).where(Category.id == cat_id))
            cat = cat_result.scalar_one_or_none()
            if cat:
                db.add(SlugRedirect(
                    old_category_slug=landing.category.slug, old_landing_slug=landing.slug,
                    new_category_slug=cat.slug, new_landing_slug=update_data["slug"],
                ))
                warning = f"Redirect created: {landing.category.slug}/{landing.slug} -> {cat.slug}/{update_data['slug']}"

    for key, value in update_data.items():
        setattr(landing, key, value)
    await db.flush()
    await db.refresh(landing)

    detail = LandingDetailRead.model_validate(landing)
    detail.category_slug = landing.category.slug
    detail.warning = warning
    return detail


@router.patch("/{landing_id}/content/{locale}")
async def update_landing_content(
    landing_id: int, locale: Locale, body: LandingContentUpdate,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    result = await db.execute(
        select(LandingContent).where(LandingContent.landing_id == landing_id, LandingContent.locale == locale)
    )
    content = result.scalar_one_or_none()
    if not content:
        raise NotFoundException("Content not found for this locale")

    update_data = body.model_dump(exclude_unset=True)
    jsonb_errors = _validate_jsonb_fields(update_data)
    if jsonb_errors:
        raise BadRequestException("JSONB validation errors: " + "; ".join(jsonb_errors))

    for key, value in update_data.items():
        setattr(content, key, value)
    await db.flush()
    await db.refresh(content)
    return {"detail": "Content updated"}


@router.patch("/{landing_id}/sections")
async def update_landing_sections(
    landing_id: int, body: SectionsUpdate,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    landing_result = await db.execute(select(Landing).where(Landing.id == landing_id))
    if not landing_result.scalar_one_or_none():
        raise NotFoundException("Landing not found")
    for toggle in body.sections:
        result = await db.execute(
            select(LandingSection).where(
                LandingSection.landing_id == landing_id, LandingSection.section_type == toggle.section_type,
            )
        )
        section = result.scalar_one_or_none()
        if section:
            section.is_enabled = toggle.is_enabled
    await db.flush()
    return {"detail": "Sections updated"}


@router.patch("/{landing_id}/publish")
async def toggle_publish(
    landing_id: int,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    result = await db.execute(
        select(Landing).where(Landing.id == landing_id).options(selectinload(Landing.contents))
    )
    landing = result.scalar_one_or_none()
    if not landing:
        raise NotFoundException("Landing not found")

    if not landing.is_published:
        missing = []
        has_valid = False
        for c in landing.contents:
            cm = []
            if not c.h1: cm.append(f"{c.locale.value}: h1")
            if not c.hero_title: cm.append(f"{c.locale.value}: hero_title")
            if not c.meta_title: cm.append(f"{c.locale.value}: meta_title")
            if not cm: has_valid = True
            missing.extend(cm)
        if not has_valid:
            raise BadRequestException(
                "Cannot publish: at least one locale must have h1, hero_title, and meta_title. "
                f"Missing: {', '.join(missing)}"
            )

    landing.is_published = not landing.is_published
    await db.flush()
    return {"is_published": landing.is_published}


@router.delete("/{landing_id}")
async def delete_landing(
    landing_id: int,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    result = await db.execute(select(Landing).where(Landing.id == landing_id))
    landing = result.scalar_one_or_none()
    if not landing:
        raise NotFoundException("Landing not found")
    await db.delete(landing)
    await db.flush()
    return {"detail": "Landing deleted"}
