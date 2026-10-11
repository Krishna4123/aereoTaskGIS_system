import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { datasetService } from '../services/datasetService';
import { Dataset, DatasetMetrics } from '../types/dataset';
import { LoadingState } from '../components/common/LoadingState';
import { formatDate } from '../utils/formatters';

export const OverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [metrics, setMetrics] = useState<DatasetMetrics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [formatFilter, setFormatFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isMockData, setIsMockData] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;
    Promise.all([datasetService.getDatasets(), datasetService.getMetrics()]).then(
      ([datasetsRes, metricsRes]) => {
        if (!mounted) return;
        setDatasets(datasetsRes.data);
        setMetrics(metricsRes.data);
        setIsMockData(datasetsRes.isMock);
        setLoading(false);
      }
    );
    return () => {
      mounted = false;
    };
  }, []);

  const filteredDatasets = datasets.filter((d) => {
    if (formatFilter !== 'all' && d.format !== formatFilter) return false;
    if (statusFilter !== 'all' && d.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        d.name.toLowerCase().includes(q) ||
        d.crs.toLowerCase().includes(q) ||
        (d.crsName && d.crsName.toLowerCase().includes(q))
      );
    }
    return true;
  });

  if (loading) {
    return <LoadingState message="Loading geospatial workspaces..." />;
  }

  return (
    <div className="flex flex-col w-full">
      <div className="p-space-lg max-w-[1540px] mx-auto w-full flex flex-col gap-space-lg">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md pb-space-xs">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Overview</h1>
              {isMockData && (
                <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                  Demo Preview Mode
                </span>
              )}
            </div>
            <p className="font-body-xs text-body-xs text-secondary mt-0.5">
              Your geospatial workspace • telemetry and spatial processing telemetry
            </p>
          </div>
          <div className="flex items-center gap-space-xs flex-wrap">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="h-8 px-3 rounded-lg bg-surface-container-low text-on-surface-variant font-label-md text-label-md hover:bg-surface-container transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">sync</span>
              <span>Sync Storage</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/upload')}
              className="h-8 px-3.5 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md hover:bg-primary transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>Upload Dataset</span>
            </button>
          </div>
        </div>

        {/* Summary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md">
          {/* Metric 1 */}
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider">
                Total Datasets
              </span>
              <div className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center text-primary flex-shrink-0">
                <span className="material-symbols-outlined text-[18px]">folder_zip</span>
              </div>
            </div>
            <div className="mt-space-md flex flex-col">
              <div className="flex items-baseline gap-2">
                <span className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-data-tabular">
                  {metrics?.totalDatasets ?? 28}
                </span>
                <span className="font-label-sm text-label-sm text-primary font-data-tabular">+4 this month</span>
              </div>
              <span className="font-body-xs text-body-xs text-secondary mt-1">
                26 active • 2 pending cache
              </span>
            </div>
          </div>

          {/* Metric 2 */}
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider">
                Total Features Processed
              </span>
              <div className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center text-secondary flex-shrink-0">
                <span className="material-symbols-outlined text-[18px]">pin_drop</span>
              </div>
            </div>
            <div className="mt-space-md flex flex-col">
              <div className="flex items-baseline gap-2">
                <span className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-data-tabular">
                  {metrics?.totalFeatures ? metrics.totalFeatures.toLocaleString() : '14,892'}
                </span>
                <span className="font-label-sm text-label-sm text-secondary font-data-tabular">99.2% parsed</span>
              </div>
              <span className="font-body-xs text-body-xs text-secondary mt-1">Polygons, Lines & Points</span>
            </div>
          </div>

          {/* Metric 3 */}
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider">
                Total Polygon Area Analyzed
              </span>
              <div className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center text-secondary flex-shrink-0">
                <span className="material-symbols-outlined text-[18px]">hexagon</span>
              </div>
            </div>
            <div className="mt-space-md flex flex-col">
              <div className="flex items-baseline gap-2">
                <span className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-data-tabular">
                  {metrics?.totalPolygonAreaHa ? metrics.totalPolygonAreaHa.toLocaleString() : '3,482.16'}{' '}
                  <span className="font-body-sm text-body-sm text-secondary">ha</span>
                </span>
              </div>
              <span className="font-body-xs text-body-xs text-secondary mt-1">34.82 km² computed area</span>
            </div>
          </div>

          {/* Metric 4 */}
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider">
                Total Line Length Analyzed
              </span>
              <div className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center text-secondary flex-shrink-0">
                <span className="material-symbols-outlined text-[18px]">timeline</span>
              </div>
            </div>
            <div className="mt-space-md flex flex-col">
              <div className="flex items-baseline gap-2">
                <span className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-data-tabular">
                  {metrics?.totalLineLengthKm ? metrics.totalLineLengthKm.toFixed(2) : '892.40'}{' '}
                  <span className="font-body-sm text-body-sm text-secondary">km</span>
                </span>
              </div>
              <span className="font-body-xs text-body-xs text-secondary mt-1">Geodetic geodesic WGS84</span>
            </div>
          </div>
        </div>

        {/* Active Spatial Overview Canvas / Mini Vis Strip */}
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col lg:flex-row gap-space-lg items-stretch">
          <div className="lg:w-2/3 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-space-xs">
              <div className="flex items-center gap-space-xs">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="font-label-md text-label-md text-on-surface font-semibold">
                  Spatial Survey Coverage Overview
                </span>
                <span className="font-label-sm text-label-sm text-secondary bg-surface-container px-2 py-0.5 rounded">
                  Live Vector Projection
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-body-xs text-body-xs text-secondary">
                  Viewport: Americas / UTM 18N
                </span>
              </div>
            </div>

            {/* Stylized Cartographic Vector Graphic matching Stitch design */}
            <div className="relative w-full h-44 rounded-lg bg-surface-container-low overflow-hidden flex items-center justify-center mt-2">
              <svg className="w-full h-full text-secondary opacity-30" fill="none" viewBox="0 0 800 240">
                <defs>
                  <pattern id="overview-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                    <path d="M 30 0 L 0 0 0 30" fill="none" stroke="currentColor" strokeDasharray="2 2" strokeWidth="0.75" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#overview-grid)" />
                <path d="M 80,180 Q 220,40 380,120 T 680,80" fill="none" opacity="0.8" stroke="#2563eb" strokeDasharray="4 3" strokeWidth="2" />
                <polygon fill="#2563eb" fillOpacity="0.12" points="180,140 260,80 340,110 310,170 200,165" stroke="#2563eb" strokeWidth="1.5" />
                <polygon fill="#2563eb" fillOpacity="0.15" points="430,90 520,70 560,130 470,160 410,120" stroke="#2563eb" strokeWidth="1.5" />
                <polygon fill="#bc4800" fillOpacity="0.15" points="620,110 710,60 740,140 650,150" stroke="#bc4800" strokeWidth="1.5" />
                <circle cx="260" cy="80" fill="#004ac6" r="3.5" />
                <circle cx="340" cy="110" fill="#004ac6" r="3.5" />
                <circle cx="520" cy="70" fill="#004ac6" r="3.5" />
                <circle cx="710" cy="60" fill="#ba1a1a" r="3.5" />
              </svg>
              <div className="absolute bottom-2 left-2 bg-surface-container-lowest/90 backdrop-blur px-2.5 py-1 rounded shadow-sm flex items-center gap-3 text-secondary font-data-tabular text-data-tabular">
                <span>Lat: 38.8951° N</span>
                <span>Lon: 77.0364° W</span>
                <span className="text-primary font-label-sm text-label-sm font-semibold">3 Active Vector Layers</span>
              </div>
            </div>
          </div>

          {/* Quick Analysis Breakdown */}
          <div className="lg:w-1/3 flex flex-col justify-between bg-surface-container-low p-space-md rounded-lg">
            <div>
              <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider">
                Storage & Integrity
              </span>
              <div className="mt-space-sm flex flex-col gap-2">
                <div className="flex justify-between items-center text-body-xs font-body-xs">
                  <span className="text-on-surface-variant">GeoPackage & Shapefile Cache</span>
                  <span className="font-data-tabular text-data-tabular text-on-surface">1.82 GB / 5 GB</span>
                </div>
                <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                  <div className="bg-primary-container h-full rounded-full" style={{ width: '36.4%' }} />
                </div>
              </div>
              <div className="mt-space-md grid grid-cols-2 gap-space-xs text-body-xs font-body-xs">
                <div className="bg-surface-container-lowest p-2 rounded">
                  <span className="text-secondary block font-label-sm text-label-sm">Valid Geometry</span>
                  <span className="font-headline-sm text-headline-sm text-on-surface font-data-tabular font-bold">
                    98.4%
                  </span>
                </div>
                <div className="bg-surface-container-lowest p-2 rounded">
                  <span className="text-secondary block font-label-sm text-label-sm">CRS Matched</span>
                  <span className="font-headline-sm text-headline-sm text-on-surface font-data-tabular font-bold">
                    27 / 28
                  </span>
                </div>
              </div>
            </div>
            <div className="pt-space-sm flex items-center justify-between text-body-xs font-body-xs">
              <span className="text-secondary">AI Topology Health:</span>
              <span className="font-label-md text-label-md text-primary flex items-center gap-1 font-semibold">
                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                High Confidence
              </span>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar Section */}
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-space-md">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[260px]">
            <span className="material-symbols-outlined absolute left-2.5 top-2 text-[18px] text-secondary">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter datasets by name or CRS..."
              className="w-full h-8 pl-8 pr-3 bg-surface-container-low rounded-lg font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container transition-all"
            />
          </div>

          {/* Filters Row */}
          <div className="flex items-center gap-space-xs flex-wrap">
            {/* Format Pills */}
            <div className="flex items-center bg-surface-container-low p-0.5 rounded-lg">
              <button
                type="button"
                onClick={() => setFormatFilter('all')}
                className={`px-2.5 py-1 rounded font-label-sm text-label-sm transition-all ${
                  formatFilter === 'all'
                    ? 'bg-surface-container-lowest text-primary shadow-sm font-semibold'
                    : 'text-secondary hover:text-on-surface'
                }`}
              >
                All formats ({datasets.length})
              </button>
              <button
                type="button"
                onClick={() => setFormatFilter('kml')}
                className={`px-2.5 py-1 rounded font-label-sm text-label-sm transition-all ${
                  formatFilter === 'kml'
                    ? 'bg-surface-container-lowest text-primary shadow-sm font-semibold'
                    : 'text-secondary hover:text-on-surface'
                }`}
              >
                KML
              </button>
              <button
                type="button"
                onClick={() => setFormatFilter('shapefile')}
                className={`px-2.5 py-1 rounded font-label-sm text-label-sm transition-all ${
                  formatFilter === 'shapefile'
                    ? 'bg-surface-container-lowest text-primary shadow-sm font-semibold'
                    : 'text-secondary hover:text-on-surface'
                }`}
              >
                Shapefile ZIP
              </button>
            </div>

            <span className="w-px h-5 bg-surface-container mx-1 hidden sm:block" />

            {/* Status Filter Pills */}
            <div className="flex items-center bg-surface-container-low p-0.5 rounded-lg">
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={`px-2 py-1 rounded font-label-sm text-label-sm transition-all ${
                  statusFilter === 'all'
                    ? 'bg-surface-container-lowest text-on-surface shadow-sm font-semibold'
                    : 'text-secondary hover:text-on-surface'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('completed')}
                className={`px-2 py-1 rounded font-label-sm text-label-sm transition-all ${
                  statusFilter === 'completed'
                    ? 'bg-surface-container-lowest text-on-surface shadow-sm font-semibold'
                    : 'text-secondary hover:text-on-surface'
                }`}
              >
                Completed
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('processing')}
                className={`px-2 py-1 rounded font-label-sm text-label-sm transition-all ${
                  statusFilter === 'processing'
                    ? 'bg-surface-container-lowest text-on-surface shadow-sm font-semibold'
                    : 'text-secondary hover:text-on-surface'
                }`}
              >
                Processing
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('flagged')}
                className={`px-2 py-1 rounded font-label-sm text-label-sm transition-all ${
                  statusFilter === 'flagged'
                    ? 'bg-surface-container-lowest text-on-surface shadow-sm font-semibold'
                    : 'text-secondary hover:text-on-surface'
                }`}
              >
                Issues
              </button>
            </div>
          </div>
        </div>

        {/* Recent Datasets Data Table */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="px-space-md py-space-sm flex items-center justify-between bg-surface-container-lowest">
            <div className="flex items-center gap-space-xs">
              <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                Recent Datasets
              </span>
              <span className="font-label-sm text-label-sm text-secondary bg-surface-container px-2 py-0.5 rounded font-data-tabular">
                {filteredDatasets.length} displayed
              </span>
            </div>
            <div className="flex items-center gap-space-xs">
              <button
                type="button"
                className="h-7 px-2 rounded bg-surface-container-low text-secondary hover:text-on-surface font-body-xs text-body-xs flex items-center gap-1 transition-colors"
              >
                <span className="material-symbols-outlined text-[15px]">file_download</span>
                <span>Export Manifest</span>
              </button>
            </div>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low text-secondary font-label-sm text-label-sm uppercase tracking-wider select-none">
                  <th className="py-2.5 px-space-md font-semibold">Dataset Name</th>
                  <th className="py-2.5 px-space-md font-semibold">Format</th>
                  <th className="py-2.5 px-space-md font-semibold text-right">Features</th>
                  <th className="py-2.5 px-space-md font-semibold">CRS</th>
                  <th className="py-2.5 px-space-md font-semibold">Status</th>
                  <th className="py-2.5 px-space-md font-semibold">Upload Date</th>
                  <th className="py-2.5 px-space-md font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y-0 text-body-sm font-body-sm text-on-surface">
                {filteredDatasets.map((ds) => (
                  <tr
                    key={ds.id}
                    className="hover:bg-surface-container-low/60 transition-colors group"
                  >
                    <td className="py-2.5 px-space-md min-w-[220px]">
                      <div className="flex items-center gap-space-xs">
                        <span className="material-symbols-outlined text-[18px] text-primary flex-shrink-0">
                          {ds.format === 'shapefile' ? 'folder_zip' : 'code'}
                        </span>
                        <div className="flex flex-col min-w-0">
                          <span
                            onClick={() => navigate(`/datasets/${ds.id}`)}
                            className="font-label-md text-label-md text-on-surface truncate group-hover:text-primary transition-colors cursor-pointer font-medium"
                          >
                            {ds.name}
                          </span>
                          <span className="font-body-xs text-body-xs text-secondary font-data-tabular">
                            {(ds.sizeBytes / (1024 * 1024)).toFixed(1)} MB • {ds.geometryTypes.join(', ')}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-space-md whitespace-nowrap">
                      <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-medium">
                        {ds.format === 'shapefile' ? 'Shapefile' : 'KML'}
                      </span>
                    </td>
                    <td className="py-2.5 px-space-md text-right font-data-tabular text-data-tabular whitespace-nowrap">
                      {ds.featureCount}
                    </td>
                    <td className="py-2.5 px-space-md whitespace-nowrap">
                      <div className="flex items-center gap-1 font-data-tabular text-data-tabular">
                        <span className="text-on-surface">{ds.crs}</span>
                        <span className="text-secondary">({ds.crsName || 'WGS 84'})</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-space-md whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-label-sm text-label-sm ${
                          ds.status === 'completed'
                            ? 'bg-surface-container text-primary font-medium'
                            : ds.status === 'processing'
                            ? 'bg-amber-100 text-amber-800 font-medium'
                            : 'bg-red-100 text-red-800 font-medium'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            ds.status === 'completed'
                              ? 'bg-primary'
                              : ds.status === 'processing'
                              ? 'bg-amber-600 animate-pulse'
                              : 'bg-red-600'
                          }`}
                        />
                        {ds.status.charAt(0).toUpperCase() + ds.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-2.5 px-space-md font-data-tabular text-data-tabular text-secondary whitespace-nowrap">
                      {formatDate(ds.uploadDate)}
                    </td>
                    <td className="py-2.5 px-space-md text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => navigate(`/datasets/${ds.id}`)}
                          className="h-6 px-2 rounded bg-surface-container text-primary hover:bg-surface-container-high font-label-sm text-label-sm transition-colors flex items-center gap-1 font-medium"
                        >
                          <span className="material-symbols-outlined text-[14px]">layers</span>
                          <span>Workspace</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => navigate(`/datasets/${ds.id}/report`)}
                          className="h-6 px-2 rounded bg-surface-container-low text-secondary hover:text-on-surface font-label-sm text-label-sm transition-colors"
                        >
                          Report
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
