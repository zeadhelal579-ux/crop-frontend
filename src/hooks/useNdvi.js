/**
 * React Query wrapper for the NDVI history of a field (satellite and drone readings).
 */
import { useQuery } from "@tanstack/react-query";
import { getData } from "@/services/apiClient";

/** NDVI series for the field trend chart. */
export function useNdvi(fieldId) {
  return useQuery({
    queryKey: ["ndvi", fieldId],
    queryFn: () => getData(`/api/v1/fields/${fieldId}/ndvi`),
    enabled: Boolean(fieldId),
  });
}
