from fastapi import APIRouter

from app.api.v1.auth import router as auth_router
from app.api.v1.categories import router as categories_router
from app.api.v1.health import router as health_router
from app.api.v1.landings import router as landings_router
from app.api.v1.public import router as public_router
from app.api.v1.settings import router as settings_router

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(health_router, tags=["health"])
api_router.include_router(auth_router, tags=["auth"])
api_router.include_router(categories_router, tags=["categories"])
api_router.include_router(landings_router, tags=["landings"])
api_router.include_router(public_router, tags=["public"])
api_router.include_router(settings_router, tags=["settings"])
