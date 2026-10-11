"""Dataset request and response schemas matching frontend expectations."""

from datetime import datetime
from typing import Optional, List, Tuple
from pydantic import BaseModel


class DatasetBase(BaseModel):
    """Base dataset properties."""

    name: str
    format: str  # 'shapefile' | 'kml'
    crs: str
    crs_name: Optional[str] = None


class DatasetCreate(DatasetBase):
    """Schema for dataset creation."""

    pass


class DatasetResponse(DatasetBase):
    """Schema representing an ingested dataset."""

    id: str
    feature_count: int
    status: str  # 'completed' | 'processing' | 'flagged'
    upload_date: datetime
    size_bytes: int
    geometry_types: List[str]
    total_area_ha: Optional[float] = None
    total_length_km: Optional[float] = None
    bounds: Optional[Tuple[float, float, float, float]] = None


class DatasetMetricsResponse(BaseModel):
    """Aggregate workspace metrics response."""

    total_datasets: int
    total_features: int
    total_polygon_area_ha: float
    total_line_length_km: float
