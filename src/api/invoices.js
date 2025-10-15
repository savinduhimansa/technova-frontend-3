import api from "./client";

export const generateInvoice = (orderId) => api.get(`/invoices/${orderId}`, {
  responseType: "blob" 
});

export const listInvoices = () => api.get("/invoices");
