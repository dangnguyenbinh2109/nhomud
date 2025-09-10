// src/services/packages.js
import api from "@/lib/api";

export async function listPackages(params = {}) {
  const { data } = await api.get("/packages", { params });
  return data?.packages || [];
}

// For manager role (not used here by teacher)
export async function createPackage(payload) {
  const { data } = await api.post("/packages", payload);
  return data?.data;
}

export async function updatePackage(id, payload) {
  const { data } = await api.put(`/packages/${id}`, payload);
  return data?.data;
}

export async function deletePackage(id) {
  const { data } = await api.delete(`/packages/${id}`);
  return data;
}

