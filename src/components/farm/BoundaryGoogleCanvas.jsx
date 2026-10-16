/**
 * Google Maps canvas for drawing a field boundary: every click adds a vertex
 * and the polygon preview updates. Rendered by FieldBoundaryDrawer once the
 * Google Maps API has loaded. It never uses Google's (deprecated) Drawing
 * library: the vertices are plain clicks owned by the parent form.
 */
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useGoogleMapInstance } from "@/hooks/useGoogleMapInstance";
import { DEFAULT_MAP_ZOOM } from "@/lib/mapDefaults";
import { createHtmlOverlay } from "@/utils/googleOverlay";

const DRAFT_COLOR = "#4CAF50";
const VERTEX_CLASSES = "h-3 w-3 rounded-full bg-tertiary-400 ring-2 ring-white";

/** Render the drawing map; points is the list of [lon, lat] vertices. */
export function BoundaryGoogleCanvas({ maps, points, onAddPoint, center }) {
  const { t } = useTranslation("farm");
  const { containerRef, map } = useGoogleMapInstance(maps, {
    center: { lat: center.latitude, lng: center.longitude },
    zoom: DEFAULT_MAP_ZOOM,
    gestureHandling: "greedy",
    zoomControl: true,
  });

  // The click listener is registered once per map and always calls the latest callback.
  const onAddPointRef = useRef(onAddPoint);
  useEffect(() => {
    onAddPointRef.current = onAddPoint;
  });
  useEffect(() => {
    if (!map) return undefined;
    const listener = map.addListener("click", (event) => onAddPointRef.current([event.latLng.lng(), event.latLng.lat()]));
    return () => listener.remove();
  }, [map]);

  useEffect(() => {
    if (!map) return undefined;
    const path = points.map(([lng, lat]) => ({ lat, lng }));
    const draft = new maps.Polygon({ map, paths: path, strokeColor: DRAFT_COLOR, strokeWeight: 3, fillColor: DRAFT_COLOR, fillOpacity: 0.35, clickable: false });
    const dots = path.map((position) => {
      const element = document.createElement("div");
      element.className = VERTEX_CLASSES;
      const overlay = createHtmlOverlay(maps, position, element);
      overlay.setMap(map);
      return overlay;
    });
    return () => {
      draft.setMap(null);
      dots.forEach((dot) => dot.setMap(null));
    };
  }, [map, maps, points]);

  return <div ref={containerRef} className="relative h-56 overflow-hidden rounded-2xl bg-primary-900" dir="ltr" role="region" aria-label={t("boundary.canvasLabel")} data-testid="google-boundary-map" />;
}
