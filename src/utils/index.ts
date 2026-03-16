import axios from "axios";

export const apiClient = axios.create({
  baseURL: "https://login-web-nu1s.onrender.com", // ✅ no trailing slash
  headers: { "Content-Type": "application/json" },
});
