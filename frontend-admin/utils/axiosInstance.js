
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "",              // <- rely on Next.js rewrites
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export default axiosInstance;
