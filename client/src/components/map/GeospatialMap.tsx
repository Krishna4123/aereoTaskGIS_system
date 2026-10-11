import React, { useEffect, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Polygon,
  Polyline,
  Marker,
  Popup,
  useMap,
} from 'react-leaflet';
import L, { LatLngExpression, LatLngBoundsExpression } from 'leaflet';
import { GeoFeature, GeoFeatureCollection } from '../../types/geometry';
import { geoJsonPolygonToLeaflet, geoJsonLineToLeaflet, bboxToLeafletBounds } from '../../utils/geoUtils';

// Fix Leaflet's default icon path issue in bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface GeospatialMapProps {
  collection: GeoFeatureCollection;
  selectedFeatureId?: string | null;
  onSelectFeature?: (featureId: string) => void;
  className?: string;
  showLabels?: boolean;
}

type BasemapType = 'light' | 'topo' | 'satellite' | 'canvas';

// Helper component to auto-fit map bounds
function MapBoundsController({ bbox }: { bbox?: [number, number, number, number] }) {
  const map = useMap();

  useEffect(() => {
    if (bbox) {
      const bounds = bboxToLeafletBounds(bbox);
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 16 });
    }
  }, [bbox, map]);

  return null;
}

// Helper component for live coordinate tracking
function MapCoordinateTracker({
  onCoordsChange,
}: {
  onCoordsChange: (lat: number, lon: number, zoom: number) => void;
}) {
  const map = useMap();

  useEffect(() => {
    const handleMove = () => {
      const center = map.getCenter();
      onCoordsChange(center.lat, center.lng, map.getZoom());
    };
    map.on('move', handleMove);
    handleMove();
    return () => {
      map.off('move', handleMove);
    };
  }, [map, onCoordsChange]);

  return null;
}

// Map Controls Controller
function MapControlsHUD({
  onResetView,
}: {
  onResetView: () => void;
}) {
  const map = useMap();

  return (
    <div className="absolute top-3 left-3 flex flex-col gap-1 shadow-sm rounded-lg bg-surface-container-lowest border border-outline-variant/30 p-1 z-[1000]">
      <button
        type="button"
        onClick={() => map.zoomIn()}
        className="w-7 h-7 flex items-center justify-center rounded hover:bg-surface-container text-on-surface transition-colors"
        title="Zoom In"
      >
        <span className="material-symbols-outlined text-[18px]">add</span>
      </button>
      <button
        type="button"
        onClick={() => map.zoomOut()}
        className="w-7 h-7 flex items-center justify-center rounded hover:bg-surface-container text-on-surface transition-colors"
        title="Zoom Out"
      >
        <span className="material-symbols-outlined text-[18px]">remove</span>
      </button>
      <div className="h-[1px] w-full bg-outline-variant/30 my-0.5" />
      <button
        type="button"
        onClick={onResetView}
        className="w-7 h-7 flex items-center justify-center rounded hover:bg-surface-container text-on-surface transition-colors"
        title="Reset View / Fit Bounds"
      >
        <span className="material-symbols-outlined text-[18px]">crop_free</span>
      </button>
      <button
        type="button"
        className="w-7 h-7 flex items-center justify-center rounded bg-surface-container-high text-primary transition-colors"
        title="Distance / Area Measure"
      >
        <span className="material-symbols-outlined text-[18px]">straighten</span>
      </button>
      <button
        type="button"
        className="w-7 h-7 flex items-center justify-center rounded hover:bg-surface-container text-on-surface transition-colors"
        title="Select Polygon"
      >
        <span className="material-symbols-outlined text-[18px]">highlight_alt</span>
      </button>
    </div>
  );
}

