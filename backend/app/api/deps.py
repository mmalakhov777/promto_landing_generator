"""FastAPI dependencies for authentication."""

from fastapi import Depends, Header
import jwt
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.exceptions import ForbiddenException, UnauthorizedException
from app.models.user import User, UserRole
from app.services.auth import decode_token


async def get_current_user(
    authorization: str = Header(..., description="Bearer <token>"),
    db: AsyncSession = Depends(get_db),
) -> User:
    """Extract and validate JWT from Authorization header, return the user."""
    if not authorization.startswith("Bearer "):
        raise UnauthorizedException("Invalid authorization header format")

    token = authorization.removeprefix("Bearer ")
    try:
        payload = decode_token(token)
    except jwt.PyJWTError:
        raise UnauthorizedException("Invalid or expired token")

    if payload.get("type") != "access":
        raise UnauthorizedException("Invalid token type")

    user_id = payload.get("sub")
    if user_id is None:
        raise UnauthorizedException("Invalid token payload")

    result = await db.execute(select(User).where(User.id == int(user_id)))
    user = result.scalar_one_or_none()
    if user is None or not user.is_active:
        raise UnauthorizedException("User not found or inactive")

    return user


async def require_admin(user: User = Depends(get_current_user)) -> User:
    """Require the current user to have admin role."""
    if user.role != UserRole.admin:
        raise ForbiddenException("Admin access required")
    return user
