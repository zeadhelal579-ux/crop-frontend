/**
 * Test helper: builds a JWT-shaped Google credential (unsigned) so tests can
 * exercise the decoding, validation and mock sign-in paths without Google.
 */

/** Encode a string as base64url, UTF-8 safe. */
function toBase64Url(text) {
  const binary = String.fromCharCode(...new TextEncoder().encode(text));
  return window.btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** Build a fake credential for a Google account; overrides replace payload fields. */
export function makeCredential(overrides = {}) {
  const payload = {
    iss: "https://accounts.google.com",
    aud: "test-client.apps.googleusercontent.com",
    sub: "1234567890",
    email: "farmer@example.com",
    email_verified: true,
    name: "Test Farmer",
    picture: "https://lh3.googleusercontent.com/a/test",
    exp: Math.floor(Date.now() / 1000) + 3600,
    ...overrides,
  };
  return `${toBase64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }))}.${toBase64Url(JSON.stringify(payload))}.signature`;
}
