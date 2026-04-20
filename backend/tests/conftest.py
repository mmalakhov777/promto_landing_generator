import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

import app.models  # noqa: F401 — register all models with Base.metadata
from app.core.database import Base, get_db
from app.main import app

# Use SQLite for tests (no PostgreSQL dependency)
TEST_DATABASE_URL = "sqlite+aiosqlite:///./test.db"

engine = create_async_engine(TEST_DATABASE_URL, echo=False)
test_session_factory = async_sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)


async def override_get_db():
    async with test_session_factory() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(autouse=True)
async def setup_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


@pytest.fixture
async def db_session():
    """Provide a direct DB session for test data setup."""
    async with test_session_factory() as session:
        yield session


@pytest.fixture
async def admin_token(client: AsyncClient, db_session: AsyncSession):
    """Create an admin user and return a valid access token."""
    from app.models.user import User, UserRole
    from app.services.auth import hash_password, create_access_token

    user = User(
        email="admin@test.com",
        hashed_password=hash_password("adminpass123"),
        role=UserRole.admin,
        is_active=True,
    )
    db_session.add(user)
    await db_session.commit()
    return create_access_token(user.id)


@pytest.fixture
async def editor_token(db_session: AsyncSession):
    """Create an editor user and return a valid access token."""
    from app.models.user import User, UserRole
    from app.services.auth import hash_password, create_access_token

    user = User(
        email="editor@test.com",
        hashed_password=hash_password("editorpass123"),
        role=UserRole.editor,
        is_active=True,
    )
    db_session.add(user)
    await db_session.commit()
    return create_access_token(user.id)


@pytest.fixture
def admin_headers(admin_token: str) -> dict:
    return {"Authorization": f"Bearer {admin_token}"}


@pytest.fixture
def editor_headers(editor_token: str) -> dict:
    return {"Authorization": f"Bearer {editor_token}"}
