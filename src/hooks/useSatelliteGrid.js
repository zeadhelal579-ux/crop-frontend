/**
 * React Query wrapper for the farm's satellite parcel grid (per-parcel NDVI).
 */
import { useQuery } from "@tanstack/react-query";
import { getData } from "@/services/apiClient";

/** One response carries both the satellite and NDVI layers, so toggling needs no refetch. */
export function useSatelliteGrid(farmId) {
  return useQuery({
    queryKey: ["satelliteGrid", farmId],
    queryFn: () => getData(`/api/v1/farms/${farmId}/satellite-grid`),
    enabled: Boolean(farmId),
  });
}
