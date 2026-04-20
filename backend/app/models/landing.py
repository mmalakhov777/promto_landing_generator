import enum
from datetime import datetime

from sqlalchemy import (
    Boolean,
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    String,
    Text,
    UniqueConstraint,
    func,
)
from sqlalchemy.types import JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Locale(str, enum.Enum):
    ru = "ru"
    en = "en"


class SectionType(str, enum.Enum):
    social_proof = "social_proof"
    advantages = "advantages"
    how_it_works = "how_it_works"
    examples = "examples"
    cta_mid = "cta_mid"
    video = "video"
    pricing = "pricing"
    reviews = "reviews"
    faq = "faq"


class Landing(Base):
    __tablename__ = "landings"

    id: Mapped[int] = mapped_column(primary_key=True)
    category_id: Mapped[int] = mapped_column(ForeignKey("categories.id", ondelete="CASCADE"), nullable=False, index=True)
    slug: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    keyword_ru: Mapped[str] = mapped_column(String(500), nullable=False, default="")
    keyword_en: Mapped[str] = mapped_column(String(500), nullable=False, default="")
    search_volume: Mapped[int] = mapped_column(Integer, default=0)
    is_published: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    __table_args__ = (
        UniqueConstraint("category_id", "slug", name="uq_landing_category_slug"),
    )

    category: Mapped["Category"] = relationship(back_populates="landings")  # noqa: F821
    contents: Mapped[list["LandingContent"]] = relationship(
        back_populates="landing", cascade="all, delete-orphan"
    )
    sections: Mapped[list["LandingSection"]] = relationship(
        back_populates="landing", cascade="all, delete-orphan"
    )


class LandingContent(Base):
    __tablename__ = "landing_contents"

    id: Mapped[int] = mapped_column(primary_key=True)
    landing_id: Mapped[int] = mapped_column(ForeignKey("landings.id", ondelete="CASCADE"), nullable=False, index=True)
    locale: Mapped[Locale] = mapped_column(Enum(Locale), nullable=False)

    # SEO
    meta_title: Mapped[str] = mapped_column(String(500), nullable=False, default="")
    meta_description: Mapped[str] = mapped_column(Text, nullable=False, default="")
    h1: Mapped[str] = mapped_column(String(500), nullable=False, default="")
    og_title: Mapped[str] = mapped_column(String(500), nullable=False, default="")
    og_description: Mapped[str] = mapped_column(Text, nullable=False, default="")
    og_image_url: Mapped[str] = mapped_column(String(1000), nullable=False, default="")

    # Hero
    hero_title: Mapped[str] = mapped_column(String(500), nullable=False, default="")
    hero_subtitle: Mapped[str] = mapped_column(Text, nullable=False, default="")
    hero_cta_text: Mapped[str] = mapped_column(String(255), nullable=False, default="")
    hero_placeholder: Mapped[str] = mapped_column(String(255), nullable=False, default="")

    # JSON sections (works on both PostgreSQL and SQLite for tests)
    social_proof: Mapped[list | None] = mapped_column(JSON, nullable=True)
    advantages: Mapped[list | None] = mapped_column(JSON, nullable=True)
    how_it_works: Mapped[list | None] = mapped_column(JSON, nullable=True)
    examples: Mapped[list | None] = mapped_column(JSON, nullable=True)
    video_url: Mapped[str] = mapped_column(String(1000), nullable=False, default="")
    video_title: Mapped[str] = mapped_column(String(500), nullable=False, default="")
    pricing: Mapped[list | None] = mapped_column(JSON, nullable=True)
    reviews: Mapped[list | None] = mapped_column(JSON, nullable=True)
    faq: Mapped[list | None] = mapped_column(JSON, nullable=True)

    # CTA
    cta_mid_title: Mapped[str] = mapped_column(String(500), nullable=False, default="")
    cta_mid_subtitle: Mapped[str] = mapped_column(Text, nullable=False, default="")
    cta_final_title: Mapped[str] = mapped_column(String(500), nullable=False, default="")
    cta_final_subtitle: Mapped[str] = mapped_column(Text, nullable=False, default="")
    cta_final_button_text: Mapped[str] = mapped_column(String(255), nullable=False, default="")

    __table_args__ = (
        UniqueConstraint("landing_id", "locale", name="uq_landing_content_locale"),
    )

    landing: Mapped["Landing"] = relationship(back_populates="contents")


class LandingSection(Base):
    __tablename__ = "landing_sections"

    id: Mapped[int] = mapped_column(primary_key=True)
    landing_id: Mapped[int] = mapped_column(ForeignKey("landings.id", ondelete="CASCADE"), nullable=False, index=True)
    section_type: Mapped[SectionType] = mapped_column(Enum(SectionType), nullable=False)
    is_enabled: Mapped[bool] = mapped_column(Boolean, default=True)

    __table_args__ = (
        UniqueConstraint("landing_id", "section_type", name="uq_landing_section_type"),
    )

    landing: Mapped["Landing"] = relationship(back_populates="sections")
