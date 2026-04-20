"""CLI script to create the first admin user."""

import asyncio
import sys
from getpass import getpass

sys.path.insert(0, ".")

from sqlalchemy import select
from app.core.database import async_session_factory, engine, Base
from app.models.user import User, UserRole
from app.services.auth import hash_password
import app.models  # noqa: F401


async def main():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    email = input("Admin email: ").strip()
    if not email:
        print("Error: email is required"); sys.exit(1)

    password = getpass("Admin password: ")
    if len(password) < 6:
        print("Error: password must be at least 6 characters"); sys.exit(1)

    confirm = getpass("Confirm password: ")
    if password != confirm:
        print("Error: passwords do not match"); sys.exit(1)

    async with async_session_factory() as session:
        result = await session.execute(select(User).where(User.email == email))
        if result.scalar_one_or_none():
            print(f"Error: user with email '{email}' already exists"); sys.exit(1)

        user = User(email=email, hashed_password=hash_password(password), role=UserRole.admin, is_active=True)
        session.add(user)
        await session.commit()
        print(f"Admin user created: {email} (id={user.id})")


if __name__ == "__main__":
    asyncio.run(main())
