/**
 * React Query wrappers for technical field tickets (ADR-021).
 */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getData, postData } from "@/services/apiClient";

/** The signed-in user's ticket history. */
export function useSupportTickets() {
  return useQuery({ queryKey: ["supportTickets"], queryFn: () => getData("/api/v1/support/tickets") });
}

/** Submit a new ticket and refresh the history. */
export function useCreateTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ticket) => postData("/api/v1/support/tickets", ticket),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["supportTickets"] }),
  });
}
