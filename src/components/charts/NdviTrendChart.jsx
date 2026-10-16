/**
 * NDVI value over time for a field. Satellite readings (about every 5 days)
 * and on-demand drone uploads are drawn with different dot colours so a user
 * can tell where each reading came from.
 */
import { useTranslation } from "react-i18next";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useNdvi } from "@/hooks/useNdvi";
import { formatMonthDay } from "@/utils/formatDate";

const SOURCE_COLORS = { "sentinel-2": "#0F4D10", "drone-upload": "#F4C04E" };

/** Dot renderer that colours each point by its source provider. */
function SourceDot({ cx, cy, payload }) {
  return <circle cx={cx} cy={cy} r={4} fill={SOURCE_COLORS[payload.sourceProvider] ?? "#0F4D10"} stroke="#fff" strokeWidth={1.5} />;
}

/** Render the chart card. */
export function NdviTrendChart({ fieldId }) {
  const { t, i18n } = useTranslation("farm");
  const { data } = useNdvi(fieldId);

  if (!data) return <Skeleton className="h-80 rounded-xl3" />;

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle>{t("detail.charts.ndvi")}</CardTitle>
        <ul className="flex gap-3 text-[10px] text-neutral-600">
          {Object.entries(SOURCE_COLORS).map(([source, color]) => (
            <li key={source} className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} aria-hidden="true" />
              {t(`detail.source.${source}`)}
            </li>
          ))}
        </ul>
      </CardHeader>
      <CardContent className="h-64" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 16, left: -12, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="captureDate" tickFormatter={(value) => formatMonthDay(value, i18n.language)} tick={{ fontSize: 10 }} minTickGap={24} />
            <YAxis domain={[0, 1]} tick={{ fontSize: 10 }} />
            <Tooltip labelFormatter={(value) => formatMonthDay(value, i18n.language)} />
            <Line type="monotone" dataKey="ndviValue" stroke="#4CAF50" strokeWidth={2} dot={<SourceDot />} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
