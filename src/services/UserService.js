import axiosInstance from "../api/config/axiosInstance";

export const userService = {
  getCurrentUser: async () => {
    try {
      const response = await axiosInstance.get("/user/me");
      console.log("get current user response :", response)
      return response.data;
    } catch (error) {
      console.error(
        " Login service error:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },
  
  updateUserProfile: async ({id, userData}) => {
    try {
     const response = await axiosInstance.patch(`/user/${id}`, userData);
      return response.data; 
    } catch (error) {
      console.error(
        " Update user profile error:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },

  getAllUsers: async (page = 0, size = 10, sortBy = 'createdAt', sortDirection = 'desc', search = '') => {
    try {
      const params = {
        page,
        size,
        sortBy,
        sortDirection
      };
      
      if (search) {
        params.search = search;
      }

      const response = await axiosInstance.get('/user', { params });
      return response.data;
    } catch (error) {
      console.error(
        "Get all users error:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },

  getUserById: async (id) => {
    try {
      const response = await axiosInstance.get(`/user/${id}`);
      return response.data;
    } catch (error) {
      console.error(
        "Get user by ID error:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },

  updateUserAdmin: async (id, userData) => {
    try {
      const response = await axiosInstance.put(`/user/${id}/admin`, userData);
      return response.data;
    } catch (error) {
      console.error(
        "Update user admin error:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },

  deleteUser: async (id) => {
    try {
      const response = await axiosInstance.delete(`/user/${id}`);
      return response.data;
    } catch (error) {
      console.error(
        "Delete user error:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },

  registerUser: async (userData) => {
    try {
      const response = await axiosInstance.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error(
        "Register user error:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },
  

  
};