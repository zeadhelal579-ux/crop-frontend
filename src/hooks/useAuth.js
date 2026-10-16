/**
 * Authentication hook: wraps authStore plus the Google sign-in / logout
 * actions and the silent session restore that runs once on app start.
 * Sign-in and registration are the same step with Google: the backend creates
 * the account the first time it sees a Google identity (POST /auth/google).
 * Token refresh on 401 lives in services/apiClient.js, not here.
 */
import { useCallback } from "react";
import i18n from "@/i18n/i18n";
import { getData, postData } from "@/services/apiClient";
import { useAuthStore } from "@/stores/authStore";

/** Load the profile with the new token, open the session, then align the UI language. */
async function startSession(accessToken) {
  const profile = await getData("/api/v1/users/me", { headers: { Authorization: `Bearer ${accessToken}` } });
  useAuthStore.getState().signIn(accessToken, profile);
  if (profile.preferredLanguage) await i18n.changeLanguage(profile.preferredLanguage);
}

/** Expose the current user and the auth actions to components. */
export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isBootstrapping = useAuthStore((state) => state.isBootstrapping);

  /** Sign in (or register on first use) with the credential returned by the Google button. */
  const signInWithGoogle = useCallback(async ({ credential, preferredLanguage }) => {
    const { accessToken } = await postData("/api/v1/auth/google", { credential, preferredLanguage });
    await startSession(accessToken);
  }, []);

  /** Open the shared demo account; only offered while Google sign-in is not configured. */
  const signInAsDemo = useCallback(async ({ preferredLanguage }) => {
    const { accessToken } = await postData("/api/v1/auth/google", { demo: true, preferredLanguage });
    await startSession(accessToken);
  }, []);

  const logout = useCallback(async () => {
    try {
      await postData("/api/v1/auth/logout");
    } finally {
      useAuthStore.getState().clearSession();
    }
  }, []);

  /** Try to resume a session from the refresh cookie (called once by App). */
  const restoreSession = useCallback(async () => {
    try {
      const { accessToken } = await postData("/api/v1/auth/refresh", null, { skipAuthRefresh: true });
      await startSession(accessToken);
    } catch {
      useAuthStore.getState().clearSession();
    } finally {
      useAuthStore.getState().finishBootstrap();
    }
  }, []);

  return { user, isAuthenticated, isBootstrapping, signInWithGoogle, signInAsDemo, logout, restoreSession };
}
