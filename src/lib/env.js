/**
 * Single place that reads Vite environment variables so the rest of the app
 * never touches import.meta.env directly.
 */
const env = import.meta.env;

/** Base URL of the ASP.NET Core backend (REST and the SignalR hub share it). */
export const API_BASE_URL = env.VITE_API_BASE_URL ?? "";

/**
 * When true, every REST call is answered by the in-browser mock API.
 * Mocks are ON unless VITE_USE_MOCKS is explicitly "false", so a fresh
 * deployment (for example on Vercel) works without any backend or settings.
 */
export const USE_MOCKS = env.VITE_USE_MOCKS !== "false";

/** Google Maps JavaScript API key (public by design; restrict it by HTTP referrer in Google Cloud). */
export const GOOGLE_MAPS_API_KEY = env.VITE_GOOGLE_MAPS_API_KEY ?? "";

/** True only for a real-looking Google API key; the .env placeholder does not count. */
export const HAS_GOOGLE_MAPS_KEY = GOOGLE_MAPS_API_KEY.startsWith("AIza");

/** Google OAuth "Web application" client id used by Sign in with Google (public, not a secret). */
export const GOOGLE_CLIENT_ID = env.VITE_GOOGLE_CLIENT_ID ?? "";

/** True only for a real-looking Google client id; the .env placeholder does not count. */
export const HAS_GOOGLE_CLIENT_ID = GOOGLE_CLIENT_ID.endsWith(".apps.googleusercontent.com");

/** Application id of the third-party live-chat widget (ADR-021). */
export const CHAT_WIDGET_APP_ID = env.VITE_CHAT_WIDGET_APP_ID ?? "";
