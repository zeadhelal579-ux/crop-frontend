/**
 * "Accumulative GDD" card: seven bars of Growing Degree Units for the current
 * week, the week's average and the change against the previous week. The
 * delta is computed here from the same series (no separate API field).
 */
import { Info } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGdd } from "@/hooks/useGdd";
import { cn } from "@/lib/utils";
import { formatNumber, formatWeekdayName } from "@/utils/formatDate";
import { average, computeWeekOverWeekDeltaPct } from "@/utils/gddHelpers";
import { findTodayEntry } from "@/utils/timeline";

const AXIS_MAX = 300;
const AXIS_TICKS = [300, 200, 100, 0];

/** Pick the bar colour: today is dark green, the final day mint, the rest grey. */
function barColor(isToday, isLast) {
  if (isToday) return "bg-primary";
  if (isLast) return "bg-secondary-300";
  return "bg-neutral-200";
}

/** Render the GDD card for one field/species pair. */
export function GddCard({ fieldId, species }) {
  const { t, i18n } = useTranslation("dashboard");
  const { data, isLoading } = useGdd(fieldId, species?.id);

  if (isLoading || !data || !species) return <Skeleton className="h-80 rounded-xl3" />;

  const units = data.daily.map((entry) => entry.degreeUnits);
  const week = data.daily.slice(-7);
  const today = findTodayEntry(week);
  const delta = computeWeekOverWeekDeltaPct(units);
  const crops = species.hostCrops.map((crop) => t(`common:cropSingular.${crop}`)).join(" & ");

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle className="flex items-center gap-1.5 text-xl">
            {t("gdd.title")}
            <span title={t("gdd.info")}>
              <Info className="h-4 w-4 text-neutral-500" aria-label={t("gdd.info")} />
            </span>
          </CardTitle>
          <p className="caption mt-1">{t("gdd.subtitle", { base: species.tbaseC, crops })}</p>
        </div>
        <span className="text-[11px] font-semibold text-neutral-600">{t("gdd.sevenDays")}</span>
      </CardHeader>

      <div className="mx-5 mb-5 rounded-2xl bg-white/80 p-3">
        <div className="flex items-start justify-between gap-2 text-[10px] font-semibold text-neutral-600">
          <span>{t("gdd.unitsLabel")}</span>
          <span className="text-end">
            {t("gdd.average", { value: formatNumber(Math.round(average(week.map((entry) => entry.degreeUnits))), i18n.language) })}
            {delta === null ? null : <span className="block">{t("gdd.delta", { value: `${delta > 0 ? "+" : ""}${delta}` })}</span>}
          </span>
        </div>

        <div className="relative mt-3 h-40 ps-8">
          {AXIS_TICKS.map((tick) => (
            <div key={tick} className="absolute inset-x-0 flex items-center" style={{ bottom: `${(tick / AXIS_MAX) * 100}%` }}>
              <span className="w-7 text-[10px] text-neutral-500">{tick}</span>
              <span className="flex-1 border-t border-dotted border-neutral-300" />
            </div>
          ))}
          <div className="relative flex h-full items-end justify-between gap-2">
            {week.map((entry, index) => (
              <div
                key={entry.date}
                className={cn("flex-1 rounded-md", barColor(entry.date === today?.date, index === week.length - 1))}
                style={{ height: `${(entry.degreeUnits / AXIS_MAX) * 100}%` }}
                title={`${entry.degreeUnits}`}
              />
            ))}
          </div>
        </div>
        <div className="mt-2 flex justify-between ps-8 text-[10px] font-medium text-neutral-600">
          {week.map((entry) => (
            <span key={entry.date} className="flex-1 text-center">
              {formatWeekdayName(entry.date, i18n.language)}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
}
