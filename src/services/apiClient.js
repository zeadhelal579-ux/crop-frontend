/**
 * The single configured axios instance used by the whole app.
 *  - Request interceptor: attaches the JWT and the Accept-Language header.
 *  - Response interceptor: on 401, refreshes the access token once (shared
 *    by every request that failed at the same moment) and retries.
 *  - Mock mode: swaps the network adapter for the in-browser mock API.
 */
import axios from "axios";
import i18n from "@/i18n/i18n";
import { API_BASE_URL, USE_MOCKS } from "@/lib/env";
import { useAuthStore } from "@/stores/authStore";

/** Loads the mock adapter lazily so it never ships in a real production flow. */
const lazyMockAdapter = (config) => import("@/mocks/mockAdapter").then((module) => module.mockAdapter(config));

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  adapter: USE_MOCKS ? lazyMockAdapter : undefined,
});

/** Promise of an in-flight refresh call, shared so concurrent 401s refresh only once. */
let refreshPromise = null;

/** Ask the backend for a new access token using the HttpOnly refresh cookie. */
function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = apiClient
      .post("/api/v1/auth/refresh", null, { skipAuthRefresh: true })
      .then((response) => {
        useAuthStore.getState().setAccessToken(response.data.accessToken);
        return response.data.accessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

apiClient.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  config.headers["Accept-Language"] = i18n.language;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const isUnauthorized = error.response?.status === 401;
    if (!isUnauthorized || !original || original.skipAuthRefresh || original.alreadyRetried) {
      return Promise.reject(error);
    }
    original.alreadyRetried = true;
    try {
      await refreshAccessToken();
      return apiClient(original);
    } catch (refreshError) {
      useAuthStore.getState().clearSession();
      return Promise.reject(refreshError);
    }
  },
);

/** GET helper returning only the response body. */
export const getData = (url, config) => apiClient.get(url, config).then((response) => response.data);

/** POST helper returning only the response body. */
export const postData = (url, body, config) => apiClient.post(url, body, config).then((response) => response.data);

/** PATCH helper returning only the response body. */
export const patchData = (url, body, config) => apiClient.patch(url, body, config).then((response) => response.data);

/** DELETE helper returning only the response body. */
export const deleteData = (url, config) => apiClient.delete(url, config).then((response) => response.data);
