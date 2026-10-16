/**
 * React Query wrappers for field endpoints (list, detail, create, delete) and
 * the "active field" resolver the Dashboard and Pests screens share.
 */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteData, getData, postData } from "@/services/apiClient";
import { useUiStore } from "@/stores/uiStore";
import { useFarms } from "./useFarms";

/** Field parcels of one farm (the Active Field Parcels cards). */
export function useFarmFields(farmId) {
  return useQuery({
    queryKey: ["fields", farmId],
    queryFn: () => getData(`/api/v1/farms/${farmId}/fields`),
    enabled: Boolean(farmId),
    staleTime: 60_000,
  });
}

/** One field with its latest risk, NDVI, soil moisture and irrigation summaries. */
export function useField(fieldId) {
  return useQuery({
    queryKey: ["field", fieldId],
    queryFn: () => getData(`/api/v1/fields/${fieldId}`),
    enabled: Boolean(fieldId),
  });
}

/**
 * Resolve the field the dashboard screens focus on: the user's selection,
 * else the organization's primary field, else the first field of the first farm.
 */
export function useActiveField() {
  const farms = useFarms();
  const farmId = farms.data?.[0]?.id;
  const fields = useFarmFields(farmId);
  const selectedFieldId = useUiStore((state) => state.selectedFieldId);
  const field =
    fields.data?.find((item) => item.id === selectedFieldId) ??
    fields.data?.find((item) => item.isPrimary) ??
    fields.data?.[0];
  return { field, farmId, isLoading: farms.isLoading || fields.isLoading };
}

/** Create a field under a farm and refresh the farm, field and satellite-map caches. */
export function useCreateField(farmId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (field) => postData(`/api/v1/farms/${farmId}/fields`, field),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fields", farmId] });
      queryClient.invalidateQueries({ queryKey: ["farm", farmId] });
      queryClient.invalidateQueries({ queryKey: ["farms"] });
      queryClient.invalidateQueries({ queryKey: ["satelliteGrid", farmId] });
    },
  });
}

/** Delete a field (soft delete on the backend) and refresh everything that lists or aggregates fields. */
export function useDeleteField(farmId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (fieldId) => deleteData(`/api/v1/fields/${fieldId}`),
    onSuccess: (_data, fieldId) => {
      if (useUiStore.getState().selectedFieldId === fieldId) useUiStore.getState().setSelectedFieldId(null);
      queryClient.removeQueries({ queryKey: ["field", fieldId] });
      queryClient.invalidateQueries({ queryKey: ["fields", farmId] });
      queryClient.invalidateQueries({ queryKey: ["farm", farmId] });
      queryClient.invalidateQueries({ queryKey: ["farms"] });
      queryClient.invalidateQueries({ queryKey: ["satelliteGrid", farmId] });
      queryClient.invalidateQueries({ queryKey: ["recommendations"] });
    },
  });
}
