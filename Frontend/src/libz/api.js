// src/lib/api.js
import axios from "axios";

export const BASE_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL) ||
  "http://127.0.0.1:6868";

// Log để nhìn trực tiếp ở console xem FE đang gọi đúng base chưa
console.log("[API BASE_URL] =", BASE_URL);

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json; charset=utf-8" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let isRefreshing = false;
let queue = [];

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config || {};
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const refresh_token = localStorage.getItem("refresh_token");
          if (!refresh_token) throw new Error("No refresh token");
          const r = await axios.post(`${BASE_URL}/auth/refresh`, { refresh_token });
          const newToken = r.data?.token;
          if (!newToken) throw new Error("No token in refresh");
          localStorage.setItem("token", newToken);
          queue.forEach((cb) => cb());
          queue = [];
          return api(original);
        } catch (e) {
          queue = [];
          localStorage.removeItem("token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("role");
          localStorage.removeItem("username");
          throw e;
        } finally {
          isRefreshing = false;
        }
      }
      return new Promise((resolve) => queue.push(() => resolve(api(original))));
    }
    throw error;
  }
);

export default api;
