import { useQueryClient, useMutation } from "@tanstack/react-query";
import { MutationConfig } from "~/lib/react-query";
import { axiosInstance } from "~/lib/axios";
import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
  name: z.string().min(1, "Name is required")
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const register = async ({ data }: { data: RegisterFormData }) => {
  const res = await axiosInstance.post("/auth/register", data);

  return res.data;
};

type UseRegister = {
  mutationConfig?: MutationConfig<typeof register>;
};

export const useRegister = ({ mutationConfig }: UseRegister) => {
  const qc = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: register,
    onSuccess: (...args) => {
      qc.invalidateQueries({
        queryKey: ["register"]
      });
      onSuccess?.(...args);
    },
    ...restConfig
  });
};
