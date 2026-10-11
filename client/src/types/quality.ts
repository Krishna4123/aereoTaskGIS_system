export type IssueSeverity = 'error' | 'warning' | 'info';

export interface ValidationIssue {
  id: string;
  featureId: string;
  severity: IssueSeverity;
  issueType: string;
  explanation: string;
  suggestedAction: string;
  coordinates?: [number, number]; // [lat, lon]
}

export interface QualityReport {
  datasetId: string;
  datasetName: string;
  totalInspected: number;
  validGeometries: number;
  invalidGeometries: number;
  anomalies: number;
  crs: string;
  crsName: string;
  issues: ValidationIssue[];
  evaluationDate: string;
  standard: string;
}
