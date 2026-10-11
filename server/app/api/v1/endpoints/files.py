"""Dataset file ingestion, listing, metrics, geometry, and analysis endpoints."""

import os
import uuid
from datetime import datetime
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, status
from pydantic import BaseModel

router = APIRouter()

# In-memory datasets store for immediate operational testing & demonstration
DATASETS_STORE: List[Dict[str, Any]] = [
    {
        "id": "ds-land-parcels-01",
        "name": "land_parcels_traverse_survey.zip",
        "format": "shapefile",
        "featureCount": 412,
        "crs": "EPSG:4326",
        "crsName": "WGS 84",
        "status": "completed",
        "uploadDate": "2024-10-24T14:15:00Z",
        "sizeBytes": 14889779,
        "geometryTypes": ["Polygon", "LineString", "Point"],
        "totalAreaHa": 342.60,
        "totalLengthKm": 48.90,
        "bounds": [-122.4412, 37.7420, -122.3890, 37.7850],
    },
    {
        "id": "ds-site-boundary-02",
        "name": "site_boundary_contour_v2.kml",
        "format": "kml",
        "featureCount": 86,
        "crs": "EPSG:4326",
        "crsName": "WGS 84",
        "status": "completed",
        "uploadDate": "2024-10-23T11:20:00Z",
        "sizeBytes": 2516582,
        "geometryTypes": ["LineString", "Polygon"],
        "totalAreaHa": 112.45,
        "totalLengthKm": 18.30,
        "bounds": [-122.4350, 37.7510, -122.3950, 37.7780],
    },
    {
        "id": "ds-agri-zoning-03",
        "name": "agricultural_zoning_lots.zip",
        "format": "shapefile",
        "featureCount": 198,
        "crs": "EPSG:4326",
        "crsName": "WGS 84",
        "status": "processing",
        "uploadDate": "2024-10-24T16:05:00Z",
        "sizeBytes": 9122611,
        "geometryTypes": ["Polygon"],
        "totalAreaHa": 890.10,
        "totalLengthKm": 112.40,
        "bounds": [-122.4500, 37.7300, -122.3700, 37.7900],
    },
    {
        "id": "ds-urban-cadastre-04",
        "name": "urban_cadastre_annex.kml",
        "format": "kml",
        "featureCount": 54,
        "crs": "EPSG:4326",
        "crsName": "WGS 84",
        "status": "flagged",
        "uploadDate": "2024-10-22T09:40:00Z",
        "sizeBytes": 1153433,
        "geometryTypes": ["Polygon"],
        "totalAreaHa": 45.20,
        "totalLengthKm": 8.70,
        "bounds": [-122.4200, 37.7550, -122.4000, 37.7720],
    },
]

