import api from "./client";

export const getCouriers = () => api.get("/couriers");

export const getCourierReport = (month) => {
  const url = month ? `/couriers/report?month=${month}` : "/couriers/report";
  return api.get(url);
};

export const deleteCourier = (id) => api.delete(`/couriers/${id}`);
