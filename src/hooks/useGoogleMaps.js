/**
 * Hook that loads Google Maps for the components that draw a map. It reports
 * "unavailable" (no key configured), "loading", "ready" (with the map classes)
 * or "error" (script blocked or key rejected), so each map can fall back to
 * its token-free SVG version.
 */
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { HAS_GOOGLE_MAPS_KEY } from "@/lib/env";
import { loadGoogleMaps, mapsAuthFailed, onMapsAuthFailure } from "@/services/googleMaps";

const UNAVAILABLE = { status: "unavailable", maps: null };
const LOADING = { status: "loading", maps: null };
const FAILED = { status: "error", maps: null };

/** Returns { status, maps }; maps is only set when status is "ready". */
export function useGoogleMaps() {
  const { i18n } = useTranslation();
  const [state, setState] = useState(HAS_GOOGLE_MAPS_KEY ? LOADING : UNAVAILABLE);

  useEffect(() => {
    if (!HAS_GOOGLE_MAPS_KEY) return undefined;
    let active = true;
    const stopListening = onMapsAuthFailure(() => active && setState(FAILED));
    loadGoogleMaps(i18n.language).then(
      (maps) => active && setState(mapsAuthFailed() ? FAILED : { status: "ready", maps }),
      () => active && setState(FAILED),
    );
    return () => {
      active = false;
      stopListening();
    };
  }, [i18n.language]);

  return state;
}
