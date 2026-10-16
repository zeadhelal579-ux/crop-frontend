/**
 * React Query wrappers for outbreak risk of one field: the latest score and
 * the mixed past-actual / future-forecast history window.
 * Scores update once a day server-side, so these refetch on a slow interval.
 */
import { useQuery } from "@tanstack/react-query";
import { getData } from "@/services/apiClient";

const REFRESH_INTERVAL_MS = 15 * 60_000;

/** Query options for the latest risk of a field/species pair (shared with useQueries callers). */
export function fieldRiskQuery(fieldId, speciesId) {
  return {
    queryKey: ["risk", fieldId, speciesId],
    queryFn: () => getData(`/api/v1/risk/field/${fieldId}`, { params: { speciesId } }),
    enabled: Boolean(fieldId && speciesId),
    refetchInterval: REFRESH_INTERVAL_MS,
  };
}

/** Latest risk score for a field/species pair. */
export function useFieldRisk(fieldId, speciesId) {
  return useQuery(fieldRiskQuery(fieldId, speciesId));
}

/** Risk history window, e.g. 3 days back and 3 days forward for the 7-day monitor. */
export function useRiskHistory(fieldId, speciesId, { daysBack = 3, daysForward = 3 } = {}) {
  return useQuery({
    queryKey: ["riskHistory", fieldId, speciesId, daysBack, daysForward],
    queryFn: () => getData(`/api/v1/risk/history/${fieldId}`, { params: { speciesId, daysBack, daysForward } }),
    enabled: Boolean(fieldId && speciesId),
    refetchInterval: REFRESH_INTERVAL_MS,
  });
}
