/**
 * Field Detail screen: one field's monitored species (a single selector) and
 * its GDD / risk / trap / NDVI charts for the selected species. The farmer does
 * not enter data here - trap counts, soil moisture and irrigation come from the
 * field team and sensors. Charts load independently of each other.
 */
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { GDDChart } from "@/components/charts/GDDChart";
import { NdviTrendChart } from "@/components/charts/NdviTrendChart";
import { RiskTrendChart } from "@/components/charts/RiskTrendChart";
import { TrapCountChart } from "@/components/charts/TrapCountChart";
import { SpeciesSelector } from "@/components/farm/SpeciesSelector";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHero } from "@/components/layout/PageHero";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useField } from "@/hooks/useFields";
import { useSpecies } from "@/hooks/useSpecies";
import { cn } from "@/lib/utils";
import { getRiskStyle } from "@/utils/riskColor";

/** Render the field detail screen for the :fieldId route parameter. */
export default function FieldDetailPage() {
  const { t } = useTranslation("farm");
  const { fieldId } = useParams();
  const field = useField(fieldId);
  const species = useSpecies();
  const [selectedId, setSelectedId] = useState(null);

  const subscribed = (species.data ?? []).filter((item) => field.data?.subscribedSpeciesIds.includes(item.id));
  const activeSpecies = subscribed.find((item) => item.id === selectedId) ?? subscribed[0];

  return (
    <>
      <PageHero title={field.data?.name ?? t("detail.loading")}>
        <Link to="/farm" className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/25">
          <ArrowLeft className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden="true" />
          {t("detail.back")}
        </Link>
        {field.data ? (
          <>
            <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-neutral-800">
              {t(`common:crops.${field.data.cropType}`)} • {t("satellite.area", { area: field.data.areaHectares ?? "—" })}
            </span>
            <Badge className={cn("px-3 py-1.5 text-xs", getRiskStyle(field.data.riskClass).badge)}>{t(`common:risk.${field.data.riskClass}`)}</Badge>
          </>
        ) : null}
      </PageHero>

      <section className="-mb-12 mt-4 bg-surface pb-16 pt-8">
        <PageContainer className="space-y-6">
          {field.data ? (
            <div>
              <h2 className="mb-3 text-lg font-bold text-neutral-800">{t("detail.monitored")}</h2>
              <SpeciesSelector speciesList={subscribed} selectedId={activeSpecies?.id} onSelect={setSelectedId} />
            </div>
          ) : (
            <Skeleton className="h-28" />
          )}

          {activeSpecies ? (
            <div role="tabpanel" className="grid gap-5 lg:grid-cols-2">
              <GDDChart fieldId={fieldId} species={activeSpecies} />
              <RiskTrendChart fieldId={fieldId} species={activeSpecies} />
              <TrapCountChart fieldId={fieldId} species={activeSpecies} />
              <NdviTrendChart fieldId={fieldId} />
            </div>
          ) : (
            <p className="rounded-2xl bg-white p-6 text-sm text-neutral-600">{t("detail.noSpecies")}</p>
          )}
        </PageContainer>
      </section>
    </>
  );
}
