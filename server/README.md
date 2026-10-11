# GeoMeasure AI — Backend Service

GeoMeasure AI is a full-stack geospatial file analysis and measurement platform engineered for GIS data ingestion, geodetic measurement verification, topological auditing, and natural language spatial analysis.

## Overview

This backend is built on **FastAPI** with Python 3.11+ and **MongoDB**. It handles geospatial parsing (`.kml`, Shapefile `.zip`), OGC Simple Features validation, ellipsoidal calculations via GeoPandas/Shapely/PyProj, and structured AI analyst querying.

## Directory Structure

```text
server/
├── app/
│   ├── api/          # API versioning, endpoint routers, and dependency injection
│   ├── core/         # Application configuration, logging, and custom exceptions
│   ├── db/           # MongoDB async client manager (Motor) and collection definitions
│   ├── models/       # Document models and database schemas
│   ├── repositories/ # MongoDB data access layer
│   ├── schemas/      # Pydantic request and response schemas
│   ├── services/     # Core domain business logic (geospatial, measurements, AI)
│   ├── utils/        # Helper functions
│   └── main.py       # FastAPI application factory and middleware configuration
├── storage/          # Local file storage (uploads and processed artifacts)
├── tests/            # Pytest test suite (unit and integration tests)
├── .env.example      # Sample environment configuration template
├── .gitignore        # Backend gitignore rules
└── requirements.txt  # Python dependency specifications
```

## Technology Stack

- **Framework**: FastAPI, Uvicorn, Pydantic v2, Pydantic-Settings
- **Geospatial Processing**: GeoPandas, Shapely, PyProj, Fiona
- **Database & Persistence**: MongoDB via Motor (Async) and PyMongo
- **Testing**: Pytest, Pytest-Asyncio, HTTPX

## Configuration Variables

| Variable | Description | Default |
|---|---|---|
| `APP_NAME` | Name of the application | `GeoMeasure AI API` |
| `API_V1_STR` | Primary API version prefix | `/api/v1` |
| `BACKEND_CORS_ORIGINS` | Allowed frontend origins | `["http://localhost:3000"]` |
| `MONGODB_URL` | MongoDB connection URI | `mongodb://localhost:27017` |
| `MONGODB_DB_NAME` | MongoDB database name | `geomeasure_ai` |
| `STORAGE_UPLOAD_DIR` | Ingestion directory for raw files | `./storage/uploads` |
| `STORAGE_PROCESSED_DIR` | Directory for serialized GeoJSON/manifests | `./storage/processed` |
| `MAX_UPLOAD_SIZE_MB` | Maximum allowed archive size in MB | `150` |
| `LLM_PROVIDER` | AI provider for natural language queries | `openai` |
| `LLM_MODEL_NAME` | LLM model identifier | `gpt-4o` |

## Future Implementation Phases

1. **Phase 1**: Ingestion pipeline for Shapefiles and KML archives (CRS detection and extraction).
2. **Phase 2**: Geodetic ellipsoidal calculations (Karney integrals, area, perimeter, lengths).
3. **Phase 3**: Topology validation engine (OGC Simple Features self-intersection & sliver detection).
4. **Phase 4**: LLM Tool calling for deterministic spatial queries.
5. **Phase 5**: Database persistence with MongoDB documents & 2dsphere spatial indexes.
