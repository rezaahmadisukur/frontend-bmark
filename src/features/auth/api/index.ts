import { axiosInstance } from "~/lib/axios";

export interface LoginResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface RegisterResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface ProfileResponse {
  id: string;
  email: string;
  name: string;
}

export const authApi = {
  register: (data: { email: string; password: string; name?: string }) =>
    axiosInstance
      .post<RegisterResponse>("/auth/register", data)
      .then((req) => req.data),

  login: (data: { email: string; password: string }) =>
    axiosInstance
      .post<LoginResponse>("/auth/login", data)
      .then((req) => req.data),

  getProfile: () =>
    axiosInstance.get<ProfileResponse>("/auth/profile").then((req) => req.data)
};
