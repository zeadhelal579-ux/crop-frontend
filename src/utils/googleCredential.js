/**
 * Pure helpers for the Google ID token ("credential") returned by Sign in
 * with Google. The token is a JWT; its payload carries the account's name,
 * email and picture. The browser only decodes and sanity-checks it - the
 * signature can be verified by the backend alone, which must do so before
 * trusting the identity once a real /auth/google endpoint exists.
 */

const GOOGLE_ISSUERS = ["accounts.google.com", "https://accounts.google.com"];

/** Decode the JSON payload of a JWT (base64url, UTF-8 safe for Arabic names). Throws on bad input. */
export function decodeCredentialPayload(credential) {
  const part = typeof credential === "string" ? credential.split(".")[1] : undefined;
  if (!part) throw new Error("Malformed Google credential");
  const base64 = part.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(part.length / 4) * 4, "=");
  const bytes = Uint8Array.from(window.atob(base64), (character) => character.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
}

/** True when the payload was issued by Google for this app, is unexpired and has a verified email. */
export function isCredentialAcceptable(payload, clientId, now = Date.now()) {
  return (
    GOOGLE_ISSUERS.includes(payload.iss) &&
    payload.aud === clientId &&
    typeof payload.exp === "number" &&
    payload.exp * 1000 > now &&
    payload.email_verified !== false &&
    Boolean(payload.sub) &&
    Boolean(payload.email)
  );
}

/** Reduce a decoded payload to the profile fields the app uses. */
export function toGoogleProfile(payload) {
  return {
    googleId: payload.sub,
    email: payload.email,
    fullName: payload.name || payload.email.split("@")[0],
    pictureUrl: payload.picture ?? null,
  };
}
