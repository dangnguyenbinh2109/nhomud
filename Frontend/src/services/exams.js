// src/services/exams.js
import api from "@/lib/api";

export async function listExams(params = {}) {
  const { data } = await api.get("/exams", { params });
  return Array.isArray(data) ? data : (data.items || []);
}
export async function createExam(payload) {
  const { data } = await api.post("/exams", payload);
  return data.data;
}
export async function updateExam(id, payload) {
  const { data } = await api.put(`/exams/${id}`, payload);
  return data.data;
}
