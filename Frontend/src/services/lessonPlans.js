// src/services/lessonPlans.js
import api from "@/libz/api";

export async function listLessonPlans(params = {}) {
  const { data } = await api.get("/lesson-plans", { params });
  return data.lesson_plans || data.items || [];
}
export async function createLessonPlan(payload) {
  const { data } = await api.post("/lesson-plans", payload);
  return data.data;
}
export async function deleteLessonPlan(id) {
  const { data } = await api.delete(`/lesson-plans/${id}`);
  return data;
}
