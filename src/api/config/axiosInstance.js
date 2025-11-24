import axios from "axios";

const API_BASE_URL = "http://localhost:8900/api";

const tokenService = {
  getToken: () => localStorage.getItem('accessToken'),
  getRefreshToken: () => localStorage.getItem('refreshToken'),
  setToken: (token) => localStorage.setItem('accessToken', token),
  setRefreshToken: (token) => localStorage.setItem('refreshToken', token),
  clearTokens: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },
  isTokenExpired: (token) => {
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }
};

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const publicEndpoints = [
      "/auth/login", 
      "/auth/register", 
      "/auth/refresh",
      "/public"
    ];
    
    if (publicEndpoints.some((endpoint) => config.url?.includes(endpoint))) {
      return config;
    }

    const token = tokenService.getToken();
    
    if (token && !tokenService.isTokenExpired(token)) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(` Token added to request: ${config.method?.toUpperCase()} ${config.url}`);
    } else if (token) {
      console.warn("️ Token expired, will attempt refresh on response");
    }

    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`Response ${response.status}: ${response.config.url}`);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    console.error(" API Error:", {
      status: error.response?.status,
      url: originalRequest?.url,
      method: originalRequest?.method,
      error: error.response?.data,
    });

    if (error.response?.status === 401 && !originalRequest._retry) {
      const refreshToken = tokenService.getRefreshToken();
      
      if (refreshToken && !tokenService.isTokenExpired(refreshToken)) {
        originalRequest._retry = true;
        console.log(" Token expired, attempting refresh...");

        try {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken: refreshToken
          });

          const { accessToken, refreshToken: newRefreshToken } = response.data;
          
          tokenService.setToken(accessToken);
          if (newRefreshToken) {
            tokenService.setRefreshToken(newRefreshToken);
          }

          console.log(" Token refreshed successfully");
          
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return axiosInstance(originalRequest);
          
        } catch (refreshError) {
          console.error(" Token refresh failed:", refreshError);
          // tokenService.clearTokens();
          // window.location.href = "/login";
        }
      } else {
        console.error(" No valid refresh token available");
        tokenService.clearTokens();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

axiosInstance.login = async (email, password) => {
  try {
    const response = await axiosInstance.post('/auth/login', {
      email,
      password
    });
    
    const { accessToken, refreshToken } = response.data;
    tokenService.setToken(accessToken);
    tokenService.setRefreshToken(refreshToken);
    
    return response;
  } catch (error) {
    tokenService.clearTokens();
    throw error;
  }
};

axiosInstance.register = async (userData) => {
  try {
    const response = await axiosInstance.post('/auth/register', userData);
    
    const { accessToken, refreshToken } = response.data;
    tokenService.setToken(accessToken);
    tokenService.setRefreshToken(refreshToken);
    
    return response;
  } catch (error) {
    tokenService.clearTokens();
    throw error;
  }
};

axiosInstance.logout = () => {
  tokenService.clearTokens();
  window.location.href = "/login";
};

axiosInstance.getToken = () => tokenService.getToken();
axiosInstance.isAuthenticated = () => {
  const token = tokenService.getToken();
  return token && !tokenService.isTokenExpired(token);
};

export default axiosInstance;