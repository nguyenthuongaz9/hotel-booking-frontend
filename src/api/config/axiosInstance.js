import axios from "axios";

const API_BASE_URL = "http://localhost:8900/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(` Adding token to request: ${token.substring(0, 20)}...`);
    }

    console.log(
      `Making ${config.method?.toUpperCase()} request to:`,
      config.url,
    );
    console.log(" Request data:", config.data);

    return config;
  },
  (error) => {
    console.error(" Request interceptor error:", error);
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => {
    console.log(" Response received:", response.status, response.data);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    console.error(" Response error:");
    console.error("Status:", error.response?.status);
    console.error("URL:", originalRequest?.url);
    console.error("Method:", originalRequest?.method);
    console.error("Error data:", error.response?.data);

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/login") &&
      !originalRequest.url?.includes("/auth/register")
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        console.log(" Attempting token refresh...");

        if (refreshToken) {
          const response = await axios.post(
            `${API_BASE_URL}/auth/refresh`,
            {
              refreshToken,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            },
          );

          const newToken = response.data.accessToken;
          localStorage.setItem("accessToken", newToken);
          console.log("🔄 New token stored");

          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        } else {
          console.log(" No refresh token available");
          throw new Error("No refresh token");
        }
      } catch (refreshError) {
        console.error(" Token refresh failed:", refreshError);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
