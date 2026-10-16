/**
 * Tests for the Google credential helpers: decoding (including Arabic names),
 * the acceptance rules (issuer, audience, expiry, verified email) and the
 * reduction to the profile the app stores.
 */
import { describe, expect, it } from "vitest";
import { decodeCredentialPayload, isCredentialAcceptable, toGoogleProfile } from "@/utils/googleCredential";
import { makeCredential } from "../setup/fakeGoogleCredential";

const CLIENT_ID = "test-client.apps.googleusercontent.com";

describe("decodeCredentialPayload", () => {
  it("reads the payload of a JWT", () => {
    expect(decodeCredentialPayload(makeCredential()).email).toBe("farmer@example.com");
  });

  it("keeps Arabic names intact (UTF-8, base64url)", () => {
    expect(decodeCredentialPayload(makeCredential({ name: "سالي حسن" })).name).toBe("سالي حسن");
  });

  it("throws on input that is not a JWT", () => {
    expect(() => decodeCredentialPayload("not-a-jwt")).toThrow();
    expect(() => decodeCredentialPayload(undefined)).toThrow();
  });
});

describe("isCredentialAcceptable", () => {
  const accept = (overrides, now) => isCredentialAcceptable(decodeCredentialPayload(makeCredential(overrides)), CLIENT_ID, now);

  it("accepts a fresh credential issued by Google for this client", () => {
    expect(accept({})).toBe(true);
    expect(accept({ iss: "accounts.google.com" })).toBe(true);
  });

  it("rejects another issuer, another audience, an expired token or an unverified email", () => {
    expect(accept({ iss: "https://evil.example" })).toBe(false);
    expect(accept({ aud: "someone-else.apps.googleusercontent.com" })).toBe(false);
    expect(accept({ exp: Math.floor(Date.now() / 1000) - 10 })).toBe(false);
    expect(accept({ email_verified: false })).toBe(false);
  });

  it("rejects a credential without a subject or email", () => {
    expect(accept({ sub: "" })).toBe(false);
    expect(accept({ email: "" })).toBe(false);
  });
});

describe("toGoogleProfile", () => {
  it("maps the payload to the stored profile", () => {
    expect(toGoogleProfile(decodeCredentialPayload(makeCredential()))).toEqual({
      googleId: "1234567890",
      email: "farmer@example.com",
      fullName: "Test Farmer",
      pictureUrl: "https://lh3.googleusercontent.com/a/test",
    });
  });

  it("falls back to the email name and a null picture", () => {
    const profile = toGoogleProfile(decodeCredentialPayload(makeCredential({ name: undefined, picture: undefined })));
    expect(profile.fullName).toBe("farmer");
    expect(profile.pictureUrl).toBeNull();
  });
});
