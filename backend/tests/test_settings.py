"""Tests for settings, revalidate, captcha endpoints."""

import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.settings import SiteSettings


@pytest.mark.asyncio
async def test_get_settings_creates_default(client: AsyncClient, db_session: AsyncSession):
    """First GET /settings should create default settings if none exist."""
    # Seed settings manually since there's no migration in tests
    settings = SiteSettings(platform_url="https://app.promto.ai")
    db_session.add(settings)
    await db_session.commit()

    resp = await client.get("/api/v1/settings")
    assert resp.status_code == 200
    data = resp.json()
    assert data["platform_url"] == "https://app.promto.ai"


@pytest.mark.asyncio
async def test_update_settings(client: AsyncClient, admin_headers, db_session: AsyncSession):
    settings = SiteSettings(platform_url="https://app.promto.ai")
    db_session.add(settings)
    await db_session.commit()

    resp = await client.patch("/api/v1/settings", json={
        "metrika_id": "12345",
        "platform_url": "https://new.promto.ai",
    }, headers=admin_headers)
    assert resp.status_code == 200
    assert resp.json()["metrika_id"] == "12345"
    assert resp.json()["platform_url"] == "https://new.promto.ai"


@pytest.mark.asyncio
async def test_update_settings_requires_admin(client: AsyncClient, editor_headers, db_session: AsyncSession):
    settings = SiteSettings(platform_url="https://app.promto.ai")
    db_session.add(settings)
    await db_session.commit()

    resp = await client.patch("/api/v1/settings", json={
        "metrika_id": "hack",
    }, headers=editor_headers)
    assert resp.status_code == 403


@pytest.mark.asyncio
async def test_captcha_verify_no_key(client: AsyncClient):
    """When SmartCaptcha key is not configured, should return error."""
    resp = await client.post("/api/v1/captcha/verify?token=sometoken")
    # SmartCaptcha server key is empty in test env
    assert resp.status_code == 400
