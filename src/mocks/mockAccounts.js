/**
 * Browser-side account registry for the mock API. It plays the part of the
 * backend's user table and refresh cookie while no real backend exists: a
 * Google account that signs in for the first time is registered here, and the
 * "remembered session" lets a page reload resume the session. Nothing secret
 * is stored - only profile fields and preferences.
 */
const ACCOUNTS_KEY = "crop.mock.accounts";
const SESSION_KEY = "crop.mock.session";
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

/** Read a JSON value from localStorage, falling back when it is missing or unreadable. */
function readJson(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

/** Write a JSON value; if storage is blocked the session simply will not survive a reload. */
function writeJson(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage unavailable (private mode / quota): keep working in memory only.
  }
}

/** Find a registered account by its user id, or undefined. */
export function findAccount(userId) {
  return readJson(ACCOUNTS_KEY, {})[userId];
}

/** Insert or update an account (keeps edited name, language and wording preference). */
export function saveAccount(account) {
  writeJson(ACCOUNTS_KEY, { ...readJson(ACCOUNTS_KEY, {}), [account.id]: account });
}

/** Remember which account is signed in so a reload can restore it. */
export function rememberSession(userId) {
  writeJson(SESSION_KEY, { userId, expiresAt: Date.now() + SESSION_TTL_MS });
}

/** The account of the remembered, unexpired session, or null. */
export function readRememberedAccount() {
  const remembered = readJson(SESSION_KEY, null);
  if (!remembered || remembered.expiresAt <= Date.now()) return null;
  return findAccount(remembered.userId) ?? null;
}

/** Forget the remembered session (logout). */
export function forgetSession() {
  try {
    window.localStorage.removeItem(SESSION_KEY);
  } catch {
    // Nothing to forget when storage is unavailable.
  }
}
