from datetime import datetime

from sqlalchemy import DateTime, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class SlugRedirect(Base):
    __tablename__ = "slug_redirects"

    id: Mapped[int] = mapped_column(primary_key=True)
    old_category_slug: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    old_landing_slug: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    new_category_slug: Mapped[str] = mapped_column(String(255), nullable=False)
    new_landing_slug: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
