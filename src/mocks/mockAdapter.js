/**
 * In-browser mock of the CROP REST API, plugged into axios as a custom
 * adapter while no real backend is connected (VITE_USE_MOCKS is not "false").
 * It answers every documented endpoint from the fixtures, honours the
 * Accept-Language header, requires a bearer token on protected routes (so the
 * 401 -> refresh flow is exercised) and keeps a small in-memory workspace so
 * accept / acknowledge / create / delete actions stick until the page is reloaded.
 * Identity is Google-based: POST /auth/google registers a new Google account
 * on first sign-in, and the account registry (mockAccounts) lets a reload
 * resume the session, just as the backend's refresh cookie will later.
 */
import { decodeCredentialPayload, toGoogleProfile } from "@/utils/googleCredential";
import { buildRiskGridResponse } from "./riskGridFixture";
import { ALERTS } from "./fixtures/alerts";
import { TICKETS } from "./fixtures/account";
import { BACKGROUND_PARCELS, FARM, FIELDS } from "./fixtures/farm";
import { buildNdviSeries, buildTrapCounts } from "./fixtures/fieldSeries";
import { buildGddSeries } from "./fixtures/gdd";
import { RECOMMENDATIONS } from "./fixtures/recommendations";
import { LATEST_RISK, buildRiskHistory, classifyRisk } from "./fixtures/risk";
import { SPECIES } from "./fixtures/species";
import { MOCK_ORGANIZATION, MOCK_USER } from "./fixtures/users";
import { findAccount, forgetSession, readRememberedAccount, rememberSession, saveAccount } from "./mockAccounts";
import { WEATHER } from "./fixtures/weather";
import { isoDay } from "./fixtures/dates";

const LATENCY_MS = 150;
const REPORT_BUILD_MS = 2500;
const OPEN_STATUSES = ["Recommended", "Accepted"];
const PUBLIC_ROUTES = ["/auth/google", "/auth/refresh", "/auth/logout"];

/** Fresh per-workspace state: the accept / acknowledge / create actions of one signed-in visit. */
function createWorkspaceState() {
  return {
    recommendationStatus: {},
    acknowledgedAlerts: new Set(),
    createdFields: [],
    deletedFieldIds: new Set(),
    tickets: [...TICKETS],
    reports: new Map(),
    counter: 1,
  };
}

/** Mutable state that lives for the lifetime of the page. */
const session = {
  loggedIn: false,
  user: { ...MOCK_USER },
  ...createWorkspaceState(),
};

/** Error thrown by handlers to produce a non-2xx response. */
class MockHttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

/** Resolve { en, ar } pairs (anywhere in the payload) to the requested language. */
function localize(value, language) {
  if (Array.isArray(value)) return value.map((item) => localize(item, language));
  if (value && typeof value === "object") {
    const keys = Object.keys(value);
    if (keys.length === 2 && "en" in value && "ar" in value) return value[language] ?? value.en;
    return Object.fromEntries(keys.map((key) => [key, localize(value[key], language)]));
  }
  return value;
}

/** Generate a unique mock id. */
function nextId(prefix) {
  session.counter += 1;
  return `${prefix}-${session.counter}`;
}

/** Current status of a recommendation, including session changes. */
function statusOf(recommendation) {
  return session.recommendationStatus[recommendation.id] ?? recommendation.status;
}

/** All live fields: fixtures plus the ones created during this session, minus the deleted ones. */
function allFields() {
  return [...FIELDS, ...session.createdFields].filter((field) => !session.deletedFieldIds.has(field.id));
}

/** Build the field DTO the frontend consumes. */
function toFieldDto(field) {
  const openCritical = RECOMMENDATIONS.find(
    (item) => item.fieldId === field.id && item.priority === "CriticalPriority" && OPEN_STATUSES.includes(statusOf(item)),
  );
  return { ...field, protocolRecommendationId: openCritical?.id ?? null };
}

