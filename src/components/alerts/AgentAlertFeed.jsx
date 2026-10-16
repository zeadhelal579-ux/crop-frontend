/**
 * List of alert cards, each bordered by its risk colour and worded for the
 * farmer. When onAcknowledge is provided, unacknowledged alerts get an
 * "Acknowledge" button.
 */
import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getRelativeAge } from "@/utils/formatDate";
import { getRiskStyle } from "@/utils/riskColor";

/** Render the alerts. */
export function AgentAlertFeed({ alerts, onAcknowledge, emptyText }) {
  const { t } = useTranslation("common");

  if (alerts.length === 0) return <p className="rounded-2xl bg-white/80 p-4 text-sm text-neutral-600">{emptyText}</p>;

  return (
    <ul className="space-y-3">
      {alerts.map((alert) => {
        const style = getRiskStyle(alert.riskClass);
        const age = getRelativeAge(alert.timestamp);
        return (
          <li key={alert.id} className={cn("rounded-2xl border-s-4 bg-white p-4 shadow-sm", style.border, alert.acknowledged && "opacity-70")}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-bold text-neutral-800">
                {alert.fieldName} • <span className="italic">{alert.scientificName}</span>
              </p>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-neutral-500">{t(`time.${age.unit}Ago`, { value: age.value })}</span>
                <Badge className={style.badge}>{t(`risk.${alert.riskClass}`)}</Badge>
              </div>
            </div>
            <p className="mt-2 text-sm text-neutral-700">{alert.messageFarmer}</p>
            {onAcknowledge ? (
              <div className="mt-3 flex items-center justify-between">
                <span className="text-[10px] text-neutral-500">
                  {alert.generatedBy === "template_fallback" ? t("alerts.template") : t("alerts.agent")}
                </span>
                {alert.acknowledged ? (
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-secondary-600">
                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    {t("alerts.acknowledged")}
                  </span>
                ) : (
                  <Button size="sm" variant="outlined" onClick={() => onAcknowledge(alert.id)}>
                    {t("alerts.acknowledge")}
                  </Button>
                )}
              </div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
