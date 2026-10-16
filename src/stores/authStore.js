/**
 * Authentication state (Zustand). The access token lives in memory only -
 * never in localStorage - to reduce token-theft exposure through XSS. The
 * refresh token is an HttpOnly cookie managed entirely by the backend.
 */
import { create } from "zustand";

export const useAuthStore = create((set) => ({
  accessToken: null,
  user: null,
  isAuthenticated: false,
  /** True until the first silent session restore attempt has finished. */
  isBootstrapping: true,

  /** Open a session with the token and the already-loaded profile in one atomic update. */
  signIn: (accessToken, user) => set({ accessToken, user, isAuthenticated: true }),

  /** Store a rotated access token (token refresh) and keep the session authenticated. */
  setAccessToken: (accessToken) => set({ accessToken, isAuthenticated: Boolean(accessToken) }),

  /** Store the signed-in user's profile. */
  setUser: (user) => set({ user }),

  /** Forget the whole session (logout or failed refresh). */
  clearSession: () => set({ accessToken: null, user: null, isAuthenticated: false }),

  /** Mark the initial session-restore attempt as complete. */
  finishBootstrap: () => set({ isBootstrapping: false }),
}));
