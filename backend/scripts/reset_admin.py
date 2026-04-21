"""Reset admin user: delete old admin and create new one."""

import asyncio
import sys

sys.path.insert(0, ".")

from sqlalchemy import delete, select

from app.core.database import async_session_factory
from app.models.user import User, UserRole
from app.services.auth import hash_password
import app.models  # noqa: F401


async def main():
    # Delete all existing admin users
    async with async_session_factory() as session:
        result = await session.execute(
            select(User).where(User.role == UserRole.admin)
        )
        old_admins = result.scalars().all()
        print(f"Found {len(old_admins)} existing admin(s):")
        for u in old_admins:
            print(f"  - {u.email} (id={u.id})")

        for u in old_admins:
            await session.execute(delete(User).where(User.id == u.id))
        print(f"Deleted {len(old_admins)} admin(s)")

    # Create new admin
    async with async_session_factory() as session:
        new_admin = User(
            email="Proomtoo2026@promto.ai",
            password_hash=hash_password("sd19!dDaff13F98vdP"),
            role=UserRole.admin,
        )
        session.add(new_admin)
        await session.commit()
        print(f"Created new admin: Proomtoo2026 / sd19!dDaff13F98vdP")


if __name__ == "__main__":
    asyncio.run(main())
