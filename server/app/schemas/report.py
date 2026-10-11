"""Cadastral spatial analysis and measurement report schemas."""

from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel


class ReportSummaryResponse(BaseModel):
    """Certified cadastral audit report summary."""

    report_ref: str
    dataset_id: str
    dataset_name: str
    issue_date: datetime
    status: str
    crs: str
    total_features: int
    total_surface_coverage_ha: float
    total_linear_traversals_km: float
    bounding_box: List[float]
    auditor_name: str
    auditor_role: str
    docket_hash: str
