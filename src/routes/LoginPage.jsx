/**
 * Login screen. Identity comes from the user's Google account (see
 * GoogleAuthPanel); a brand-new Google account is registered automatically.
 * After sign-in the user lands on the page they originally asked for (or
 * /dashboard). While the mock API is active a note says the data is sample data.
 */
import { useTranslation } from "react-i18next";
import { Link, Navigate, useLocation } from "react-router-dom";
import logoUrl from "@/assets/brand/logo.png";
import { GoogleAuthPanel } from "@/components/auth/GoogleAuthPanel";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { useAuth } from "@/hooks/useAuth";
import { USE_MOCKS } from "@/lib/env";

/** Render the login screen. */
export default function LoginPage() {
  const { t, i18n } = useTranslation("common");
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) return <Navigate to={location.state?.from?.pathname ?? "/dashboard"} replace />;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-field p-4">
      <div className="mb-4 self-end sm:absolute sm:end-6 sm:top-6">
        <LanguageSwitcher />
      </div>
      <div className="w-full max-w-md rounded-xl4 bg-surface p-8 shadow-card">
        <img src={logoUrl} alt="CROP" className="mx-auto h-16 w-auto" />
        <h1 className="mt-6 text-center text-2xl font-bold text-neutral-800">{t("auth.loginTitle")}</h1>
        <p className="mt-1 text-center text-sm text-neutral-600">{t("auth.loginSubtitle")}</p>
        <div className="mt-6">
          <GoogleAuthPanel mode="login" preferredLanguage={i18n.language} />
        </div>
        {USE_MOCKS ? <p className="mt-4 text-center text-[11px] text-neutral-500">{t("auth.demoNote")}</p> : null}
        <p className="mt-4 text-center text-xs text-neutral-600">
          {t("auth.noAccount")}{" "}
          <Link to="/register" className="font-semibold text-primary hover:underline">
            {t("auth.register")}
          </Link>
        </p>
      </div>
    </div>
  );
}
