from typing import Any

from pydantic import BaseModel


class SettingsRead(BaseModel):
    metrika_id: str
    smartcaptcha_client_key: str
    platform_url: str

    model_config = {"from_attributes": True}


class SettingsUpdate(BaseModel):
    metrika_id: str | None = None
    smartcaptcha_client_key: str | None = None
    default_pricing: list[dict[str, Any]] | None = None
    default_cta_texts: dict[str, Any] | None = None
    platform_url: str | None = None
    social_proof_defaults: list[dict[str, Any]] | None = None
    default_video_url: str | None = None


class SettingsFullRead(BaseModel):
    id: int
    metrika_id: str
    smartcaptcha_client_key: str
    default_pricing: list[dict[str, Any]] | None
    default_cta_texts: dict[str, Any] | None
    platform_url: str
    social_proof_defaults: list[dict[str, Any]] | None
    default_video_url: str

    model_config = {"from_attributes": True}
