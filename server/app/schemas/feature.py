"""GeoJSON Feature and FeatureCollection schemas."""

from typing import Dict, Any, List, Optional
from pydantic import BaseModel


class GeometrySchema(BaseModel):
    """GeoJSON Geometry schema."""

    type: str
    coordinates: Any


class FeaturePropertiesSchema(BaseModel):
    """Extensible feature attribute schema."""

    name: Optional[str] = None
    lot_id: Optional[str] = None
    zoning: Optional[str] = None
    area_ha: Optional[float] = None
    area_m2: Optional[float] = None
    length_m: Optional[float] = None
    perimeter_m: Optional[float] = None
    vertices: Optional[int] = None
    topology_status: Optional[str] = "Valid"
    assessor_val: Optional[str] = None
    survey_date: Optional[str] = None
    notes: Optional[str] = None


class GeoFeatureSchema(BaseModel):
    """GeoJSON Feature model."""

    id: str
    type: str = "Feature"
    geometry: GeometrySchema
    properties: Dict[str, Any]


class GeoFeatureCollectionSchema(BaseModel):
    """GeoJSON FeatureCollection model."""

    type: str = "FeatureCollection"
    features: List[GeoFeatureSchema]
    bbox: Optional[List[float]] = None
