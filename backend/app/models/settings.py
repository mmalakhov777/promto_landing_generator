from datetime import datetime

from sqlalchemy import DateTime, String, Text, func
from sqlalchemy.types import JSON
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class SiteSettings(Base):
    __tablename__ = "site_settings"

    id: Mapped[int] = mapped_column(primary_key=True)
    metrika_id: Mapped[str] = mapped_column(String(50), nullable=False, default="")
    smartcaptcha_client_key: Mapped[str] = mapped_column(String(255), nullable=False, default="")
    default_pricing: Mapped[list | None] = mapped_column(JSON, nullable=True)
    default_cta_texts: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    platform_url: Mapped[str] = mapped_column(String(500), nullable=False, default="https://app.promto.ai")
    social_proof_defaults: Mapped[list | None] = mapped_column(JSON, nullable=True)
    default_video_url: Mapped[str] = mapped_column(Text, nullable=False, default="")
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )
