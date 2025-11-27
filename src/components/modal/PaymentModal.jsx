import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { paymentService } from "../../services/PaymentService";
import { orderService } from "../../services/OrderService";

const stripePromise = loadStripe(
  "pk_test_51SJs9MGORPQB7l1qcKjOvFVXwhI8IsIZlYhV4LGIEm8YxDjHY6qn4ab1W7wPxKPlkV6lDMDao8R09UwrUGp6qCmi00A94ZMW1Z",
);

const CheckoutForm = ({ order, onSuccess, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const handleCustomerInfoChange = (field, value) => {
    setCustomerInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    if (!stripe || !elements) {
      setError("Stripe chưa được khởi tạo");
      setLoading(false);
      return;
    }

    if (!customerInfo.name || !customerInfo.email) {
      setError("Vui lòng điền đầy đủ thông tin khách hàng");
      setLoading(false);
      return;
    }

    try {
      console.log("=== FRONTEND PAYMENT DATA ===");
      console.log("Original VND amount:", order.totalPrice);
      console.log("Order ID:", order._id);
      console.log("Currency: vnd");
      console.log("=============================");

      const paymentData = await paymentService.createPayment(
        order.totalPrice * 23000,
        order._id,
        "vnd",
      );

      console.log("Payment data:", paymentData);

      if (!paymentData.clientSecret) {
        throw new Error("No client secret received from server");
      }

      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(paymentData.clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: customerInfo.name,
              email: customerInfo.email,
              phone: customerInfo.phone || "Not provided",
              address: {
                country: "VN",
                line1: "Customer Address",
              },
            },
          },
        });

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      console.log("Payment intent result:", paymentIntent);

      if (paymentIntent.status === "succeeded") {
        await orderService.updatePaymentStatus(order._id, "PAID");
        onSuccess();
      }
    } catch (err) {
      console.error("Payment error:", err);

      let errorMessage = "Payment failed. Please try again.";

      if (err.message.includes("card_declined")) {
        errorMessage =
          "Your card was declined. Please check your card information or use a different card.";
      } else if (err.message.includes("incorrect_number")) {
        errorMessage = "Incorrect card number. Please check again.";
      } else if (err.message.includes("invalid_expiry_month")) {
        errorMessage = "Invalid expiration month.";
      } else if (err.message.includes("invalid_expiry_year")) {
        errorMessage = "Invalid expiration year.";
      } else if (err.message.includes("invalid_cvc")) {
        errorMessage = "Invalid CVC code.";
      } else if (err.message.includes("currency_not_supported")) {
        errorMessage = "Currency not supported. Please contact support.";
      } else if (err.message.includes("amount_too_small")) {
        errorMessage =
          "Payment amount is too small. Minimum amount is 10,000 VND.";
      } else if (err.message.includes("amount_too_large")) {
        errorMessage =
          "Payment amount is too large. Please contact support for large payments.";
      } else {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <div className="space-y-4 mb-6">
        <h4 className="font-semibold text-gray-700">Customer Information</h4>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            value={customerInfo.name}
            onChange={(e) => handleCustomerInfoChange("name", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="John Doe"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            value={customerInfo.email}
            onChange={(e) => handleCustomerInfoChange("email", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="john.doe@example.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            value={customerInfo.phone}
            onChange={(e) => handleCustomerInfoChange("phone", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="+84 123 456 789"
          />
        </div>
      </div>

      <div className="form-group mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Credit Card Information *
        </label>
        <div className="border border-gray-300 rounded-lg p-3 bg-white">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#424770",
                  "::placeholder": {
                    color: "#aab7c4",
                  },
                  fontFamily: '"Inter", sans-serif',
                },
              },
              hidePostalCode: true,
            }}
          />
        </div>
        <div className="mt-2 text-xs text-gray-500">
          <p>Accept Visa, Mastercard, American Express, JCB</p>
          <p className="text-green-600 font-medium">
            ✅ International cards accepted
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg border border-red-200">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="flex-1 bg-gray-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-600 disabled:bg-gray-400 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || loading}
          className="flex-1 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center justify-center"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </>
          ) : (
            `Pay ${order.totalPrice.toLocaleString("vi-VN")}₫`
          )}
        </button>
      </div>
    </form>
  );
};

const PaymentModal = ({ order, onSuccess, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Credit Card Payment
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl transition-colors"
          >
            ×
          </button>
        </div>

        {/* Thông tin đơn hàng */}
        <div className="mb-6 bg-gray-50 rounded-xl p-4">
          <h3 className="font-semibold text-gray-700 mb-3">
            Order Information
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Order ID:</span>
              <span className="font-semibold">#{order._id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Room:</span>
              <span className="font-semibold">{order.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Nights:</span>
              <span className="font-semibold">{order.nights} nights</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
              <span className="text-gray-700">Total Amount:</span>
              <span className="text-blue-600">
                {order.totalPrice} $
              </span>
            </div>
          </div>
        </div>

        <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4">
          <h4 className="font-semibold text-green-800 mb-2 flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Payment Information
          </h4>
          <ul className="text-sm text-green-700 space-y-1">
            <li>✓ Accept Visa, Mastercard, American Express, JCB</li>
            <li>✓ All international cards accepted</li>
            <li>✓ Secure payment by Stripe</li>
            <li>✓ Amount will be charged in VND</li>
          </ul>
        </div>

        <Elements stripe={stripePromise}>
          <CheckoutForm order={order} onSuccess={onSuccess} onClose={onClose} />
        </Elements>
      </div>
    </div>
  );
};

export default PaymentModal;
