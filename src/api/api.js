import api from "./client.js";

// Inventory
export const PRODUCTS = {
  getAll: () => api.get("/products"),
  getOne: (id) => api.get(`/products/${id}`),
  create: (data) => api.post("/products", data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  setStock: (id, quantity) => api.patch(`/products/${id}/stock`, { quantity }),
};

// Suppliers
export const SUPPLIERS = {
  getAll: () => api.get("/suppliers"),
  getOne: (id) => api.get(`/suppliers/${id}`),
  create: (data) => api.post("/suppliers", data),
  update: (id, data) => api.put(`/suppliers/${id}`, data),
  delete: (id) => api.delete(`/suppliers/${id}`),
};
