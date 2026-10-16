/**
 * Farm Overview hero: farm profile (name, description, crop allocation by
 * zone) next to the Overall Health Score ring and four live stat tiles.
 * Purely presentational - every number comes from one GetFarm response, so
 * the figures are always consistent with each other.
 */
import { Bug, Droplet, Leaf, Timer } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { formatClockTime, formatNumber, getRelativeAge } from "@/utils/formatDate";

const CROP_BAR_COLORS = {
  tomato: "bg-primary-800",
  cucumber: "bg-primary-600",
  citrus: "bg-secondary-300",
  pepper: "bg-tertiary-500",
  peach: "bg-tertiary-300",
  fig: "bg-neutral-500",
};

/** Describe a health score: Vigorous (85+), Stable (70-84) or Stressed. */
function healthLabelKey(score) {
  if (score >= 85) return "vigorous";
  if (score >= 70) return "stable";
  return "stressed";
}

/** A dark rounded stat tile used in the 2x2 grid. */
function StatTile({ icon: Icon, label, children, footer }) {
  return (
    <div className="rounded-2xl bg-neutral-800 p-3 text-white">
      <p className="flex items-center gap-1.5 text-[11px] text-white/70">
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
        {label}
      </p>
      <div className="mt-1.5">{children}</div>
      {footer ? <p className="mt-1 text-[10px] text-white/70">{footer}</p> : null}
    </div>
  );
}

/** Render the farm hero card. */
export function FarmHealthHero({ farm }) {
  const { t, i18n } = useTranslation("farm");
  const circumference = 2 * Math.PI * 26;
  const age = getRelativeAge(farm.lastIrrigation.completedAt);

  return (
    <Card className="grid gap-6 p-5 lg:grid-cols-[1.4fr_1fr] lg:p-6">
      <div className="flex flex-col justify-between gap-6">
        <div>
          <span className="inline-block rounded-md bg-secondary-100 px-2 py-0.5 text-[10px] font-bold uppercase text-primary-700">
            {t("hero.profile", { code: farm.code })}
          </span>
          <h2 className="mt-2 text-3xl font-bold text-neutral-800">{farm.name}</h2>
          <p className="mt-1 max-w-md text-sm text-neutral-600">{farm.description}</p>
        </div>

        <div className="rounded-2xl bg-white/80 p-4">
          <p className="text-xs font-semibold text-neutral-700">
            {t("hero.allocation", { total: formatNumber(farm.totalAreaHectares, i18n.language) })}
          </p>
          <div className="mt-2 flex h-2 overflow-hidden rounded-full bg-neutral-200">
            {farm.cropAllocation.map((zone) => (
              <span key={zone.cropType} className={cn("h-full", CROP_BAR_COLORS[zone.cropType])} style={{ width: `${zone.percent}%` }} />
            ))}
          </div>
          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[11px] text-neutral-700">
            {farm.cropAllocation.map((zone) => (
              <li key={zone.cropType} className="flex items-center gap-1.5">
                <span className={cn("h-2 w-2 rounded-full", CROP_BAR_COLORS[zone.cropType])} aria-hidden="true" />
                {t("hero.zone", { crop: t(`common:crops.${zone.cropType}`), percent: zone.percent, hectares: zone.hectares })}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="caption">{t("hero.vigor")}</p>
            <p className="text-lg font-bold text-neutral-800">{t("hero.healthScore")}</p>
          </div>
          <div className="relative h-16 w-16" role="img" aria-label={`${t("hero.healthScore")} ${farm.overallHealthScore}%`}>
            <svg viewBox="0 0 64 64" className="h-full w-full -rotate-90">
              <circle cx="32" cy="32" r="26" fill="none" strokeWidth="5" className="stroke-neutral-200" />
              <circle
                cx="32"
                cy="32"
                r="26"
                fill="none"
                strokeWidth="5"
                strokeLinecap="round"
                className="stroke-secondary-500"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - farm.overallHealthScore / 100)}
              />
            </svg>
            <span className="absolute inset-0 flex flex-col items-center justify-center leading-none">
              <span className="text-sm font-bold text-primary-800">{farm.overallHealthScore}%</span>
              <span className="mt-0.5 text-[7px] font-bold uppercase text-primary-700">{t(`hero.health.${healthLabelKey(farm.overallHealthScore)}`)}</span>
            </span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <StatTile icon={Droplet} label={t("hero.soilMoisture")}>
            <p className="text-2xl font-bold">
              {formatNumber(farm.avgSoilMoisture, i18n.language)}
              <span className="text-xs font-semibold text-secondary-300">%</span>
            </p>
            <Progress value={farm.avgSoilMoisture} className="mt-2 bg-white/20" indicatorClassName="bg-secondary-400" />
          </StatTile>
          <StatTile icon={Timer} label={t("hero.lastIrrigation")} footer={farm.lastIrrigation.cycleLabel}>
            <p className="text-2xl font-bold">{t(`common:time.${age.unit}Ago`, { value: age.value })}</p>
            <p className="mt-1 text-[10px] font-semibold text-secondary-300">
              {t("hero.nextIrrigation", { time: formatClockTime(farm.lastIrrigation.nextScheduledAt, i18n.language) })}
            </p>
          </StatTile>
          <StatTile icon={Leaf} label={t("hero.ndvi")} footer={t("hero.ndviNote")}>
            <p className="text-2xl font-bold">
              {formatNumber(farm.ndviCanopy, i18n.language, { minimumFractionDigits: 2 })}
              <span className="text-xs font-semibold text-white/60"> /1.0</span>
            </p>
          </StatTile>
          <StatTile icon={Bug} label={t("hero.traps")} footer={t("hero.trapsNote")}>
            <p className="text-2xl font-bold">
              {farm.activeTraps}
              <span className="text-xs font-semibold text-white/60"> {t("hero.sightings")}</span>
            </p>
          </StatTile>
        </div>
      </div>
    </Card>
  );
}
