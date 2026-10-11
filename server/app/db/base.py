"""MongoDB collection constants and base document conventions."""

from typing import Dict, Any


class MongoCollections:
    """Standard collection names used across GeoMeasure AI."""

    DATASETS = "datasets"
    FEATURES = "features"
    MEASUREMENTS = "measurements"
    QUALITY_REPORTS = "quality_reports"
    AI_SESSIONS = "ai_sessions"
