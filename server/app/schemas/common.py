"""Common shared Pydantic response models and pagination schemas."""

from typing import Generic, TypeVar, Optional, List
from pydantic import BaseModel

T = TypeVar("T")


class APIResponse(BaseModel, Generic[T]):
    """Standard generic API response wrapper."""

    success: bool = True
    message: Optional[str] = None
    data: Optional[T] = None


class PaginationParams(BaseModel):
    """Pagination query parameters."""

    page: int = 1
    page_size: int = 50
