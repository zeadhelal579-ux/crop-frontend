/**
 * React Query wrapper for the species catalogue (the three pests of record).
 * The list already carries thermal thresholds and life-stage thresholds, so
 * screens look a species up by id instead of fetching each one separately.
 */
import { useQuery } from "@tanstack/react-query";
import { getData } from "@/services/apiClient";

/** All configured species. Rarely changes, so it is cached for a long time. */
export function useSpecies() {
  return useQuery({ queryKey: ["species"], queryFn: () => getData("/api/v1/species"), staleTime: 10 * 60_000 });
}
