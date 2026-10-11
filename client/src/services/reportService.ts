import { apiClient } from './apiClient';
import { QualityReport } from '../types/quality';
import { MOCK_QUALITY_REPORT } from './mockData';

export const reportService = {
  async getQualityReport(datasetId: string): Promise<{ data: QualityReport; isMock: boolean }> {
    try {
      const response = await apiClient.get<QualityReport>(`/api/files/${datasetId}/quality/`);
      return { data: response.data, isMock: false };
    } catch {
      return { data: MOCK_QUALITY_REPORT, isMock: true };
    }
  },

  async revalidateDataset(datasetId: string): Promise<{ success: boolean; isMock: boolean }> {
    try {
      await apiClient.post(`/api/files/${datasetId}/revalidate/`);
      return { success: true, isMock: false };
    } catch {
      return { success: true, isMock: true };
    }
  },

  downloadQualityJSON(report: QualityReport): void {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(report, null, 2));
    const a = document.createElement('a');
    a.setAttribute('href', dataStr);
    a.setAttribute('download', `quality_report_${report.datasetId}.json`);
    document.body.appendChild(a);
    a.click();
    a.remove();
  },
};
