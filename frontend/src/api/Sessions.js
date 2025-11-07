import axiosInstance from "../lib/axios";

export const sessionApi = {
  createSession: async (data) => {
    const response = await axiosInstance.post("/sessions", data); // ✅ /api HATA do
    return response.data;
  },

  getActiveSessions: async () => {
    const response = await axiosInstance.get("/sessions/active"); // ✅ /api HATA do
    return response.data;
  },
  
  getMyRecentSessions: async () => {
    const response = await axiosInstance.get("/sessions/my-recent"); // ✅ /api HATA do
    return response.data;
  },

  getSessionById: async (id) => {
    const response = await axiosInstance.get(`/sessions/${id}`); // ✅ /api HATA do
    return response.data;
  },

  joinSession: async (id) => {
    const response = await axiosInstance.post(`/sessions/${id}/join`); // ✅ /api HATA do
    return response.data;
  },
  
  endSession: async (id) => {
    const response = await axiosInstance.post(`/sessions/${id}/end`); // ✅ /api HATA do
    return response.data;
  },
  
  getStreamToken: async () => {
    const response = await axiosInstance.get(`/chat/token`); // ✅ /api HATA do
    return response.data;
  },
};