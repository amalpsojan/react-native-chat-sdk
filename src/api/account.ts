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

type ListResponse<T> = {
  page: number;
  perPage: number;
  totalItems: number;
  items: T[];
};

export async function userExists(identifier: string): Promise<boolean> {
  const isEmail = identifier.includes("@");
  const value = identifier.trim();
  const filter = isEmail ? `email = "${value}"` : `username = "${value}"`;
  try {
    const { data } = await http.get<ListResponse<any>>(
      "/api/collections/users/records",
      { params: { filter, page: 1, perPage: 1, skipTotal: 1 } }
    );
    return Array.isArray(data?.items) && data.items.length > 0;
  } catch (_) {
    // If server disallows public listing, fallback to unknown -> let app route to login
    return true;
  }
}
