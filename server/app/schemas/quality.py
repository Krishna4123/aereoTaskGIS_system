"""Data quality and topological audit validation schemas."""

from datetime import datetime
from typing import List, Optional, Tuple
from pydantic import BaseModel


class ValidationIssueSchema(BaseModel):
    """Specific topological anomaly or geometry error."""

    id: str
    feature_id: str
    severity: str  # 'error' | 'warning' | 'info'
    issue_type: str
    explanation: str
    suggested_action: str
    coordinates: Optional[Tuple[float, float]] = None


class QualityReportResponse(BaseModel):
    """OGC Simple Features quality audit report."""

    dataset_id: str
    dataset_name: str
    total_inspected: int
    valid_geometries: int
    invalid_geometries: int
    anomalies: int
    crs: str
    crs_name: str
    evaluation_date: datetime
    standard: str = "OGC Simple Features v1.2.1"
    issues: List[ValidationIssueSchema]
