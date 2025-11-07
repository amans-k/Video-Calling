import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://video-calling-h6on.onrender.com", // ✅ YEH URL DALDO
  withCredentials: true, // by adding this field browser will send the cookies to server automatically, on every single req
});

export default axiosInstance;