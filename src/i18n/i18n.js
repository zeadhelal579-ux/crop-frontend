/**
 * Initialises react-i18next for the whole app (ADR-020).
 *  - One JSON namespace per screen so each screen's strings load independently.
 *  - A languageChanged side effect flips <html dir> and <html lang>; together
 *    with Tailwind logical utilities this mirrors the entire layout for Arabic.
 * Imported by main.jsx before <App /> renders, so direction is right at first paint.
 */
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enCommon from "./locales/en/common.json";
import enDashboard from "./locales/en/dashboard.json";
import enFarm from "./locales/en/farm.json";
import enPests from "./locales/en/pests.json";
import enGuidance from "./locales/en/guidance.json";
import enHelp from "./locales/en/help.json";
import arCommon from "./locales/ar/common.json";
import arDashboard from "./locales/ar/dashboard.json";
import arFarm from "./locales/ar/farm.json";
import arPests from "./locales/ar/pests.json";
import arGuidance from "./locales/ar/guidance.json";
import arHelp from "./locales/ar/help.json";

export const SUPPORTED_LANGUAGES = ["en", "ar"];
const LANGUAGE_STORAGE_KEY = "crop.language";

export const resources = {
  en: { common: enCommon, dashboard: enDashboard, farm: enFarm, pests: enPests, guidance: enGuidance, help: enHelp },
  ar: { common: arCommon, dashboard: arDashboard, farm: arFarm, pests: arPests, guidance: arGuidance, help: arHelp },
};

/** Read the saved language; storage can be blocked (private mode, in-app browsers), so never throw. */
function readSavedLanguage() {
  try {
    return window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  } catch {
    return null;
  }
}

/** Remember the chosen language; silently skipped when storage is blocked. */
function saveLanguage(language) {
  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch {
    // The language simply will not survive a reload.
  }
}

/** Pick the starting language: saved choice, then browser language, then English. */
function detectInitialLanguage() {
  const saved = readSavedLanguage();
  if (SUPPORTED_LANGUAGES.includes(saved)) return saved;
  return window.navigator.language?.toLowerCase().startsWith("ar") ? "ar" : "en";
}

/** Reflect the language on the document: text direction and lang attribute. */
function applyDocumentLanguage(language) {
  document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  document.documentElement.lang = language;
}

i18n.use(initReactI18next).init({
  resources,
  lng: detectInitialLanguage(),
  fallbackLng: "en",
  defaultNS: "common",
  ns: Object.keys(resources.en),
  interpolation: { escapeValue: false },
});

i18n.on("languageChanged", (language) => {
  saveLanguage(language);
  applyDocumentLanguage(language);
});

applyDocumentLanguage(i18n.language);

export default i18n;
