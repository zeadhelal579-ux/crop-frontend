/**
 * Alerts screen: the alert history with filters and acknowledge actions, the
 * live SignalR feed, and the regional risk map for the selected species.
 */
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AgentAlertFeed } from "@/components/alerts/AgentAlertFeed";
import { RiskMapPanel } from "@/components/alerts/RiskMapPanel";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useAcknowledgeAlert, useAlerts } from "@/hooks/useAlerts";
import { useLiveAlerts } from "@/hooks/useLiveAlerts";
import { useRiskGrid } from "@/hooks/useRiskGrid";
import { useSpecies } from "@/hooks/useSpecies";

/** Bounding box of the monitored region (Nile Delta pilot area). */
const REGION_BBOX = { minLat: 30.78, minLon: 30.38, maxLat: 30.86, maxLon: 30.48 };
const RISK_FILTERS = ["all", "Low", "Mid", "High"];
const TODAY = new Date().toISOString().slice(0, 10);

/** Render the Alerts screen. */
export default function AlertsPage() {
  const { t } = useTranslation("common");
  const alerts = useAlerts();
  const acknowledge = useAcknowledgeAlert();
  const liveAlerts = useLiveAlerts();
  const species = useSpecies();

  const [onlyUnacknowledged, setOnlyUnacknowledged] = useState(false);
  const [riskFilter, setRiskFilter] = useState("all");
  const [newestFirst, setNewestFirst] = useState(true);
  const [regionSpeciesId, setRegionSpeciesId] = useState(null);

  const speciesList = species.data ?? [];
  const activeSpeciesId = regionSpeciesId ?? speciesList[0]?.id;
  const grid = useRiskGrid(activeSpeciesId ? { ...REGION_BBOX, startDate: TODAY, endDate: TODAY, speciesId: activeSpeciesId } : null);

  const visibleAlerts = (alerts.data ?? [])
    .filter((alert) => !onlyUnacknowledged || !alert.acknowledged)
    .filter((alert) => riskFilter === "all" || alert.riskClass === riskFilter)
    .sort((a, b) => (newestFirst ? b.timestamp.localeCompare(a.timestamp) : a.timestamp.localeCompare(b.timestamp)));

  return (
    <>
      <PageHero title={t("alerts.title")} />

      <PageContainer className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <section className="glass-card p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-bold text-neutral-800">{t("alerts.history")}</h2>
            <div className="flex flex-wrap items-center gap-2">
              <Button size="sm" variant={onlyUnacknowledged ? "primary" : "outlined"} aria-pressed={onlyUnacknowledged} onClick={() => setOnlyUnacknowledged((value) => !value)}>
                {t("alerts.unacknowledged")}
              </Button>
              <Select value={riskFilter} onValueChange={setRiskFilter}>
                <SelectTrigger className="h-8 w-32 rounded-full text-xs" aria-label={t("alerts.filterRisk")}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RISK_FILTERS.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item === "all" ? t("alerts.allRisks") : t(`risk.${item}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button size="sm" variant="outlined" onClick={() => setNewestFirst((value) => !value)}>
                {newestFirst ? t("alerts.newest") : t("alerts.oldest")}
              </Button>
            </div>
          </div>
          <div className="mt-4">
            {alerts.isLoading ? (
              <Skeleton className="h-48" />
            ) : (
              <AgentAlertFeed alerts={visibleAlerts} onAcknowledge={acknowledge.mutate} emptyText={t("alerts.empty")} />
            )}
          </div>
        </section>

        <div className="space-y-5">
          <section className="glass-card p-5">
            <h2 className="flex items-center gap-2 text-lg font-bold text-neutral-800">
              <span className="h-2 w-2 animate-pulse rounded-full bg-risk-high" aria-hidden="true" />
              {t("alerts.live")}
            </h2>
            <div className="mt-3">
              <AgentAlertFeed alerts={liveAlerts} emptyText={t("alerts.liveEmpty")} />
            </div>
          </section>

          <section className="glass-card p-5">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-lg font-bold text-neutral-800">{t("alerts.regional")}</h2>
              <Select value={activeSpeciesId ?? ""} onValueChange={setRegionSpeciesId}>
                <SelectTrigger className="h-8 w-40 rounded-full text-xs" aria-label={t("alerts.regionSpecies")}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {speciesList.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.scientificName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="mt-3">{grid.data ? <RiskMapPanel data={grid.data} bbox={REGION_BBOX} /> : <Skeleton className="h-64" />}</div>
          </section>
        </div>
      </PageContainer>
    </>
  );
}
