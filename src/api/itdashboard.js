// src/api/itdashboard.js
import api from "./client"; // your existing Axios instance

// GET /api/it-dashboard/counts  (use your actual route; if you kept /api/dashboard/counts, change it below)
export const getITDashboardCounts = () => api.get("/it-dashboard/counts");
