/**
 * Trap count history. Moth and whitefly species show egg / larva bars with an
 * adult line; the Medfly (McPhail traps) shows flies per trap per day.
 */
import { useTranslation } from "react-i18next";
import { Bar, CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTrapCounts } from "@/hooks/useTrapCounts";
import { formatMonthDay } from "@/utils/formatDate";

/** Render the chart card. */
export function TrapCountChart({ fieldId, species }) {
  const { t, i18n } = useTranslation("farm");
  const { data } = useTrapCounts(fieldId, species.id);

  if (!data) return <Skeleton className="h-80 rounded-xl3" />;

  const isMedfly = species.monitoringMethod === "mcphail";
  const series = [...data].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle>{t("detail.charts.traps", { species: species.scientificName })}</CardTitle>
      </CardHeader>
      <CardContent className="h-64" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={series} margin={{ top: 8, right: 16, left: -12, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" tickFormatter={(value) => formatMonthDay(value, i18n.language)} tick={{ fontSize: 10 }} minTickGap={24} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip labelFormatter={(value) => formatMonthDay(value, i18n.language)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            {isMedfly ? (
              <Line type="monotone" dataKey="fliesPerTrapPerDay" name={t("detail.series.ftd")} stroke="#B3261E" strokeWidth={2.5} dot={false} />
            ) : (
              <>
                <Bar dataKey="eggCount" name={t("detail.series.eggs")} fill="#F4C04E" />
                <Bar dataKey="larvaeCount" name={t("detail.series.larvae")} fill="#4CAF50" />
                <Line type="monotone" dataKey="adultCount" name={t("detail.series.adults")} stroke="#B3261E" strokeWidth={2.5} dot={false} />
              </>
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
