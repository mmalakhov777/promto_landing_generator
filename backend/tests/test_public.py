"""Tests for public API: categories, landings, detail, sitemap-data."""

import pytest
from httpx import AsyncClient


async def _setup_published_landing(client, headers):
    cat_resp = await client.post("/api/v1/categories", json={"slug": "pub-cat", "name_ru": "Public"}, headers=headers)
    cat_id = cat_resp.json()["id"]

    land_resp = await client.post("/api/v1/landings", json={
        "category_id": cat_id, "slug": "pub-landing", "keyword_ru": "тест", "search_volume": 100
    }, headers=headers)
    land_id = land_resp.json()["id"]

    await client.patch(f"/api/v1/landings/{land_id}/content/ru", json={
        "h1": "Публичный", "hero_title": "Герой", "meta_title": "Мета"
    }, headers=headers)
    await client.patch(f"/api/v1/landings/{land_id}/publish", headers=headers)
    return cat_id, land_id


@pytest.mark.asyncio
async def test_public_categories(client: AsyncClient, admin_headers: dict):
    await _setup_published_landing(client, admin_headers)

    resp = await client.get("/api/v1/public/categories")
    assert resp.status_code == 200
    data = resp.json()
    assert len(data) == 1
    assert data[0]["slug"] == "pub-cat"
    assert data[0]["landing_count"] == 1


@pytest.mark.asyncio
async def test_public_landings(client: AsyncClient, admin_headers: dict):
    await _setup_published_landing(client, admin_headers)

    resp = await client.get("/api/v1/public/landings?locale=ru")
    assert resp.status_code == 200
    data = resp.json()
    assert data["total"] == 1
    assert data["items"][0]["slug"] == "pub-landing"
    assert data["items"][0]["full_url"] == "/ru/pub-cat/pub-landing/"


@pytest.mark.asyncio
async def test_public_landing_detail(client: AsyncClient, admin_headers: dict):
    await _setup_published_landing(client, admin_headers)

    resp = await client.get("/api/v1/public/landing/pub-cat/pub-landing?locale=ru")
    assert resp.status_code == 200
    data = resp.json()
    assert data["h1"] == "Публичный"
    assert "enabled_sections" in data


@pytest.mark.asyncio
async def test_public_landing_not_found(client: AsyncClient):
    resp = await client.get("/api/v1/public/landing/none/none")
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_sitemap_data(client: AsyncClient, admin_headers: dict):
    await _setup_published_landing(client, admin_headers)

    resp = await client.get("/api/v1/public/sitemap-data")
    assert resp.status_code == 200
    data = resp.json()
    assert len(data) == 1
    assert data[0]["category_slug"] == "pub-cat"
    assert data[0]["landing_slug"] == "pub-landing"
