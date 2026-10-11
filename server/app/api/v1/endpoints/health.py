"""Health check endpoint router."""

from fastapi import APIRouter
from app.core.config import settings

router = APIRouter()


@router.get("", summary="System Health Status")
async def health_check():
    """Returns the basic operational health status of the GeoMeasure AI backend."""
    return {
        "status": "healthy",
        "app_name": settings.APP_NAME,
        "version": settings.VERSION,
        "environment": settings.APP_ENV,
    }
