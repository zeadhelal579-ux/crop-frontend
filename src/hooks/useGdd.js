/**
 * React Query wrapper for the GDD accumulation series of a field/species pair.
 */
import { useQuery } from "@tanstack/react-query";
import { getData } from "@/services/apiClient";

/** Daily series, accumulated total, life stage and biofix date. */
export function useGdd(fieldId, speciesId) {
  return useQuery({
    queryKey: ["gdd", fieldId, speciesId],
    queryFn: () => getData(`/api/v1/gdd/${fieldId}/${speciesId}`),
    enabled: Boolean(fieldId && speciesId),
  });
}
