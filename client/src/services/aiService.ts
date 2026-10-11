import { apiClient } from './apiClient';
import { AIMessage } from '../types/ai';
import { INITIAL_AI_MESSAGES, MOCK_FEATURES } from './mockData';

export const aiService = {
  getInitialConversation(): AIMessage[] {
    return [...INITIAL_AI_MESSAGES];
  },

  async queryAI(datasetId: string, prompt: string): Promise<{ data: AIMessage; isMock: boolean }> {
    try {
      const response = await apiClient.post<AIMessage>(`/api/files/${datasetId}/ai/query/`, { prompt });
      return { data: response.data, isMock: false };
    } catch {
      // Deterministic geospatial mock response
      const lower = prompt.toLowerCase();
      let text = '';
      let structuredResultsTitle = 'Query Results';
      let structuredResults: any[] = [];

      if (lower.includes('five') || lower.includes('largest') || lower.includes('area')) {
        structuredResultsTitle = 'Top 5 Extents by Area';
        structuredResults = [
          { rank: 1, featureId: 'P-1043', zoning: 'Mixed-Use MU-1', areaHa: 24.50, areaM2: 245000, centroid: [37.7500, -122.4200] },
          { rank: 2, featureId: 'P-1044', zoning: 'Commercial C-2', areaHa: 19.30, areaM2: 193000, centroid: [37.7525, -122.4105] },
          { rank: 3, featureId: 'P-1040', zoning: 'Industrial M-1', areaHa: 18.22, areaM2: 182200, centroid: [37.7658, -122.4130] },
          { rank: 4, featureId: 'P-1039', zoning: 'Industrial M-1', areaHa: 16.80, areaM2: 168000, centroid: [37.7660, -122.4200] },
          { rank: 5, featureId: 'P-1038', zoning: 'Industrial M-1', areaHa: 14.35, areaM2: 143500, centroid: [37.7645, -122.4275] },
        ];
        text = 'Identified the 5 largest parcel polygons in this dataset using geodesic ellipsoidal computations. Maximum recorded parcel area is 24.50 ha.';
      } else if (lower.includes('small') || lower.includes('< 500') || lower.includes('sliver')) {
        structuredResultsTitle = 'Anomalously Small Features';
        structuredResults = [
          { rank: 1, featureId: 'P-0772', zoning: 'Unassigned', areaHa: 0.0014, areaM2: 14.2, centroid: [37.7630, -122.4180] },
        ];
        text = 'Detected 1 sliver polygon feature (P-0772) with area under 500 m². It exhibits an extreme perimeter-to-area ratio and may represent a digitization defect.';
      } else if (lower.includes('quality') || lower.includes('invalid') || lower.includes('topology')) {
        structuredResultsTitle = 'Topology Issues Flagged';
        structuredResults = [
          { rank: 1, featureId: 'P-0914', zoning: 'Cadastral Ring Error', areaHa: 4.82, areaM2: 48200, centroid: [37.7591, -122.4210] },
        ];
        text = 'Audit detected 1 severe topology error: Polygon P-0914 contains a self-intersecting boundary between vertices 12 and 18. Other 411 features are topological compliant.';
      } else {
        text = `Processed spatial query: "${prompt}". Evaluated all 412 geometric features across the active dataset with geodetic verification.`;
        structuredResultsTitle = 'Related Features';
        structuredResults = [
          { rank: 1, featureId: 'P-1042', zoning: 'Commercial C-2', areaHa: 12.48, areaM2: 124800, centroid: [37.7645, -122.4148] },
        ];
      }

      const mockResponse: AIMessage = {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        authorName: 'GeoMeasure Deterministic Engine (Dev Mode)',
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }) + ' UTC',
        planId: `GeoMeasure Spatial Execution Plan #${Math.floor(100 + Math.random() * 900)}`,
        latencyMs: Math.floor(120 + Math.random() * 80),
        datasetName: 'land_parcels_traverse_survey.zip',
        featureCount: 412,
        calculationMethod: 'Karney geodesic calculations on WGS 84 ellipsoid',
        text,
        structuredResultsTitle,
        structuredResultsMetricHeader: 'ST_Area(geography)',
        structuredResults,
      };

      return { data: mockResponse, isMock: true };
    }
  },
};
