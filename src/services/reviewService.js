import axiosInstance from "../api/config/axiosInstance";

export const reviewService = {
  getReviews: async () => {
    const response = axiosInstance.get(`/review`);
  },
};
