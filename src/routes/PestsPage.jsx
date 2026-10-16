/**
 * Pests screen: one card per species (activity, GDD progress, predicted stage,
 * emergence ETA) and the "Target Deep Dive" of the selected species. The
 * deep dive opens on the species named in the ?species= link (the Target Pest
 * card's expand arrow), otherwise on the species with the highest outbreak
 * probability.
 */
import { CalendarDays } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useQueries } from "@tanstack/react-query";
import { NoFieldsNotice } from "@/components/farm/NoFieldsNotice";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHero } from "@/components/layout/PageHero";
import { SpeciesCard } from "@/components/pests/SpeciesCard";
import { TargetDeepDive } from "@/components/pests/TargetDeepDive";
import { fieldRiskQuery } from "@/hooks/useFieldRisk";
import { useActiveField } from "@/hooks/useFields";
import { useSpecies } from "@/hooks/useSpecies";
import { formatLongDate } from "@/utils/formatDate";

/** Render the Pests screen. */
export default function PestsPage() {
  const { t, i18n } = useTranslation("pests");
  const { field, isLoading } = useActiveField();
  const [searchParams] = useSearchParams();
  const species = useSpecies();
  const speciesList = species.data ?? [];
  const [selectedId, setSelectedId] = useState(null);

  const riskResults = useQueries({ queries: speciesList.map((item) => fieldRiskQuery(field?.id, item.id)) });
  const topIndex = riskResults.reduce(
    (best, result, index) => ((result.data?.outbreakProbability7d ?? -1) > (riskResults[best]?.data?.outbreakProbability7d ?? -1) ? index : best),
    0,
  );
  const requestedId = searchParams.get("species");
  const activeSpecies = speciesList.find((item) => item.id === (selectedId ?? requestedId)) ?? speciesList[topIndex];
  const todayDate = riskResults.find((result) => result.data)?.data.date;

  return (
    <>
      <PageHero title={t("title")}>
        {todayDate ? (
          <span className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-neutral-800">
            <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
            {formatLongDate(todayDate, i18n.language)}
          </span>
        ) : null}
        <span className="flex items-center gap-1.5 rounded-full bg-secondary-400 px-3 py-1.5 text-xs font-bold text-primary-900">
          <span className="h-1.5 w-1.5 rounded-full bg-primary-900" aria-hidden="true" />
          {t("modeled", { count: speciesList.length })}
        </span>
      </PageHero>

      <PageContainer>
        {!isLoading && !field ? <NoFieldsNotice /> : null}
        <div className="grid gap-5 lg:grid-cols-3">
          {speciesList.map((item) => (
            <SpeciesCard key={item.id} species={item} fieldId={field?.id} isSelected={item.id === activeSpecies?.id} onSelect={setSelectedId} />
          ))}
        </div>
      </PageContainer>

      <section className="-mb-12 mt-8 bg-surface pb-16 pt-6">
        <PageContainer>{activeSpecies ? <TargetDeepDive fieldId={field?.id} species={activeSpecies} /> : null}</PageContainer>
      </section>
    </>
  );
}
