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

  

  
};

export default paymentService;
