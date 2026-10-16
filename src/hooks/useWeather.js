/**
 * React Query wrapper for stored weather: current conditions, the hourly
 * strip, daily rows and the season-baseline comparison for one field.
 */
import { useQuery } from "@tanstack/react-query";
import { getData } from "@/services/apiClient";

/** Weather for a field, including the short forecast. Never triggers a vendor call. */
export function useWeather(fieldId) {
  return useQuery({
    queryKey: ["weather", fieldId],
    queryFn: () => getData(`/api/v1/weather/${fieldId}`, { params: { includeForecast: true } }),
    enabled: Boolean(fieldId),
    refetchInterval: 15 * 60_000,
  });
}
