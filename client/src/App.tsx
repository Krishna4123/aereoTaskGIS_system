import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { OverviewPage } from './pages/OverviewPage';
import { UploadPage } from './pages/UploadPage';
import { AnalysisWorkspacePage } from './pages/AnalysisWorkspacePage';
import { AIAnalystPage } from './pages/AIAnalystPage';
import { DataQualityPage } from './pages/DataQualityPage';
import { ReportPreviewPage } from './pages/ReportPreviewPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          {/* Page A: Overview Dashboard */}
          <Route path="/" element={<OverviewPage />} />

          {/* Page B: Upload Dataset */}
          <Route path="/upload" element={<UploadPage />} />

          {/* Page C: Dataset Analysis Workspace */}
          <Route path="/datasets/:id" element={<AnalysisWorkspacePage />} />

          {/* Page D: AI Analyst */}
          <Route path="/ai-analyst" element={<AIAnalystPage />} />

          {/* Page E: Data Quality */}
          <Route path="/datasets/:id/quality" element={<DataQualityPage />} />

          {/* Page F: Analysis Report */}
          <Route path="/datasets/:id/report" element={<ReportPreviewPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
