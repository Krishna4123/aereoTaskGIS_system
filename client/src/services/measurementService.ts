import { apiClient } from './apiClient';
import { GeoFeature, GeoFeatureCollection } from '../types/geometry';
import { MOCK_COLLECTION } from './mockData';

export const measurementService = {
  async getFeatures(datasetId: string): Promise<{ data: GeoFeatureCollection; isMock: boolean }> {
    try {
      const response = await apiClient.get<GeoFeatureCollection>(`/api/files/${datasetId}/geometry/`);
      return { data: response.data, isMock: false };
    } catch {
      return { data: MOCK_COLLECTION, isMock: true };
    }
  },

  async getMeasurements(datasetId: string): Promise<{ data: any; isMock: boolean }> {
    try {
      const response = await apiClient.get(`/api/files/${datasetId}/measurements/`);
      return { data: response.data, isMock: false };
    } catch {
      return { data: MOCK_COLLECTION.features.map(f => ({ id: f.id, ...f.properties })), isMock: true };
    }
  },

  exportGeoJSONBlob(collection: GeoFeatureCollection, filename = 'geomeasure_export.geojson'): void {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(collection, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', filename);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  },

  exportCSVBlob(features: GeoFeature[], filename = 'features_measurement_manifest.csv'): void {
    if (!features.length) return;
    const headers = ['ID', 'Type', 'Area_ha', 'Perimeter_m', 'Vertices', 'Zoning', 'Status'];
    const rows = features.map((f) => [
      f.id,
      f.geometry.type,
      f.properties.areaHa ?? '—',
      f.properties.perimeterM ?? '—',
      f.properties.vertices ?? '—',
      f.properties.zoning ?? '—',
      f.properties.topologyStatus ?? 'Valid',
    ]);

    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },
};
