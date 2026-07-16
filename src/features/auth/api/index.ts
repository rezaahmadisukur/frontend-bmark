import api from "~/lib/axios";

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
    api.post<RegisterResponse>("/auth/register", data).then((req) => req.data),

  login: (data: { email: string; password: string }) =>
    api.post<LoginResponse>("/auth/login", data).then((req) => req.data),

  getProfile: () =>
    api.get<ProfileResponse>("/auth/profile").then((req) => req.data)
};
