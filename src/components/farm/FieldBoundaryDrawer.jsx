/**
 * Boundary drawing tool for the field form. Clicking the map adds a vertex;
 * three or more vertices form the polygon. It is a controlled component: the
 * parent owns the list of points and receives every change via onChange,
 * which is a React state setter (so updates can use the functional form).
 * With a Google Maps key it draws on satellite imagery of the farm location;
 * without one it falls back to a simple click-to-plot canvas around it.
 */
import { Eraser, Undo2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGoogleMaps } from "@/hooks/useGoogleMaps";
import { DEFAULT_MAP_CENTER } from "@/lib/mapDefaults";
import { boundsAround, canvasToLonLat, lonLatToCanvas } from "@/utils/mapProjection";
import { BoundaryGoogleCanvas } from "./BoundaryGoogleCanvas";

const CANVAS_WIDTH = 300;
const CANVAS_HEIGHT = 200;
const CANVAS_BOUNDS = boundsAround(DEFAULT_MAP_CENTER, 0.012, 0.008);

/** Render the drawing tool. points is an array of [lon, lat]. */
export function FieldBoundaryDrawer({ points, onChange }) {
  const { t } = useTranslation("farm");
  const { status, maps } = useGoogleMaps();

  /** Append a vertex to the boundary. */
  function addPoint(point) {
    onChange((current) => [...current, point]);
  }

  /** Convert a click on the fallback canvas into a vertex. */
  function handleCanvasClick(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    addPoint(canvasToLonLat((event.clientX - rect.left) / rect.width, (event.clientY - rect.top) / rect.height, CANVAS_BOUNDS));
  }

  const canvasPoints = points.map((point) => lonLatToCanvas(point, CANVAS_BOUNDS));

  return (
    <div className="space-y-2">
      {status === "ready" ? <BoundaryGoogleCanvas maps={maps} points={points} onAddPoint={addPoint} center={DEFAULT_MAP_CENTER} /> : null}
      {status === "loading" ? <Skeleton className="h-56 rounded-2xl" /> : null}
      {status === "unavailable" || status === "error" ? (
        <svg
          viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
          className="w-full cursor-crosshair rounded-2xl bg-primary-900"
          onClick={handleCanvasClick}
          role="img"
          aria-label={t("boundary.canvasLabel")}
          data-testid="boundary-canvas"
        >
          <rect width={CANVAS_WIDTH} height={CANVAS_HEIGHT} fill="#2f5a2c" />
          {canvasPoints.length >= 3 ? (
            <polygon
              points={canvasPoints.map((point) => `${point.x * CANVAS_WIDTH},${point.y * CANVAS_HEIGHT}`).join(" ")}
              fill="rgba(76,175,80,0.35)"
              stroke="#4CAF50"
              strokeWidth="2"
            />
          ) : null}
          {canvasPoints.map((point, index) => (
            <circle key={index} cx={point.x * CANVAS_WIDTH} cy={point.y * CANVAS_HEIGHT} r="4" fill="#F4C04E" />
          ))}
        </svg>
      ) : null}
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] text-neutral-600">{t("boundary.hint", { count: points.length })}</p>
        <div className="flex gap-2">
          <Button size="sm" variant="outlined" disabled={points.length === 0} onClick={() => onChange((current) => current.slice(0, -1))}>
            <Undo2 className="h-3.5 w-3.5" aria-hidden="true" />
            {t("boundary.undo")}
          </Button>
          <Button size="sm" variant="outlined" disabled={points.length === 0} onClick={() => onChange([])}>
            <Eraser className="h-3.5 w-3.5" aria-hidden="true" />
            {t("boundary.clear")}
          </Button>
        </div>
      </div>
    </div>
  );
}
