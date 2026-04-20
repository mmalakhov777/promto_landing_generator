from datetime import datetime

from sqlalchemy import Boolean, DateTime, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Category(Base):
    __tablename__ = "categories"

    id: Mapped[int] = mapped_column(primary_key=True)
    slug: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    name_ru: Mapped[str] = mapped_column(String(500), nullable=False)
    name_en: Mapped[str] = mapped_column(String(500), nullable=False, default="")
    description_ru: Mapped[str] = mapped_column(Text, nullable=False, default="")
    description_en: Mapped[str] = mapped_column(Text, nullable=False, default="")
    meta_title_ru: Mapped[str] = mapped_column(String(500), nullable=False, default="")
    meta_title_en: Mapped[str] = mapped_column(String(500), nullable=False, default="")
    meta_description_ru: Mapped[str] = mapped_column(Text, nullable=False, default="")
    meta_description_en: Mapped[str] = mapped_column(Text, nullable=False, default="")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    landings: Mapped[list["Landing"]] = relationship(  # noqa: F821
        back_populates="category", cascade="all, delete-orphan"
    )
