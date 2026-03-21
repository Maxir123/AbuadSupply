// utils/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

const isVendorApi = (url = "") => url.includes("/api/vendors");

axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    const url = err?.config?.url || "";
    if ((status === 401 || status === 403) && isVendorApi(url) && typeof window !== "undefined") {
      try { localStorage.removeItem("vendorInfo"); } catch {}
      try { sessionStorage.removeItem("vendorInfo"); } catch {}
      const { pathname, search, hash } = window.location;
      if (!pathname.startsWith("/vendor/login")) {
        const next = encodeURIComponent(pathname + search + hash);
        window.location.replace(`/vendor/login?reason=expired&next=${next}`);
      }
    }
    return Promise.reject(err);
  }
);

export default axiosInstance;
