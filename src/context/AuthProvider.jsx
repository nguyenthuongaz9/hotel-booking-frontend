import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services/AuthService";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const storedUser = localStorage.getItem("user");

      if (token && storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.log("Auth check failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);

      console.log(" Attempting login with:", { email });

      const response = await authService.login({
        email,
        password,
      });

      console.log(" Login response received:", response);

      if (response.accessToken) {
        localStorage.setItem("accessToken", response.accessToken);
        localStorage.setItem("refreshToken", response.refreshToken);

        const userData = {
          email: email,
          name: email.split("@")[0],
          ...response.user,
        };

        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);

        toast.success("Login successfull!");
        return response;
      } else {
        throw new Error("No access token received from server");
      }
    } catch (error) {
      console.error(" Login context error:", error);

      let errorMessage = "Login failed";

      if (error.response?.status === 401) {
        errorMessage = "Invalid email or password";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      toast.success("Logout successfull!");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setError(null);
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const response = await authService.register(userData);
      toast.success("Register successfull");
      return response;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Registration failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const clearError = () => setError(null);

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    logout,
    register,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
