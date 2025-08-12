import RestClient from "./http";

type AuthResponse = { token: string };

export const login = async (
  username: string,
  password: string
): Promise<AuthResponse> => {
  const { data } = await RestClient.post<AuthResponse>("/login", {
    identity: username,
    password,
  });

  return data;
};

export const register = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const { data } = await RestClient.post<any>("/register", {
    email,
    password: password,
    passwordConfirm: password,
    username: email,
  });

  return data;
};

export const preLogin = async (
  username: string
): Promise<{
  exists: boolean;
}> => {
  const { data } = await RestClient.post<any>("/prelogin", {
    identity: username,
  });

  return data;
};
