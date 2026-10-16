/**
 * Dashboard screen: greeting, today's date, and the card row (GDD, target
 * pest, weather) above the 7-day Pest Risk Monitor. Each card loads its own
 * data, so one slow request never blocks the whole page.
 */
import { CalendarDays } from "lucide-react";
import { useTranslation } from "react-i18next";
import { NoFieldsNotice } from "@/components/farm/NoFieldsNotice";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHero } from "@/components/layout/PageHero";
import { GddCard } from "@/components/dashboard/GddCard";
import { PestRiskMonitorCard } from "@/components/dashboard/PestRiskMonitorCard";
import { TargetPestCard } from "@/components/dashboard/TargetPestCard";
import { WeatherCard } from "@/components/dashboard/WeatherCard";
import { useActiveField } from "@/hooks/useFields";
import { useRiskHistory } from "@/hooks/useFieldRisk";
import { useSpecies } from "@/hooks/useSpecies";
import { useAuthStore } from "@/stores/authStore";
import { useUiStore } from "@/stores/uiStore";
import { formatLongDate } from "@/utils/formatDate";
import { findTodayEntry } from "@/utils/timeline";

/** Render the dashboard. */
export default function DashboardPage() {
  const { t, i18n } = useTranslation("dashboard");
  const user = useAuthStore((state) => state.user);
  const { field, farmId, isLoading } = useActiveField();
  const species = useSpecies();
  const selectedSpeciesId = useUiStore((state) => state.selectedSpeciesId);

  const speciesList = species.data ?? [];
  const activeSpecies = speciesList.find((item) => item.id === selectedSpeciesId) ?? speciesList[0];
  const risk = useRiskHistory(field?.id, activeSpecies?.id, { daysBack: 3, daysForward: 3 });
  const todayDate = findTodayEntry(risk.data)?.date;

  return (
    <>
      <PageHero title={t("greeting", { name: user?.fullName?.split(" ")[0] ?? "" })}>
        {todayDate ? (
          <span className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-neutral-800">
            <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
            {formatLongDate(todayDate, i18n.language)}
          </span>
        ) : null}
      </PageHero>
      <PageContainer className="space-y-5">
        {!isLoading && !field ? <NoFieldsNotice /> : null}
        <div className="grid gap-5 lg:grid-cols-3">
          <GddCard fieldId={field?.id} species={activeSpecies} />
          <TargetPestCard speciesList={speciesList} species={activeSpecies} cropType={field?.cropType} />
          <WeatherCard fieldId={field?.id} />
        </div>
        <PestRiskMonitorCard fieldId={field?.id} speciesId={activeSpecies?.id} farmId={farmId} />
      </PageContainer>
    </>
  );
}
