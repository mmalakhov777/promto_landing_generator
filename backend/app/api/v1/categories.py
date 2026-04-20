"""Categories CRUD API."""

from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.api.deps import require_admin
from app.core.database import get_db
from app.core.exceptions import BadRequestException, NotFoundException
from app.models.category import Category
from app.models.user import User
from app.schemas.category import CategoryCreate, CategoryRead, CategoryUpdate
from app.services.slug import validate_slug

router = APIRouter(prefix="/categories", tags=["categories"])


@router.get("", response_model=list[CategoryRead])
async def list_categories(
    is_active: bool | None = Query(None),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(Category).order_by(Category.sort_order, Category.id)
    if is_active is not None:
        stmt = stmt.where(Category.is_active == is_active)
    result = await db.execute(stmt)
    return result.scalars().all()


@router.post("", response_model=CategoryRead, status_code=201)
async def create_category(
    body: CategoryCreate,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    # [RISK-05] Validate slug
    errors = validate_slug(body.slug)
    if errors:
        raise BadRequestException("; ".join(errors))

    existing = await db.execute(select(Category).where(Category.slug == body.slug))
    if existing.scalar_one_or_none():
        raise BadRequestException(f"Category with slug '{body.slug}' already exists")

    category = Category(**body.model_dump())
    db.add(category)
    await db.flush()
    await db.refresh(category)
    return category


@router.get("/{category_id}", response_model=CategoryRead)
async def get_category(
    category_id: int,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    result = await db.execute(select(Category).where(Category.id == category_id))
    category = result.scalar_one_or_none()
    if not category:
        raise NotFoundException("Category not found")
    return category


@router.patch("/{category_id}", response_model=CategoryRead)
async def update_category(
    category_id: int,
    body: CategoryUpdate,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    result = await db.execute(select(Category).where(Category.id == category_id))
    category = result.scalar_one_or_none()
    if not category:
        raise NotFoundException("Category not found")

    update_data = body.model_dump(exclude_unset=True)

    if "slug" in update_data:
        errors = validate_slug(update_data["slug"])
        if errors:
            raise BadRequestException("; ".join(errors))
        existing = await db.execute(
            select(Category).where(Category.slug == update_data["slug"], Category.id != category_id)
        )
        if existing.scalar_one_or_none():
            raise BadRequestException(f"Category with slug '{update_data['slug']}' already exists")

    for key, value in update_data.items():
        setattr(category, key, value)

    await db.flush()
    await db.refresh(category)
    return category


@router.delete("/{category_id}")
async def delete_category(
    category_id: int,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    """[RISK-11] Deactivate category and cascade-unpublish all its landings."""
    result = await db.execute(
        select(Category).where(Category.id == category_id).options(selectinload(Category.landings))
    )
    category = result.scalar_one_or_none()
    if not category:
        raise NotFoundException("Category not found")

    category.is_active = False
    unpublished_count = 0
    for landing in category.landings:
        if landing.is_published:
            landing.is_published = False
            unpublished_count += 1

    await db.flush()
    return {"detail": "Category deactivated", "unpublished_landings": unpublished_count}
