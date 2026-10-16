/**
 * One species card on the Pests screen: names, activity badge, photo with a
 * caption, and the GDD progress / predicted stage / emergence tiles. The card
 * is a button: selecting it chooses the species shown in the deep dive.
 */
import { useTranslation } from "react-i18next";
import { getPestPhoto } from "@/assets/pests";
import { Skeleton } from "@/components/ui/skeleton";
import { useFieldRisk } from "@/hooks/useFieldRisk";
import { useGdd } from "@/hooks/useGdd";
import { cn } from "@/lib/utils";
import { gddProgressPct } from "@/utils/gddHelpers";
import { getRiskStyle } from "@/utils/riskColor";

/** Dark stat tile (label above, value below). */
function Tile({ label, value }) {
  return (
    <div className="flex-1 rounded-xl bg-neutral-800 px-2.5 py-2 text-white">
      <p className="text-[9px] text-white/60">{label}</p>
      <p className="text-sm font-bold">{value}</p>
    </div>
  );
}

/** Render the card of one species for the active field. */
export function SpeciesCard({ species, fieldId, isSelected, onSelect }) {
  const { t } = useTranslation("pests");
  const risk = useFieldRisk(fieldId, species.id);
  const gdd = useGdd(fieldId, species.id);

  if (!risk.data || !gdd.data) return <Skeleton className="h-96 rounded-xl3" />;

  const riskStyle = getRiskStyle(risk.data.riskClass);
  const percent = Math.round(risk.data.outbreakProbability7d * 100);
  const progress = gddProgressPct(gdd.data.accumulatedGdd, species.gddThermalConstant);

  return (
    <button
      type="button"
      onClick={() => onSelect(species.id)}
      aria-pressed={isSelected}
      className={cn("glass-card flex w-full flex-col gap-3 p-4 text-start transition-shadow", isSelected && "ring-2 ring-secondary-400")}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xl font-bold text-neutral-800">{species.scientificName}</p>
          <p className="text-[11px] italic text-neutral-600">{species.order} • {species.family}</p>
        </div>
        <span className={cn("flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-bold", riskStyle.badge)}>
          <span className={cn("h-1.5 w-1.5 rounded-full", riskStyle.dot)} aria-hidden="true" />
          {t(`activity.${risk.data.riskClass}`, { percent })}
        </span>
      </div>

      <div className="relative overflow-hidden rounded-2xl">
        <img src={getPestPhoto(species.scientificName)} alt={species.commonName} className="h-40 w-full object-cover" />
        <span className="absolute inset-x-0 bottom-2 mx-auto w-fit rounded-full bg-white px-3 py-1 text-[10px] font-semibold text-neutral-800 shadow-pill">
          {species.scientificName} • {species.commonName}
        </span>
      </div>

      <div className="flex gap-2">
        <Tile label={t("tiles.progress")} value={t("tiles.progressValue", { current: gdd.data.accumulatedGdd, total: species.gddThermalConstant, percent: progress })} />
        <Tile label={t("tiles.stage")} value={t(`stage.${gdd.data.currentLifeStage}`)} />
        <Tile label={t("tiles.emergence")} value={t("tiles.emergenceValue", { days: risk.data.daysToEvent })} />
      </div>
    </button>
  );
}
