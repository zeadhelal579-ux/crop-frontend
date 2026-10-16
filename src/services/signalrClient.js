/**
 * Factory for the SignalR connection behind the live alert feed.
 * The access token is read on every (re)connect through accessTokenFactory,
 * so a refreshed token is used automatically after a dropped connection.
 */
import { HubConnectionBuilder } from "@microsoft/signalr";
import { API_BASE_URL } from "@/lib/env";
import { useAuthStore } from "@/stores/authStore";

/** Build (but do not start) a connection to the /hubs/live-alerts hub. */
export function createAlertsConnection() {
  return new HubConnectionBuilder()
    .withUrl(`${API_BASE_URL}/hubs/live-alerts`, {
      accessTokenFactory: () => useAuthStore.getState().accessToken ?? "",
    })
    .withAutomaticReconnect()
    .build();
}
