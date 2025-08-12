import axios from 'axios';

export function getBaseUrl(): string {
  // eslint-disable-next-line no-undef
  const envUrl = (process as any)?.env?.EXPO_PUBLIC_PB_URL;
  return envUrl?.trim() || 'http://127.0.0.1:8090';
}

export const http = axios.create({
  baseURL: getBaseUrl(),
  headers: { 'Content-Type': 'application/json' },
});

export function setAuthToken(token?: string) {
  if (token) {
    http.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete http.defaults.headers.common.Authorization;
  }
}


