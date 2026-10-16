/**
 * Google Maps parcel map: real satellite imagery of the farm location with
 * every parcel polygon coloured by its NDVI vigor class, plus the shared
 * ParcelLabel pinned on each parcel. Rendered by SatelliteGridMap once the
 * Google Maps API has loaded.
 */
import { Maximize, Minus, Plus } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { useGoogleMapInstance } from "@/hooks/useGoogleMapInstance";
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM } from "@/lib/mapDefaults";
import { createHtmlOverlay, pathCenter, polygonToPath } from "@/utils/googleOverlay";
import { vigorHex } from "@/utils/vigorColor";
import { ParcelLabel } from "./ParcelLabel";

const FIT_PADDING = 56;
const UNMONITORED_COLOR = "#E5E5E3";

/** Render the Google map; maps is the class bundle from useGoogleMaps. */
export function ParcelMapGoogle({ maps, parcels }) {
  const { t, i18n } = useTranslation("farm");
  const { containerRef, map } = useGoogleMapInstance(maps, { center: { lat: DEFAULT_MAP_CENTER.latitude, lng: DEFAULT_MAP_CENTER.longitude }, zoom: DEFAULT_MAP_ZOOM });
  const [labelHosts, setLabelHosts] = useState([]);
  const boundsRef = useRef(null);
  const direction = i18n.dir();

  useEffect(() => {
    if (!map) return undefined;
    const bounds = new maps.LatLngBounds();
    const polygons = [];
    const overlays = [];
    const hosts = [];

    parcels.forEach((parcel) => {
      const path = polygonToPath(parcel.boundary);
      path.forEach((point) => bounds.extend(point));
      const color = parcel.monitored ? vigorHex(parcel.vigorClass) : UNMONITORED_COLOR;
      polygons.push(
        new maps.Polygon({
          map,
          paths: path,
          strokeColor: color,
          strokeWeight: parcel.hasPestAlert ? 5 : 3,
          fillColor: color,
          fillOpacity: parcel.monitored ? 0.3 : 0,
          clickable: false,
        }),
      );
      const element = document.createElement("div");
      element.dir = direction;
      const overlay = createHtmlOverlay(maps, pathCenter(path), element);
      overlay.setMap(map);
      overlays.push(overlay);
      hosts.push({ fieldId: parcel.fieldId, parcel, element });
    });

    boundsRef.current = bounds;
    map.fitBounds(bounds, FIT_PADDING);
    setLabelHosts(hosts);
    return () => {
      polygons.forEach((polygon) => polygon.setMap(null));
      overlays.forEach((overlay) => overlay.setMap(null));
    };
  }, [map, maps, parcels, direction]);

  /** Zoom the map in (+1) or out (-1) by one level. */
  const zoomBy = useCallback((delta) => map.setZoom((map.getZoom() ?? DEFAULT_MAP_ZOOM) + delta), [map]);

  return (
    <div className="relative h-[420px] overflow-hidden rounded-2xl bg-primary-900 md:h-[520px]">
      <div ref={containerRef} className="absolute inset-0" dir="ltr" role="region" aria-label={t("satellite.mapLabel")} data-testid="google-parcel-map" />
      {labelHosts.map((host) => createPortal(<ParcelLabel parcel={host.parcel} />, host.element, host.fieldId))}
      {map ? (
        <div className="absolute end-3 top-3 flex flex-col gap-2">
          <button type="button" onClick={() => zoomBy(1)} className="rounded-full bg-black/55 p-2 text-white hover:bg-black/70" aria-label={t("satellite.zoomIn")}>
            <Plus className="h-4 w-4" aria-hidden="true" />
          </button>
          <button type="button" onClick={() => zoomBy(-1)} className="rounded-full bg-black/55 p-2 text-white hover:bg-black/70" aria-label={t("satellite.zoomOut")}>
            <Minus className="h-4 w-4" aria-hidden="true" />
          </button>
          <button type="button" onClick={() => map.fitBounds(boundsRef.current, FIT_PADDING)} className="rounded-full bg-black/55 p-2 text-white hover:bg-black/70" aria-label={t("satellite.resetZoom")}>
            <Maximize className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
