/**
 * One field parcel card on Farm Overview: crop and risk badge, an active-pest
 * banner, crop phenology progress, and the soil moisture / irrigation / trap
 * catch rows. The whole card opens the field page (a "stretched link": the
 * field name is the real link and covers the full card). The Recommendations
 * button opens the Guidance screen for the field's open recommendation, and
 * the trash button deletes the field; both sit above the stretched link.
 */
import { AlertTriangle, Bug, ClipboardList, Clock, Droplet } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { formatClockTime, getRelativeAge } from "@/utils/formatDate";
import { getRiskStyle } from "@/utils/riskColor";
import { DeleteFieldButton } from "./DeleteFieldButton";

/** One label/value row inside the card. */
function StatRow({ icon: Icon, label, children, className }) {
  return (
    <div className={cn("flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-[11px]", className)}>
      <span className="flex items-center gap-1.5 text-neutral-600">
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
        {label}
      </span>
      <span className="text-end font-bold text-neutral-800">{children}</span>
    </div>
  );
}

/** Render the irrigation row for the field's current irrigation state. */
function IrrigationRow({ irrigation }) {
  const { t, i18n } = useTranslation("farm");

  if (irrigation.status === "UrgentRequired") {
    return (
      <StatRow icon={Droplet} label={t("parcel.irrigationStatus")} className="bg-risk-midBg">
        <span className="text-risk-high">{t("parcel.urgentDrip")}</span>
      </StatRow>
    );
  }
  if (irrigation.status === "Scheduled") {
    return (
      <StatRow icon={Droplet} label={t("parcel.lastIrrigation")}>
        {t("parcel.scheduledAt", { time: formatClockTime(irrigation.scheduledAt, i18n.language) })}
      </StatRow>
    );
  }
  const age = getRelativeAge(irrigation.completedAt);
  return (
    <StatRow icon={Clock} label={t("parcel.lastIrrigation")}>
      {t("parcel.irrigationDone", { age: t(`common:time.${age.unit}Ago`, { value: age.value }), note: t(`parcel.irrigationNote.${irrigation.note}`) })}
    </StatRow>
  );
}

/** Render the card for one field. */
export function FieldParcelCard({ field }) {
  const { t } = useTranslation("farm");
  const navigate = useNavigate();
  const riskStyle = getRiskStyle(field.riskClass);
  const isHigh = field.riskClass === "High";
  const isMoistureLow = field.soilMoistureStatus === "Low";

  return (
    <article
      className={cn(
        "relative flex flex-col gap-3 rounded-xl3 bg-white p-4 shadow-card transition-shadow focus-within:ring-2 focus-within:ring-primary-700 hover:shadow-lg",
        isHigh && "border-t-4 border-risk-high",
      )}
      data-testid={`field-card-${field.id}`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="caption">{t("parcel.caption", { code: field.name.split(" ").pop(), area: field.areaHectares ?? "—" })}</p>
        <div className="-my-1 -me-1 flex items-center gap-1">
          <Badge className={riskStyle.badge}>{t(`common:risk.${field.riskClass}`)}</Badge>
          <DeleteFieldButton field={field} />
        </div>
      </div>

      <div>
        <Link
          to={`/farm/${field.farmId}/fields/${field.id}`}
          className="text-xl font-bold text-neutral-800 outline-none after:absolute after:inset-0 after:rounded-xl3 after:content-[''] hover:underline"
        >
          {field.name}
        </Link>
        <p className={cn("text-xs", isHigh ? "font-semibold text-risk-high" : "text-neutral-600")}>
          {t(`common:crops.${field.cropType}`)}
          {isHigh ? ` (${t("parcel.highThreat")})` : ""}
        </p>
      </div>

      {field.activeAlert ? (
        <div className="flex items-center justify-between gap-2 rounded-xl bg-risk-highBg px-3 py-2 text-[11px] font-semibold text-risk-high">
          <span className="flex items-center gap-1.5">
            <Bug className="h-3.5 w-3.5" aria-hidden="true" />
            {t("parcel.alertBanner", { species: field.activeAlert.scientificName })}
          </span>
          {field.activeAlert.actionRequired ? <span className="text-[9px] uppercase">{t("parcel.actionRequired")}</span> : null}
        </div>
      ) : null}

      <div className="rounded-xl bg-surface-muted px-3 py-2">
        <p className="caption normal-case">{t("parcel.phenology")}</p>
        <p className="mt-0.5 text-xs font-semibold text-neutral-800">
          {t("parcel.stage", { stage: t(`phenology.${field.cropPhenologyStage.stage}`), day: field.cropPhenologyStage.day })}
        </p>
        <Progress value={field.cropPhenologyStage.progressPct} className="mt-2" indicatorClassName={isHigh ? "bg-risk-high" : "bg-primary-700"} />
      </div>

      <div className="space-y-1">
        <StatRow icon={isMoistureLow ? AlertTriangle : Droplet} label={t("parcel.soilMoisture")} className={isMoistureLow ? "bg-risk-midBg" : undefined}>
          {isMoistureLow ? t("parcel.moistureLow", { value: field.soilMoisturePct }) : `${field.soilMoisturePct}%`}
        </StatRow>
        <IrrigationRow irrigation={field.irrigation} />
        <StatRow icon={Bug} label={t("parcel.trapCatch")}>
          <span className={isHigh ? "text-risk-high" : undefined}>{t("parcel.perWeek", { count: field.trapCatchPerWeek })}</span>
          {isHigh ? null : ` (${t(`parcel.trapStatus.${field.trapStatus}`)})`}
        </StatRow>
      </div>

      {field.protocolRecommendationId ? (
        <Button variant="danger" className="relative z-10 mt-auto w-full" onClick={() => navigate(`/guidance?fieldId=${field.id}`)}>
          <ClipboardList className="h-4 w-4" aria-hidden="true" />
          {t("parcel.recommendations")}
        </Button>
      ) : null}
    </article>
  );
}