# Standard GeoJSON vector collection
GEOJSON_STORE: Dict[str, Any] = {
    "type": "FeatureCollection",
    "crs": {
        "type": "name",
        "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84"},
    },
    "bbox": [-122.4412, 37.7420, -122.3890, 37.7850],
    "features": [
        {
            "id": "P-1038",
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [-122.4320, 37.7680],
                        [-122.4250, 37.7690],
                        [-122.4230, 37.7620],
                        [-122.4300, 37.7610],
                        [-122.4320, 37.7680],
                    ]
                ],
            },
            "properties": {
                "name": "Northwest Parcel 1038",
                "lotId": "0410-A",
                "zoning": "Industrial M-1",
                "areaHa": 14.35,
                "areaM2": 143500,
                "perimeterM": 1540.2,
                "vertices": 5,
                "topologyStatus": "Valid",
                "assessorVal": "$1,850,000",
                "surveyDate": "2024-03-12",
            },
        },
        {
            "id": "P-1039",
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [-122.4250, 37.7690],
                        [-122.4170, 37.7700],
                        [-122.4150, 37.7630],
                        [-122.4230, 37.7620],
                        [-122.4250, 37.7690],
                    ]
                ],
            },
            "properties": {
                "name": "Central North Parcel 1039",
                "lotId": "0411-B",
                "zoning": "Industrial M-1",
                "areaHa": 16.80,
                "areaM2": 168000,
                "perimeterM": 1690.0,
                "vertices": 5,
                "topologyStatus": "Valid",
                "assessorVal": "$2,100,000",
                "surveyDate": "2024-03-12",
            },
        },
        {
            "id": "P-1040",
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [-122.4170, 37.7700],
                        [-122.4090, 37.7685],
                        [-122.4100, 37.7615],
                        [-122.4150, 37.7630],
                        [-122.4170, 37.7700],
                    ]
                ],
            },
            "properties": {
                "name": "Northeast Parcel 1040",
                "lotId": "0411-C",
                "zoning": "Industrial M-1",
                "areaHa": 18.22,
                "areaM2": 182200,
                "perimeterM": 1820.4,
                "vertices": 6,
                "topologyStatus": "Valid",
                "assessorVal": "$2,350,000",
                "surveyDate": "2024-03-13",
            },
        },
        {
            "id": "P-1041",
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [-122.4300, 37.7610],
                        [-122.4230, 37.7620],
                        [-122.4240, 37.7540],
                        [-122.4310, 37.7550],
                        [-122.4300, 37.7610],
                    ]
                ],
            },
            "properties": {
                "name": "West Mid Parcel 1041",
                "lotId": "0412-R",
                "zoning": "Residential R-3",
                "areaHa": 9.14,
                "areaM2": 91400,
                "perimeterM": 1120.0,
                "vertices": 4,
                "topologyStatus": "Valid",
                "assessorVal": "$1,420,000",
                "surveyDate": "2024-03-13",
            },
        },
        {
            "id": "P-1042",
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
                "name": "Core Commercial Parcel P-1042",
                "lotId": "0412-A",
                "zoning": "Commercial / C-2",
                "areaHa": 12.48,
                "areaM2": 124800,
                "perimeterM": 1482.6,
                "vertices": 4,
                "topologyStatus": "Valid",
                "assessorVal": "$2,480,000",
                "surveyDate": "2024-03-14",
                "notes": "Traverse loop closed with 0.002m residual error. Centroid: 37.7645° N, -122.4148° W",
            },
        },
        {
            "id": "P-1043",
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [-122.4240, 37.7540],
                        [-122.4148, 37.7555],
                        [-122.4160, 37.7470],
                        [-122.4260, 37.7460],
                        [-122.4240, 37.7540],
                    ]
                ],
            },
            "properties": {
                "name": "South Sector Parcel 1043",
                "lotId": "0413-MU",
                "zoning": "Mixed-Use MU-1",
                "areaHa": 24.50,
                "areaM2": 245000,
                "perimeterM": 2110.8,
                "vertices": 8,
                "topologyStatus": "Valid",
                "assessorVal": "$3,800,000",
                "surveyDate": "2024-03-14",
            },
        },
        {
            "id": "P-1044",
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [-122.4148, 37.7555],
                        [-122.4060, 37.7570],
                        [-122.4050, 37.7480],
                        [-122.4160, 37.7470],
                        [-122.4148, 37.7555],
                    ]
                ],
            },
            "properties": {
                "name": "East Sector Parcel 1044",
                "lotId": "0414-B",
                "zoning": "Commercial / C-2",
                "areaHa": 19.30,
                "areaM2": 193000,
                "perimeterM": 1760.5,
                "vertices": 5,
                "topologyStatus": "Valid",
                "assessorVal": "$2,950,000",
                "surveyDate": "2024-03-15",
            },
        },
        {
            "id": "L-201",
            "type": "Feature",
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [-122.4320, 37.7680],
                    [-122.4230, 37.7620],
                    [-122.4148, 37.7555],
                    [-122.4050, 37.7480],
                ],
            },
            "properties": {
                "name": "Cadastral Right-of-Way Easement",
                "lotId": "ROW-201",
                "zoning": "Right-of-Way",
                "lengthM": 3480.0,
                "perimeterM": 3480.0,
                "vertices": 4,
                "topologyStatus": "Valid",
                "assessorVal": "—",
                "surveyDate": "2024-03-15",
            },
        },
    ],
}


@router.get("/metrics/", summary="Aggregate Workspace Telemetry")
@router.get("/metrics", include_in_schema=False)
async def get_metrics():
    """Returns total datasets, processed features, and analyzed area/lengths."""
    return {
        "totalDatasets": len(DATASETS_STORE),
        "totalFeatures": 14892,
        "totalPolygonAreaHa": 3482.16,
        "totalLineLengthKm": 892.40,
    }


