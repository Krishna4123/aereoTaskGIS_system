import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { reportService } from '../services/reportService';
import { QualityReport, ValidationIssue } from '../types/quality';
import { LoadingState } from '../components/common/LoadingState';

export const DataQualityPage: React.FC = () => {
  const { id = 'ds-land-parcels-01' } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [report, setReport] = useState<QualityReport | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'error' | 'warning' | 'valid'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [revalidating, setRevalidating] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;
    reportService.getQualityReport(id).then((res) => {
      if (!mounted) return;
      setReport(res.data);
      setLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, [id]);

  const handleRevalidate = async () => {
    setRevalidating(true);
    await reportService.revalidateDataset(id);
    setTimeout(() => {
      setRevalidating(false);
    }, 800);
  };

  const handleExportJSON = () => {
    if (report) {
      reportService.downloadQualityJSON(report);
    }
  };

  if (loading || !report) {
    return <LoadingState message="Auditing spatial topology..." subtext="Checking OGC Simple Features compliance" />;
  }

  const filteredIssues = report.issues.filter((issue) => {
    if (filterSeverity === 'error' && issue.severity !== 'error') return false;
    if (filterSeverity === 'warning' && issue.severity !== 'warning') return false;
    if (filterSeverity === 'valid') return false; // valid features don't have issues
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        issue.featureId.toLowerCase().includes(q) ||
        issue.issueType.toLowerCase().includes(q) ||
        issue.explanation.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="flex flex-col w-full">
      {/* Top Viewport Sub-Header & Controls */}
      <div className="px-space-xl pt-space-lg pb-space-md bg-surface-container-lowest border-b border-outline-variant/30 select-none">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-space-xs text-secondary font-label-sm text-label-sm uppercase tracking-wider mb-1">
              <span>Cadastral Topology Audit</span>
              <span>•</span>
              <span className="text-primary font-medium">{report.standard}</span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-semibold">
              Data Quality & Topology Inspector
            </h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 truncate">
              Validation report for{' '}
              <span className="font-label-md text-label-md text-on-surface bg-surface-container-low px-1.5 py-0.5 rounded font-mono">
                {report.datasetName}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-space-sm flex-shrink-0">
            <button
              type="button"
              disabled={revalidating}
              onClick={handleRevalidate}
              className="h-8 px-3 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md transition-all flex items-center gap-1.5 shadow-sm border border-outline-variant/30"
            >
              <span
                className={`material-symbols-outlined text-[16px] text-secondary ${
                  revalidating ? 'animate-spin' : ''
                }`}
              >
                cached
              </span>
              <span>{revalidating ? 'Evaluating...' : 'Re-validate Dataset'}</span>
            </button>
            <button
              type="button"
              onClick={handleExportJSON}
              className="h-8 px-3 rounded-lg bg-primary-container hover:bg-primary text-on-primary font-label-md text-label-md transition-all flex items-center gap-1.5 shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span>Export Quality Report (JSON)</span>
            </button>
          </div>
        </div>

        {/* 5 Compact Metric Cards matching Stitch */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-space-sm mt-space-lg">
          {/* Metric 1 */}
          <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col justify-between">
            <div className="flex items-center justify-between text-secondary">
              <span className="font-label-sm text-label-sm uppercase tracking-wider">Features Inspected</span>
              <span className="material-symbols-outlined text-[18px]">fact_check</span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-headline-lg text-headline-lg font-bold text-on-surface">
                {report.totalInspected}
              </span>
              <span className="font-label-sm text-label-sm text-secondary font-data-tabular">
                100% evaluated
              </span>
            </div>
          </div>

          {/* Metric 2 */}
          <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col justify-between">
            <div className="flex items-center justify-between text-secondary">
              <span className="font-label-sm text-label-sm uppercase tracking-wider">Valid Geometries</span>
              <span className="material-symbols-outlined text-[18px] text-primary">check_circle</span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-headline-lg text-headline-lg font-bold text-on-surface">
                {report.validGeometries}
              </span>
              <span className="font-label-sm text-label-sm text-primary font-medium font-data-tabular">
                99.5% pass
              </span>
            </div>
          </div>

          {/* Metric 3 (Error) */}
          <div className="p-space-md rounded-xl bg-error-container/30 flex flex-col justify-between border border-error/20">
            <div className="flex items-center justify-between text-error">
              <span className="font-label-sm text-label-sm uppercase tracking-wider">Invalid Geometries</span>
              <span className="material-symbols-outlined text-[18px]">error</span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-headline-lg text-headline-lg font-bold text-error">
                {report.invalidGeometries}
              </span>
              <span className="font-label-sm text-label-sm text-error font-medium font-data-tabular">
                0.24% failed
              </span>
            </div>
          </div>

          {/* Metric 4 (Warning) */}
          <div className="p-space-md rounded-xl bg-amber-50 flex flex-col justify-between border border-amber-200">
            <div className="flex items-center justify-between text-amber-800">
              <span className="font-label-sm text-label-sm uppercase tracking-wider">Potential Anomalies</span>
              <span className="material-symbols-outlined text-[18px]">warning</span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-headline-lg text-headline-lg font-bold text-amber-800">
                {report.anomalies}
              </span>
              <span className="font-label-sm text-label-sm text-amber-700 font-medium font-data-tabular">
                Outlier scale
              </span>
            </div>
          </div>

          {/* Metric 5 (CRS) */}
          <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col justify-between col-span-2 md:col-span-1">
            <div className="flex items-center justify-between text-secondary">
              <span className="font-label-sm text-label-sm uppercase tracking-wider">Reference System</span>
              <span className="material-symbols-outlined text-[18px]">public</span>
            </div>
            <div className="mt-2 flex flex-col">
              <span className="font-label-md text-label-md font-bold text-on-surface font-data-tabular">
                {report.crs}
              </span>
              <span className="font-label-sm text-label-sm text-secondary truncate">
                {report.crsName} Verified
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Space: Filter + Table */}
      <div className="px-space-xl py-space-lg flex flex-col gap-space-lg max-w-[1440px]">
        {/* Filter and Search Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md bg-surface-container-lowest p-space-sm rounded-xl shadow-sm border border-outline-variant/20">
          <div className="flex items-center gap-1 flex-wrap">
            <button
              type="button"
              onClick={() => setFilterSeverity('all')}
              className={`px-3 py-1.5 rounded-lg font-label-md text-label-md transition-all ${
                filterSeverity === 'all'
                  ? 'bg-surface-container-high text-primary font-semibold shadow-xs'
                  : 'hover:bg-surface-container text-on-surface-variant'
              }`}
            >
              All Issues ({report.issues.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterSeverity('error')}
              className={`px-3 py-1.5 rounded-lg font-label-md text-label-md transition-all ${
                filterSeverity === 'error'
                  ? 'bg-error-container text-on-error-container font-semibold shadow-xs'
                  : 'hover:bg-surface-container text-on-surface-variant'
              }`}
            >
              Errors ({report.invalidGeometries})
            </button>
            <button
              type="button"
              onClick={() => setFilterSeverity('warning')}
              className={`px-3 py-1.5 rounded-lg font-label-md text-label-md transition-all ${
                filterSeverity === 'warning'
                  ? 'bg-amber-100 text-amber-800 font-semibold shadow-xs'
                  : 'hover:bg-surface-container text-on-surface-variant'
              }`}
            >
              Warnings / Anomalies ({report.anomalies})
            </button>
            <button
              type="button"
              onClick={() => setFilterSeverity('valid')}
              className={`px-3 py-1.5 rounded-lg font-label-md text-label-md transition-all ${
                filterSeverity === 'valid'
                  ? 'bg-emerald-100 text-emerald-800 font-semibold shadow-xs'
                  : 'hover:bg-surface-container text-on-surface-variant'
              }`}
            >
              Valid Features ({report.validGeometries})
            </button>
          </div>
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-2.5 text-[16px] text-secondary">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by Parcel ID (e.g. P-0914)..."
              className="h-8 pl-8 pr-3 bg-surface-container-low rounded-lg font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary-container w-full sm:w-64 transition-all"
            />
          </div>
        </div>

        {/* Detected Issues Data Table */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden flex flex-col">
          <div className="px-space-md py-3 flex items-center justify-between bg-surface-container-low/50 border-b border-outline-variant/20">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-primary">rule</span>
              <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                Detected Topology Violations & Spatial Anomalies
              </span>
            </div>
            <span className="font-label-sm text-label-sm text-secondary">
              {filteredIssues.length} records requiring operator action
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container font-label-sm text-label-sm text-secondary uppercase tracking-wider select-none">
                <tr>
                  <th className="px-space-md py-2.5 font-semibold">Feature ID</th>
                  <th className="px-space-md py-2.5 font-semibold">Severity</th>
                  <th className="px-space-md py-2.5 font-semibold">Issue Type</th>
                  <th className="px-space-md py-2.5 min-w-[320px] font-semibold">Explanation</th>
                  <th className="px-space-md py-2.5 min-w-[260px] font-semibold">Suggested Action</th>
                  <th className="px-space-md py-2.5 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-low font-body-sm text-body-sm">
                {filteredIssues.map((issue) => (
                  <tr
                    key={issue.id}
                    className={`transition-colors ${
                      issue.severity === 'error' ? 'hover:bg-error-container/10' : 'hover:bg-amber-50/50'
                    }`}
                  >
                    <td className="px-space-md py-3 font-data-tabular text-data-tabular font-bold text-on-surface">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            issue.severity === 'error' ? 'bg-error' : 'bg-amber-600'
                          }`}
                        />
                        <span>Parcel #{issue.featureId}</span>
                      </div>
                    </td>
                    <td className="px-space-md py-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-label-sm text-label-sm font-semibold ${
                          issue.severity === 'error'
                            ? 'bg-error-container text-on-error-container'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[13px]">
                          {issue.severity === 'error' ? 'cancel' : 'warning'}
                        </span>
                        <span>{issue.severity === 'error' ? 'Error' : 'Warning'}</span>
                      </span>
                    </td>
                    <td className="px-space-md py-3 font-medium text-on-surface">
                      {issue.issueType}
                    </td>
                    <td className="px-space-md py-3 text-on-surface-variant font-body-xs text-body-xs leading-relaxed">
                      {issue.explanation}
                    </td>
                    <td className="px-space-md py-3 text-secondary font-body-xs text-body-xs">
                      {issue.suggestedAction}
                    </td>
                    <td className="px-space-md py-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => navigate(`/datasets/${id}`)}
                          className="h-7 px-2.5 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm transition-colors flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[14px]">map</span>
                          <span>Inspect on Map</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredIssues.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-secondary">
                      No issues match the selected filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
