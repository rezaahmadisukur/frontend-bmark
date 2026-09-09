import axios, { AxiosError, AxiosRequestConfig } from "axios";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"
});

// Interceptor: tambah token ke setiap request
axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// --- Refresh token queue ---
// Jika beberapa request 401 simultan, kita hanya ingin 1x call /auth/refresh,
// not all the others wait, trus semua retry dengan token baru.
let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) throw new Error("No refresh token available");

  // Reuse in-flight refresh promise supaya gak duplicate POST
  if (!refreshPromise) {
    refreshPromise = axiosInstance
      .post("/auth/refresh", { refreshToken })
      .then((res) => {
        const { accessToken, refreshToken: newRefresh } = res.data;
        localStorage.setItem("token", accessToken);
        localStorage.setItem("refreshToken", newRefresh);
        return accessToken;
      })
      .finally(() => {
        refreshPromise = null;
        isRefreshing = false;
      });
  }
  return refreshPromise;
}

function forceLogout() {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  window.location.href = "/login";
}

// Interceptor: tangani error 401 (access token expired) → silent refresh + retry
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as AxiosRequestConfig & { _retry?: boolean };
    const status = error.response?.status;

    // Hanya handle 401, sekali per request, dan bukan on /auth/* sendiri
    if (
      status === 401 &&
      original &&
      !original._retry &&
      !String(original.url).includes("/auth/refresh") &&
      !String(original.url).includes("/auth/login") &&
      !String(original.url).includes("/auth/register")
    ) {
      original._retry = true;
      try {
        isRefreshing = true;
        const newToken = await refreshAccessToken();
        original.headers = original.headers ?? {};
        (original.headers as Record<string, string>).Authorization =
          `Bearer ${newToken}`;
        return axiosInstance(original);
      } catch (refreshError) {
        forceLogout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
