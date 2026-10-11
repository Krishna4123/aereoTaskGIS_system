"""FastAPI dependency injection utilities for GeoMeasure AI."""

from motor.motor_asyncio import AsyncIOMotorDatabase
from app.db.session import get_database


async def get_db() -> AsyncIOMotorDatabase:
    """Dependency providing access to the MongoDB database."""
    return await get_database()
