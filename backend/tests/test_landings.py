"""Tests for landings CRUD API including content, sections, publish, and slug validation."""

import pytest
from httpx import AsyncClient


async def _create_category(client, headers):
    resp = await client.post("/api/v1/categories", json={"slug": "test-cat", "name_ru": "Test"}, headers=headers)
    return resp.json()["id"]


@pytest.mark.asyncio
async def test_create_landing(client: AsyncClient, admin_headers: dict):
    cat_id = await _create_category(client, admin_headers)
    resp = await client.post("/api/v1/landings", json={
        "category_id": cat_id, "slug": "my-landing", "keyword_ru": "тест"
    }, headers=admin_headers)
    assert resp.status_code == 201
    data = resp.json()
    assert data["slug"] == "my-landing"
    assert len(data["contents"]) == 2  # ru + en
    assert len(data["sections"]) == 9  # all section types


@pytest.mark.asyncio
async def test_list_landings_with_filter(client: AsyncClient, admin_headers: dict):
    cat_id = await _create_category(client, admin_headers)
    await client.post("/api/v1/landings", json={"category_id": cat_id, "slug": "a"}, headers=admin_headers)
    await client.post("/api/v1/landings", json={"category_id": cat_id, "slug": "b"}, headers=admin_headers)

    resp = await client.get("/api/v1/landings", headers=admin_headers)
    assert resp.json()["total"] == 2

    # Search filter
    resp = await client.get("/api/v1/landings?search=a", headers=admin_headers)
    assert resp.json()["total"] == 1


@pytest.mark.asyncio
async def test_update_content(client: AsyncClient, admin_headers: dict):
    cat_id = await _create_category(client, admin_headers)
    land_resp = await client.post("/api/v1/landings", json={"category_id": cat_id, "slug": "edit-me"}, headers=admin_headers)
    land_id = land_resp.json()["id"]

    resp = await client.patch(f"/api/v1/landings/{land_id}/content/ru", json={
        "h1": "Заголовок", "hero_title": "Герой", "meta_title": "Мета",
        "faq": [{"question": "Q?", "answer": "A."}],
    }, headers=admin_headers)
    assert resp.status_code == 200


@pytest.mark.asyncio
async def test_update_content_invalid_jsonb(client: AsyncClient, admin_headers: dict):
    """[RISK-07] Invalid JSONB data is rejected."""
    cat_id = await _create_category(client, admin_headers)
    land_resp = await client.post("/api/v1/landings", json={"category_id": cat_id, "slug": "bad-json"}, headers=admin_headers)
    land_id = land_resp.json()["id"]

    resp = await client.patch(f"/api/v1/landings/{land_id}/content/ru", json={
        "faq": [{"wrong_field": "no question or answer"}],
    }, headers=admin_headers)
    assert resp.status_code == 400


@pytest.mark.asyncio
async def test_toggle_sections(client: AsyncClient, admin_headers: dict):
    cat_id = await _create_category(client, admin_headers)
    land_resp = await client.post("/api/v1/landings", json={"category_id": cat_id, "slug": "sections-test"}, headers=admin_headers)
    land_id = land_resp.json()["id"]

    resp = await client.patch(f"/api/v1/landings/{land_id}/sections", json={
        "sections": [{"section_type": "faq", "is_enabled": False}]
    }, headers=admin_headers)
    assert resp.status_code == 200

    # Verify
    detail = (await client.get(f"/api/v1/landings/{land_id}", headers=admin_headers)).json()
    faq_section = next(s for s in detail["sections"] if s["section_type"] == "faq")
    assert faq_section["is_enabled"] is False


@pytest.mark.asyncio
async def test_publish_empty_content_rejected(client: AsyncClient, admin_headers: dict):
    """[RISK-10] Publishing with empty content should fail."""
    cat_id = await _create_category(client, admin_headers)
    land_resp = await client.post("/api/v1/landings", json={"category_id": cat_id, "slug": "empty"}, headers=admin_headers)
    land_id = land_resp.json()["id"]

    resp = await client.patch(f"/api/v1/landings/{land_id}/publish", headers=admin_headers)
    assert resp.status_code == 400
    assert "h1" in resp.json()["detail"]


@pytest.mark.asyncio
async def test_publish_with_content_succeeds(client: AsyncClient, admin_headers: dict):
    cat_id = await _create_category(client, admin_headers)
    land_resp = await client.post("/api/v1/landings", json={"category_id": cat_id, "slug": "good"}, headers=admin_headers)
    land_id = land_resp.json()["id"]

    await client.patch(f"/api/v1/landings/{land_id}/content/ru", json={
        "h1": "Title", "hero_title": "Hero", "meta_title": "Meta"
    }, headers=admin_headers)

    resp = await client.patch(f"/api/v1/landings/{land_id}/publish", headers=admin_headers)
    assert resp.status_code == 200
    assert resp.json()["is_published"] is True


@pytest.mark.asyncio
async def test_slug_redirect_on_change(client: AsyncClient, admin_headers: dict):
    """[RISK-09] Changing slug of published landing creates redirect."""
    cat_id = await _create_category(client, admin_headers)
    land_resp = await client.post("/api/v1/landings", json={"category_id": cat_id, "slug": "old-slug"}, headers=admin_headers)
    land_id = land_resp.json()["id"]

    # Fill content and publish
    await client.patch(f"/api/v1/landings/{land_id}/content/ru", json={
        "h1": "T", "hero_title": "T", "meta_title": "T"
    }, headers=admin_headers)
    await client.patch(f"/api/v1/landings/{land_id}/publish", headers=admin_headers)

    # Change slug
    resp = await client.patch(f"/api/v1/landings/{land_id}", json={"slug": "new-slug"}, headers=admin_headers)
    assert resp.status_code == 200
    assert resp.json()["warning"] is not None
    assert "Redirect" in resp.json()["warning"]


@pytest.mark.asyncio
async def test_reserved_slug_landing(client: AsyncClient, admin_headers: dict):
    """[RISK-05] Reserved slugs rejected for landings too."""
    cat_id = await _create_category(client, admin_headers)
    resp = await client.post("/api/v1/landings", json={"category_id": cat_id, "slug": "admin"}, headers=admin_headers)
    assert resp.status_code == 400


@pytest.mark.asyncio
async def test_page_pattern_slug_rejected(client: AsyncClient, admin_headers: dict):
    """[RISK-01] pageN pattern slugs rejected."""
    cat_id = await _create_category(client, admin_headers)
    resp = await client.post("/api/v1/landings", json={"category_id": cat_id, "slug": "page2"}, headers=admin_headers)
    assert resp.status_code == 400


@pytest.mark.asyncio
async def test_delete_landing(client: AsyncClient, admin_headers: dict):
    cat_id = await _create_category(client, admin_headers)
    land_resp = await client.post("/api/v1/landings", json={"category_id": cat_id, "slug": "delete-me"}, headers=admin_headers)
    land_id = land_resp.json()["id"]

    resp = await client.delete(f"/api/v1/landings/{land_id}", headers=admin_headers)
    assert resp.status_code == 200

    # Verify deleted
    resp = await client.get(f"/api/v1/landings/{land_id}", headers=admin_headers)
    assert resp.status_code == 404
