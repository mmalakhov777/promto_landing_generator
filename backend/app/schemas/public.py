from datetime import datetime
from typing import Any

from pydantic import BaseModel


class PublicLandingItem(BaseModel):
    title: str
    slug: str
    category_slug: str
    full_url: str
    keyword: str
    search_volume: int
    locale: str


class PublicLandingListResponse(BaseModel):
    items: list[PublicLandingItem]
    total: int
    page: int
    per_page: int


class PublicLandingDetail(BaseModel):
    slug: str
    category_slug: str
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
    enabled_sections: list[str]


class SitemapItem(BaseModel):
    category_slug: str
    landing_slug: str
    updated_at: datetime | None
    locales: list[str]
