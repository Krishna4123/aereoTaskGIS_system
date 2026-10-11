"""AI Analyst request and structured response execution plan schemas."""

from typing import List, Optional, Tuple
from pydantic import BaseModel


class AIQueryRequest(BaseModel):
    """Natural language query payload."""

    prompt: str


class StructuredResultItemSchema(BaseModel):
    """Ranked feature item from natural language spatial query."""

    rank: int
    feature_id: str
    zoning: Optional[str] = None
    notes: Optional[str] = None
    centroid: Optional[Tuple[float, float]] = None
    area_ha: Optional[float] = None
    area_m2: Optional[float] = None
    length_m: Optional[float] = None


class AIQueryResponse(BaseModel):
    """Calibrated geospatial analyst response."""

    id: str
    sender: str = "assistant"
    author_name: str = "GeoMeasure Deterministic Engine"
    timestamp: str
    plan_id: Optional[str] = None
    latency_ms: Optional[int] = None
    dataset_name: Optional[str] = None
    feature_count: Optional[int] = None
    calculation_method: Optional[str] = None
    text: str
    structured_results_title: Optional[str] = None
    structured_results_metric_header: Optional[str] = None
    structured_results: Optional[List[StructuredResultItemSchema]] = None
