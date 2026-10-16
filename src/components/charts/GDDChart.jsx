/**
 * Season GDD accumulation curve of a field/species pair, with a dashed
 * reference line at each life-stage threshold. The thresholds come from the
 * species object, so a recalibration shows up without a frontend deploy.
 */
import { useTranslation } from "react-i18next";
import { CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGdd } from "@/hooks/useGdd";
import { formatMonthDay } from "@/utils/formatDate";
import { stageReferenceLines } from "@/utils/gddHelpers";

/** Render the chart card. */
export function GDDChart({ fieldId, species }) {
  const { t, i18n } = useTranslation("farm");
  const { data } = useGdd(fieldId, species.id);

  if (!data) return <Skeleton className="h-80 rounded-xl3" />;

  const series = data.daily.map((entry) => ({ date: entry.date, accumulated: entry.accumulatedGdd }));

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle>{t("detail.charts.gdd", { species: species.scientificName })}</CardTitle>
      </CardHeader>
      <CardContent className="h-64" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={series} margin={{ top: 8, right: 16, left: -12, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" tickFormatter={(value) => formatMonthDay(value, i18n.language)} tick={{ fontSize: 10 }} minTickGap={32} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip labelFormatter={(value) => formatMonthDay(value, i18n.language)} />
            {stageReferenceLines(species.lifeStageThresholds).map((line) => (
              <ReferenceLine key={line.stage} y={line.value} stroke="#B3261E" strokeDasharray="4 4" label={{ value: t(`detail.stage.${line.stage}`), fontSize: 10, position: "insideTopLeft" }} />
            ))}
            <Line type="monotone" dataKey="accumulated" stroke="#0F4D10" strokeWidth={2.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
