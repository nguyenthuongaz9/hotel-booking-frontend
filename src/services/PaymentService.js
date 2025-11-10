import axiosInstance from "../api/config/axiosInstance";
export const paymentService = {
  async createPayment(amount, orderId, currency = "usd") {
    try {
      console.log("Sending payment request:", { amount, orderId, currency });

      const response = await axiosInstance.post(`/payment/create`, {
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
      const response = await axiosInstance.post(
        `/payment/confirm/${paymentIntentId}`,
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to confirm payment: " + error.message);
    }
  },

  async getPaymentStatus(orderId) {
    try {
      const response = await axiosInstance.get(`/payment/status/${orderId}`);
      return response.data;
    } catch (error) {
      throw new Error("Failed to get payment status: " + error.message);
    }
  },

  async handleWebhook(payload) {
    try {
      const response = await axiosInstance.post(`/payment/webhook`, payload);
      return response.data;
    } catch (error) {
      throw new Error("Failed to handle webhook: " + error.message);
    }
  },

  async createMomoPayment(amount, orderId, orderInfo = "") {
    try {
      const response = await axiosInstance.post(`/payment/momo/create`, {
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
