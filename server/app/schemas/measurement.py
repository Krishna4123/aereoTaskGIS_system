"""Measurement models for calculated geodesic areas, perimeters, and lengths."""

from typing import Optional
from pydantic import BaseModel


class FeatureMeasurementResponse(BaseModel):
    """Calculated geodetic measurement record for a single feature."""

    feature_id: str
    geometry_type: str
    area_ha: Optional[float] = None
    area_m2: Optional[float] = None
    perimeter_m: Optional[float] = None
    length_m: Optional[float] = None
    vertices_count: int
    calculation_method: str = "Karney Geodesic WGS84"
