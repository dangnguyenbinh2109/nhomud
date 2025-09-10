// src/services/auth.js
import api from "@/lib/api";

export async function login(username, password) {
  const res = await api.post("/auth/login", { username, password });
  const data = res.data || {};
  if (data?.token) {
    localStorage.setItem("token", data.token);
    if (data?.refresh_token) localStorage.setItem("refresh_token", data.refresh_token);
    if (data?.user?.role) localStorage.setItem("role", data.user.role);
    if (data?.user?.username) localStorage.setItem("username", data.user.username);
    if (data?.user?.user_id != null) localStorage.setItem("user_id", String(data.user.user_id));
    // thông báo cho Context biết auth đã thay đổi
    try { window.dispatchEvent(new Event("auth-updated")); } catch {}
  }
  return data.user;
}

export async function me() {
  try {
    const r = await api.get("/auth/me");
    return r.data?.data || r.data?.user || r.data;
  } catch {
    const r = await api.post("/auth/me");
    return r.data?.data || r.data?.user || r.data;
  }
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("role");
  localStorage.removeItem("username");
  localStorage.removeItem("user_id");
  // thông báo cho Context để đồng bộ ngay lập tức
  try { window.dispatchEvent(new Event("auth-logout")); } catch {}
}
