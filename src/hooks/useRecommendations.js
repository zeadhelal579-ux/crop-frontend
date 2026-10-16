/**
 * React Query wrappers for treatment recommendations (the Guidance screen).
 * Accept uses an optimistic update: the card changes instantly and rolls
 * back only if the request fails. (The approved design has no dismiss action.)
 */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { applyOptimisticUpdate, rollbackSnapshots } from "@/lib/queryHelpers";
import { getData, postData } from "@/services/apiClient";

/** List recommendations, optionally filtered by field, species and status. */
export function useRecommendations({ fieldId, speciesId, status } = {}) {
  return useQuery({
    queryKey: ["recommendations", { fieldId, speciesId, status }],
    queryFn: () => getData("/api/v1/recommendations", { params: { fieldId, status } }).then((list) => (speciesId ? list.filter((item) => item.speciesId === speciesId) : list)),
  });
}

/** Accept a recommendation (the "Recommended action" button) with an optimistic update. */
export function useAcceptRecommendation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }) => postData(`/api/v1/recommendations/${id}/accept`),
    onMutate: ({ id }) =>
      applyOptimisticUpdate(queryClient, ["recommendations"], (item) => (item.id === id ? { ...item, status: "Accepted" } : item)),
    onError: (_error, _variables, snapshots) => rollbackSnapshots(queryClient, snapshots),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["recommendations"] });
      queryClient.invalidateQueries({ queryKey: ["fields"] });
    },
  });
}
