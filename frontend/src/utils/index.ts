import axios, { AxiosHeaders } from "axios";

const baseURL =
  import.meta.env.VITE_API_URL?.toString() || "https://login-web-nu1s.onrender.com";

export const apiClient = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    const headers = AxiosHeaders.from(config.headers);
    headers.set("Authorization", `Bearer ${token}`);
    config.headers = headers;
  }
  return config;
});
