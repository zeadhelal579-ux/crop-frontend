/**
 * Top-level route table and the global authentication gate.
 * Every route except /login and /register sits behind RequireAuth, the single
 * place where unauthenticated access is blocked. The signed-in screens are
 * loaded on demand (code splitting), so the login page downloads only what it needs.
 */
import { LoaderCircle } from "lucide-react";
import { Suspense, lazy, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { useAuth } from "@/hooks/useAuth";
import LoginPage from "@/routes/LoginPage";
import NotFoundPage from "@/routes/NotFoundPage";
import RegisterPage from "@/routes/RegisterPage";

const AlertsPage = lazy(() => import("@/routes/AlertsPage"));
const DashboardPage = lazy(() => import("@/routes/DashboardPage"));
const FarmOverviewPage = lazy(() => import("@/routes/FarmOverviewPage"));
const FieldDetailPage = lazy(() => import("@/routes/FieldDetailPage"));
const GuidancePage = lazy(() => import("@/routes/GuidancePage"));
const HelpPage = lazy(() => import("@/routes/HelpPage"));
const PestsPage = lazy(() => import("@/routes/PestsPage"));
const SettingsPage = lazy(() => import("@/routes/SettingsPage"));

/** Full-screen spinner shown while the session is restored or a screen is being downloaded. */
function FullPageSpinner() {
  const { t } = useTranslation("common");
  return (
    <div className="flex min-h-screen items-center justify-center bg-field text-white">
      <LoaderCircle className="h-8 w-8 animate-spin" aria-label={t("actions.loading")} />
    </div>
  );
}

/** Redirect to /login unless a session exists (waits for the first restore attempt). */
function RequireAuth() {
  const { isAuthenticated, isBootstrapping } = useAuth();
  const location = useLocation();

  if (isBootstrapping) return <FullPageSpinner />;
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace state={{ from: location }} />;
}

/** Render the route tree. */
export default function App() {
  const { restoreSession } = useAuth();

  // Try to resume a session from the refresh cookie once, when the app starts.
  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  return (
    <Suspense fallback={<FullPageSpinner />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<RequireAuth />}>
          <Route element={<AppShell />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/farm" element={<FarmOverviewPage />} />
            <Route path="/farm/:farmId/fields/:fieldId" element={<FieldDetailPage />} />
            <Route path="/pests" element={<PestsPage />} />
            <Route path="/guidance" element={<GuidancePage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
