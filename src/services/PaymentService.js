const API_URL = `${import.meta.env.VITE_API_BASE_URL}/payment`;
import axios from "axios";

export const paymentService = {
  async createPayment(amount, orderId, currency = "usd") {
    try {
      console.log("Sending payment request:", { amount, orderId, currency });

      const response = await axios.post(`${API_URL}/create`, {
        amount: amount,
        orderId: orderId,
        currency: currency,
      });

      console.log("Payment response:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Payment creation error:",
        error.response?.data || error.message,
      );
      throw new Error(
        "Failed to create payment: " +
          (error.response?.data?.message || error.message),
      );
    }
  },

  async confirmPayment(paymentIntentId) {
    try {
      const response = await axios.post(
        `${API_URL}/confirm/${paymentIntentId}`,
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to confirm payment: " + error.message);
    }
  },

  async getPaymentStatus(orderId) {
    try {
      const response = await axios.get(`${API_URL}/status/${orderId}`);
      return response.data;
    } catch (error) {
      throw new Error("Failed to get payment status: " + error.message);
    }
  },

  async handleWebhook(payload) {
    try {
      const response = await axios.post(`${API_URL}/webhook`, payload);
      return response.data;
    } catch (error) {
      throw new Error("Failed to handle webhook: " + error.message);
    }
  },

  async createMomoPayment(amount, orderId, orderInfo = "") {
    try {
      const response = await axios.post(`${API_URL}/momo/create`, {
        amount: amount,
        orderId: orderId,
        orderInfo: orderInfo || `Payment for order #${orderId}`,
      });
      return response.data;
    } catch (error) {
      throw new Error("Failed to create Momo payment: " + error.message);
    }
  },
};

export default paymentService;
