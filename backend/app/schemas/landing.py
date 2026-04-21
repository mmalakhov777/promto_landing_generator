from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field

from app.models.landing import Locale, SectionType


class LandingCreate(BaseModel):
    category_id: int
    slug: str = Field(min_length=1, max_length=255)
    keyword_ru: str = Field(default="", max_length=500)
    keyword_en: str = Field(default="", max_length=500)
    search_volume: int = 0


class LandingUpdate(BaseModel):
    category_id: int | None = None
    slug: str | None = Field(default=None, min_length=1, max_length=255)
    keyword_ru: str | None = Field(default=None, max_length=500)
    keyword_en: str | None = Field(default=None, max_length=500)
    search_volume: int | None = None


class LandingContentUpdate(BaseModel):
    meta_title: str | None = Field(default=None, max_length=500)
    meta_description: str | None = None
    h1: str | None = Field(default=None, max_length=500)
    og_title: str | None = Field(default=None, max_length=500)
    og_description: str | None = None
    og_image_url: str | None = Field(default=None, max_length=1000)
    hero_title: str | None = Field(default=None, max_length=500)
    hero_subtitle: str | None = None
    hero_cta_text: str | None = Field(default=None, max_length=255)
    hero_placeholder: str | None = Field(default=None, max_length=255)
    social_proof: list[dict[str, Any]] | None = None
    advantages: list[dict[str, Any]] | None = None
    how_it_works: list[dict[str, Any]] | None = None
    examples: list[dict[str, Any]] | None = None
    video_url: str | None = Field(default=None, max_length=1000)
    video_title: str | None = Field(default=None, max_length=500)
    pricing: list[dict[str, Any]] | None = None
    reviews: list[dict[str, Any]] | None = None
    faq: list[dict[str, Any]] | None = None
    cta_mid_title: str | None = Field(default=None, max_length=500)
    cta_mid_subtitle: str | None = None
    cta_final_title: str | None = Field(default=None, max_length=500)
    cta_final_subtitle: str | None = None
    cta_final_button_text: str | None = Field(default=None, max_length=255)


class SectionToggle(BaseModel):
    section_type: SectionType
    is_enabled: bool


class SectionsUpdate(BaseModel):
    sections: list[SectionToggle]


class LandingContentRead(BaseModel):
    id: int
    locale: Locale
    meta_title: str
    meta_description: str
    h1: str
    og_title: str
    og_description: str
    og_image_url: str
    hero_title: str
    hero_subtitle: str
    hero_cta_text: str
    hero_placeholder: str
    social_proof: list[dict[str, Any]] | None
    advantages: list[dict[str, Any]] | None
    how_it_works: list[dict[str, Any]] | None
    examples: list[dict[str, Any]] | None
    video_url: str
    video_title: str
    pricing: list[dict[str, Any]] | None
    reviews: list[dict[str, Any]] | None
    faq: list[dict[str, Any]] | None
    cta_mid_title: str
    cta_mid_subtitle: str
    cta_final_title: str
    cta_final_subtitle: str
    cta_final_button_text: str

    model_config = {"from_attributes": True}


class LandingSectionRead(BaseModel):
    id: int
    section_type: SectionType
    is_enabled: bool

    model_config = {"from_attributes": True}


class LandingRead(BaseModel):
    id: int
    category_id: int
    slug: str
    keyword_ru: str
    keyword_en: str
    search_volume: int
    is_published: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class LandingDetailRead(LandingRead):
    contents: list[LandingContentRead] = []
    sections: list[LandingSectionRead] = []
    category_slug: str = ""
    warning: str | None = None


class LandingListResponse(BaseModel):
    items: list[LandingRead]
    total: int
    page: int
    per_page: int
