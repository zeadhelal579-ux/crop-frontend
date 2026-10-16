/**
 * Outbreak probability trend (last 14 days plus the short forecast) with the
 * 40% and 70% tier boundaries drawn as reference lines. Useful both for
 * growers and for eyeballing back-tests against known past outbreaks.
 */
import { useTranslation } from "react-i18next";
import { Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useRiskHistory } from "@/hooks/useFieldRisk";
import { formatMonthDay } from "@/utils/formatDate";
import { riskHex } from "@/utils/riskColor";

/** Render the chart card. */
export function RiskTrendChart({ fieldId, species }) {
  const { t, i18n } = useTranslation("farm");
  const { data } = useRiskHistory(fieldId, species.id, { daysBack: 14, daysForward: 3 });

  if (!data) return <Skeleton className="h-80 rounded-xl3" />;

  const series = data.map((entry) => ({ date: entry.date, probability: Math.round(entry.outbreakProbability7d * 100) }));

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle>{t("detail.charts.risk", { species: species.scientificName })}</CardTitle>
      </CardHeader>
      <CardContent className="h-64" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={series} margin={{ top: 8, right: 16, left: -12, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" tickFormatter={(value) => formatMonthDay(value, i18n.language)} tick={{ fontSize: 10 }} minTickGap={24} />
            <YAxis domain={[0, 100]} unit="%" tick={{ fontSize: 10 }} />
            <Tooltip labelFormatter={(value) => formatMonthDay(value, i18n.language)} />
            <ReferenceLine y={40} stroke={riskHex("Mid")} strokeDasharray="4 4" />
            <ReferenceLine y={70} stroke={riskHex("High")} strokeDasharray="4 4" />
            <Area type="monotone" dataKey="probability" stroke={riskHex("High")} fill={riskHex("High")} fillOpacity={0.15} strokeWidth={2.5} />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