/** Find a field or fail with 404. */
function requireField(fieldId) {
  const field = allFields().find((item) => item.id === fieldId);
  if (!field) throw new MockHttpError(404, "Field not found");
  return field;
}

/** Build the satellite grid response from the fields and the background plots. */
function buildSatelliteGrid() {
  const monitored = allFields().map((field) => ({
    fieldId: field.id,
    name: field.name,
    cropType: field.cropType,
    areaHectares: field.areaHectares,
    boundary: field.boundary,
    ndviValue: field.ndvi.value,
    vigorClass: field.ndvi.vigorClass,
    statusNote: field.statusNote,
    hasPestAlert: Boolean(field.activeAlert),
    alertScientificName: field.activeAlert?.scientificName ?? null,
    monitored: true,
  }));
  const background = BACKGROUND_PARCELS.map((plot) => ({
    fieldId: plot.id,
    name: plot.name,
    areaHectares: plot.areaHectares,
    boundary: plot.boundary,
    statusNote: plot.statusNote,
    monitored: false,
  }));
  return { ...FARM.satellite, parcels: [...monitored, ...background] };
}

/** Minimal valid PDF used as the downloadable report body in mock mode. */
function buildMockPdf() {
  const text = "%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 300 120]>>endobj\ntrailer<</Root 1 0 R>>\n%%EOF";
  return new Blob([text], { type: "application/pdf" });
}

/** Resolve the account behind a Google credential, registering it on the first sign-in. */
function resolveGoogleAccount(body) {
  let profile;
  try {
    profile = toGoogleProfile(decodeCredentialPayload(body?.credential));
  } catch {
    throw new MockHttpError(401, "Invalid Google credential");
  }
  const id = `usr-google-${profile.googleId}`;
  const existing = findAccount(id);
  return {
    id,
    role: "OrgAdmin",
    organizationId: MOCK_ORGANIZATION.id,
    preferredLanguage: body.preferredLanguage ?? "en",
    ...existing,
    email: profile.email,
    fullName: existing?.fullName ?? profile.fullName,
    pictureUrl: profile.pictureUrl,
  };
}

/** The shared demo account, used only when Google sign-in is not configured. */
function resolveDemoAccount(body) {
  return { ...MOCK_USER, preferredLanguage: body.preferredLanguage ?? MOCK_USER.preferredLanguage, ...findAccount(MOCK_USER.id) };
}

