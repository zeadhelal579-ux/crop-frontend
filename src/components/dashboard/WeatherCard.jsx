/**
 * Weather card: current conditions, today's high/low, the hourly strip, the
 * comparison with the season baseline and the pressure / humidity / wind
 * chips. All values are read from stored weather; no vendor call happens here.
 */
import { CloudMoon, CloudSun, Droplets, Gauge, Sun, Wind } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useWeather } from "@/hooks/useWeather";
import { formatNumber, getRelativeAge } from "@/utils/formatDate";

const HOURLY_ICONS = { sun: Sun, partlyCloudy: CloudSun, night: CloudMoon };

/** Render the weather card for one field. */
export function WeatherCard({ fieldId }) {
  const { t, i18n } = useTranslation("dashboard");
  const { data, isLoading } = useWeather(fieldId);

  if (isLoading || !data) return <Skeleton className="h-80 rounded-xl3" />;

  const { current, hourly } = data;
  const age = getRelativeAge(current.updatedAt);
  const baselineSign = current.seasonBaselineDeltaC > 0 ? "+" : "";

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary-100 text-primary">
            <CloudSun className="h-5 w-5" aria-hidden="true" />
          </span>
          <h3 className="text-xl font-bold text-neutral-800">{t("weather.title")}</h3>
        </div>
        <span className="flex items-center gap-1 text-[11px] font-semibold text-secondary-600">
          <span className="h-1.5 w-1.5 rounded-full bg-secondary-500" aria-hidden="true" />
          {t(`common:time.${age.unit}Ago`, { value: age.value })}
        </span>
      </div>

      <div className="mt-3 flex items-start justify-between gap-2">
        <div>
          <p className="text-5xl font-bold leading-none text-neutral-800">
            {formatNumber(current.tempC, i18n.language)}°<span className="text-2xl font-semibold text-neutral-500">C</span>
          </p>
          <p className="mt-1 text-base font-semibold text-neutral-700">{t(`weather.condition.${current.condition}`)}</p>
          <p className="mt-1 max-w-[11rem] text-[11px] text-neutral-600">
            {t("weather.details", { precipitation: current.precipitationPct, dewPoint: current.dewPointC })}
          </p>
        </div>
        <div className="text-end">
          <p className="text-sm font-bold text-neutral-800">{t("weather.highLow", { high: current.highC, low: current.lowC })}</p>
          <p className="mt-1 text-[11px] font-semibold text-secondary-600">
            {t("weather.baseline", { value: `${baselineSign}${current.seasonBaselineDeltaC}` })}
          </p>
        </div>
      </div>

      <ul className="mt-3 grid grid-cols-4 gap-1 rounded-2xl bg-white/80 p-2">
        {hourly.map((hour) => {
          const Icon = HOURLY_ICONS[hour.icon] ?? Sun;
          return (
            <li key={hour.time} className="flex flex-col items-center gap-0.5 text-[11px] text-neutral-600">
              <span>{hour.time}</span>
              <Icon className="h-4 w-4 text-tertiary-500" aria-hidden="true" />
              <span className="font-bold text-neutral-800">{hour.tempC}°</span>
            </li>
          );
        })}
      </ul>

      <div className="mt-3 flex flex-wrap gap-1.5 text-[10px] font-semibold text-white">
        <span className="flex items-center gap-1 rounded-full bg-neutral-800 px-2.5 py-1">
          <Gauge className="h-3 w-3" aria-hidden="true" />
          {t("weather.pressure", { value: formatNumber(current.pressureHpa, i18n.language, { useGrouping: false }) })}
        </span>
        <span className="flex items-center gap-1 rounded-full bg-neutral-800 px-2.5 py-1">
          <Droplets className="h-3 w-3" aria-hidden="true" />
          {t("weather.humidity", { value: current.humidityPct })}
        </span>
        <span className="flex items-center gap-1 rounded-full bg-neutral-800 px-2.5 py-1">
          <Wind className="h-3 w-3" aria-hidden="true" />
          {t("weather.wind", { speed: current.windKmh, direction: current.windDirection })}
        </span>
      </div>
    </Card>
  );
}
