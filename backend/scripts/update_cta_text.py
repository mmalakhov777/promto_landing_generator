"""Update cta_final_button_text for all landings: 'Создать сайт бесплатно' → 'Создать сайт за 1₽'"""

import asyncio
import sys

sys.path.insert(0, ".")

from sqlalchemy import select, update

from app.core.database import async_session_factory
from app.models.landing import LandingContent
import app.models  # noqa: F401 — ensure all models are registered with SQLAlchemy


async def main():
    # Count before
    async with async_session_factory() as session:
        result = await session.execute(
            select(LandingContent).where(LandingContent.cta_final_button_text == "Создать сайт бесплатно")
        )
        before = result.scalars().all()
        print(f"Found {len(before)} landing contents with old CTA text")

    # Update
    async with async_session_factory() as session:
        result = await session.execute(
            update(LandingContent)
            .where(LandingContent.cta_final_button_text == "Создать сайт бесплатно")
            .values(cta_final_button_text="Создать сайт за 1₽")
        )
        await session.commit()
        print(f"Updated {result.rowcount} rows")

    # Verify
    async with async_session_factory() as session:
        result = await session.execute(
            select(LandingContent).where(LandingContent.cta_final_button_text == "Создать сайт за 1₽")
        )
        after = result.scalars().all()
        print(f"Verified: {len(after)} landing contents now have new CTA text")


if __name__ == "__main__":
    asyncio.run(main())
