"""Main FastAPI application entrypoint for GeoMeasure AI."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.logging import setup_logging
from app.api.v1.router import api_v1_router

# Initialize application logging
setup_logging()

app = FastAPI(
    title=settings.APP_NAME,
    description=(
        "Portfolio-ready geospatial file analysis, parcel topology validation, "
        "and geodesic measurement API with deterministic natural language spatial querying."
    ),
    version=settings.VERSION,
    debug=settings.DEBUG,
)

# Robust CORS Middleware Configuration for Frontend Dev & Production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Versioned API Router (/api/v1)
app.include_router(api_v1_router, prefix=settings.API_V1_STR)

# Also mount under /api for frontend client service compatibility
app.include_router(api_v1_router, prefix="/api")


@app.get("/", tags=["Root"], summary="Root Status")
async def root():
    """Root endpoint verifying API availability."""
    return {
        "app": settings.APP_NAME,
        "version": settings.VERSION,
        "status": "online",
        "docs_url": "/docs",
    }


@app.get("/api/health", tags=["Health"], summary="Frontend Health Probe")
@app.get("/health", tags=["Health"], summary="Health Probe")
async def health_probe():
    """Direct health endpoint queried by the frontend apiClient on boot."""
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": settings.VERSION,
    }
