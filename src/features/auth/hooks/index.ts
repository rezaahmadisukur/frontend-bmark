import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MutationConfig } from "~/lib/react-query";
import { authApi } from "../api";

export const PROFILE_KEY = ["auth", "profile"];

export function useLogin(config?: MutationConfig<typeof authApi.login>) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user));
      qc.setQueryData(PROFILE_KEY, data.user);
    },
    ...config
  });
}

export function useRegister(config?: MutationConfig<typeof authApi.register>) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user));
      qc.setQueryData(PROFILE_KEY, data.user);
    },
    ...config
  });
}

export function useProfile() {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return useQuery({
    queryKey: PROFILE_KEY,
    queryFn: authApi.getProfile,
    enabled: !!token
  });
}

export function useLogout() {
  const qc = useQueryClient();
  return () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    qc.clear();
    window.location.href = "/login";
  };
}
