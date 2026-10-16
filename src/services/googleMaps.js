/**
 * Loads the Google Maps JavaScript API once, on demand, using the key from
 * VITE_GOOGLE_MAPS_API_KEY. It uses the recommended "loading=async" bootstrap
 * and importLibrary(), and exposes only the classes the app needs.
 */
import { GOOGLE_MAPS_API_KEY } from "@/lib/env";

const CALLBACK_NAME = "__cropGoogleMapsReady";
const authFailureListeners = new Set();
let loadPromise = null;
let authFailed = false;

/** Build the bootstrap URL of the Maps JavaScript API. */
export function buildMapsScriptUrl(apiKey, language) {
  const params = new URLSearchParams({ key: apiKey, v: "weekly", loading: "async", language, callback: CALLBACK_NAME });
  return `https://maps.googleapis.com/maps/api/js?${params.toString()}`;
}

/** True once Google reported that the key was rejected (bad key, referrer, billing or API not enabled). */
export function mapsAuthFailed() {
  return authFailed;
}

/** Subscribe to Google's "key rejected" signal; returns an unsubscribe function. */
export function onMapsAuthFailure(listener) {
  authFailureListeners.add(listener);
  return () => authFailureListeners.delete(listener);
}

/** Import the "maps" and "core" libraries and return the classes the app uses. */
async function importMapClasses() {
  const [maps, core] = await Promise.all([window.google.maps.importLibrary("maps"), window.google.maps.importLibrary("core")]);
  const { Map, Polygon, Rectangle, OverlayView } = maps;
  const { LatLng, LatLngBounds, event } = core;
  return { Map, Polygon, Rectangle, OverlayView, LatLng, LatLngBounds, event };
}

/** Load the API (only the first call injects the script) and resolve with the map classes. */
export function loadGoogleMaps(language) {
  if (loadPromise) return loadPromise;
  loadPromise = new Promise((resolve, reject) => {
    window.gm_authFailure = () => {
      authFailed = true;
      authFailureListeners.forEach((listener) => listener());
    };
    window[CALLBACK_NAME] = () => importMapClasses().then(resolve, reject);
    const script = document.createElement("script");
    script.src = buildMapsScriptUrl(GOOGLE_MAPS_API_KEY, language);
    script.async = true;
    script.onerror = () => {
      loadPromise = null;
      script.remove();
      reject(new Error("Google Maps could not be loaded."));
    };
    document.head.append(script);
  });
  return loadPromise;
}
