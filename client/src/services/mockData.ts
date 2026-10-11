import { Dataset, DatasetMetrics } from '../types/dataset';
import { GeoFeature, GeoFeatureCollection } from '../types/geometry';
import { QualityReport } from '../types/quality';
import { AIMessage } from '../types/ai';

export const MOCK_METRICS: DatasetMetrics = {
  totalDatasets: 28,
  totalFeatures: 14892,
  totalPolygonAreaHa: 3482.16,
  totalLineLengthKm: 892.40,
};

export const MOCK_DATASETS: Dataset[] = [
  {
    id: 'ds-land-parcels-01',
    name: 'land_parcels_traverse_survey.zip',
    format: 'shapefile',
    featureCount: 412,
    crs: 'EPSG:4326',
    crsName: 'WGS 84',
    status: 'completed',
    uploadDate: '2024-10-24T14:15:00Z',
    sizeBytes: 14889779, // ~14.2 MB
    geometryTypes: ['Polygon', 'LineString', 'Point'],
    totalAreaHa: 342.60,
    totalLengthKm: 48.90,
    bounds: [-122.4412, 37.7420, -122.3890, 37.7850],
  },
  {
    id: 'ds-site-boundary-02',
    name: 'site_boundary_contour_v2.kml',
    format: 'kml',
    featureCount: 86,
    crs: 'EPSG:4326',
    crsName: 'WGS 84',
    status: 'completed',
    uploadDate: '2024-10-23T11:20:00Z',
    sizeBytes: 2516582, // ~2.4 MB
    geometryTypes: ['LineString', 'Polygon'],
    totalAreaHa: 112.45,
    totalLengthKm: 18.30,
    bounds: [-122.4350, 37.7510, -122.3950, 37.7780],
  },
  {
    id: 'ds-agri-zoning-03',
    name: 'agricultural_zoning_lots.zip',
    format: 'shapefile',
    featureCount: 198,
    crs: 'EPSG:4326',
    crsName: 'WGS 84',
    status: 'processing',
    uploadDate: '2024-10-24T16:05:00Z',
    sizeBytes: 9122611, // ~8.7 MB
    geometryTypes: ['Polygon'],
    totalAreaHa: 890.10,
    totalLengthKm: 112.40,
    bounds: [-122.4500, 37.7300, -122.3700, 37.7900],
  },
  {
    id: 'ds-urban-cadastre-04',
    name: 'urban_cadastre_annex.kml',
    format: 'kml',
    featureCount: 54,
    crs: 'EPSG:4326',
    crsName: 'WGS 84',
    status: 'flagged',
    uploadDate: '2024-10-22T09:40:00Z',
    sizeBytes: 1153433, // ~1.1 MB
    geometryTypes: ['Polygon'],
    totalAreaHa: 45.20,
    totalLengthKm: 8.70,
    bounds: [-122.4200, 37.7550, -122.4000, 37.7720],
  },
];

