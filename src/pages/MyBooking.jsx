import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import roomImg1 from "../assets/roomImg1.png";
import roomImg2 from "../assets/roomImg2.png";
import roomImg3 from "../assets/roomImg3.png";
import roomImg4 from "../assets/roomImg4.png";
import Title from "../components/Title";
import { orderService } from "../services/OrderService";
import toast from "react-hot-toast";
import PaymentModal from "../components/modal/PaymentModal";

const MyBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const defaultImages = [roomImg1, roomImg2, roomImg3, roomImg4];
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showPayment, setShowPayment] = useState(false);

  const mapOrderData = (order) => {
    const calculateNights = (checkIn, checkOut) => {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const timeDiff = end - start;
      return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    };

    const nights = calculateNights(order.checkIn, order.checkOut);
    const totalPrice =
      order.totalPrice || order.room?.pricePerNight * nights || 0;

    return {
      _id: order.id,
      name: order.room?.roomNumber || "Unknown Room",
      price: order.room?.pricePerNight || 0,
      description: order.room?.description || "No description available",
      image:
        order.room?.images && order.room.images.length > 0
          ? order.room.images.map(
              (img) => `${import.meta.env.VITE_API_IMAGE_UPLOADS}/${img.image}`,
            )
          : defaultImages,
      location: order.room?.location || "Location not specified",
      rating: calculateRating(order.room?.reviews),
      amenities: mapAmenities(order.room?.amenities),
      roomTypes: order.room?.type ? [order.room.type] : ["Standard Room"],
      checkIn: order.checkIn,
      checkOut: order.checkOut,
      guests: order.room?.capacity || 1,
      status: mapOrderStatus(order.status),
      payment: mapPaymentStatus(order.paymentStatus),
      totalPrice: totalPrice,
      nights: nights,
      room: order.room,
      originalStatus: order.status,
      originalPaymentStatus: order.paymentStatus,
    };
  };

  const calculateRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 4.5;
    const total = reviews.reduce(
      (sum, review) => sum + (review.rating || 0),
      0,
    );
    return Math.round((total / reviews.length) * 10) / 10;
  };

  const mapAmenities = (amenities) => {
    if (!amenities || amenities.length === 0) {
      return ["Free WiFi", "Breakfast Included"];
    }

    const amenityMap = {
      FREE_WIFI: "Free WiFi",
      BREAKFAST_INCLUDED: "Breakfast Included",
      OCEAN_VIEW: "Ocean View",
      KING_BED: "King Bed",
      FREE_PARKING: "Free Parking",
      PET_FRIENDLY: "Pet Friendly",
      FIREPLACE: "Fireplace",
      MOUNTAIN_VIEW: "Mountain View",
      PRIVATE_POOL: "Private Pool",
      BEACH_ACCESS: "Beach Access",
      BBQ_AREA: "BBQ Area",
      GYM_ACCESS: "Gym Access",
      CITY_VIEW: "City View",
      KITCHENETTE: "Kitchenette",
    };

    return amenities.map((amenity) => amenityMap[amenity] || amenity);
  };

  const mapOrderStatus = (status) => {
    const statusMap = {
      PENDING: "Pending",
      CONFIRMED: "Confirmed",
      CANCELLED: "Cancelled",
      COMPLETED: "Completed",
    };
    return statusMap[status] || status;
  };

  const mapPaymentStatus = (paymentStatus) => {
    const paymentMap = {
      UNPAID: "Unpaid",
      PAID: "Paid",
      FAILED: "Failed",
      REFUNDED: "Refunded",
      PENDING: "Unpaid",
    };
    return paymentMap[paymentStatus] || paymentStatus;
  };

  const fetchUserOrders = async () => {
    try {
      setLoading(true);
      const orders = await orderService.getUserOrders();
      console.log("Orders from API:", orders);

      const mappedBookings = orders.map(mapOrderData);
      console.log("Mapped bookings:", mappedBookings);
      setBookings(mappedBookings);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load your bookings. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = (order) => {
    setSelectedOrder(order);
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    toast.success("Payment successful!");
    fetchUserOrders();
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        await orderService.cancelOrder(bookingId);
        fetchUserOrders();
        toast.success("Booking cancelled successfully!");
      } catch (error) {
        console.error("Cancel booking error:", error);
        toast.error("Failed to cancel booking. Please try again.");
      }
    }
  };

  const handleReview = (booking) => {
    // Điều hướng đến trang đánh giá với thông tin booking
    navigate(`/review/${booking._id}`, {
      state: {
        roomId: booking.room?.id,
        roomName: booking.name,
        bookingId: booking._id,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut
      }
    });
  };

  useEffect(() => {
    fetchUserOrders();
  }, []);

  useEffect(() => {
    if (bookings.length > 0) {
      console.log("Current bookings state:", bookings);
    }
  }, [bookings]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-20 px-4 md:px-16 lg:px-24 xl:px-32">
        <div className="max-w-7xl mx-auto">
          <Title
            title="My Booking"
            subtitle="Easily manage your past, current, and upcoming hotel reservations in one place."
            align="left"
          />
          <div className="flex justify-center items-center py-20">
            <div className="text-gray-600 text-lg">
              Loading your bookings...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-20 px-4 md:px-16 lg:px-24 xl:px-32">
        <div className="max-w-7xl mx-auto">
          <Title
            title="My Booking"
            subtitle="Easily manage your past, current, and upcoming hotel reservations in one place."
            align="left"
          />
          <div className="flex flex-col justify-center items-center py-20">
            <div className="text-red-600 text-lg mb-4">{error}</div>
            <button
              onClick={fetchUserOrders}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-20 px-4 md:px-16 lg:px-24 xl:px-32">
      <div className="max-w-7xl mx-auto">
        <Title
          title="My Booking"
          subtitle="Easily manage your past, current, and upcoming hotel reservations in one place. Plan your trips seamlessly with just a few clicks and unlock a world of unforgettable experiences."
          align="left"
        />

        {bookings.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-gray-500 text-lg mb-4">No bookings found</div>
            <p className="text-gray-400">You haven't made any bookings yet.</p>
          </div>
        ) : (
          <div className="mt-12 space-y-6">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <div className="p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-5">
                      <div className="flex flex-col sm:flex-row gap-6">
                        <div className="w-full sm:w-48 h-48 rounded-xl overflow-hidden flex-shrink-0 shadow-lg">
                          <img
                            src={booking.image[0]}
                            alt={booking.name}
                            className="w-full h-full object-cover transition-transform hover:scale-110 duration-500"
                            onError={(e) => {
                              e.target.src = defaultImages[0];
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="text-2xl font-bold text-gray-900 leading-tight">
                              Room {booking.name}
                            </h3>
                          </div>

                          <div className="flex items-center mb-3">
                            <svg
                              className="w-4 h-4 text-gray-500 mr-2"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <p className="text-gray-600 text-sm">
                              {booking.location || "Location not specified"}
                            </p>
                          </div>

                          <div className="flex items-center gap-4 mb-4">
                            <div className="flex items-center bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg">
                              <svg
                                className="w-4 h-4 mr-1.5 fill-current"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              <span className="font-semibold text-sm">
                                {booking.rating}
                              </span>
                            </div>

                            <div className="flex items-center text-gray-600">
                              <svg
                                className="w-4 h-4 mr-1.5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <span className="text-sm font-medium">
                                {booking.guests}{" "}
                                {booking.guests > 1 ? "guests" : "guest"}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {booking.amenities
                              .slice(0, 3)
                              .map((amenity, index) => (
                                <span
                                  key={index}
                                  className="text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full font-medium border border-blue-200"
                                >
                                  {amenity}
                                </span>
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-3">
                      <div className="bg-gray-50 rounded-xl p-5">
                        <h4 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
                          Booking Period
                        </h4>

                        <div className="space-y-4">
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                              Check-in
                            </p>
                            <p className="font-bold text-gray-900 text-lg">
                              {booking.checkIn}
                            </p>
                          </div>

                          <div className="flex justify-center">
                            <svg
                              className="w-5 h-5 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 14l-7 7m0 0l-7-7m7 7V3"
                              />
                            </svg>
                          </div>

                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                              Check-out
                            </p>
                            <p className="font-bold text-gray-900 text-lg">
                              {booking.checkOut}
                            </p>
                          </div>

                          <div className="pt-2 border-t border-gray-200">
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                              Duration
                            </p>
                            <p className="font-bold text-gray-900">
                              {booking.nights} night
                              {booking.nights > 1 ? "s" : ""}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-4">
                      <div className="flex flex-col h-full justify-between">
                        <div>
                          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 mb-6">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600 font-medium">
                                Payment Status
                              </span>
                              <span
                                className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide
                                                          ${
                                                            booking.payment ===
                                                            "Paid"
                                                              ? "bg-green-100 text-green-800 border border-green-200"
                                                              : booking.payment ===
                                                                  "Unpaid"
                                                                ? "bg-red-100 text-red-800 border border-red-200"
                                                                : "bg-yellow-100 text-yellow-800 border border-yellow-200"
                                                          }`}
                              >
                                {booking.payment}
                              </span>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600 font-medium">
                                Booking Status
                              </span>
                              <span
                                className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide
                                                          ${
                                                            booking.status ===
                                                            "Confirmed"
                                                              ? "bg-blue-100 text-blue-800 border border-blue-200"
                                                              : booking.status ===
                                                                  "Pending"
                                                                ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                                                                : booking.status ===
                                                                    "Cancelled"
                                                                  ? "bg-red-100 text-red-800 border border-red-200"
                                                                  : "bg-gray-100 text-gray-800 border border-gray-200"
                                                          }`}
                              >
                                {booking.status}
                              </span>
                            </div>
                          </div>

                          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-6">
                            <p className="text-sm text-gray-600 mb-1">
                              Total Amount
                            </p>
                            <p className="text-3xl font-bold text-gray-900">
                              ${booking.totalPrice}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          {(booking.payment === "Unpaid" ||
                            booking.originalPaymentStatus === "UNPAID") &&
                            booking.status !== "Cancelled" &&
                            booking.originalStatus !== "CANCELLED" && (
                              <button
                                onClick={() => handlePayment(booking)}
                                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                              >
                                Thanh toán
                              </button>
                            )}

                          {(booking.payment === "Paid" ||
                            booking.originalPaymentStatus === "PAID") &&
                            (booking.status === "Pending" ||
                              booking.status === "Confirmed" ||
                              booking.originalStatus === "PENDING" ||
                              booking.originalStatus === "CONFIRMED") && (
                              <button
                                onClick={() => handleCancelBooking(booking._id)}
                                className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                              >
                                Hủy
                              </button>
                            )}

                          {(booking.status === "Cancelled" ||
                            booking.originalStatus === "CANCELLED") && (
                            <div className="flex-1 text-center py-3 px-6 bg-gray-100 text-gray-500 rounded-xl font-semibold">
                              Đã hủy
                            </div>
                          )}

                          {(booking.status === "Completed" ||
                            booking.originalStatus === "COMPLETED") && (
                            <button
                              onClick={() => handleReview(booking)}
                              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                            >
                              Đánh giá
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {showPayment && selectedOrder && (
        <PaymentModal
          order={selectedOrder}
          onSuccess={handlePaymentSuccess}
          onClose={() => setShowPayment(false)}
        />
      )}
    </div>
  );
};

export default MyBooking;