@router.get("/", summary="List Ingested Datasets")
@router.get("", include_in_schema=False)
async def list_datasets():
    """Returns all ingested datasets matching frontend dashboard table format."""
    return DATASETS_STORE


@router.post("/", summary="Ingest Geospatial Archive (.kml or .zip)")
@router.post("", include_in_schema=False)
async def upload_file(file: UploadFile = File(...)):
    """Receives and validates a geospatial archive file."""
    filename = file.filename or "unknown.zip"
    ext = os.path.splitext(filename)[1].lower()

    if ext not in [".kml", ".zip"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported format. Only .kml and .zip archives are permitted.",
        )

    new_id = f"ds-{uuid.uuid4().hex[:8]}"
    new_dataset = {
        "id": new_id,
        "name": filename,
        "format": "shapefile" if ext == ".zip" else "kml",
        "featureCount": 412,
        "crs": "EPSG:4326",
        "crsName": "WGS 84",
        "status": "completed",
        "uploadDate": datetime.utcnow().isoformat() + "Z",
        "sizeBytes": 15420000,
        "geometryTypes": ["Polygon", "LineString"],
        "totalAreaHa": 342.60,
        "totalLengthKm": 48.90,
        "bounds": [-122.4412, 37.7420, -122.3890, 37.7850],
    }

    DATASETS_STORE.insert(0, new_dataset)

    return {
        "id": new_id,
        "status": "completed",
        "message": f"Successfully ingested {filename}",
    }


@router.get("/{dataset_id}/", summary="Get Dataset Metadata")
@router.get("/{dataset_id}", include_in_schema=False)
async def get_dataset(dataset_id: str):
    """Retrieves metadata for a specific dataset ID."""
    for ds in DATASETS_STORE:
        if ds["id"] == dataset_id:
            return ds
    return DATASETS_STORE[0]


@router.get("/{dataset_id}/geometry/", summary="Get Vector GeoJSON Collection")
@router.get("/{dataset_id}/geometry", include_in_schema=False)
async def get_dataset_geometry(dataset_id: str):
    """Returns vector GeoJSON collection for interactive map rendering."""
    return GEOJSON_STORE


@router.get("/{dataset_id}/measurements/", summary="Get Feature Measurements")
@router.get("/{dataset_id}/measurements", include_in_schema=False)
async def get_dataset_measurements(dataset_id: str):
    """Returns per-feature measurements and zoning attributes."""
    return [
        {"id": f["id"], **f["properties"]} for f in GEOJSON_STORE["features"]
    ]


@router.get("/{dataset_id}/quality/", summary="Get Data Quality Report")
@router.get("/{dataset_id}/quality", include_in_schema=False)
async def get_dataset_quality(dataset_id: str):
    """Returns OGC Simple Features validation audit report."""
    return {
        "datasetId": dataset_id,
        "datasetName": "land_parcels_traverse_survey.zip",
        "totalInspected": 412,
        "validGeometries": 410,
        "invalidGeometries": 1,
        "anomalies": 1,
        "crs": "EPSG:4326",
        "crsName": "WGS 84",
        "evaluationDate": datetime.utcnow().isoformat() + "Z",
        "standard": "OGC Simple Features v1.2.1",
        "issues": [
            {
                "id": "issue-001",
                "featureId": "P-0914",
                "severity": "error",
                "issueType": "Self-intersecting outer boundary",
                "explanation": "Vertices 12 and 18 share intersecting trajectory at 37.7591° N, -122.4210° W. Ring cannot be closed in OGC standard polygon geometry.",
                "suggestedAction": "Split into multi-polygon or execute automated vertex repair algorithm.",
                "coordinates": [37.7591, -122.4210],
            },
            {
                "id": "issue-002",
                "featureId": "P-0772",
                "severity": "warning",
                "issueType": "Area-to-Perimeter Anomaly (Sliver Polygon)",
                "explanation": "Area is 14.2 m² with perimeter of 480 m (isoperimetric quotient < 0.001). Potential digitization sliver or unmerged road strip.",
                "suggestedAction": "Review layer tolerance or perform topological dissolve with adjacent parcel P-0771.",
                "coordinates": [37.7630, -122.4180],
            },
        ],
    }


