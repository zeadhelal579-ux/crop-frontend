/**
 * Guidance screen: "Recommendations & Targeted Intervention Schedule" - the
 * open treatment recommendations of the organization, sorted by priority.
 * A ?fieldId= query narrows the list to one field (links from the dashboard
 * and the field parcel cards use it).
 */
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { RecommendationCard } from "@/components/guidance/RecommendationCard";
import { PageContainer } from "@/components/layout/PageContainer";
import { Skeleton } from "@/components/ui/skeleton";
import { useRecommendations } from "@/hooks/useRecommendations";

const PRIORITY_ORDER = { CriticalPriority: 0, PreemptiveBiocontrol: 1, DiagnosticTrigger: 2 };

/** Render the Guidance screen. */
export default function GuidancePage() {
  const { t } = useTranslation("guidance");
  const [searchParams, setSearchParams] = useSearchParams();
  const fieldId = searchParams.get("fieldId") ?? undefined;
  const { data, isLoading } = useRecommendations({ fieldId, status: "Recommended,Accepted" });
  const sorted = [...(data ?? [])].sort((a, b) => (PRIORITY_ORDER[a.priority] ?? 9) - (PRIORITY_ORDER[b.priority] ?? 9));

  return (
    <PageContainer className="pt-8">
      <section className="glass-card bg-white/95 p-6">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-neutral-200 pb-4">
          <h1 className="max-w-md text-2xl font-bold text-neutral-800">{t("title")}</h1>
          {fieldId ? (
            <button
              type="button"
              onClick={() => setSearchParams({})}
              className="flex items-center gap-1.5 rounded-full bg-neutral-800 px-3 py-1.5 text-[11px] font-semibold text-white"
            >
              {t("filteredByField")}
              <X className="h-3 w-3" aria-label={t("clearFilter")} />
            </button>
          ) : null}
        </div>

        <div className="mt-4">
          {isLoading ? <Skeleton className="h-64" /> : null}
          {!isLoading && sorted.length === 0 ? <p className="rounded-2xl bg-surface-muted p-6 text-sm text-neutral-600">{t("empty")}</p> : null}
          <ul className="space-y-3">
            {sorted.map((recommendation) => (
              <RecommendationCard key={recommendation.id} recommendation={recommendation} />
            ))}
          </ul>
        </div>
      </section>
    </PageContainer>
  );
}
