"""Central API v1 router mounting all domain endpoint routers."""

from fastapi import APIRouter
from app.api.v1.endpoints import (
    health,
    files,
    measurements,
    features,
    quality,
    ai_analyst,
    reports,
)

api_v1_router = APIRouter()

api_v1_router.include_router(health.router, prefix="/health", tags=["Health"])
api_v1_router.include_router(files.router, prefix="/files", tags=["Files"])
api_v1_router.include_router(
    measurements.router, prefix="/measurements", tags=["Measurements"]
)
api_v1_router.include_router(features.router, prefix="/features", tags=["Features"])
api_v1_router.include_router(quality.router, prefix="/quality", tags=["Data Quality"])
api_v1_router.include_router(
    ai_analyst.router, prefix="/ai", tags=["AI Analyst"]
)
api_v1_router.include_router(reports.router, prefix="/reports", tags=["Reports"])
