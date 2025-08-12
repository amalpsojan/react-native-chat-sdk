import { http } from "./http";

type AuthResponse = { token: string; record: any };

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const { data } = await http.post<AuthResponse>(
    "/api/collections/users/auth-with-password",
    { identity: email, password }
  );
  return data;
};

export const register = async (email: string, password: string): Promise<any> => {
  const username = email.split("@")[0] || `user_${Date.now()}`;
  const { data } = await http.post<any>("/api/collections/users/records", {
    email,
    password,
    passwordConfirm: password,
    username,
  });
  return data;
};

export const logout = async (): Promise<void> => {
  // No-op at API level (stateless JWT). Caller should clear token from storage.
  return Promise.resolve();
};

export const refreshToken = async (token: string): Promise<string> => {
  const { data } = await http.post<AuthResponse>(
    "/api/collections/users/auth-refresh",
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data?.token;
};
