/**
 * Regional risk map: Google Maps with every grid cell tinted by its risk class
 * when an API key exists, otherwise an SVG grid. Both draw the same cells.
 */
import { useTranslation } from "react-i18next";
import { Skeleton } from "@/components/ui/skeleton";
import { useGoogleMaps } from "@/hooks/useGoogleMaps";
import { riskHex } from "@/utils/riskColor";
import { RiskGridGoogleMap } from "./RiskGridGoogleMap";

/** Render the map for one risk-grid response. */
export function RiskMapPanel({ data, bbox }) {
  const { t } = useTranslation("common");
  const { status, maps } = useGoogleMaps();
  const [rows, cols] = data.gridShape;

  if (status === "ready") return <RiskGridGoogleMap maps={maps} data={data} bbox={bbox} />;
  if (status === "loading") return <Skeleton className="h-80 rounded-2xl" />;

  return (
    <svg viewBox={`0 0 ${cols * 20} ${rows * 20}`} className="w-full rounded-2xl bg-neutral-900" role="img" aria-label={t("alerts.mapLabel")}>
      {data.cells.map((cell) => (
        <rect
          key={`${cell.row}-${cell.col}`}
          x={cell.col * 20 + 1}
          y={cell.row * 20 + 1}
          width="18"
          height="18"
          rx="4"
          fill={riskHex(cell.riskClass)}
          fillOpacity={0.25 + cell.emergenceProbability * 0.7}
        />
      ))}
    </svg>
  );
}
