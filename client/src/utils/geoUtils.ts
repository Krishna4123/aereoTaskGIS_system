import { LatLngExpression, LatLngBoundsExpression } from 'leaflet';

/**
 * Converts a GeoJSON coordinate [lon, lat] to a Leaflet [lat, lon] tuple
 */
export function geoJsonToLeafletCoord(coord: [number, number]): [number, number] {
  return [coord[1], coord[0]];
}

/**
 * Converts a GeoJSON Polygon ring ([ [lon, lat], ... ]) to Leaflet LatLngExpression[]
 */
export function geoJsonPolygonToLeaflet(ring: number[][]): [number, number][] {
  return ring.map((coord) => [coord[1], coord[0]]);
}

/**
 * Converts a GeoJSON LineString coordinates ([ [lon, lat], ... ]) to Leaflet LatLngExpression[]
 */
export function geoJsonLineToLeaflet(coords: number[][]): [number, number][] {
  return coords.map((coord) => [coord[1], coord[0]]);
}

/**
 * Computes Leaflet LatLngBoundsExpression from a [minLon, minLat, maxLon, maxLat] bounding box
 */
export function bboxToLeafletBounds(bbox: [number, number, number, number]): LatLngBoundsExpression {
  const [minLon, minLat, maxLon, maxLat] = bbox;
  return [
    [minLat, minLon],
    [maxLat, maxLon],
  ];
}
