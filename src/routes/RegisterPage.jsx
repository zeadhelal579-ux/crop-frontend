/**
 * Registration screen. Registering means signing in with a Google account for
 * the first time: the account is created automatically, so there is no
 * password to choose. The language picked here becomes the new account's
 * preferredLanguage (UI language and the language of AI-written content).
 */
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, Navigate, useLocation } from "react-router-dom";
import logoUrl from "@/assets/brand/logo.png";
import { GoogleAuthPanel } from "@/components/auth/GoogleAuthPanel";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { SUPPORTED_LANGUAGES } from "@/i18n/i18n";
import { USE_MOCKS } from "@/lib/env";

/** Render the registration screen. */
export default function RegisterPage() {
  const { t, i18n } = useTranslation("common");
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [language, setLanguage] = useState(i18n.language);

  if (isAuthenticated) return <Navigate to={location.state?.from?.pathname ?? "/dashboard"} replace />;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-field p-4">
      <div className="mb-4 self-end sm:absolute sm:end-6 sm:top-6">
        <LanguageSwitcher />
      </div>
      <div className="w-full max-w-md rounded-xl4 bg-surface p-8 shadow-card">
        <img src={logoUrl} alt="CROP" className="mx-auto h-14 w-auto" />
        <h1 className="mt-5 text-center text-2xl font-bold text-neutral-800">{t("auth.registerTitle")}</h1>
        <p className="mt-1 text-center text-sm text-neutral-600">{t("auth.registerSubtitle")}</p>
        <div className="mt-5 space-y-4">
          <div>
            <Label htmlFor="register-language">{t("auth.language")}</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger id="register-language">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SUPPORTED_LANGUAGES.map((code) => (
                  <SelectItem key={code} value={code}>
                    {t(`language.names.${code}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <GoogleAuthPanel mode="register" preferredLanguage={language} />
        </div>
        {USE_MOCKS ? <p className="mt-4 text-center text-[11px] text-neutral-500">{t("auth.demoNote")}</p> : null}
        <p className="mt-4 text-center text-xs text-neutral-600">
          {t("auth.haveAccount")}{" "}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            {t("auth.login")}
          </Link>
        </p>
      </div>
    </div>
  );
}
