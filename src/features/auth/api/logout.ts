import { useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";

export function useLogout() {
  const qc = useQueryClient();
  return async () => {
    // Revoke refresh token on server first (best-effort)
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      try {
        await axiosInstance.post("/auth/logout", { refreshToken });
      } catch {
        // Ignore — local logout still proceeds even if server call fails
      }
    }

    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    qc.clear();
    window.location.href = "/login";
  };
}
