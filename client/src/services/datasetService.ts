import { apiClient } from './apiClient';
import { Dataset, DatasetMetrics } from '../types/dataset';
import { MOCK_DATASETS, MOCK_METRICS } from './mockData';

export interface UploadProgressCallback {
  (progressPercent: number, statusText: string): void;
}

export const datasetService = {
  async getMetrics(): Promise<{ data: DatasetMetrics; isMock: boolean }> {
    try {
      const response = await apiClient.get<DatasetMetrics>('/api/files/metrics/');
      return { data: response.data, isMock: false };
    } catch {
      return { data: MOCK_METRICS, isMock: true };
    }
  },

  async getDatasets(): Promise<{ data: Dataset[]; isMock: boolean }> {
    try {
      const response = await apiClient.get<Dataset[]>('/api/files/');
      return { data: response.data, isMock: false };
    } catch {
      return { data: MOCK_DATASETS, isMock: true };
    }
  },

  async getDatasetById(id: string): Promise<{ data: Dataset | null; isMock: boolean }> {
    try {
      const response = await apiClient.get<Dataset>(`/api/files/${id}/`);
      return { data: response.data, isMock: false };
    } catch {
      const found = MOCK_DATASETS.find((d) => d.id === id) || MOCK_DATASETS[0];
      return { data: found, isMock: true };
    }
  },

  async uploadFile(
    file: File,
    onProgress?: UploadProgressCallback
  ): Promise<{ datasetId: string; status: string; isMock: boolean }> {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await apiClient.post('/api/files/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total && onProgress) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(percent, 'Uploading to GIS pipeline...');
          }
        },
      });
      return {
        datasetId: response.data?.id || 'ds-uploaded',
        status: response.data?.status || 'processing',
        isMock: false,
      };
    } catch (err: any) {
      // If server is not responding, reject so the user is informed
      // The upload page will display error state and optional retry
      throw new Error(err.response?.data?.message || err.message || 'Network upload failed');
    }
  },
};
