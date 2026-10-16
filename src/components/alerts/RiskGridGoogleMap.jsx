/**
 * Google map for the regional risk grid: satellite imagery of the region with
 * every grid cell drawn as a rectangle tinted by its risk class (stronger
 * tint = higher emergence probability). Rendered by RiskMapPanel once the
 * Google Maps API has loaded.
 */
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useGoogleMapInstance } from "@/hooks/useGoogleMapInstance";
import { cellBounds } from "@/utils/riskGrid";
import { riskHex } from "@/utils/riskColor";

/** Render the map for one risk-grid response inside its bounding box. */
export function RiskGridGoogleMap({ maps, data, bbox }) {
  const { t } = useTranslation("common");
  const { containerRef, map } = useGoogleMapInstance(maps, {
    center: { lat: (bbox.minLat + bbox.maxLat) / 2, lng: (bbox.minLon + bbox.maxLon) / 2 },
    zoom: 11,
  });

  useEffect(() => {
    if (!map) return undefined;
    map.fitBounds({ north: bbox.maxLat, south: bbox.minLat, east: bbox.maxLon, west: bbox.minLon });
    const rectangles = data.cells.map(
      (cell) =>
        new maps.Rectangle({
          map,
          bounds: cellBounds(cell, bbox, data.gridShape),
          strokeWeight: 0,
          fillColor: riskHex(cell.riskClass),
          fillOpacity: 0.25 + cell.emergenceProbability * 0.5,
          clickable: false,
        }),
    );
    return () => rectangles.forEach((rectangle) => rectangle.setMap(null));
  }, [map, maps, data, bbox]);

  return <div ref={containerRef} className="relative h-80 overflow-hidden rounded-2xl bg-neutral-900" dir="ltr" role="region" aria-label={t("alerts.mapLabel")} data-testid="google-risk-map" />;
}
