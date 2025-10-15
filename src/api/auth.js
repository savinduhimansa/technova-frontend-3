import api from "./client";

export const login = (email, password) => api.post("/users/login", { email, password });
export const register = (data) => api.post("/users/register", data);
