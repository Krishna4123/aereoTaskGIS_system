import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { datasetService } from '../services/datasetService';
import { measurementService } from '../services/measurementService';
import { Dataset } from '../types/dataset';
import { GeoFeatureCollection, GeoFeature } from '../types/geometry';
import { GeospatialMap } from '../components/map/GeospatialMap';
import { FeatureTable } from '../components/dataset/FeatureTable';
import { FeatureInspector } from '../components/dataset/FeatureInspector';
import { LoadingState } from '../components/common/LoadingState';

export const AnalysisWorkspacePage: React.FC = () => {
  const { id = 'ds-land-parcels-01' } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [collection, setCollection] = useState<GeoFeatureCollection | null>(null);
  const [selectedFeatureId, setSelectedFeatureId] = useState<string | null>('P-1042');
  const [isTableCollapsed, setIsTableCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);

  // Layer toggles
  const [layerPolygons, setLayerPolygons] = useState(true);
  const [layerLines, setLayerLines] = useState(true);
  const [showLabels, setShowLabels] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    Promise.all([
      datasetService.getDatasetById(id),
      measurementService.getFeatures(id),
    ]).then(([dsRes, featRes]) => {
      if (!mounted) return;
      setDataset(dsRes.data);
      setCollection(featRes.data);
      setLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading || !collection) {
    return <LoadingState message="Loading geospatial layers..." subtext="Parsing vector features & geodesic geometry" />;
  }

  // Filter features based on layer toggles
  const visibleFeatures = collection.features.filter((f) => {
    if (!layerPolygons && f.geometry.type.includes('Polygon')) return false;
    if (!layerLines && f.geometry.type.includes('Line')) return false;
    return true;
  });

  const activeCollection: GeoFeatureCollection = {
    ...collection,
    features: visibleFeatures,
  };

  const selectedFeature = collection.features.find((f) => f.id === selectedFeatureId);

  const handleExportGeoJSON = () => {
    measurementService.exportGeoJSONBlob(collection, `${dataset?.name || 'export'}.geojson`);
  };

  const handleExportCSV = () => {
    measurementService.exportCSVBlob(collection.features, `${dataset?.name || 'manifest'}.csv`);
  };

  return (
    <div className="flex flex-col w-full h-[calc(100vh-3rem)] overflow-hidden">
      {/* Top Workspace Context Toolbar */}
      <div className="h-12 bg-surface-container-lowest px-4 flex items-center justify-between border-b border-outline-variant/30 flex-shrink-0 z-20 select-none">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="material-symbols-outlined text-primary text-[20px] flex-shrink-0">
              inventory_2
            </span>
            <span className="font-headline-sm text-headline-sm text-on-surface truncate font-semibold">
              {dataset?.name || 'land_parcels_traverse_survey.zip'}
            </span>
          </div>
          <div className="h-4 w-[1px] bg-outline-variant/40 hidden md:block" />
          <div className="hidden sm:flex items-center gap-1.5 flex-wrap">
            <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-medium">
              {dataset?.format === 'shapefile' ? 'Shapefile ZIP' : 'KML'}
            </span>
            <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-surface-container-high text-primary font-medium">
              {collection.features.length} features
            </span>
            <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-surface-container-low text-primary flex items-center gap-1 font-data-tabular">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              {dataset?.crs || 'EPSG:4326'} ({dataset?.crsName || 'WGS 84'})
            </span>
            <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-surface-container-low text-on-surface-variant flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse" />
              Status: Ready
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={handleExportGeoJSON}
            className="h-8 px-2.5 rounded-lg bg-surface hover:bg-surface-container-low text-on-surface font-label-md text-label-md flex items-center gap-1.5 transition-colors border border-outline-variant/30 shadow-xs"
          >
            <span className="material-symbols-outlined text-[16px] text-secondary">code_blocks</span>
            <span className="hidden md:inline">Export GeoJSON</span>
          </button>
          <button
            type="button"
            onClick={handleExportCSV}
            className="h-8 px-2.5 rounded-lg bg-surface hover:bg-surface-container-low text-on-surface font-label-md text-label-md flex items-center gap-1.5 transition-colors border border-outline-variant/30 shadow-xs"
          >
            <span className="material-symbols-outlined text-[16px] text-secondary">file_download</span>
            <span className="hidden md:inline">Export CSV</span>
          </button>
          <button
            type="button"
            onClick={() => navigate(`/datasets/${id}/report`)}
            className="h-8 px-2.5 rounded-lg bg-primary-container hover:bg-primary text-on-primary font-label-md text-label-md flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <span className="material-symbols-outlined text-[16px]">description</span>
            <span className="hidden md:inline">View Report</span>
          </button>
        </div>
      </div>

      {/* Primary Split GIS Workspace */}
      <div className="flex flex-1 min-h-0 relative">
        {/* Left Panel: Dataset Information & Layers (260px) */}
        <aside className="w-[260px] flex-shrink-0 bg-surface-container-lowest border-r border-outline-variant/30 flex flex-col justify-between overflow-y-auto z-10 select-none">
          <div className="p-3 space-y-4">
            {/* Section: Layer Summary */}
            <div>
              <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-outline-variant/20">
                <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider">
                  Layer Summary
                </span>
                <span className="font-data-tabular text-body-xs text-secondary">3 layers</span>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between p-1.5 rounded-lg bg-surface-container-low">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[16px]">polyline</span>
                    <span className="font-body-sm text-body-sm text-on-surface font-medium">Polygons</span>
                  </div>
                  <span className="font-data-tabular text-body-xs text-secondary">320 ftr (94.2%)</span>
                </div>
                <div className="flex items-center justify-between p-1.5 rounded-lg hover:bg-surface-container-low transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[16px]">show_chart</span>
                    <span className="font-body-sm text-body-sm text-on-surface">Lines</span>
                  </div>
                  <span className="font-data-tabular text-body-xs text-secondary">68 ftr (14.2 km)</span>
                </div>
                <div className="flex items-center justify-between p-1.5 rounded-lg hover:bg-surface-container-low transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[16px]">location_on</span>
                    <span className="font-body-sm text-body-sm text-on-surface">Points</span>
                  </div>
                  <span className="font-data-tabular text-body-xs text-secondary">24 benchmarks</span>
                </div>
              </div>
            </div>

            {/* Section: Spatial Extents BBox */}
            <div>
              <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-outline-variant/20">
                <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider">
                  Bounding Box (BBOX)
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedFeatureId(null)}
                  className="text-primary hover:underline font-label-sm text-label-sm font-medium"
                >
                  Full Extent
                </button>
              </div>
              <div className="bg-surface-container p-2 rounded-lg font-data-tabular text-body-xs space-y-1 text-on-surface-variant">
                <div className="flex justify-between items-center">
                  <span className="text-secondary">Min:</span>
                  <span>-122.4412, 37.7420</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-secondary">Max:</span>
                  <span>-122.3890, 37.7850</span>
                </div>
              </div>
            </div>

            {/* Section: Active Layers & Visibility */}
            <div>
              <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-outline-variant/20">
                <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider">
                  Layer Visibility
                </span>
                <span className="material-symbols-outlined text-secondary text-[16px]">visibility</span>
              </div>
              <div className="space-y-1">
                <label className="flex items-center justify-between p-1.5 rounded-lg bg-surface-container-high/40 hover:bg-surface-container-high cursor-pointer transition-colors">
                  <div className="flex items-center gap-2 min-w-0">
                    <input
                      type="checkbox"
                      checked={layerPolygons}
                      onChange={(e) => setLayerPolygons(e.target.checked)}
                      className="w-3.5 h-3.5 rounded text-primary-container focus:ring-0"
                    />
                    <span className="w-2.5 h-2.5 rounded-sm bg-primary-container flex-shrink-0" />
                    <span className="font-body-sm text-body-sm text-on-surface truncate">
                      Parcel Polygons
                    </span>
                  </div>
                  <span className="font-data-tabular text-body-xs text-secondary">320</span>
                </label>
                <label className="flex items-center justify-between p-1.5 rounded-lg hover:bg-surface-container-low cursor-pointer transition-colors">
                  <div className="flex items-center gap-2 min-w-0">
                    <input
                      type="checkbox"
                      checked={layerLines}
                      onChange={(e) => setLayerLines(e.target.checked)}
                      className="w-3.5 h-3.5 rounded text-primary-container focus:ring-0"
                    />
                    <span className="w-2.5 h-0.5 rounded-sm bg-secondary flex-shrink-0" />
                    <span className="font-body-sm text-body-sm text-on-surface truncate">
                      Cadastral Lot Lines
                    </span>
                  </div>
                  <span className="font-data-tabular text-body-xs text-secondary">68</span>
                </label>
                <label className="flex items-center justify-between p-1.5 rounded-lg hover:bg-surface-container-low cursor-pointer transition-colors">
                  <div className="flex items-center gap-2 min-w-0">
                    <input
                      type="checkbox"
                      checked={showLabels}
                      onChange={(e) => setShowLabels(e.target.checked)}
                      className="w-3.5 h-3.5 rounded text-primary-container focus:ring-0"
                    />
                    <span className="material-symbols-outlined text-[14px] text-secondary">label</span>
                    <span className="font-body-sm text-body-sm text-on-surface truncate">
                      Measurement Labels
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Section: Measurement Summary Footer */}
          <div className="p-3 bg-surface border-t border-outline-variant/30 space-y-2">
            <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider block">
              Cartographic Total
            </span>
            <div className="space-y-1 font-data-tabular text-body-xs">
              <div className="flex justify-between items-center">
                <span className="text-secondary">Area:</span>
                <span className="font-label-md text-label-md text-on-surface font-semibold">
                  342.60 ha (3.42 km²)
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-secondary">Perimeter:</span>
                <span className="font-label-md text-label-md text-on-surface font-semibold">
                  48.90 km
                </span>
              </div>
            </div>
            <p className="font-body-xs text-[11px] leading-tight text-secondary">
              Karney geodesic ellipsoidal computation applied.
            </p>
          </div>
        </aside>

        {/* Center Panel: Interactive Map & Bottom Feature Table */}
        <div className="flex-1 flex flex-col min-w-0 relative bg-surface-container-lowest overflow-hidden">
          <div className="flex-1 relative w-full h-full">
            <GeospatialMap
              collection={activeCollection}
              selectedFeatureId={selectedFeatureId}
              onSelectFeature={(featId) => setSelectedFeatureId(featId)}
              showLabels={showLabels}
            />
          </div>

          {/* Collapsible Bottom Feature Table */}
          <FeatureTable
            features={collection.features}
            selectedFeatureId={selectedFeatureId}
            onSelectFeature={(featId) => setSelectedFeatureId(featId)}
            isCollapsed={isTableCollapsed}
            onToggleCollapse={() => setIsTableCollapsed(!isTableCollapsed)}
          />
        </div>

        {/* Right Panel: Selected Feature Inspector (290px) */}
        <FeatureInspector
          feature={selectedFeature}
          onClose={() => setSelectedFeatureId(null)}
        />
      </div>
    </div>
  );
};