// Rich GeoJSON feature collection for land_parcels_traverse_survey.zip
export const MOCK_FEATURES: GeoFeature[] = [
  {
    id: 'P-1038',
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-122.4320, 37.7680],
          [-122.4250, 37.7690],
          [-122.4230, 37.7620],
          [-122.4300, 37.7610],
          [-122.4320, 37.7680],
        ],
      ],
    },
    properties: {
      name: 'Northwest Parcel 1038',
      lotId: '0410-A',
      zoning: 'Industrial M-1',
      areaHa: 14.35,
      areaM2: 143500,
      perimeterM: 1540.2,
      vertices: 5,
      topologyStatus: 'Valid',
      assessorVal: '$1,850,000',
      surveyDate: '2024-03-12',
    },
  },
  {
    id: 'P-1039',
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-122.4250, 37.7690],
          [-122.4170, 37.7700],
          [-122.4150, 37.7630],
          [-122.4230, 37.7620],
          [-122.4250, 37.7690],
        ],
      ],
    },
    properties: {
      name: 'Central North Parcel 1039',
      lotId: '0411-B',
      zoning: 'Industrial M-1',
      areaHa: 16.80,
      areaM2: 168000,
      perimeterM: 1690.0,
      vertices: 5,
      topologyStatus: 'Valid',
      assessorVal: '$2,100,000',
      surveyDate: '2024-03-12',
    },
  },
  {
    id: 'P-1040',
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-122.4170, 37.7700],
          [-122.4090, 37.7685],
          [-122.4100, 37.7615],
          [-122.4150, 37.7630],
          [-122.4170, 37.7700],
        ],
      ],
    },
    properties: {
      name: 'Northeast Parcel 1040',
      lotId: '0411-C',
      zoning: 'Industrial M-1',
      areaHa: 18.22,
      areaM2: 182200,
      perimeterM: 1820.4,
      vertices: 6,
      topologyStatus: 'Valid',
      assessorVal: '$2,350,000',
      surveyDate: '2024-03-13',
    },
  },
  {
    id: 'P-1041',
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-122.4300, 37.7610],
          [-122.4230, 37.7620],
          [-122.4240, 37.7540],
          [-122.4310, 37.7550],
          [-122.4300, 37.7610],
        ],
      ],
    },
    properties: {
      name: 'West Mid Parcel 1041',
      lotId: '0412-R',
      zoning: 'Residential R-3',
      areaHa: 9.14,
      areaM2: 91400,
      perimeterM: 1120.0,
      vertices: 4,
      topologyStatus: 'Valid',
      assessorVal: '$1,420,000',
      surveyDate: '2024-03-13',
    },
  },
  {
    id: 'P-1042',
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-122.4230, 37.7620],
          [-122.4130, 37.7635],
          [-122.4148, 37.7555],
          [-122.4240, 37.7540],
          [-122.4230, 37.7620],
        ],
      ],
    },
    properties: {
      name: 'Core Commercial Parcel P-1042',
      lotId: '0412-A',
      zoning: 'Commercial / C-2',
      areaHa: 12.48,
      areaM2: 124800,
      perimeterM: 1482.6,
      vertices: 4,
      topologyStatus: 'Valid',
      assessorVal: '$2,480,000',
      surveyDate: '2024-03-14',
      notes: 'Traverse loop closed with 0.002m residual error. Centroid: 37.7645° N, -122.4148° W',
    },
  },
  {
    id: 'P-1043',
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-122.4240, 37.7540],
          [-122.4148, 37.7555],
          [-122.4160, 37.7470],
          [-122.4260, 37.7460],
          [-122.4240, 37.7540],
        ],
      ],
    },
    properties: {
      name: 'South Sector Parcel 1043',
      lotId: '0413-MU',
      zoning: 'Mixed-Use MU-1',
      areaHa: 24.50,
      areaM2: 245000,
      perimeterM: 2110.8,
      vertices: 8,
      topologyStatus: 'Valid',
      assessorVal: '$3,800,000',
      surveyDate: '2024-03-14',
    },
  },
  {
    id: 'P-1044',
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-122.4148, 37.7555],
          [-122.4060, 37.7570],
          [-122.4050, 37.7480],
          [-122.4160, 37.7470],
          [-122.4148, 37.7555],
        ],
      ],
    },
    properties: {
      name: 'East Sector Parcel 1044',
      lotId: '0414-B',
      zoning: 'Commercial / C-2',
      areaHa: 19.30,
      areaM2: 193000,
      perimeterM: 1760.5,
      vertices: 5,
      topologyStatus: 'Valid',
      assessorVal: '$2,950,000',
      surveyDate: '2024-03-15',
    },
  },
  {
    id: 'L-201',
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: [
        [-122.4320, 37.7680],
        [-122.4230, 37.7620],
        [-122.4148, 37.7555],
        [-122.4050, 37.7480],
      ],
    },
    properties: {
      name: 'Cadastral Right-of-Way Easement',
      lotId: 'ROW-201',
      zoning: 'Right-of-Way',
      lengthM: 3480.0,
      perimeterM: 3480.0,
      vertices: 4,
      topologyStatus: 'Valid',
      assessorVal: '—',
      surveyDate: '2024-03-15',
    },
  },
];

export const MOCK_COLLECTION: GeoFeatureCollection = {
  type: 'FeatureCollection',
  crs: {
    type: 'name',
    properties: {
      name: 'urn:ogc:def:crs:OGC:1.3:CRS84',
    },
  },
  bbox: [-122.4412, 37.7420, -122.3890, 37.7850],
  features: MOCK_FEATURES,
};

