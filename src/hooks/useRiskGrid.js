/**
 * React Query wrapper for the regional risk map (POST /api/v1/risk/grid).
 */
import { useQuery } from "@tanstack/react-query";
import { postData } from "@/services/apiClient";

/** Risk cells inside a bounding box for one species and date range. */
export function useRiskGrid(request) {
  return useQuery({
    queryKey: ["riskGrid", request],
    queryFn: () => postData("/api/v1/risk/grid", request),
    enabled: Boolean(request?.speciesId),
    refetchInterval: 15 * 60_000,
  });
}
