/**
 * Tests for the in-browser mock API: protected routes need a token, Google
 * sign-in registers and restores accounts, language headers localize content
 * and the session overlay makes accept actions stick.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockAdapter } from "@/mocks/mockAdapter";
import { makeCredential } from "../setup/fakeGoogleCredential";

/** Call the adapter like axios would. */
const call = (method, url, { headers = { Authorization: "Bearer test" }, params, data } = {}) =>
  mockAdapter({ method, url, headers, params, data: data ? JSON.stringify(data) : undefined });

describe("mockAdapter", () => {
  beforeEach(async () => {
    await call("post", "/api/v1/auth/logout", { headers: {} });
    window.localStorage.clear();
  });

  it("rejects protected routes without a bearer token (401)", async () => {
    await expect(call("get", "/api/v1/farms", { headers: {} })).rejects.toMatchObject({ response: { status: 401 } });
  });

  it("only refreshes the session after a sign-in", async () => {
    await expect(call("post", "/api/v1/auth/refresh", { headers: {} })).rejects.toMatchObject({ response: { status: 401 } });
    await call("post", "/api/v1/auth/google", { headers: {}, data: { credential: makeCredential(), preferredLanguage: "en" } });
    const response = await call("post", "/api/v1/auth/refresh", { headers: {} });
    expect(response.data.accessToken).toBeTruthy();
  });

  it("registers a new Google account on first sign-in and uses its profile", async () => {
    await call("post", "/api/v1/auth/google", { headers: {}, data: { credential: makeCredential({ name: "Mona Ali" }), preferredLanguage: "ar" } });
    const me = await call("get", "/api/v1/users/me");
    expect(me.data).toMatchObject({ email: "farmer@example.com", fullName: "Mona Ali", role: "OrgAdmin", preferredLanguage: "ar" });
    expect(me.data.pictureUrl).toBe("https://lh3.googleusercontent.com/a/test");
  });

  it("keeps edited preferences when the same Google account signs in again", async () => {
    const credential = makeCredential();
    await call("post", "/api/v1/auth/google", { headers: {}, data: { credential, preferredLanguage: "en" } });
    await call("patch", "/api/v1/users/me", { data: { fullName: "Edited Name", preferredLanguage: "ar" } });
    await call("post", "/api/v1/auth/logout", { headers: {} });
    await call("post", "/api/v1/auth/google", { headers: {}, data: { credential, preferredLanguage: "en" } });
    const me = await call("get", "/api/v1/users/me");
    expect(me.data).toMatchObject({ fullName: "Edited Name", preferredLanguage: "ar" });
  });

  it("resumes the remembered session after a page reload", async () => {
    await call("post", "/api/v1/auth/google", { headers: {}, data: { credential: makeCredential({ name: "Mona Ali" }), preferredLanguage: "en" } });
    // A reload wipes module memory but keeps localStorage: load a fresh copy of the adapter.
    vi.resetModules();
    const { mockAdapter: reloadedAdapter } = await import("@/mocks/mockAdapter");
    const refreshed = await reloadedAdapter({ method: "post", url: "/api/v1/auth/refresh", headers: {} });
    expect(refreshed.data.accessToken).toBeTruthy();
    const me = await reloadedAdapter({ method: "get", url: "/api/v1/users/me", headers: { Authorization: "Bearer t" } });
    expect(me.data.fullName).toBe("Mona Ali");
  });

  it("forgets the remembered session on logout", async () => {
    await call("post", "/api/v1/auth/google", { headers: {}, data: { credential: makeCredential(), preferredLanguage: "en" } });
    await call("post", "/api/v1/auth/logout", { headers: {} });
    vi.resetModules();
    const { mockAdapter: reloadedAdapter } = await import("@/mocks/mockAdapter");
    await expect(reloadedAdapter({ method: "post", url: "/api/v1/auth/refresh", headers: {} })).rejects.toMatchObject({ response: { status: 401 } });
  });

  it("rejects a malformed Google credential (401)", async () => {
    await expect(call("post", "/api/v1/auth/google", { headers: {}, data: { credential: "garbage" } })).rejects.toMatchObject({ response: { status: 401 } });
  });

  it("opens the shared demo account on request", async () => {
    await call("post", "/api/v1/auth/google", { headers: {}, data: { demo: true, preferredLanguage: "en" } });
    const me = await call("get", "/api/v1/users/me");
    expect(me.data.email).toBe("sally@crop.app");
  });

  it("returns 404 for unknown routes", async () => {
    await expect(call("get", "/api/v1/nope")).rejects.toMatchObject({ response: { status: 404 } });
  });

  it("localizes { en, ar } content using Accept-Language", async () => {
    const english = await call("get", "/api/v1/farms", { headers: { Authorization: "Bearer t", "Accept-Language": "en" } });
    const arabic = await call("get", "/api/v1/farms", { headers: { Authorization: "Bearer t", "Accept-Language": "ar" } });
    expect(english.data[0].name).toBe("El-Beheira Agricultural Estate");
    expect(arabic.data[0].name).not.toBe(english.data[0].name);
  });

  it("serves the three real species (never the fall_armyworm placeholder)", async () => {
    const response = await call("get", "/api/v1/species");
    expect(response.data.map((item) => item.scientificName)).toEqual(["Tuta absoluta", "Bemisia tabaci", "Ceratitis capitata"]);
  });

  it("classifies risk with the three-tier thresholds", async () => {
    const high = await call("get", "/api/v1/risk/field/fld-b02", { params: { speciesId: "sp-tuta" } });
    const low = await call("get", "/api/v1/risk/field/fld-b02", { params: { speciesId: "sp-ceratitis" } });
    expect(high.data.riskClass).toBe("High");
    expect(low.data.riskClass).toBe("Low");
  });

  it("remembers an accepted recommendation for the rest of the session", async () => {
    await call("post", "/api/v1/recommendations/rec-bt-b02/accept");
    const list = await call("get", "/api/v1/recommendations", { params: { status: "Accepted" } });
    expect(list.data.map((item) => item.id)).toContain("rec-bt-b02");
  });

  it("deletes a field for the rest of the session and drops its recommendations", async () => {
    await call("delete", "/api/v1/fields/fld-b02");
    const fields = await call("get", "/api/v1/farms/farm-beheira/fields");
    expect(fields.data.map((item) => item.id)).not.toContain("fld-b02");
    await expect(call("get", "/api/v1/fields/fld-b02")).rejects.toMatchObject({ response: { status: 404 } });
    const grid = await call("get", "/api/v1/farms/farm-beheira/satellite-grid");
    expect(grid.data.parcels.map((item) => item.fieldId)).not.toContain("fld-b02");
    const recommendations = await call("get", "/api/v1/recommendations");
    expect(recommendations.data.map((item) => item.fieldId)).not.toContain("fld-b02");
  });

  it("lets a field created in the session be deleted again and monitors all three species by default", async () => {
    const boundary = { type: "Polygon", coordinates: [[[30.41, 30.8], [30.42, 30.8], [30.42, 30.81], [30.41, 30.8]]] };
    const created = await call("post", "/api/v1/farms/farm-beheira/fields", { data: { name: "Field X", cropType: "tomato", boundaryGeoJson: JSON.stringify(boundary) } });
    expect(created.data.subscribedSpeciesIds).toHaveLength(3);
    await call("delete", `/api/v1/fields/${created.data.id}`);
    const fields = await call("get", "/api/v1/farms/farm-beheira/fields");
    expect(fields.data.map((item) => item.id)).not.toContain(created.data.id);
  });

  it("no longer serves the billing, regional-summary, species-subscription and manual-entry routes", async () => {
    for (const [method, url] of [
      ["get", "/api/v1/billing/plans"],
      ["get", "/api/v1/admin/regional-summary"],
      ["post", "/api/v1/fields/fld-b02/species"],
      ["post", "/api/v1/trap-counts"],
      ["post", "/api/v1/fields/fld-b02/soil-moisture"],
      ["post", "/api/v1/fields/fld-b02/irrigation"],
    ]) {
      await expect(call(method, url)).rejects.toMatchObject({ response: { status: 404 } });
    }
  });
});
