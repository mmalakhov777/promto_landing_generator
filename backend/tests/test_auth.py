"""Tests for auth API: login, refresh, me, invalid/expired tokens."""

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_login_success(client: AsyncClient, admin_headers: dict):
    """Login with valid credentials returns tokens."""
    resp = await client.post("/api/v1/auth/login", json={"email": "admin@test.com", "password": "adminpass123"})
    assert resp.status_code == 200
    data = resp.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["token_type"] == "bearer"


@pytest.mark.asyncio
async def test_login_wrong_password(client: AsyncClient, admin_headers: dict):
    resp = await client.post("/api/v1/auth/login", json={"email": "admin@test.com", "password": "wrong"})
    assert resp.status_code == 401


@pytest.mark.asyncio
async def test_login_nonexistent_user(client: AsyncClient):
    resp = await client.post("/api/v1/auth/login", json={"email": "nobody@test.com", "password": "pass"})
    assert resp.status_code == 401


@pytest.mark.asyncio
async def test_refresh_token(client: AsyncClient, admin_headers: dict):
    """Refresh endpoint returns new tokens."""
    login_resp = await client.post("/api/v1/auth/login", json={"email": "admin@test.com", "password": "adminpass123"})
    refresh_token = login_resp.json()["refresh_token"]

    resp = await client.post("/api/v1/auth/refresh", json={"refresh_token": refresh_token})
    assert resp.status_code == 200
    assert "access_token" in resp.json()


@pytest.mark.asyncio
async def test_refresh_with_access_token_fails(client: AsyncClient, admin_token: str):
    """Using an access token as refresh token should fail."""
    resp = await client.post("/api/v1/auth/refresh", json={"refresh_token": admin_token})
    assert resp.status_code == 401


@pytest.mark.asyncio
async def test_refresh_invalid_token(client: AsyncClient):
    resp = await client.post("/api/v1/auth/refresh", json={"refresh_token": "invalid.token.here"})
    assert resp.status_code == 401


@pytest.mark.asyncio
async def test_me(client: AsyncClient, admin_headers: dict):
    resp = await client.get("/api/v1/auth/me", headers=admin_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert data["email"] == "admin@test.com"
    assert data["role"] == "admin"


@pytest.mark.asyncio
async def test_me_no_token(client: AsyncClient):
    resp = await client.get("/api/v1/auth/me")
    assert resp.status_code in (401, 422)  # Missing header
