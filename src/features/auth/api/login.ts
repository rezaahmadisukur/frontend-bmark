import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MutationConfig } from "~/lib/react-query";
import { axiosInstance } from "~/lib/axios";
import { Authentication } from "~/types/api";
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(1, "Password is required")
});

export type LoginFormData = z.infer<typeof loginSchema>;

type LoginResponse = Authentication;

export const login = async ({
  data
}: {
  data: LoginFormData;
}): Promise<LoginResponse> => {
  const res = await axiosInstance.post("/auth/login", data);

  return res.data;
};

type UseLogin = {
  mutationConfig?: MutationConfig<typeof login>;
};

export const useLogin = ({ mutationConfig }: UseLogin = {}) => {
  const qc = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: login,
    onSuccess: (...args) => {
      const data = args[0] as Authentication;
      // Simpan token & user ke localStorage
      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Set data profile di cache React Query
      qc.setQueryData(["auth", "profile"], data.user);

      // Redirect ke dashboard
      window.location.href = "/";

      onSuccess?.(...args);
    },
    ...restConfig
  });
};
