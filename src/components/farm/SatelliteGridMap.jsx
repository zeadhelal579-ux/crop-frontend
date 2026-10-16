/**
 * "Parcels Health & Orthomosaic Satellite Grid": the farm map with each
 * parcel coloured by its latest NDVI vigor class, a pest-alert marker on
 * parcels with an open alert and the NDVI legend. The map is Google Maps
 * satellite imagery when an API key exists; otherwise (or if Google rejects
 * the key) the SVG fallback draws the same data. The "Satellite / NDVI Layer"
 * chip is a fixed label, exactly as in the design - it never toggles.
 */
import { Layers } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGoogleMaps } from "@/hooks/useGoogleMaps";
import { useSatelliteGrid } from "@/hooks/useSatelliteGrid";
import { cn } from "@/lib/utils";
import { vigorHex } from "@/utils/vigorColor";
import { ParcelMapGoogle } from "./ParcelMapGoogle";
import { ParcelMapSvg } from "./ParcelMapSvg";

const LEGEND = [
  { vigorClass: "HighVigor", labelKey: "satellite.legend.high" },
  { vigorClass: "ModerateStress", labelKey: "satellite.legend.moderate" },
  { vigorClass: "CriticalAlert", labelKey: "satellite.legend.critical" },
];

/** Render the satellite grid card for one farm. */
export function SatelliteGridMap({ farmId }) {
  const { t } = useTranslation("farm");
  const { data, isLoading } = useSatelliteGrid(farmId);
  const { status, maps } = useGoogleMaps();

  if (isLoading || !data) return <Skeleton className="h-[520px] rounded-xl3" />;
  // Google keeps its logo and copyright at the bottom edge of the map; the legend must stay clear of them.
  const legendOffset = status === "ready" || status === "loading" ? "bottom-9" : "bottom-3";

  return (
    <Card className="bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="flex flex-wrap items-center gap-2 text-[11px] text-neutral-600">
            <span className="rounded-md bg-neutral-800 px-2 py-0.5 text-[10px] font-bold uppercase text-white">{t("satellite.live")}</span>
            {t("satellite.resolution", { resolution: data.resolutionMPerPx, source: data.source })}
          </p>
          <h3 className="mt-1 text-xl font-bold text-neutral-800">{t("satellite.title")}</h3>
        </div>
        <span className="flex items-center gap-2 rounded-full bg-neutral-800 px-4 py-2 text-xs font-semibold text-white">
          <Layers className="h-4 w-4" aria-hidden="true" />
          {t("satellite.layer")}
        </span>
      </div>

      <div className="relative mt-4">
        {status === "ready" ? <ParcelMapGoogle maps={maps} parcels={data.parcels} /> : null}
        {status === "loading" ? <Skeleton className="h-[420px] rounded-2xl md:h-[520px]" /> : null}
        {status === "unavailable" || status === "error" ? <ParcelMapSvg parcels={data.parcels} /> : null}
        <div className={cn("absolute inset-x-3 flex flex-wrap items-center justify-between gap-2 rounded-full bg-black/60 px-4 py-2 text-[10px] font-semibold text-white", legendOffset)}>
          <ul className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <li className="uppercase text-white/60">{t("satellite.legend.title")}</li>
            {LEGEND.map((item) => (
              <li key={item.vigorClass} className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: vigorHex(item.vigorClass) }} aria-hidden="true" />
                {t(item.labelKey)}
              </li>
            ))}
          </ul>
          <span className="text-white/70">{t("satellite.elevation", { value: data.elevationM })}</span>
        </div>
      </div>
      {status === "error" ? (
        <p role="status" className="mt-2 text-[11px] text-neutral-600">
          {t("satellite.mapFallback")}
        </p>
      ) : null}
    </Card>
  );
}
