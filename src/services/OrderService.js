import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getUserIdFromStorage = () => {
  try {
    const userData = localStorage.getItem("user");
    if (!userData) return null;

    const user = JSON.parse(userData);
    return user?.id || null;
  } catch (error) {
    console.error("Error getting user ID from storage:", error);
    return null;
  }
};

const orderService = {
  createOrder: async (orderData) => {
    try {
      console.log("Creating order with data:", orderData);

      if (!orderData.userId) {
        throw new Error("User ID is required");
      }
      if (!orderData.roomId) {
        throw new Error("Room ID is required");
      }
      if (!orderData.checkIn) {
        throw new Error("Check-in date is required");
      }
      if (!orderData.checkOut) {
        throw new Error("Check-out date is required");
      }
      if (!orderData.totalPrice || orderData.totalPrice <= 0) {
        throw new Error("Total price is required and must be greater than 0");
      }

      const orderPayload = {
        userId: orderData.userId,
        roomId: orderData.roomId,
        checkIn: orderData.checkIn,
        checkOut: orderData.checkOut,
        totalPrice: orderData.totalPrice,
      };

      console.log("Order payload to backend:", orderPayload);

      const response = await axios.post(
        `${API_BASE_URL}/orders`,
        orderPayload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      console.log("Order created successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating order:", error);

      if (error.response) {
        const errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          "Failed to create order";
        throw new Error(errorMessage);
      } else if (error.request) {
        throw new Error(
          "No response from server. Please check your connection.",
        );
      } else {
        throw new Error("Error creating order: " + error.message);
      }
    }
  },

  cancelOrder: async (orderId) => {
    try {
      console.log("Cancelling order:", orderId);

      const response = await axios.post(
        `${API_BASE_URL}/orders/${orderId}/cancel`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      console.log("Order cancelled successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error cancelling order:", error);

      if (error.response) {
        const errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          "Failed to cancel order";
        throw new Error(errorMessage);
      } else if (error.request) {
        throw new Error(
          "No response from server. Please check your connection.",
        );
      } else {
        throw new Error("Error cancelling order: " + error.message);
      }
    }
  },

  createPaymentSession: async (orderId, successUrl, cancelUrl) => {
    try {
      console.log("Creating payment session for order:", orderId);

      const response = await axios.post(
        `${API_BASE_URL}/orders/${orderId}/payment`,
        {
          successUrl: successUrl || `${window.location.origin}/payment/success`,
          cancelUrl: cancelUrl || `${window.location.origin}/payment/cancel`,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      console.log("Payment session created:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating payment session:", error);

      if (error.response) {
        const errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          "Failed to create payment session";
        throw new Error(errorMessage);
      } else if (error.request) {
        throw new Error(
          "No response from server. Please check your connection.",
        );
      } else {
        throw new Error("Error creating payment session: " + error.message);
      }
    }
  },

  processPayment: async (orderId) => {
    try {
      const paymentSession = await orderService.createPaymentSession(orderId);

      window.location.href = paymentSession.paymentUrl;

      return paymentSession;
    } catch (error) {
      console.error("Error processing payment:", error);
      throw error;
    }
  },

  getOrderById: async (orderId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching order:", error);
      throw error;
    }
  },

  getOrderByIdWithRoom: async (orderId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/orders/${orderId}/with-room`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching order with room details:", error);
      throw error;
    }
  },

  getUserOrders: async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/orders/user/${getUserIdFromStorage()}/with-rooms`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      console.log("User orders:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching user orders:", error);
      throw error;
    }
  },

  getUserOrdersSync: async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/orders/user/${getUserIdFromStorage()}/with-rooms-sync`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching user orders:", error);
      throw error;
    }
  },

  updateOrderStatus: async (orderId, status) => {
    try {
      console.log("Updating order status:", orderId, status);

      const response = await axios.patch(
        `${API_BASE_URL}/orders/${orderId}/status`,
        { status },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      console.log("Order status updated successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating order status:", error);

      if (error.response) {
        const errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          "Failed to update order status";
        throw new Error(errorMessage);
      } else if (error.request) {
        throw new Error(
          "No response from server. Please check your connection.",
        );
      } else {
        throw new Error("Error updating order status: " + error.message);
      }
    }
  },

  updatePaymentStatus: async (orderId, paymentStatus) => {
    try {
      console.log("Updating payment status:", orderId, paymentStatus);

      const response = await axios.patch(
        `${API_BASE_URL}/orders/${orderId}/payment-status`,
        { paymentStatus },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      console.log("Payment status updated successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating payment status:", error);

      if (error.response) {
        const errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          "Failed to update payment status";
        throw new Error(errorMessage);
      } else if (error.request) {
        throw new Error(
          "No response from server. Please check your connection.",
        );
      } else {
        throw new Error("Error updating payment status: " + error.message);
      }
    }
  },

  deleteOrder: async (orderId) => {
    try {
      console.log("Deleting order:", orderId);

      const response = await axios.delete(`${API_BASE_URL}/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log("Order deleted successfully");
      return response.data;
    } catch (error) {
      console.error("Error deleting order:", error);

      if (error.response) {
        const errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          "Failed to delete order";
        throw new Error(errorMessage);
      } else if (error.request) {
        throw new Error(
          "No response from server. Please check your connection.",
        );
      } else {
        throw new Error("Error deleting order: " + error.message);
      }
    }
  },

  checkRoomAvailability: async (roomId, checkIn, checkOut) => {
    try {
      console.log("Checking room availability:", roomId, checkIn, checkOut);

      const response = await axios.get(`${API_BASE_URL}/orders/availability`, {
        params: {
          roomId,
          checkIn,
          checkOut,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log("Room availability checked:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error checking room availability:", error);

      if (error.response) {
        const errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          "Failed to check room availability";
        throw new Error(errorMessage);
      } else if (error.request) {
        throw new Error(
          "No response from server. Please check your connection.",
        );
      } else {
        throw new Error("Error checking room availability: " + error.message);
      }
    }
  },

  getAllOrders: async (page = 0, size = 10) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/orders`, {
        params: {
          page,
          size,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching all orders:", error);
      throw error;
    }
  },

  getOrdersByStatus: async (status) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/orders/status/${status}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching orders by status:", error);
      throw error;
    }
  },

  getOrdersByPaymentStatus: async (paymentStatus) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/orders/payment-status/${paymentStatus}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching orders by payment status:", error);
      throw error;
    }
  },
};

export { orderService };