/** Handler table: [method, path pattern, handler(context)]. */
const routes = [
  ["POST", "/auth/google", ({ body }) => {
    const account = body?.demo ? resolveDemoAccount(body) : resolveGoogleAccount(body);
    saveAccount(account);
    rememberSession(account.id);
    session.user = account;
    session.loggedIn = true;
    return { accessToken: "mock-access-token", tokenType: "bearer" };
  }],
  ["POST", "/auth/refresh", () => {
    if (!session.loggedIn) {
      const remembered = readRememberedAccount();
      if (!remembered) throw new MockHttpError(401, "No active session");
      session.user = remembered;
      session.loggedIn = true;
    }
    return { accessToken: "mock-access-token" };
  }],
  ["POST", "/auth/logout", () => {
    session.loggedIn = false;
    forgetSession();
    Object.assign(session, createWorkspaceState());
    return null;
  }],
  ["GET", "/users/me", () => session.user],
  ["PATCH", "/users/me", ({ body }) => {
    session.user = { ...session.user, ...body };
    saveAccount(session.user);
    return session.user;
  }],
  ["POST", "/users/invite", () => ({ invitationId: nextId("inv") })],
  ["GET", "/organizations/me", () => ({ ...MOCK_ORGANIZATION, fieldCount: allFields().length })],

  ["GET", "/farms", () => [{ id: FARM.id, name: FARM.name, description: FARM.description, fieldCount: allFields().length, overallHealthScore: FARM.overallHealthScore }]],
  ["GET", "/farms/:farmId", () => ({ ...FARM, fieldCount: allFields().length })],
  ["GET", "/farms/:farmId/fields", () => allFields().map(toFieldDto)],
  ["GET", "/farms/:farmId/satellite-grid", () => buildSatelliteGrid()],
  ["POST", "/farms/:farmId/fields", ({ params, body }) => {
    const field = {
      id: nextId("fld"),
      farmId: params.farmId,
      name: body.name,
      cropType: body.cropType,
      areaHectares: body.areaHectares ?? null,
      boundary: typeof body.boundaryGeoJson === "string" ? JSON.parse(body.boundaryGeoJson) : body.boundaryGeoJson,
      plantingDate: body.plantingDate ?? null,
      isPrimary: false,
      riskClass: "Low",
      cropPhenologyStage: { stage: "Seedling", day: 1, progressPct: 5 },
      soilMoisturePct: 28,
      soilMoistureStatus: "Optimal",
      irrigation: { status: "Scheduled", scheduledAt: new Date().toISOString() },
      trapCatchPerWeek: 0,
      trapStatus: "Safe",
      ndvi: { value: 0.7, vigorClass: "ModerateStress" },
      statusNote: null,
      activeAlert: null,
      subscribedSpeciesIds: SPECIES.map((item) => item.id),
    };
    session.createdFields.push(field);
    return toFieldDto(field);
  }],

  ["GET", "/fields/:fieldId", ({ params }) => toFieldDto(requireField(params.fieldId))],
  ["PATCH", "/fields/:fieldId", ({ params, body }) => ({ ...toFieldDto(requireField(params.fieldId)), ...body })],
  ["DELETE", "/fields/:fieldId", ({ params }) => {
    session.deletedFieldIds.add(requireField(params.fieldId).id);
    return null;
  }],

  ["GET", "/species", () => SPECIES],
  ["GET", "/species/:speciesId", ({ params }) => SPECIES.find((item) => item.id === params.speciesId) ?? null],
  ["GET", "/weather/:fieldId", () => WEATHER],
  ["GET", "/gdd/:fieldId/:speciesId", ({ params }) => buildGddSeries(params.speciesId)],

  ["GET", "/risk/field/:fieldId", ({ params, query }) => {
    const latest = LATEST_RISK[query.speciesId];
    if (!latest) throw new MockHttpError(404, "Species not found");
    return { fieldId: params.fieldId, speciesId: query.speciesId, date: isoDay(0), ...latest, riskClass: classifyRisk(latest.outbreakProbability7d), isForecast: false };
  }],
  ["GET", "/risk/history/:fieldId", ({ query }) => buildRiskHistory(query.speciesId, Number(query.daysBack ?? 3), Number(query.daysForward ?? 4))],
  ["POST", "/risk/grid", ({ body }) => buildRiskGridResponse(body.speciesId)],

  ["GET", "/trap-counts/:fieldId", ({ params, query }) => buildTrapCounts(params.fieldId, query.speciesId)],

  ["GET", "/fields/:fieldId/ndvi", ({ params }) => buildNdviSeries(params.fieldId)],

  ["GET", "/recommendations", ({ query }) => {
    const wanted = query.status ? String(query.status).split(",") : null;
    const liveFieldIds = allFields().map((field) => field.id);
    return RECOMMENDATIONS.map((item) => ({ ...item, status: statusOf(item) }))
      .filter((item) => liveFieldIds.includes(item.fieldId))
      .filter((item) => !query.fieldId || item.fieldId === query.fieldId)
      .filter((item) => !wanted || wanted.includes(item.status));
  }],
  ["POST", "/recommendations/:id/accept", ({ params }) => {
    session.recommendationStatus[params.id] = "Accepted";
    return { id: params.id, status: "Accepted" };
  }],
  ["POST", "/recommendations/:id/dismiss", ({ params }) => {
    session.recommendationStatus[params.id] = "Dismissed";
    return { id: params.id, status: "Dismissed" };
  }],

  ["GET", "/alerts", () => ALERTS.map((item) => ({ ...item, acknowledged: item.acknowledged || session.acknowledgedAlerts.has(item.id) }))],
  ["POST", "/alerts/:alertId/ack", ({ params }) => {
    session.acknowledgedAlerts.add(params.alertId);
    return { id: params.alertId, acknowledged: true };
  }],

  ["POST", "/reports/generate", () => {
    const reportId = nextId("rpt");
    session.reports.set(reportId, Date.now());
    return { reportId, status: "Generating" };
  }],
  ["GET", "/reports/:reportId", ({ params }) => {
    const startedAt = session.reports.get(params.reportId);
    if (!startedAt) throw new MockHttpError(404, "Report not found");
    const isReady = Date.now() - startedAt >= REPORT_BUILD_MS;
    return isReady
      ? { reportId: params.reportId, status: "Ready", generatedAt: new Date(startedAt + REPORT_BUILD_MS).toISOString(), sizeBytes: 14 * 1024 * 1024, versionLabel: "v2.4" }
      : { reportId: params.reportId, status: "Generating" };
  }],
  ["GET", "/reports/:reportId/download", () => buildMockPdf()],

  ["GET", "/support/tickets", () => session.tickets],
  ["POST", "/support/tickets", ({ body }) => {
    const ticket = { id: nextId("tkt"), subject: body.subject, status: "Open", createdAt: new Date().toISOString() };
    session.tickets = [ticket, ...session.tickets];
    return ticket;
  }],


];

