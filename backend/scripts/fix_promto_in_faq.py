"""Replace 'Promto' with 'Промто' in all landing FAQ content in database."""

import asyncio
import sys

sys.path.insert(0, ".")

from sqlalchemy import select
from app.core.database import async_session_factory
from app.models.landing import LandingContent
import app.models  # noqa: F401


async def main():
    async with async_session_factory() as session:
        result = await session.execute(
            select(LandingContent).where(
                LandingContent.faq.isnot(None)
            )
        )
        contents = result.scalars().all()
        print(f"Found {len(contents)} landing contents with FAQ")

        updated = 0
        for content in contents:
            faq = content.faq
            if not faq:
                continue

            modified = False
            new_faq = []
            for item in faq:
                if not isinstance(item, dict):
                    new_faq.append(item)
                    continue
                new_item = dict(item)
                if "answer" in new_item and "Promto" in new_item["answer"]:
                    new_item["answer"] = new_item["answer"].replace("Promto", "Промто")
                    modified = True
                if "question" in new_item and "Promto" in new_item["question"]:
                    new_item["question"] = new_item["question"].replace("Promto", "Промто")
                    modified = True
                new_faq.append(new_item)

            if modified:
                content.faq = new_faq
                updated += 1
                print(f"  Updated {content.locale} (id={content.id})")

        await session.commit()
        print(f"\nUpdated {updated} landing contents")


if __name__ == "__main__":
    asyncio.run(main())
