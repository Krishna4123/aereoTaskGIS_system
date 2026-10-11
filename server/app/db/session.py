"""MongoDB database client and connection session management using Motor."""

from typing import Optional
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.core.config import settings


class MongoDBManager:
    """Manages the lifecycle of MongoDB connections."""

    client: Optional[AsyncIOMotorClient] = None
    db: Optional[AsyncIOMotorDatabase] = None

    def connect(self) -> None:
        """Initializes the MongoDB client."""
        self.client = AsyncIOMotorClient(settings.MONGODB_URL)
        self.db = self.client[settings.MONGODB_DB_NAME]

    def close(self) -> None:
        """Closes the MongoDB connection."""
        if self.client:
            self.client.close()


db_manager = MongoDBManager()


async def get_database() -> AsyncIOMotorDatabase:
    """FastAPI dependency yielding the active MongoDB database instance."""
    if db_manager.db is None:
        db_manager.connect()
    return db_manager.db
