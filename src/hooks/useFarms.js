/**
 * React Query wrappers for the farm endpoints (GET /api/v1/farms and detail).
 */
import { useQuery } from "@tanstack/react-query";
import { getData } from "@/services/apiClient";

/** All farms of the signed-in organization. */
export function useFarms() {
  return useQuery({ queryKey: ["farms"], queryFn: () => getData("/api/v1/farms"), staleTime: 60_000 });
}

/** One farm with its aggregated health numbers (the Farm Overview hero). */
export function useFarm(farmId) {
  return useQuery({
    queryKey: ["farm", farmId],
    queryFn: () => getData(`/api/v1/farms/${farmId}`),
    enabled: Boolean(farmId),
    staleTime: 60_000,
  });
}