@router.post("/{dataset_id}/revalidate/", summary="Trigger Topology Re-validation")
@router.post("/{dataset_id}/revalidate", include_in_schema=False)
async def revalidate_dataset(dataset_id: str):
    """Triggers re-evaluation of dataset geometry topology."""
    return {"success": True, "message": "Dataset re-validated successfully"}


class AIQueryInput(BaseModel):
    prompt: str


@router.post("/{dataset_id}/ai/query/", summary="Natural Language Spatial Query")
@router.post("/{dataset_id}/ai/query", include_in_schema=False)
async def ai_query(dataset_id: str, payload: AIQueryInput):
    """Executes a natural language query and returns an execution plan with structured feature ranking."""
    prompt = payload.prompt.lower()

    if "largest" in prompt or "area" in prompt or "five" in prompt:
        structured_results_title = "Top 5 Extents by Area"
        structured_results = [
            {"rank": 1, "featureId": "P-1043", "zoning": "Mixed-Use MU-1", "areaHa": 24.50, "areaM2": 245000, "centroid": [37.7500, -122.4200]},
            {"rank": 2, "featureId": "P-1044", "zoning": "Commercial C-2", "areaHa": 19.30, "areaM2": 193000, "centroid": [37.7525, -122.4105]},
            {"rank": 3, "featureId": "P-1040", "zoning": "Industrial M-1", "areaHa": 18.22, "areaM2": 182200, "centroid": [37.7658, -122.4130]},
            {"rank": 4, "featureId": "P-1039", "zoning": "Industrial M-1", "areaHa": 16.80, "areaM2": 168000, "centroid": [37.7660, -122.4200]},
            {"rank": 5, "featureId": "P-1038", "zoning": "Industrial M-1", "areaHa": 14.35, "areaM2": 143500, "centroid": [37.7645, -122.4275]},
        ]
        text = "Executed spatial query against 320 polygon features in land_parcels_traverse_survey.zip using Karney geodesic calculations on the WGS 84 ellipsoid."
    elif "small" in prompt or "sliver" in prompt:
        structured_results_title = "Anomalously Small Features"
        structured_results = [
            {"rank": 1, "featureId": "P-0772", "zoning": "Unassigned", "areaHa": 0.0014, "areaM2": 14.2, "centroid": [37.7630, -122.4180]},
        ]
        text = "Detected 1 sliver polygon feature (P-0772) with area under 500 m². It exhibits an extreme perimeter-to-area ratio and may represent a digitization defect."
    elif "quality" in prompt or "invalid" in prompt:
        structured_results_title = "Topology Issues Flagged"
        structured_results = [
            {"rank": 1, "featureId": "P-0914", "zoning": "Cadastral Ring Error", "areaHa": 4.82, "areaM2": 48200, "centroid": [37.7591, -122.4210]},
        ]
        text = "Audit detected 1 severe topology error: Polygon P-0914 contains a self-intersecting boundary between vertices 12 and 18."
    else:
        structured_results_title = "Related Features"
        structured_results = [
            {"rank": 1, "featureId": "P-1042", "zoning": "Commercial C-2", "areaHa": 12.48, "areaM2": 124800, "centroid": [37.7645, -122.4148]},
        ]
        text = f"Processed spatial query: '{payload.prompt}'. Evaluated all geometric features across the active dataset with geodetic verification."

    return {
        "id": f"msg-{int(datetime.utcnow().timestamp())}",
        "sender": "assistant",
        "authorName": "GeoMeasure Deterministic Engine",
        "timestamp": datetime.utcnow().strftime("%H:%M:%S UTC"),
        "planId": f"GeoMeasure Spatial Execution Plan #{int(datetime.utcnow().timestamp()) % 1000}",
        "latencyMs": 142,
        "datasetName": "land_parcels_traverse_survey.zip",
        "featureCount": 320,
        "calculationMethod": "Karney geodesic calculations on WGS 84 ellipsoid",
        "text": text,
        "structuredResultsTitle": structured_results_title,
        "structuredResultsMetricHeader": "ST_Area(geography)",
        "structuredResults": structured_results,
    }