export const GeospatialMap: React.FC<GeospatialMapProps> = ({
  collection,
  selectedFeatureId,
  onSelectFeature,
  className = 'w-full h-full',
  showLabels = true,
}) => {
  const [basemap, setBasemap] = useState<BasemapType>('light');
  const [coords, setCoords] = useState<{ lat: number; lon: number; zoom: number }>({
    lat: 37.7642,
    lon: -122.4150,
    zoom: 14,
  });

  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);

  const resetBounds = () => {
    if (mapInstance && collection.bbox) {
      mapInstance.fitBounds(bboxToLeafletBounds(collection.bbox), { padding: [40, 40] });
    }
  };

  const selectedFeature = collection.features.find((f) => f.id === selectedFeatureId);

  // Basemap Tile URLs
  const tileUrls: Record<BasemapType, { url: string; attribution: string } | null> = {
    light: {
      url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    },
    topo: {
      url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      attribution: '&copy; OpenStreetMap contributors, SRTM',
    },
    satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    },
    canvas: null,
  };

  return (
    <div className={`relative overflow-hidden bg-surface-container-low select-none ${className}`}>
      {/* If Canvas Only mode, show stylized subtle cartographic grid background */}
      {basemap === 'canvas' && (
        <div className="absolute inset-0 pointer-events-none opacity-40 z-0">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="carto-grid" width="80" height="80" patternUnits="userSpaceOnUse">
                <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#c3c6d7" strokeDasharray="3 3" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#carto-grid)" />
          </svg>
        </div>
      )}

      {/* Main Leaflet Map */}
      <MapContainer
        center={[37.7642, -122.4150]}
        zoom={14}
        zoomControl={false}
        attributionControl={false}
        className="w-full h-full z-10"
        ref={setMapInstance}
      >
        {tileUrls[basemap] && (
          <TileLayer
            url={tileUrls[basemap]!.url}
            attribution={tileUrls[basemap]!.attribution}
            maxZoom={19}
          />
        )}

        <MapBoundsController bbox={collection.bbox} />
        <MapCoordinateTracker
          onCoordsChange={(lat, lon, zoom) => setCoords({ lat, lon, zoom })}
        />
        <MapControlsHUD onResetView={resetBounds} />

        {/* Render Vector Features */}
        {collection.features.map((feature) => {
          const isSelected = feature.id === selectedFeatureId;
          const geomType = feature.geometry.type;

          if (geomType === 'Polygon' || geomType === 'MultiPolygon') {
            const rings =
              geomType === 'Polygon'
                ? [feature.geometry.coordinates[0]]
                : feature.geometry.coordinates.map((poly: any) => poly[0]);

            return rings.map((ring: number[][], idx: number) => {
              const positions = geoJsonPolygonToLeaflet(ring);
              return (
                <Polygon
                  key={`${feature.id}-${idx}`}
                  positions={positions}
                  pathOptions={{
                    color: isSelected ? '#004ac6' : '#2563eb',
                    fillColor: isSelected ? '#2563eb' : '#2563eb',
                    fillOpacity: isSelected ? 0.35 : 0.08,
                    weight: isSelected ? 2.5 : 1.2,
                  }}
                  eventHandlers={{
                    click: () => onSelectFeature?.(feature.id),
                  }}
                >
                  <Popup>
                    <div className="font-sans text-xs p-1">
                      <div className="font-bold text-primary flex items-center gap-1">
                        <span>Parcel #{feature.id}</span>
                        {feature.properties.zoning && (
                          <span className="text-[10px] text-secondary font-normal">
                            ({feature.properties.zoning})
                          </span>
                        )}
                      </div>
                      <div className="mt-1 font-mono text-[11px] text-on-surface">
                        {feature.properties.areaHa ? `${feature.properties.areaHa} ha` : ''}
                        {feature.properties.perimeterM ? ` • Peri: ${feature.properties.perimeterM}m` : ''}
                      </div>
                      <div className="mt-1 text-[10px] text-secondary">
                        Status: <span className="text-primary font-medium">{feature.properties.topologyStatus || 'Valid'}</span>
                      </div>
                    </div>
                  </Popup>
                </Polygon>
              );
            });
          }

          if (geomType === 'LineString' || geomType === 'MultiLineString') {
            const lines =
              geomType === 'LineString'
                ? [feature.geometry.coordinates]
                : feature.geometry.coordinates;

            return lines.map((lineCoords: number[][], idx: number) => {
              const positions = geoJsonLineToLeaflet(lineCoords);
              return (
                <Polyline
                  key={`${feature.id}-${idx}`}
                  positions={positions}
                  pathOptions={{
                    color: isSelected ? '#004ac6' : '#585f67',
                    weight: isSelected ? 3 : 1.8,
                    dashArray: isSelected ? undefined : '4, 4',
                  }}
                  eventHandlers={{
                    click: () => onSelectFeature?.(feature.id),
                  }}
                >
                  <Popup>
                    <div className="font-sans text-xs p-1">
                      <div className="font-bold text-on-surface">{feature.id} (LineString)</div>
                      <div className="text-[11px] font-mono text-secondary mt-0.5">
                        Length: {feature.properties.lengthM || feature.properties.perimeterM} m
                      </div>
                    </div>
                  </Popup>
                </Polyline>
              );
            });
          }

          return null;
        })}
      </MapContainer>

      {/* Floating HUD Top Right: Basemap Selector & Live Coordinates */}
      <div className="absolute top-3 right-3 flex items-center gap-2 z-[1000]">
        <div className="flex items-center rounded-lg bg-surface-container-lowest border border-outline-variant/30 p-0.5 shadow-sm">
          <button
            type="button"
            onClick={() => setBasemap('light')}
            className={`px-2 py-1 rounded font-label-sm text-label-sm transition-colors ${
              basemap === 'light'
                ? 'bg-surface-container text-primary font-semibold'
                : 'text-secondary hover:text-on-surface'
            }`}
          >
            Light Vector
          </button>
          <button
            type="button"
            onClick={() => setBasemap('topo')}
            className={`px-2 py-1 rounded font-label-sm text-label-sm transition-colors ${
              basemap === 'topo'
                ? 'bg-surface-container text-primary font-semibold'
                : 'text-secondary hover:text-on-surface'
            }`}
          >
            Topographic
          </button>
          <button
            type="button"
            onClick={() => setBasemap('satellite')}
            className={`px-2 py-1 rounded font-label-sm text-label-sm transition-colors ${
              basemap === 'satellite'
                ? 'bg-surface-container text-primary font-semibold'
                : 'text-secondary hover:text-on-surface'
            }`}
          >
            Satellite
          </button>
          <button
            type="button"
            onClick={() => setBasemap('canvas')}
            className={`px-2 py-1 rounded font-label-sm text-label-sm transition-colors ${
              basemap === 'canvas'
                ? 'bg-surface-container text-primary font-semibold'
                : 'text-secondary hover:text-on-surface'
            }`}
          >
            Canvas Only
          </button>
        </div>

        <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 bg-surface-container-lowest/95 border border-outline-variant/30 rounded-lg shadow-sm font-data-tabular text-body-xs text-secondary">
          <span>Lat: {coords.lat.toFixed(4)}° N</span>
          <span>•</span>
          <span>Lon: {coords.lon.toFixed(4)}° W</span>
          <span>•</span>
          <span className="font-medium text-on-surface">Zoom: {coords.zoom}</span>
        </div>
      </div>

      {/* Floating HUD Bottom Right: Scale & Projection */}
      <div className="absolute bottom-3 right-3 flex items-center gap-3 z-[1000] pointer-events-none">
        <div className="bg-surface-container-lowest/90 px-2 py-1 rounded border border-outline-variant/30 shadow-sm flex flex-col items-center">
          <div className="w-24 h-1.5 border-b-2 border-l-2 border-r-2 border-on-surface" />
          <span className="font-data-tabular text-[10px] text-on-surface font-medium mt-0.5">
            500 m / 1,640 ft
          </span>
        </div>
        <div className="bg-surface-container-lowest/90 px-2 py-1 rounded border border-outline-variant/30 shadow-sm font-data-tabular text-body-xs text-secondary">
          EPSG:4326
        </div>
      </div>
    </div>
  );
};
