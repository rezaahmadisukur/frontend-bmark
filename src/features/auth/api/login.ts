import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MutationConfig } from "~/lib/react-query";
import { axiosInstance } from "~/lib/axios";
import { Login } from "~/types/api";
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(1, "Password is required")
});

type LoginFormData = z.infer<typeof loginSchema>;

export const login = async ({
  data
}: {
  data: LoginFormData;
}): Promise<Login> => {
  const res = await axiosInstance.post("/auth/login", data);

  return res.data;
};

type UseLogin = {
  mutationConfig?: MutationConfig<typeof login>;
};

export const useLogin = ({ mutationConfig }: UseLogin) => {
  const qc = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: login,
    onSuccess: (...args) => {
      qc.invalidateQueries({
        queryKey: ["login"]
      });

      onSuccess?.(...args);
    },
    ...restConfig
  });
};
