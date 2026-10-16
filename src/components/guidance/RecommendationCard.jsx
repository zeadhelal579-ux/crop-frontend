/**
 * One row of the Guidance list: priority tag, species and field, the
 * recommended method, schedule, dosage and safety tags, and the action
 * button. Diagnostic entries are informational: they link to the GDD curve
 * instead of offering an accept action. Accept uses an optimistic update.
 */
import { Bug, CalendarClock, LineChart, RefreshCcw, Thermometer } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAcceptRecommendation } from "@/hooks/useRecommendations";
import { cn } from "@/lib/utils";

const PRIORITY_STYLES = {
  CriticalPriority: { icon: RefreshCcw, row: "bg-risk-highBg/70", iconBox: "bg-risk-high text-white", tag: "bg-risk-high text-white" },
  PreemptiveBiocontrol: { icon: Bug, row: "bg-tertiary-100/70", iconBox: "bg-tertiary-800 text-tertiary-200", tag: "bg-tertiary-800 text-tertiary-100" },
  DiagnosticTrigger: { icon: Thermometer, row: "bg-surface-muted", iconBox: "bg-neutral-100 text-neutral-700", tag: "bg-neutral-100 text-neutral-700" },
};

/** Render one recommendation. */
export function RecommendationCard({ recommendation }) {
  const { t } = useTranslation("guidance");
  const accept = useAcceptRecommendation();
  const style = PRIORITY_STYLES[recommendation.priority] ?? PRIORITY_STYLES.DiagnosticTrigger;
  const Icon = style.icon;
  const isDiagnostic = recommendation.priority === "DiagnosticTrigger";
  const isAccepted = recommendation.status === "Accepted";
  const scheduleParts = [recommendation.scheduledWindowLabel, recommendation.applicationWindowGuidance].filter(Boolean);
  const detailParts = [
    recommendation.dosageGuidance,
    typeof recommendation.pollinatorToxicityPct === "number" ? t("pollinatorToxicity", { value: recommendation.pollinatorToxicityPct }) : null,
    ...recommendation.safetyCertifications,
  ].filter(Boolean);

  return (
    <li className={cn("flex flex-wrap items-center justify-between gap-4 rounded-2xl p-4", style.row)}>
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", style.iconBox)}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-2 text-[10px] text-neutral-600">
            <span className={cn("rounded-md px-2 py-0.5 text-[9px] font-bold uppercase", style.tag)}>{t(`priority.${recommendation.priority}`)}</span>
            {isDiagnostic ? null : (
              <span>
                {recommendation.scientificName} • {recommendation.fieldName} ({t(`common:crops.${recommendation.cropType}`)})
              </span>
            )}
          </p>
          <p className="mt-1 text-sm font-bold text-neutral-800">
            {recommendation.title} {recommendation.triggerNote}
          </p>
          {isDiagnostic ? <p className="mt-1 max-w-xl text-[11px] text-neutral-600">{recommendation.description}</p> : null}
          {scheduleParts.length > 0 ? (
            <p className="mt-1 flex items-center gap-1.5 text-[11px] font-semibold text-risk-high">
              <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" />
              {scheduleParts.join(" • ")}
            </p>
          ) : null}
          {detailParts.length > 0 ? <p className="mt-0.5 text-[11px] font-semibold text-primary-700">{detailParts.join(" • ")}</p> : null}
        </div>
      </div>

      {isDiagnostic ? (
        <Link
          to={`/farm/${recommendation.farmId}/fields/${recommendation.fieldId}`}
          className="flex items-center gap-2 rounded-full border border-neutral-500 px-5 py-2 text-[11px] font-bold uppercase text-neutral-700 hover:bg-white"
        >
          <LineChart className="h-3.5 w-3.5" aria-hidden="true" />
          {t("viewGddCurve")}
        </Link>
      ) : (
        <Button
          variant={recommendation.priority === "CriticalPriority" ? "primary" : "secondary"}
          className={recommendation.priority === "CriticalPriority" ? undefined : "bg-white"}
          disabled={isAccepted || accept.isPending}
          onClick={() => accept.mutate({ id: recommendation.id })}
        >
          {isAccepted ? t("accepted") : t("recommendedAction")}
        </Button>
      )}
    </li>
  );
}
