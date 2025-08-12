import { ClientConfig } from "@/config";
import axios from "axios";

export const RestClient = axios.create({
  baseURL: ClientConfig.apiBaseUrl,
  headers: { "Content-Type": "application/json" },
});

export function setAuthToken(token?: string) {
  if (token) {
    RestClient.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete RestClient.defaults.headers.common.Authorization;
  }
}

export default RestClient;
