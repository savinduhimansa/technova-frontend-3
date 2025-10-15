import api from "./client";

export const askChatbot = (query) => api.post("/chatbot/query", { query });
