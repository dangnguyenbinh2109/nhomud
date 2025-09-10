// src/services/questions.js
import api from "@/lib/api";

export async function listQuestions(params = {}) {
  const { data } = await api.get("/questions", { params });
  // API samples return { questions: [...], status }
  return data.questions || data.items || [];
}

export async function createQuestion(payload) {
  const { data } = await api.post("/questions", payload);
  return data.data;
}

export async function updateQuestion(id, payload) {
  const { data } = await api.put(`/questions/${id}`, payload);
  return data.data;
}

export async function deleteQuestion(id) {
  const { data } = await api.delete(`/questions/${id}`);
  return data;
}

