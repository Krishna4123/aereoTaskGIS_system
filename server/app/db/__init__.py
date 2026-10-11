"""Database layer package containing MongoDB client and collection definitions."""

from app.db.base import MongoCollections
from app.db.session import get_database, db_manager

__all__ = ["MongoCollections", "get_database", "db_manager"]
