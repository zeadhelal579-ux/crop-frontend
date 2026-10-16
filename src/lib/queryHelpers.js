/**
 * Helpers for optimistic updates on cached lists (alerts, recommendations).
 * The UI changes instantly; if the request fails the previous cache is restored.
 */

/** Apply updateItem to every cached list under queryKey and return snapshots for rollback. */
export async function applyOptimisticUpdate(queryClient, queryKey, updateItem) {
  await queryClient.cancelQueries({ queryKey });
  const snapshots = queryClient.getQueriesData({ queryKey });
  queryClient.setQueriesData({ queryKey }, (list) => (Array.isArray(list) ? list.map(updateItem) : list));
  return snapshots;
}

/** Restore the cache entries captured by applyOptimisticUpdate. */
export function rollbackSnapshots(queryClient, snapshots) {
  snapshots?.forEach(([key, data]) => queryClient.setQueryData(key, data));
}
