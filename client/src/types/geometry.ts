export type GeometryType = 'Polygon' | 'MultiPolygon' | 'LineString' | 'MultiLineString' | 'Point';

export interface GeoFeatureProperties {
  name?: string;
  lotId?: string;
  zoning?: string;
  areaHa?: number;
  areaM2?: number;
  lengthM?: number;
  perimeterM?: number;
  vertices?: number;
  topologyStatus?: 'Valid' | 'Invalid' | 'Warning';
  assessorVal?: string;
  surveyDate?: string;
  notes?: string;
  [key: string]: any;
}

export interface GeoFeature {
  id: string;
  type: 'Feature';
  geometry: {
    type: GeometryType;
    coordinates: any;
  };
  properties: GeoFeatureProperties;
}

export interface GeoFeatureCollection {
  type: 'FeatureCollection';
  crs?: {
    type: string;
    properties: {
      name: string;
    };
  };
  features: GeoFeature[];
  bbox?: [number, number, number, number];
}