export const MOCK_QUALITY_REPORT: QualityReport = {
  datasetId: 'ds-land-parcels-01',
  datasetName: 'land_parcels_traverse_survey.zip',
  totalInspected: 412,
  validGeometries: 410,
  invalidGeometries: 1,
  anomalies: 1,
  crs: 'EPSG:4326',
  crsName: 'WGS 84',
  evaluationDate: '2024-10-24T14:30:00Z',
  standard: 'OGC Simple Features v1.2.1',
  issues: [
    {
      id: 'issue-001',
      featureId: 'P-0914',
      severity: 'error',
      issueType: 'Self-intersecting outer boundary',
      explanation: 'Vertices 12 and 18 share intersecting trajectory at 37.7591° N, -122.4210° W. Ring cannot be closed in OGC standard polygon geometry.',
      suggestedAction: 'Split into multi-polygon or execute automated vertex repair algorithm.',
      coordinates: [37.7591, -122.4210],
    },
    {
      id: 'issue-002',
      featureId: 'P-0772',
      severity: 'warning',
      issueType: 'Area-to-Perimeter Anomaly (Sliver Polygon)',
      explanation: 'Area is 14.2 m² with perimeter of 480 m (isoperimetric quotient < 0.001). Potential digitization sliver or unmerged road strip.',
      suggestedAction: 'Review layer tolerance or perform topological dissolve with adjacent parcel P-0771.',
      coordinates: [37.7630, -122.4180],
    },
  ],
};

export const INITIAL_AI_MESSAGES: AIMessage[] = [
  {
    id: 'msg-01',
    sender: 'user',
    authorName: 'Elena Rostova',
    timestamp: '14:18:02 UTC',
    text: 'Which five polygons have the largest area in this survey?',
  },
  {
    id: 'msg-02',
    sender: 'assistant',
    authorName: 'GeoMeasure Deterministic Engine',
    timestamp: '14:18:03 UTC',
    planId: 'GeoMeasure Spatial Execution Plan #804',
    latencyMs: 142,
    datasetName: 'land_parcels_traverse_survey.zip',
    featureCount: 320,
    calculationMethod: 'Karney geodesic calculations on the WGS 84 ellipsoid',
    text: 'Executed spatial query against 320 polygon features in land_parcels_traverse_survey.zip using Karney geodesic calculations on the WGS 84 ellipsoid.',
    structuredResultsTitle: 'Top 5 Extents by Area',
    structuredResultsMetricHeader: 'ST_Area(geography)',
    structuredResults: [
      {
        rank: 1,
        featureId: 'P-1043',
        zoning: 'Mixed-Use MU-1',
        notes: 'Traverse Loop #15 • Centroid: [37.7500, -122.4200]',
        areaHa: 24.50,
        areaM2: 245000,
        centroid: [37.7500, -122.4200],
      },
      {
        rank: 2,
        featureId: 'P-1044',
        zoning: 'Commercial C-2',
        notes: 'Traverse Loop #16 • Centroid: [37.7525, -122.4105]',
        areaHa: 19.30,
        areaM2: 193000,
        centroid: [37.7525, -122.4105],
      },
      {
        rank: 3,
        featureId: 'P-1040',
        zoning: 'Industrial M-1',
        notes: 'Traverse Loop #12 • Centroid: [37.7658, -122.4130]',
        areaHa: 18.22,
        areaM2: 182200,
        centroid: [37.7658, -122.4130],
      },
      {
        rank: 4,
        featureId: 'P-1039',
        zoning: 'Industrial M-1',
        notes: 'Traverse Loop #11 • Centroid: [37.7660, -122.4200]',
        areaHa: 16.80,
        areaM2: 168000,
        centroid: [37.7660, -122.4200],
      },
      {
        rank: 5,
        featureId: 'P-1038',
        zoning: 'Industrial M-1',
        notes: 'Traverse Loop #10 • Centroid: [37.7645, -122.4275]',
        areaHa: 14.35,
        areaM2: 143500,
        centroid: [37.7645, -122.4275],
      },
    ],
  },
];
