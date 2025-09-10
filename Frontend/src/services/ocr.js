// src/services/ocr.js
import api from "@/lib/api";

// Backend consolidates OCR into POST /ocr/upload
export async function ocrExtractText(image_base64) {
  const { data } = await api.post("/ocr/upload", { image_base64 });
  // Expected: { status, message, data: { text } }
  return data?.data?.text || "";
}

export async function ocrGrade({ exam_id, student_name, image_base64 }) {
  const { data } = await api.post("/ocr/upload", { exam_id, student_name, image_base64 });
  // Expected: { status, message, data: { ocr_id, exam_id, score, student_name, processed_at } }
  return data?.data;
}

export async function listOcrResults() {
  const { data } = await api.get("/ocr/results");
  return data?.data || [];
}
