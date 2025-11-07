import axiosInstance from "../lib/axios";

export const sessionApi = {
  createSession: async (data) => {
    const response = await axiosInstance.post("/api/sessions", data); // ✅ /api add karo
    return response.data;
  },

  getActiveSessions: async () => {
    const response = await axiosInstance.get("/api/sessions/active"); // ✅ /api add karo
    return response.data;
  },
  
  getMyRecentSessions: async () => {
    const response = await axiosInstance.get("/api/sessions/my-recent"); // ✅ /api add karo
    return response.data;
  },

  getSessionById: async (id) => {
    const response = await axiosInstance.get(`/api/sessions/${id}`); // ✅ /api add karo
    return response.data;
  },

  joinSession: async (id) => {
    const response = await axiosInstance.post(`/api/sessions/${id}/join`); // ✅ /api add karo
    return response.data;
  },
  
  endSession: async (id) => {
    const response = await axiosInstance.post(`/api/sessions/${id}/end`); // ✅ /api add karo
    return response.data;
  },
  
  getStreamToken: async () => {
    const response = await axiosInstance.get(`/api/chat/token`); // ✅ /api add karo
    return response.data;
  },
};