/**
 * Token-free parcel map: draws every parcel polygon on a dark satellite-style
 * canvas with SVG, and overlays the shared ParcelLabel at each centre.
 * Used whenever no Google Maps key is configured (or Google rejects it).
 * Zoom is local UI state.
 */
import { Maximize, Minus, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { projectPolygons } from "@/utils/mapProjection";
import { vigorHex } from "@/utils/vigorColor";
import { ParcelLabel } from "./ParcelLabel";

const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 520;
const MAP_PADDING = 0.18;
const ZOOM_STEP = 0.4;
const MIN_ZOOM = 1;
const MAX_ZOOM = 2.2;

/** Render the SVG map; monitored parcels are filled with their vigor colour. */
export function ParcelMapSvg({ parcels }) {
  const { t } = useTranslation("farm");
  const [zoom, setZoom] = useState(1);
  const projected = useMemo(() => projectPolygons(parcels.map((parcel) => parcel.boundary), CANVAS_WIDTH, CANVAS_HEIGHT, MAP_PADDING), [parcels]);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-primary-900" style={{ aspectRatio: `${CANVAS_WIDTH} / ${CANVAS_HEIGHT}` }}>
      <div className="absolute inset-0 origin-center transition-transform duration-300" style={{ transform: `scale(${zoom})` }}>
        <svg viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`} className="absolute inset-0 h-full w-full" role="img" aria-label={t("satellite.mapLabel")}>
          <defs>
            <pattern id="field-rows" width="26" height="26" patternUnits="userSpaceOnUse" patternTransform="rotate(18)">
              <rect width="26" height="26" fill="#2f5a2c" />
              <rect width="13" height="26" fill="#3a6a35" />
            </pattern>
          </defs>
          <rect width={CANVAS_WIDTH} height={CANVAS_HEIGHT} fill="url(#field-rows)" />
          <rect width={CANVAS_WIDTH} height={CANVAS_HEIGHT} fill="rgba(6,30,10,0.35)" />
          {parcels.map((parcel, index) => {
            const color = parcel.monitored ? vigorHex(parcel.vigorClass) : "#E5E5E3";
            return (
              <polygon
                key={parcel.fieldId}
                points={projected[index].points}
                fill={parcel.monitored ? color : "transparent"}
                fillOpacity={0.3}
                stroke={color}
                strokeWidth={parcel.hasPestAlert ? 5 : 3}
                strokeLinejoin="round"
              />
            );
          })}
        </svg>
        {parcels.map((parcel, index) => (
          <div
            key={parcel.fieldId}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${(projected[index].center.x / CANVAS_WIDTH) * 100}%`, top: `${(projected[index].center.y / CANVAS_HEIGHT) * 100}%` }}
          >
            <ParcelLabel parcel={parcel} />
          </div>
        ))}
      </div>

      <div className="absolute end-3 top-3 flex flex-col gap-2">
        <button type="button" onClick={() => setZoom((value) => Math.min(MAX_ZOOM, value + ZOOM_STEP))} className="rounded-full bg-black/55 p-2 text-white hover:bg-black/70" aria-label={t("satellite.zoomIn")}>
          <Plus className="h-4 w-4" aria-hidden="true" />
        </button>
        <button type="button" onClick={() => setZoom((value) => Math.max(MIN_ZOOM, value - ZOOM_STEP))} className="rounded-full bg-black/55 p-2 text-white hover:bg-black/70" aria-label={t("satellite.zoomOut")}>
          <Minus className="h-4 w-4" aria-hidden="true" />
        </button>
        <button type="button" onClick={() => setZoom(1)} className="rounded-full bg-black/55 p-2 text-white hover:bg-black/70" aria-label={t("satellite.resetZoom")}>
          <Maximize className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
