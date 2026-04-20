from datetime import datetime

from pydantic import BaseModel, Field


class CategoryCreate(BaseModel):
    slug: str = Field(min_length=1, max_length=255)
    name_ru: str = Field(min_length=1, max_length=500)
    name_en: str = Field(default="", max_length=500)
    description_ru: str = ""
    description_en: str = ""
    meta_title_ru: str = Field(default="", max_length=500)
    meta_title_en: str = Field(default="", max_length=500)
    meta_description_ru: str = ""
    meta_description_en: str = ""
    is_active: bool = True
    sort_order: int = 0


class CategoryUpdate(BaseModel):
    slug: str | None = Field(default=None, min_length=1, max_length=255)
    name_ru: str | None = Field(default=None, min_length=1, max_length=500)
    name_en: str | None = Field(default=None, max_length=500)
    description_ru: str | None = None
    description_en: str | None = None
    meta_title_ru: str | None = Field(default=None, max_length=500)
    meta_title_en: str | None = Field(default=None, max_length=500)
    meta_description_ru: str | None = None
    meta_description_en: str | None = None
    is_active: bool | None = None
    sort_order: int | None = None


class CategoryRead(BaseModel):
    id: int
    slug: str
    name_ru: str
    name_en: str
    description_ru: str
    description_en: str
    meta_title_ru: str
    meta_title_en: str
    meta_description_ru: str
    meta_description_en: str
    is_active: bool
    sort_order: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class CategoryReadPublic(BaseModel):
    id: int
    slug: str
    name_ru: str
    name_en: str
    description_ru: str
    description_en: str
    meta_title_ru: str
    meta_title_en: str
    meta_description_ru: str
    meta_description_en: str
    landing_count: int = 0

    model_config = {"from_attributes": True}
