/**
 * React Query wrapper for the trap count history of a field/species pair
 * (the data behind the trap count chart). Trap counts are not entered by the
 * farmer in this app, so there is no logging hook.
 */
import { useQuery } from "@tanstack/react-query";
import { getData } from "@/services/apiClient";

/** Trap count history of a field/species pair. */
export function useTrapCounts(fieldId, speciesId) {
  return useQuery({
    queryKey: ["trapCounts", fieldId, speciesId],
    queryFn: () => getData(`/api/v1/trap-counts/${fieldId}`, { params: { speciesId } }),
    enabled: Boolean(fieldId && speciesId),
  });
}
