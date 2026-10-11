import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GeoFeature } from '../../types/geometry';

interface FeatureInspectorProps {
  feature?: GeoFeature | null;
  onClose?: () => void;
}

export const FeatureInspector: React.FC<FeatureInspectorProps> = ({ feature, onClose }) => {
  const navigate = useNavigate();

  if (!feature) {
    return (
      <aside className="w-[290px] flex-shrink-0 bg-surface-container-lowest border-l border-outline-variant/30 flex flex-col justify-center items-center p-6 text-center select-none">
        <span className="material-symbols-outlined text-[36px] text-secondary mb-2">touch_app</span>
        <span className="font-label-md text-label-md text-on-surface">No Feature Selected</span>
        <span className="font-body-xs text-body-xs text-secondary mt-1">
          Click any vector geometry on the map or select a row in the features table.
        </span>
      </aside>
    );
  }

  const props = feature.properties;
  const isPolygon = feature.geometry.type.includes('Polygon');

  return (
    <aside className="w-[290px] flex-shrink-0 bg-surface-container-lowest border-l border-outline-variant/30 flex flex-col justify-between overflow-y-auto z-10 select-none">
      <div className="p-3.5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px] text-primary">select_window</span>
            <span className="font-headline-sm text-headline-sm text-on-surface">Feature Inspector</span>
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="w-6 h-6 flex items-center justify-center rounded text-secondary hover:text-on-surface hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>

        {/* Selected Badge */}
        <div className="p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30">
          <div className="flex items-center justify-between mb-1">
            <span className="font-label-md text-label-md text-primary font-bold">
              Parcel #{feature.id}
            </span>
            <span className="font-label-sm text-label-sm px-1.5 py-0.5 rounded bg-surface-container text-secondary">
              {feature.geometry.type}
            </span>
          </div>
          <span className="font-body-xs text-body-xs text-secondary block leading-relaxed">
            {props.notes || 'Traverse loop closed with 0.002m residual error.'}
          </span>
        </div>

        {/* Calculated Measurements */}
        <div className="space-y-2">
          <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider block">
            Geometric Calculations
          </span>
          <div className="bg-surface-container p-2.5 rounded-lg space-y-2 font-data-tabular">
            {isPolygon ? (
              <div>
                <span className="font-body-xs text-body-xs text-secondary block">Geodesic Area</span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-headline-md font-headline-md text-on-surface font-bold">
                    {props.areaHa !== undefined ? props.areaHa.toFixed(2) : '—'}
                  </span>
                  <span className="font-body-sm text-body-sm text-secondary">ha</span>
                </div>
                <span className="font-body-xs text-[11px] text-secondary">
                  {props.areaM2 ? `${props.areaM2.toLocaleString()} m²` : ''} •{' '}
                  {props.areaHa ? `${(props.areaHa * 2.47105).toFixed(2)} acres` : ''}
                </span>
              </div>
            ) : (
              <div>
                <span className="font-body-xs text-body-xs text-secondary block">Geodesic Length</span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-headline-md font-headline-md text-on-surface font-bold">
                    {props.lengthM ? props.lengthM.toLocaleString() : '—'}
                  </span>
                  <span className="font-body-sm text-body-sm text-secondary">m</span>
                </div>
              </div>
            )}

            <div className="h-[1px] bg-outline-variant/20" />
            <div className="flex justify-between items-center">
              <div>
                <span className="font-body-xs text-body-xs text-secondary block">Perimeter</span>
                <span className="font-label-md text-label-md text-on-surface">
                  {props.perimeterM ? `${props.perimeterM.toLocaleString()} m` : '—'}
                </span>
              </div>
              <div className="text-right">
                <span className="font-body-xs text-body-xs text-secondary block">Nodes</span>
                <span className="font-label-md text-label-md text-on-surface">
                  {props.vertices ?? 4} vertices
                </span>
              </div>
            </div>

            <div className="h-[1px] bg-outline-variant/20" />
            <div>
              <span className="font-body-xs text-body-xs text-secondary block">Centroid Coordinate</span>
              <span className="font-body-xs text-body-xs text-on-surface">
                37.7645° N, -122.4148° W
              </span>
            </div>
          </div>
        </div>

        {/* Original Dataset Attributes */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider">
              Source Attributes
            </span>
            <span className="font-body-xs text-[11px] text-secondary">5 fields</span>
          </div>
          <div className="border border-outline-variant/20 rounded-lg overflow-hidden font-data-tabular text-body-xs">
            <div className="flex justify-between p-2 bg-surface border-b border-outline-variant/10">
              <span className="text-secondary">LOT_ID</span>
              <span className="font-medium text-on-surface">{props.lotId || '0412-A'}</span>
            </div>
            <div className="flex justify-between p-2 bg-surface-container-lowest border-b border-outline-variant/10">
              <span className="text-secondary">ZONING</span>
              <span className="font-medium text-on-surface">
                {props.zoning || 'Commercial / Mixed-Use C-2'}
              </span>
            </div>
            <div className="flex justify-between p-2 bg-surface border-b border-outline-variant/10">
              <span className="text-secondary">ASSESSOR_VAL</span>
              <span className="font-medium text-on-surface">{props.assessorVal || '$2,480,000'}</span>
            </div>
            <div className="flex justify-between p-2 bg-surface-container-lowest border-b border-outline-variant/10">
              <span className="text-secondary">SURVEY_DATE</span>
              <span className="font-medium text-on-surface">{props.surveyDate || '2024-03-14'}</span>
            </div>
            <div className="flex justify-between p-2 bg-surface">
              <span className="text-secondary">TOPOLOGY</span>
              <span className="font-medium text-primary">
                {props.topologyStatus === 'Valid' ? 'Valid Ring' : props.topologyStatus || 'Valid Ring'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Commands */}
      <div className="p-3 bg-surface border-t border-outline-variant/30 space-y-1.5">
        <div className="grid grid-cols-2 gap-1.5">
          <button
            type="button"
            className="h-8 px-2 rounded-lg bg-surface hover:bg-surface-container-low text-on-surface font-label-md text-label-md border border-outline-variant/30 flex items-center justify-center gap-1 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px] text-secondary">my_location</span>
            <span>Center</span>
          </button>
          <button
            type="button"
            onClick={() => navigator.clipboard.writeText(`37.7645, -122.4148`)}
            className="h-8 px-2 rounded-lg bg-surface hover:bg-surface-container-low text-on-surface font-label-md text-label-md border border-outline-variant/30 flex items-center justify-center gap-1 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px] text-secondary">content_copy</span>
            <span>Copy Coords</span>
          </button>
        </div>
        <button
          type="button"
          onClick={() => navigate('/ai-analyst')}
          className="w-full h-8.5 px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md flex items-center justify-center gap-1.5 transition-colors shadow-sm"
        >
          <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
          <span>Ask AI About Parcel #{feature.id}</span>
        </button>
      </div>
    </aside>
  );
};
