// src/services/orders.js
import api from "@/lib/api";

export async function listOrders(params = {}) {
  const { data } = await api.get("/orders", { params });
  return data.orders || [];
}
export async function createOrder(package_id) {
  const { data } = await api.post("/orders", { package_id });
  return data.data;
}
