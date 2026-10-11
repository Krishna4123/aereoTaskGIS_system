export type DatasetFormat = 'shapefile' | 'kml';
export type DatasetStatus = 'completed' | 'processing' | 'flagged';

export interface Dataset {
  id: string;
  name: string;
  format: DatasetFormat;
  featureCount: number;
  crs: string;
  crsName?: string;
  status: DatasetStatus;
  uploadDate: string;
  sizeBytes: number;
  geometryTypes: string[];
  totalAreaHa?: number;
  totalLengthKm?: number;
  bounds?: [number, number, number, number]; // [minLon, minLat, maxLon, maxLat]
}

export interface DatasetMetrics {
  totalDatasets: number;
  totalFeatures: number;
  totalPolygonAreaHa: number;
  totalLineLengthKm: number;
}