/** Compile "/farms/:farmId/fields" into a RegExp plus its parameter names. */
function compile(pattern) {
  const names = [];
  const source = pattern.replace(/:([A-Za-z]+)/g, (_match, name) => {
    names.push(name);
    return "([^/]+)";
  });
  return { regex: new RegExp(`^${source}$`), names };
}

const compiledRoutes = routes.map(([method, pattern, handler]) => ({ method, ...compile(pattern), pattern, handler }));

/** Parse a request body that axios may already have serialized to JSON text. */
function parseBody(data) {
  if (typeof data === "string" && data !== "") return JSON.parse(data);
  return data ?? {};
}

/** Build an axios-like response object. */
function buildResponse(config, status, data) {
  return { data, status, statusText: status < 400 ? "OK" : "Error", headers: {}, config, request: {} };
}

/** The axios adapter: match a route, run its handler and shape the response. */
export async function mockAdapter(config) {
  await new Promise((resolve) => setTimeout(resolve, LATENCY_MS));
  const language = config.headers?.["Accept-Language"] === "ar" ? "ar" : "en";
  const path = (config.url ?? "").split("?")[0].replace("/api/v1", "");
  const method = (config.method ?? "get").toUpperCase();

  try {
    const route = compiledRoutes
      .map((candidate) => ({ candidate, match: candidate.regex.exec(path) }))
      .find(({ candidate, match }) => match && candidate.method === method);
    if (!route) throw new MockHttpError(404, `No mock route for ${method} ${path}`);

    const isProtected = !PUBLIC_ROUTES.includes(path);
    if (isProtected && !config.headers?.Authorization) throw new MockHttpError(401, "Missing bearer token");

    const params = Object.fromEntries(route.candidate.names.map((name, index) => [name, route.match[index + 1]]));
    const result = route.candidate.handler({ params, query: config.params ?? {}, body: parseBody(config.data), language });
    const data = result instanceof Blob ? result : localize(result, language);
    return buildResponse(config, result === null ? 204 : 200, data);
  } catch (error) {
    if (!(error instanceof MockHttpError)) throw error;
    const failure = new Error(error.message);
    failure.isAxiosError = true;
    failure.config = config;
    failure.response = buildResponse(config, error.status, { title: error.message });
    throw failure;
  }
}
