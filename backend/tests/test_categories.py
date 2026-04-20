"""Tests for categories CRUD API including slug validation."""

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_create_category(client: AsyncClient, admin_headers: dict):
    resp = await client.post("/api/v1/categories", json={
        "slug": "test-category", "name_ru": "Тест", "name_en": "Test"
    }, headers=admin_headers)
    assert resp.status_code == 201
    data = resp.json()
    assert data["slug"] == "test-category"
    assert data["name_ru"] == "Тест"


@pytest.mark.asyncio
async def test_list_categories(client: AsyncClient, admin_headers: dict):
    await client.post("/api/v1/categories", json={"slug": "cat1", "name_ru": "Cat 1"}, headers=admin_headers)
    await client.post("/api/v1/categories", json={"slug": "cat2", "name_ru": "Cat 2"}, headers=admin_headers)

    resp = await client.get("/api/v1/categories")
    assert resp.status_code == 200
    assert len(resp.json()) == 2


@pytest.mark.asyncio
async def test_list_categories_filter_active(client: AsyncClient, admin_headers: dict):
    await client.post("/api/v1/categories", json={"slug": "active", "name_ru": "Active", "is_active": True}, headers=admin_headers)
    await client.post("/api/v1/categories", json={"slug": "inactive", "name_ru": "Inactive", "is_active": False}, headers=admin_headers)

    resp = await client.get("/api/v1/categories?is_active=true")
    assert len(resp.json()) == 1
    assert resp.json()[0]["slug"] == "active"


@pytest.mark.asyncio
async def test_update_category(client: AsyncClient, admin_headers: dict):
    create_resp = await client.post("/api/v1/categories", json={"slug": "old", "name_ru": "Old"}, headers=admin_headers)
    cat_id = create_resp.json()["id"]

    resp = await client.patch(f"/api/v1/categories/{cat_id}", json={"name_ru": "Updated"}, headers=admin_headers)
    assert resp.status_code == 200
    assert resp.json()["name_ru"] == "Updated"


@pytest.mark.asyncio
async def test_reserved_slug_rejected(client: AsyncClient, admin_headers: dict):
    """[RISK-05] Reserved slugs must be rejected."""
    for slug in ["admin", "api", "ru", "en"]:
        resp = await client.post("/api/v1/categories", json={"slug": slug, "name_ru": "Test"}, headers=admin_headers)
        assert resp.status_code == 400, f"Slug '{slug}' should be rejected"


@pytest.mark.asyncio
async def test_duplicate_slug_rejected(client: AsyncClient, admin_headers: dict):
    await client.post("/api/v1/categories", json={"slug": "unique", "name_ru": "First"}, headers=admin_headers)
    resp = await client.post("/api/v1/categories", json={"slug": "unique", "name_ru": "Second"}, headers=admin_headers)
    assert resp.status_code == 400


@pytest.mark.asyncio
async def test_delete_category_cascades(client: AsyncClient, admin_headers: dict):
    """[RISK-11] Deactivating category unpublishes its landings."""
    cat_resp = await client.post("/api/v1/categories", json={"slug": "todie", "name_ru": "Bye"}, headers=admin_headers)
    cat_id = cat_resp.json()["id"]

    # Create a landing and publish it
    land_resp = await client.post("/api/v1/landings", json={
        "category_id": cat_id, "slug": "my-landing"
    }, headers=admin_headers)
    land_id = land_resp.json()["id"]

    # Add content so we can publish
    await client.patch(f"/api/v1/landings/{land_id}/content/ru", json={
        "h1": "Test", "hero_title": "Test", "meta_title": "Test"
    }, headers=admin_headers)
    await client.patch(f"/api/v1/landings/{land_id}/publish", headers=admin_headers)

    # Deactivate category
    resp = await client.delete(f"/api/v1/categories/{cat_id}", headers=admin_headers)
    assert resp.status_code == 200
    assert resp.json()["unpublished_landings"] == 1


@pytest.mark.asyncio
async def test_editor_cannot_create_category(client: AsyncClient, editor_headers: dict):
    resp = await client.post("/api/v1/categories", json={"slug": "nope", "name_ru": "Nope"}, headers=editor_headers)
    assert resp.status_code == 403
