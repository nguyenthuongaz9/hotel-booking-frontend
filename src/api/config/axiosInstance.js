import axios from "axios";
import keycloakService from "../../services/KeyCloakService";

const API_BASE_URL = "http://localhost:8900/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const publicEndpoints = ["/auth/login", "/auth/register", "/public"];
    if (publicEndpoints.some((endpoint) => config.url?.includes(endpoint))) {
      return config;
    }

    try {
      const token = await keycloakService.getClientToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log(
          `✅ Token added to request: ${config.method?.toUpperCase()} ${config.url}`,
        );
      }
    } catch (error) {
      console.error("❌ Failed to get token for request:", error);
    }

    return config;
  },
  (error) => {
    console.error(" Request interceptor error:", error);
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`✅ Response ${response.status}: ${response.config.url}`);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    console.error("❌ API Error:", {
      status: error.response?.status,
      url: originalRequest?.url,
      method: originalRequest?.method,
      error: error.response?.data,
    });

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      console.log("🔄 Token expired, attempting refresh...");
      keycloakService.clearToken();

      try {
        await keycloakService.getClientToken();
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("❌ Token refresh failed:", refreshError);
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
