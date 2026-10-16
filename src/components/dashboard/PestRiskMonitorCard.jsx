/**
 * "Pest Risk Monitor": the rolling 7-day outbreak forecast (3 past days,
 * today, 3 forecast days) for the selected species, plus the
 * "Recommendations" and "Download Report" actions. The forecast days are
 * precomputed by the nightly risk job; viewing this card never computes risk.
 */
import { CloudDownload, Radar } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ReportDownloadCard } from "@/components/help/ReportDownloadCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useRiskHistory } from "@/hooks/useFieldRisk";
import { cn } from "@/lib/utils";
import { formatWeekdayShort, getDayOffset } from "@/utils/formatDate";
import { getRiskStyle } from "@/utils/riskColor";
import { findTodayEntry } from "@/utils/timeline";

/** Which caption sits above a day: forecast, today, yesterday or past. */
function dayCaptionKey(entry, todayDate) {
  if (entry.isForecast) return "forecast";
  if (entry.date === todayDate) return "today";
  return getDayOffset(entry.date, todayDate) === 1 ? "yesterday" : "past";
}

/** Render the monitor for one field/species pair. */
export function PestRiskMonitorCard({ fieldId, speciesId, farmId }) {
  const { t, i18n } = useTranslation("dashboard");
  const navigate = useNavigate();
  const { data, isLoading } = useRiskHistory(fieldId, speciesId, { daysBack: 3, daysForward: 3 });

  if (isLoading || !data) return <Skeleton className="h-56 rounded-xl3" />;

  const todayDate = findTodayEntry(data)?.date;

  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">
            <Radar className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h3 className="text-xl font-bold text-neutral-800">{t("monitor.title")}</h3>
            <p className="text-xs text-neutral-600">{t("monitor.subtitle")}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="danger" size="sm" onClick={() => navigate(`/guidance?fieldId=${fieldId}`)}>
            {t("monitor.recommendations")}
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">
                <CloudDownload className="h-4 w-4" aria-hidden="true" />
                {t("monitor.downloadReport")}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle className="text-lg font-bold">{t("monitor.reportTitle")}</DialogTitle>
              <DialogDescription className="mb-4 text-sm text-neutral-600">{t("monitor.reportDescription")}</DialogDescription>
              <ReportDownloadCard farmId={farmId} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <ul className="mt-5 grid auto-cols-[minmax(7rem,1fr)] grid-flow-col gap-3 overflow-x-auto pb-1 pt-4">
        {data.map((entry) => {
          const captionKey = dayCaptionKey(entry, todayDate);
          const isToday = captionKey === "today";
          const riskStyle = getRiskStyle(entry.riskClass);
          return (
            <li
              key={entry.date}
              className={cn(
                "relative flex flex-col items-center gap-1 rounded-2xl bg-white/80 px-2 pb-3 pt-4 text-center",
                isToday && "bg-white shadow-card ring-1 ring-risk-high/30",
              )}
            >
              {isToday ? (
                <span className="absolute -top-3 rounded-full bg-risk-high px-3 py-0.5 text-[10px] font-bold uppercase text-white">
                  {t("monitor.caption.today")}
                </span>
              ) : (
                <span className="text-[10px] font-semibold uppercase text-neutral-500">{t(`monitor.caption.${captionKey}`)}</span>
              )}
              <span className="text-lg font-bold text-neutral-800">{formatWeekdayShort(entry.date, i18n.language)}</span>
              <span className="text-[11px] text-neutral-600">
                {entry.tempC}°C • {t(`condition.${entry.condition}`)}
              </span>
              <span className={cn("mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl py-2 text-[10px] font-bold uppercase", riskStyle.badge)}>
                <span className={cn("h-1.5 w-1.5 rounded-full", riskStyle.dot)} aria-hidden="true" />
                {t(`common:risk.${entry.riskClass}`)}
              </span>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
