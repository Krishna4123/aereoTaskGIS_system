export interface StructuredResultItem {
  rank: number;
  featureId: string;
  zoning?: string;
  notes?: string;
  centroid?: [number, number]; // [lat, lon]
  areaHa?: number;
  areaM2?: number;
  lengthM?: number;
}

export interface AIMessage {
  id: string;
  sender: 'user' | 'assistant';
  authorName: string;
  timestamp: string;
  text: string;
  planId?: string;
  latencyMs?: number;
  datasetName?: string;
  featureCount?: number;
  calculationMethod?: string;
  structuredResultsTitle?: string;
  structuredResultsMetricHeader?: string;
  structuredResults?: StructuredResultItem[];
}
