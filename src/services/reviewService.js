import axiosInstance from "../api/config/axiosInstance";
const reviewService = {
  getRoomReviews: async (roomId) => {
    try {
      const response = await axiosInstance.get(`/rooms/reviews/${roomId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching room reviews:', error);
      throw error;
    }
  },

  submitReview: async (reviewData) => {
    try {
      const response = await axiosInstance.post('/rooms/reviews', reviewData);
      return response.data;
    } catch (error) {
      console.error('Error submitting review:', error);
      throw error;
    }
  },

  updateReview: async (reviewId, reviewData) => {
    try {
      const response = await axiosInstance.put(`/rooms/reviews/${reviewId}`, reviewData);
      return response.data;
    } catch (error) {
      console.error('Error updating review:', error);
      throw error;
    }
  },

  deleteReview: async (reviewId) => {
    try {
      const response = await axiosInstance.delete(`/rooms/reviews/${reviewId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  },

  getUserReviews: async (userId) => {
    try {
      const response = await axiosInstance.get(`/rooms/reviews/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user reviews:', error);
      throw error;
    }
  }
};

export default reviewService;