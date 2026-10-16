/**
 * React Query wrapper for the signed-in user's organization profile.
 */
import { useQuery } from "@tanstack/react-query";
import { getData } from "@/services/apiClient";

/** Organization name, tier and counts. */
export function useOrganization() {
  return useQuery({ queryKey: ["organization"], queryFn: () => getData("/api/v1/organizations/me") });
}
