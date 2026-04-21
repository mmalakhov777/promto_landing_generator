"""Site settings API + captcha verification + ISR revalidation."""

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import require_admin
from app.core.config import settings as app_settings
from app.core.database import get_db
from app.core.exceptions import BadRequestException, NotFoundException
from app.models.settings import SiteSettings
from app.models.user import User
from app.schemas.settings import SettingsFullRead, SettingsRead, SettingsUpdate

router = APIRouter(tags=["settings"])


async def _get_settings(db: AsyncSession) -> SiteSettings:
    result = await db.execute(select(SiteSettings).limit(1))
    settings_obj = result.scalar_one_or_none()
    if not settings_obj:
        raise NotFoundException("Site settings not initialized. Run the migration to seed default settings.")
    return settings_obj


@router.get("/settings", response_model=SettingsRead)
async def get_settings(db: AsyncSession = Depends(get_db)):
    """Public: returns only metrika_id, smartcaptcha_client_key, platform_url."""
    return await _get_settings(db)


@router.get("/settings/full", response_model=SettingsFullRead)
async def get_settings_full(
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    """Admin: returns all settings including defaults."""
    return await _get_settings(db)


@router.patch("/settings", response_model=SettingsFullRead)
async def update_settings(
    body: SettingsUpdate,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    settings_obj = await _get_settings(db)
    update_data = body.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(settings_obj, key, value)
    await db.flush()
    await db.refresh(settings_obj)
    return settings_obj


@router.post("/revalidate")
async def revalidate(
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    """Trigger ISR revalidation on the Next.js frontend."""
    import httpx

    frontend_url = app_settings.FRONTEND_URL
    revalidate_secret = app_settings.REVALIDATE_SECRET

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(
                f"{frontend_url}/api/revalidate",
                params={"secret": revalidate_secret},
            )
            return {"status": "ok", "frontend_status": resp.status_code}
    except Exception as e:
        return {"status": "error", "detail": str(e)}


@router.post("/captcha/verify")
async def verify_captcha(token: str):
    """Server-side SmartCaptcha token verification."""
    import httpx

    server_key = app_settings.SMARTCAPTCHA_SERVER_KEY
    if not server_key:
        raise BadRequestException("SmartCaptcha server key not configured")

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(
                "https://smartcaptcha.yandexcloud.net/validate",
                params={"secret": server_key, "token": token},
            )
            data = resp.json()
            return {"ok": data.get("status") == "ok"}
    except Exception:
        return {"ok": False}
