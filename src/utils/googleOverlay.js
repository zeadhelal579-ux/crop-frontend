/**
 * Helpers that turn the app's GeoJSON-style geometry into Google Maps values
 * and pin DOM elements (parcel labels, vertex dots) onto a map.
 */

/** Closed GeoJSON polygon ring -> list of { lat, lng } for google.maps.Polygon. */
export function polygonToPath(polygon) {
  return polygon.coordinates[0].map(([lng, lat]) => ({ lat, lng }));
}

/** Centre of a path's bounding box as { lat, lng }. */
export function pathCenter(path) {
  const lats = path.map((point) => point.lat);
  const lngs = path.map((point) => point.lng);
  return { lat: (Math.min(...lats) + Math.max(...lats)) / 2, lng: (Math.min(...lngs) + Math.max(...lngs)) / 2 };
}

/** Pin a DOM element, centred, at a latitude/longitude on a map (returns the overlay). */
export function createHtmlOverlay(maps, position, element) {
  const overlay = new maps.OverlayView();
  element.style.position = "absolute";
  element.style.transform = "translate(-50%, -50%)";
  overlay.onAdd = () => overlay.getPanes().floatPane.appendChild(element);
  overlay.draw = () => {
    const point = overlay.getProjection().fromLatLngToDivPixel(new maps.LatLng(position.lat, position.lng));
    if (!point) return;
    element.style.left = `${point.x}px`;
    element.style.top = `${point.y}px`;
  };
  overlay.onRemove = () => element.remove();
  return overlay;
}
