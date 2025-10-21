import api from "./client";

export const createOrder = (data) => api.post("/orders", data);
export const getOrders = () => api.get("/orders");
export const updateOrder = (id, data) => api.put(`/orders/${id}`, data);
export const deleteOrder = (id) => api.delete(`/orders/${id}`);
export const getConfirmedOrders = () => api.get("/orders/confirmed");

// Public multi-item checkout
export const createPublicOrder = (data) => api.post("/public/orders", data);
export const getMyOrders = () => api.get("/public/orders/mine");
export const cancelMyOrder = (id) => api.patch(`/public/orders/${id}/cancel`);

// ⬇️ NEW: customer updates their own order
export const updateMyOrder = (id, data) => api.put(`/public/orders/${id}`, data);
