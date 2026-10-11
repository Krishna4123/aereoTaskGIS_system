import React, { useState } from 'react';
import { GeoFeature } from '../../types/geometry';

interface FeatureTableProps {
  features: GeoFeature[];
  selectedFeatureId?: string | null;
  onSelectFeature: (id: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const FeatureTable: React.FC<FeatureTableProps> = ({
  features,
  selectedFeatureId,
  onSelectFeature,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'polygon'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFeatures = features.filter((f) => {
    if (filterType === 'polygon' && !f.geometry.type.includes('Polygon')) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchId = f.id.toLowerCase().includes(term);
      const matchZoning = f.properties.zoning?.toLowerCase().includes(term);
      const matchLot = f.properties.lotId?.toLowerCase().includes(term);
      return matchId || matchZoning || matchLot;
    }
    return true;
  });

  return (
    <div
      className={`bg-surface-container-lowest border-t border-outline-variant/30 flex flex-col flex-shrink-0 z-20 transition-all duration-200 ${
        isCollapsed ? 'h-8' : 'h-48'
      }`}
    >
      {/* Table Control Strip */}
      <div className="h-8 px-3 border-b border-outline-variant/20 flex items-center justify-between bg-surface-container-low flex-shrink-0 select-none">
        <div className="flex items-center gap-3">
          <span className="font-label-sm text-label-sm text-on-surface uppercase tracking-wider flex items-center gap-1 font-semibold">
            <span className="material-symbols-outlined text-[16px] text-primary">table_chart</span>
            Features Table ({features.length} items)
          </span>
          <div className="h-3 w-[1px] bg-outline-variant/30" />
          <span className="font-body-xs text-body-xs text-secondary hidden sm:inline">Filter by:</span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className={`px-1.5 py-0.5 rounded text-[11px] transition-colors ${
                filterType === 'all'
                  ? 'bg-surface-container-high text-primary font-medium'
                  : 'text-secondary hover:bg-surface-container'
              }`}
            >
              All Types
            </button>
            <button
              type="button"
              onClick={() => setFilterType('polygon')}
              className={`px-1.5 py-0.5 rounded text-[11px] transition-colors ${
                filterType === 'polygon'
                  ? 'bg-surface-container-high text-primary font-medium'
                  : 'text-secondary hover:bg-surface-container'
              }`}
            >
              Polygons only
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-1.5 text-[14px] text-secondary">
              filter_alt
            </span>
            <input
              type="text"
              placeholder="Filter attribute..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-6 pl-5 pr-2 bg-surface text-body-xs rounded border border-outline-variant/30 text-on-surface focus:outline-none focus:border-primary-container w-32 sm:w-36 transition-all"
            />
          </div>
          {onToggleCollapse && (
            <button
              type="button"
              onClick={onToggleCollapse}
              className="w-6 h-6 flex items-center justify-center rounded text-secondary hover:text-on-surface"
              title={isCollapsed ? 'Expand Table' : 'Collapse Table'}
            >
              <span className="material-symbols-outlined text-[16px]">
                {isCollapsed ? 'expand_less' : 'expand_more'}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Table Viewport */}
      {!isCollapsed && (
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-surface-container font-label-sm text-label-sm text-secondary uppercase border-b border-outline-variant/20 z-10 select-none">
              <tr>
                <th className="px-3 py-1 font-medium">ID</th>
                <th className="px-3 py-1 font-medium">Type</th>
                <th className="px-3 py-1 font-medium">Area (ha)</th>
                <th className="px-3 py-1 font-medium">Perimeter (m)</th>
                <th className="px-3 py-1 font-medium">Vertices</th>
                <th className="px-3 py-1 font-medium">Zoning</th>
                <th className="px-3 py-1 font-medium">Topology Status</th>
              </tr>
            </thead>
            <tbody className="font-data-tabular text-body-xs divide-y divide-outline-variant/10 text-on-surface">
              {filteredFeatures.map((feature) => {
                const isSelected = feature.id === selectedFeatureId;
                return (
                  <tr
                    key={feature.id}
                    onClick={() => onSelectFeature(feature.id)}
                    className={`transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-surface-container-high/60 border-l-2 border-primary font-semibold'
                        : 'hover:bg-surface-container-low'
                    }`}
                  >
                    <td
                      className={`px-3 py-1.5 ${
                        isSelected ? 'text-primary font-semibold' : 'text-secondary font-medium'
                      }`}
                    >
                      {feature.id}
                    </td>
                    <td
                      className={`px-3 py-1.5 ${
                        isSelected ? 'text-primary font-medium' : 'text-secondary'
                      }`}
                    >
                      {feature.geometry.type}
                    </td>
                    <td className="px-3 py-1.5">
                      {feature.properties.areaHa !== undefined
                        ? feature.properties.areaHa.toFixed(2)
                        : '—'}
                    </td>
                    <td className="px-3 py-1.5">
                      {feature.properties.perimeterM !== undefined
                        ? feature.properties.perimeterM.toLocaleString()
                        : feature.properties.lengthM !== undefined
                        ? feature.properties.lengthM.toLocaleString()
                        : '—'}
                    </td>
                    <td className="px-3 py-1.5">{feature.properties.vertices ?? '—'}</td>
                    <td className="px-3 py-1.5">{feature.properties.zoning ?? '—'}</td>
                    <td className="px-3 py-1.5 text-primary font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {feature.properties.topologyStatus || 'Valid'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
