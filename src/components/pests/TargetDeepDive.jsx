/**
 * "Target Deep Dive": the predicted trap count per day against the species'
 * intervention threshold (bars coloured by each day's risk class), plus the
 * "Predicted Field Impact" and "Recommended Protocol" boxes. The impact text
 * is the advisory narrative; the protocol text comes from the agronomist-
 * authored knowledge base. They are separate fields and are never merged.
 */
import { ClipboardCheck, ScanSearch, TriangleAlert } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Bar, BarChart, Cell, LabelList, ReferenceLine, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { useRecommendations } from "@/hooks/useRecommendations";
import { useRiskHistory } from "@/hooks/useFieldRisk";
import { formatWeekdayShort } from "@/utils/formatDate";
import { riskHex } from "@/utils/riskColor";

/** Render the deep dive for one field/species pair. */
export function TargetDeepDive({ fieldId, species }) {
  const { t, i18n } = useTranslation("pests");
  const history = useRiskHistory(fieldId, species.id, { daysBack: 3, daysForward: 3 });
  const recommendations = useRecommendations({ speciesId: species.id });

  if (!history.data) return <Skeleton className="h-80 rounded-xl3" />;

  const protocol = recommendations.data?.find((item) => item.priority !== "DiagnosticTrigger");
  const chartData = history.data.map((entry) => ({
    day: formatWeekdayShort(entry.date, i18n.language),
    count: entry.predictedTrapCount,
    color: riskHex(entry.riskClass),
  }));

  return (
    <section className="rounded-xl3 bg-white p-5 shadow-card">
      <h3 className="flex items-center gap-2 text-lg font-bold text-neutral-800">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-risk-highBg text-risk-high">
          <ScanSearch className="h-4 w-4" aria-hidden="true" />
        </span>
        {t("deepDive.title", { species: species.scientificName })}
      </h3>

      <div className="mt-4 grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-sm font-bold text-neutral-800">{t("deepDive.chartTitle")}</h4>
            <ul className="flex items-center gap-4 text-[10px] text-neutral-600">
              <li className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-primary-700" aria-hidden="true" />
                {t("deepDive.legendCount")}
              </li>
              <li className="flex items-center gap-1.5 font-semibold text-risk-high">
                <span className="h-0.5 w-4 bg-risk-high" aria-hidden="true" />
                {t("deepDive.legendThreshold", { value: species.trapThreshold })}
              </li>
            </ul>
          </div>
          <div className="mt-3 h-60 rounded-2xl bg-surface-muted p-3" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 16, right: 8, left: -20, bottom: 0 }}>
                <XAxis dataKey="day" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <ReferenceLine y={species.trapThreshold} stroke="#B3261E" strokeDasharray="4 4" />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  <LabelList dataKey="count" position="top" style={{ fontSize: 10, fontWeight: 700 }} />
                  {chartData.map((item) => (
                    <Cell key={item.day} fill={item.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-3">
          <div className="rounded-2xl bg-surface-muted p-4">
            <h4 className="flex items-center gap-2 text-sm font-bold text-neutral-800">
              <TriangleAlert className="h-4 w-4 text-risk-high" aria-hidden="true" />
              {t("deepDive.impactTitle")}
            </h4>
            <p className="mt-2 text-xs text-neutral-600">{protocol?.narrative ?? t("deepDive.noImpact")}</p>
          </div>
          <div className="rounded-2xl border-s-4 border-secondary-500 bg-secondary-50 p-4">
            <h4 className="flex items-center gap-2 text-sm font-bold text-neutral-800">
              <ClipboardCheck className="h-4 w-4 text-primary-700" aria-hidden="true" />
              {t("deepDive.protocolTitle")}
            </h4>
            <p className="mt-2 text-xs text-neutral-700">{protocol?.protocolSummary ?? t("deepDive.noProtocol")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
