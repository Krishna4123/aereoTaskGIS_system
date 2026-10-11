"""Pytest configuration and fixture placeholders for GeoMeasure AI tests."""

import pytest


@pytest.fixture
def mock_geojson_feature():
    """Placeholder fixture returning a standard GeoJSON Polygon feature."""
    return {
        "type": "Feature",
        "geometry": {
            "type": "Polygon",
            "coordinates": [
                [
                    [-122.4230, 37.7620],
                    [-122.4130, 37.7635],
                    [-122.4148, 37.7555],
                    [-122.4240, 37.7540],
                    [-122.4230, 37.7620],
                ]
            ],
        },
        "properties": {
            "id": "P-1042",
            "lot_id": "0412-A",
            "zoning": "Commercial / C-2",
        },
    }
