import api from "./client";

export const createDelivery = (data) => api.post("/deliveries", data);
export const getDeliveries = () => api.get("/deliveries");
export const updateDeliveryStatus = (id, status) => api.put(`/deliveries/${id}/status`, { status });

// Delete delivery (optional if you support cancel/remove)
export const deleteDelivery = (id) => api.delete(`/deliveries/${id}`);
