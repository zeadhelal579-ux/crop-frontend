/**
 * Geometry helpers for the token-free SVG maps: project longitude/latitude
 * polygons onto a flat canvas, and convert canvas clicks back to coordinates.
 */

/** Flatten every polygon ring into one list of [lon, lat] points. */
function collectPoints(polygons) {
  return polygons.flatMap((polygon) => polygon.coordinates[0]);
}

/**
 * Project polygons into a width x height canvas, keeping the real aspect ratio.
 * Returns, per polygon, an SVG "points" string and its centre in canvas units.
 */
export function projectPolygons(polygons, width, height, padding = 0.1) {
  const points = collectPoints(polygons);
  const lons = points.map(([lon]) => lon);
  const lats = points.map(([, lat]) => lat);
  const minLon = Math.min(...lons);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const lonScale = Math.cos((((minLat + maxLat) / 2) * Math.PI) / 180);
  const spanX = (Math.max(...lons) - minLon) * lonScale;
  const spanY = maxLat - minLat;
  const scale = Math.min((width * (1 - 2 * padding)) / spanX, (height * (1 - 2 * padding)) / spanY);
  const offsetX = (width - spanX * scale) / 2;
  const offsetY = (height - spanY * scale) / 2;

  const project = ([lon, lat]) => ({ x: offsetX + (lon - minLon) * lonScale * scale, y: offsetY + (maxLat - lat) * scale });

  return polygons.map((polygon) => {
    const ring = polygon.coordinates[0].map(project);
    const xs = ring.map((point) => point.x);
    const ys = ring.map((point) => point.y);
    return {
      points: ring.map((point) => `${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(" "),
      center: { x: (Math.min(...xs) + Math.max(...xs)) / 2, y: (Math.min(...ys) + Math.max(...ys)) / 2 },
    };
  });
}

/** Bounding box [west, south, east, north] around a centre point. */
export function boundsAround(center, halfLon, halfLat) {
  return { west: center.longitude - halfLon, east: center.longitude + halfLon, south: center.latitude - halfLat, north: center.latitude + halfLat };
}

/** Convert a click position (0-1 across and down the canvas) to [lon, lat]. */
export function canvasToLonLat(fractionX, fractionY, bounds) {
  return [
    Number((bounds.west + fractionX * (bounds.east - bounds.west)).toFixed(5)),
    Number((bounds.north - fractionY * (bounds.north - bounds.south)).toFixed(5)),
  ];
}

/** Convert [lon, lat] to canvas fractions (0-1), the inverse of canvasToLonLat. */
export function lonLatToCanvas([lon, lat], bounds) {
  return { x: (lon - bounds.west) / (bounds.east - bounds.west), y: (bounds.north - lat) / (bounds.north - bounds.south) };
}

/** Close a list of clicked points into a GeoJSON Polygon (null below 3 points). */
export function pointsToPolygon(points) {
  if (points.length < 3) return null;
  return { type: "Polygon", coordinates: [[...points, points[0]]] };
}
