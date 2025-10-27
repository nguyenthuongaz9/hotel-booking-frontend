import axiosInstance from "../api/config/axiosInstance";

export const authService = {
  login: async (credentials) => {
    try {
      console.log(" Sending login request to /auth/login");
      const response = await axiosInstance.post("/auth/login", credentials);
      console.log(" Login successful:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        " Login service error:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },

  register: async (userData) => {
    try {
      const response = await axiosInstance.post("/auth/register", userData);
      return response.data;
    } catch (error) {
      console.error(
        " Register service error:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },

  refreshToken: async (refreshToken) => {
    try {
      const response = await axiosInstance.post("/auth/refresh", {
        refreshToken,
      });
      return response.data;
    } catch (error) {
      console.error(
        " Refresh token error:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },

  logout: async () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    window.location.href = "/login";
  },

  getCurrentUser: async () => {
    try {
      const response = await axiosInstance.get("/auth/me");
      return response.data;
    } catch (error) {
      console.log(
        "Could not fetch user data:",
        error.response?.data || error.message,
      );
      return null;
    }
  },
};
