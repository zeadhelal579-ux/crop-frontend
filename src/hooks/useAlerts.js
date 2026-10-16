/**
 * React Query wrappers for the alert history and acknowledge action.
 */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { applyOptimisticUpdate, rollbackSnapshots } from "@/lib/queryHelpers";
import { getData, postData } from "@/services/apiClient";

/** Alerts of the organization's fields (already localized by the backend). */
export function useAlerts() {
  return useQuery({ queryKey: ["alerts"], queryFn: () => getData("/api/v1/alerts") });
}

/** Acknowledge an alert with an optimistic update. */
export function useAcknowledgeAlert() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (alertId) => postData(`/api/v1/alerts/${alertId}/ack`),
    onMutate: (alertId) =>
      applyOptimisticUpdate(queryClient, ["alerts"], (item) => (item.id === alertId ? { ...item, acknowledged: true } : item)),
    onError: (_error, _alertId, snapshots) => rollbackSnapshots(queryClient, snapshots),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["alerts"] }),
  });
}
