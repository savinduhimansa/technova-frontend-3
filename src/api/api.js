import api from "./client.js";

// Inventory (unchanged)
export const PRODUCTS = {
  getAll: () => api.get("/products"),
  getOne: (id) => api.get(`/products/${id}`),
  create: (data) => api.post("/products", data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  setStock: (id, quantity) => api.patch(`/products/${id}/stock`, { quantity }),
};

// Suppliers (extended, non-breaking)
export const SUPPLIERS = {
  // accepts optional query params: { search, hasPendingOrder, minPendingCount, maxPendingCount, ... }
  getAll: (params) => api.get("/suppliers", { params }),

  // keep your original name AND add an alias used by some pages
  getOne: (id) => api.get(`/suppliers/${id}`),
  getById: (id) => api.get(`/suppliers/${id}`),

  create: (data) => api.post("/suppliers", data),
  update: (id, data) => api.put(`/suppliers/${id}`, data),
  delete: (id) => api.delete(`/suppliers/${id}`),

  // description editor
  setDescription: (id, description) =>
    api.patch(`/suppliers/${id}/description`, { description }),

  // pending order helpers
  pending: {
    setStatus: (id, hasPendingOrder, note) =>
      api.patch(`/suppliers/${id}/pending/status`, { hasPendingOrder, note }),

    // If second arg is an object -> embedded entry; else treat as legacy orderId
    add: (id, entryOrOrderId, note) =>
      typeof entryOrOrderId === "object"
        ? api.post(`/suppliers/${id}/pending/add`, { entry: entryOrOrderId })
        : api.post(`/suppliers/${id}/pending/add`, { orderId: entryOrOrderId, note }),

    // If second arg is object with entryId -> remove entry; else remove orderId
    remove: (id, idOrObj) =>
      typeof idOrObj === "object" && idOrObj.entryId
        ? api.post(`/suppliers/${id}/pending/remove`, { entryId: idOrObj.entryId })
        : api.post(`/suppliers/${id}/pending/remove`, { orderId: idOrObj }),

    clear: (id) => api.post(`/suppliers/${id}/pending/clear`),
    sync: (id) => api.post(`/suppliers/${id}/pending/sync`),
  },
};
