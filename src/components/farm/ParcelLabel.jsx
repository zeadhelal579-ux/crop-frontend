/**
 * Overlay label drawn on top of a parcel of the satellite grid. Shared by the
 * SVG fallback map and the Google map so both show identical information.
 */
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { vigorHex } from "@/utils/vigorColor";

/** "Field B-01" -> "B-01". */
function parcelCode(name) {
  return name.split(" ").pop();
}

/** Render the label of one parcel (a full card for monitored plots, a pill otherwise). */
export function ParcelLabel({ parcel }) {
  const { t } = useTranslation("farm");

  if (!parcel.monitored) {
    return (
      <span className="flex items-center gap-1.5 whitespace-nowrap rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-semibold text-white">
        <span className="h-1.5 w-1.5 rounded-full bg-white/70" aria-hidden="true" />
        {t("satellite.plotPill", { code: parcelCode(parcel.name), area: parcel.areaHectares, status: parcel.statusNote })}
      </span>
    );
  }

  const meta = [t(`common:crops.${parcel.cropType}`), t("satellite.area", { area: parcel.areaHectares ?? "—" }), parcel.statusNote].filter(Boolean).join(" • ");

  return (
    <div className="w-40 text-start">
      <span
        className={cn(
          "mb-1 inline-block rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase text-white",
          parcel.hasPestAlert ? "bg-risk-high" : "bg-black/60",
        )}
      >
        {parcel.hasPestAlert ? t("satellite.alertTag", { code: parcelCode(parcel.name) }) : t("satellite.plotTag", { code: parcelCode(parcel.name) })}
      </span>
      <div className="rounded-lg bg-black/55 px-2 py-1.5 text-white backdrop-blur-sm">
        <p className="text-[10px] font-bold" style={{ color: parcel.hasPestAlert ? "#FCA5A5" : vigorHex(parcel.vigorClass) }}>
          {parcel.hasPestAlert
            ? t("satellite.pestAlert", { species: parcel.alertScientificName })
            : t("satellite.vigorLine", { vigor: t(`satellite.vigor.${parcel.vigorClass}`), value: parcel.ndviValue })}
        </p>
        <p className="mt-0.5 text-[9px] text-white/70">{meta}</p>
      </div>
    </div>
  );
}
