/**
 * Live alert feed over SignalR. Keeps the 50 most recent pushed alerts and
 * refreshes the alert history cache so the bell badge stays accurate.
 * In mock mode there is no hub, so the feed simply stays empty.
 */
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { USE_MOCKS } from "@/lib/env";
import { createAlertsConnection } from "@/services/signalrClient";

const MAX_LIVE_ALERTS = 50;

/** Return the array of alerts received since the page opened (newest first). */
export function useLiveAlerts() {
  const [alerts, setAlerts] = useState([]);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (USE_MOCKS) return undefined;
    const connection = createAlertsConnection();
    connection.on("ReceiveAlert", (alert) => {
      setAlerts((previous) => [alert, ...previous].slice(0, MAX_LIVE_ALERTS));
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
    });
    connection.start().catch(() => {
      // Hub unreachable: the feed stays empty and automatic reconnect is not started.
    });
    return () => {
      connection.stop();
    };
  }, [queryClient]);

  return alerts;
}
