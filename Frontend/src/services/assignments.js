// src/services/assignments.js
import api from "@/lib/api";

export async function listAssignments(params = {}) {
  const { data } = await api.get("/assignments", { params });
  return Array.isArray(data) ? data : (data.items || []);
}
export async function createAssignment(payload) {
  const { data } = await api.post("/assignments", payload);
  return data.data;
}
