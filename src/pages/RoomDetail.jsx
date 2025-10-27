import React, { useEffect, useState } from "react";
import {
  FaBed,
  FaCalendarAlt,
  FaCity,
  FaCoffee,
  FaDog,
  FaFire,
  FaMountain,
  FaParking,
  FaSwimmingPool,
  FaUser,
  FaUtensils,
  FaWifi,
} from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import locationIcon from "../assets/locationIcon.svg";
import roomImg1 from "../assets/roomImg1.png";
import roomImg2 from "../assets/roomImg2.png";
import roomImg3 from "../assets/roomImg3.png";
import roomImg4 from "../assets/roomImg4.png";
import StarRating from "../components/StarRating";
import { roomService } from "../services/RoomService";
import { orderService } from "../services/OrderService";
import toast from "react-hot-toast";

const RoomDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guests, setGuests] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const amenitiesIcons = {
    "Free WiFi": <FaWifi />,
    "Breakfast Included": <FaCoffee />,
    "Ocean View": <FaSwimmingPool />,
    "King Bed": <FaBed />,
    "Free Parking": <FaParking />,
    "Pet Friendly": <FaDog />,
    Fireplace: <FaFire />,
    "Mountain View": <FaMountain />,
    "Private Pool": <FaSwimmingPool />,
    "Beach Access": <FaUtensils />,
    "BBQ Area": <FaUtensils />,
    "Gym Access": <FaCity />,
    "City View": <FaCity />,
    Kitchenette: <FaUtensils />,
  };

  const defaultImages = [roomImg1, roomImg2, roomImg3, roomImg4];

  const mapRoomData = (apiRoom) => {
    const roomImages =
      apiRoom.images && apiRoom.images.length > 0
        ? apiRoom.images.map((img) => {
            const imageUrl = `${import.meta.env.VITE_API_IMAGE_UPLOADS}/${img.image}`;
            return imageUrl;
          })
        : defaultImages;

    const mappedAmenities = apiRoom.amenities
      ? apiRoom.amenities.map((amenity) => {
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
          return amenityMap[amenity] || amenity;
        })
      : ["Free WiFi", "Breakfast Included"];

    return {
      id: apiRoom.id,
      name: apiRoom.roomNumber || "Unnamed Room",
      price: apiRoom.pricePerNight || 0,
      description: apiRoom.description || "No description available.",
      images: roomImages,
      location: apiRoom.location || "Location not specified",
      rating: calculateRating(apiRoom.reviews),
      amenities: mappedAmenities,
      roomTypes: apiRoom.type ? [apiRoom.type] : ["Standard Room"],
      capacity: apiRoom.capacity || 2,
      isAvailable: apiRoom.isAvailable !== false,
      reviews: apiRoom.reviews || [],
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

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        setLoading(true);
        const roomData = await roomService.getRoomById(id);
        console.log(roomData);
        const mappedRoom = mapRoomData(roomData);
        setRoom(mappedRoom);

        if (mappedRoom.images && mappedRoom.images.length > 0) {
          setMainImage(mappedRoom.images[0]);
        } else {
          setMainImage(defaultImages[0]);
        }

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setCheckInDate(tomorrow.toISOString().split("T")[0]);

        const dayAfterTomorrow = new Date();
        dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
        setCheckOutDate(dayAfterTomorrow.toISOString().split("T")[0]);
      } catch (err) {
        console.error("Error fetching room:", err);
        setError("Failed to load room details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRoom();
    }
  }, [id]);

  const handleGuestsChange = (e) => {
    const value = Math.max(1, parseInt(e.target.value) || 1);
    const maxGuests = room ? room.capacity : 10;
    setGuests(Math.min(value, maxGuests));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!room) return;

    if (guests > room.capacity) {
      toast.loading(
        `This room can only accommodate up to ${room.capacity} guests.`,
      );
      return;
    }

    if (!room.isAvailable) {
      toast.error("Sorry, this room is not available for booking.");
      return;
    }

    if (!checkInDate || !checkOutDate) {
      toast.error("Please select check-in and check-out dates.");
      return;
    }

    const nights = calculateNights();
    if (nights <= 0) {
      toast.error("Check-out date must be after check-in date.");
      return;
    }

    try {
      setBookingLoading(true);

      const userId = getCurrentUserId();
      if (!userId) {
        toast.error("Please login to book a room.");
        return;
      }

      const orderData = {
        userId: userId,
        roomId: room.id,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        totalPrice: room.price * nights,
      };

      console.log("Creating order with data:", orderData);

      const createdOrder = await orderService.createOrder(orderData);

      console.log("Order created successfully:", createdOrder);

      setBookingSuccess(true);
      setOrderId(createdOrder.id);

      toast.success(`Booking confirmed! Your order ID is: ${createdOrder.id}`);
      navigate("/my-bookings");
    } catch (error) {
      console.error("Booking failed:", error);

      if (error.response) {
        const errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          "Booking failed. Please try again.";
        toast.error(`Booking failed: ${errorMessage}`);
      } else {
        toast.error(`Booking failed: ${error.message}`);
      }
    } finally {
      setBookingLoading(false);
    }
  };

  const getCurrentUserId = () => {
    try {
      const userData = localStorage.getItem("user");

      if (!userData) {
        console.warn("No user data found in localStorage");
        return null;
      }

      const user = JSON.parse(userData);

      if (user && user.id) {
        return user.id.toString();
      } else {
        console.warn("User object does not have id property:", user);
        return null;
      }
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
      return null;
    }
  };

  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 0;
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const timeDiff = end - start;
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  };
  const nights = calculateNights();
  const totalPrice = room ? room.price * nights : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-28 md:py-35 min-h-screen">
        <div className="text-gray-600 text-lg">Loading room details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-28 md:py-35 min-h-screen">
        <div className="text-red-600 text-lg mb-4">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="flex items-center justify-center py-28 md:py-35 min-h-screen">
        <div className="text-gray-600 text-lg">Room not found.</div>
      </div>
    );
  }

  return (
    <div className="py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32">
      <h1 className="pt-4">Room Detail</h1>

      {bookingSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <p className="font-semibold">Booking Confirmed!</p>
          <p>Your order ID: {orderId}</p>
          <button
            onClick={() => navigate(`/orders/${orderId}`)}
            className="mt-2 px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
          >
            View Order Details
          </button>
        </div>
      )}

      {!room.isAvailable && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          This room is currently not available for booking.
        </div>
      )}

      <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
        <h1 className="text-3xl md:text-4xl font-semibold">
          {room.name}{" "}
          <span className="font-thin text-sm">
            ({room.roomTypes.join(", ")})
          </span>
        </h1>
        <p className="font-extrabold text-xs py-1.5 px-3 text-white bg-orange-500 rounded-full">
          20% OFF
        </p>
      </div>

      <div className="flex items-center gap-1 mt-2">
        <StarRating rating={room.rating} size={20} />
        <p className="ml-2">{room.reviews.length}+ Reviews</p>
      </div>

      <div className="flex items-center gap-1 mt-2 text-gray-500">
        <img src={locationIcon} alt="" />
        <span className="ml-2">{room.location}</span>
      </div>

      <div className="mt-2 text-gray-600">
        <FaUser className="inline mr-1" />
        Up to {room.capacity} guests
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-4 mt-6">
        <div className="lg:w-1/2 w-full">
          <img
            src={mainImage}
            alt="room-image"
            className="w-full h-80 lg:h-96 rounded-xl shadow-lg object-cover"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 lg:w-1/2 w-full">
          {room.images && room.images.length > 0
            ? room.images.map((image, index) => (
                <img
                  src={image}
                  alt={`room-image-${index + 1}`}
                  className={`w-full h-36 lg:h-44 rounded-xl shadow-md object-cover cursor-pointer transition-all ${
                    mainImage === image
                      ? "ring-2 ring-amber-500 transform scale-105"
                      : "hover:shadow-lg"
                  }`}
                  key={index}
                  onClick={() => setMainImage(image)}
                  onError={(e) => {
                    e.target.src = defaultImages[index % defaultImages.length];
                  }}
                />
              ))
            : defaultImages.map((image, index) => (
                <img
                  src={image}
                  alt={`default-room-image-${index + 1}`}
                  className="w-full h-36 lg:h-44 rounded-xl shadow-md object-cover"
                  key={index}
                />
              ))}
        </div>
      </div>

      <div className="mt-10 space-y-6 md:space-y-0 md:flex md:justify-between md:items-start md:gap-8">
        <div className="space-y-6 md:max-w-2xl">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-light leading-tight text-gray-800">
            {room.description}
          </h1>
          <div className="flex flex-wrap gap-3 p-4 rounded-xl bg-gray-50 shadow-sm">
            {room.amenities.map((amenity, index) => (
              <span
                key={index}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <span className="text-orange-500">
                  {amenitiesIcons[amenity] || <FaWifi />}
                </span>
                {amenity}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-end space-y-2">
          <p className="text-2xl md:text-3xl font-semibold text-gray-800">
            ${room.price}
          </p>
          <p className="text-sm text-gray-500">per night</p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-[0px_0px_20px_rgba(0,0,0,0.15)] p-6 rounded-xl mx-auto mt-16 max-w-6xl"
      >
        <h2 className="text-xl font-semibold mb-6 text-gray-800">
          Book Your Stay
        </h2>

        <div className="flex flex-col md:flex-row items-stretch gap-4 md:gap-6">
          <div className="flex-1 flex flex-col">
            <label
              htmlFor="checkInDate"
              className="font-medium text-gray-700 mb-2 flex items-center gap-2"
            >
              <FaCalendarAlt className="text-blue-500" />
              Check-In
            </label>
            <div className="relative">
              <input
                type="date"
                name="checkInDate"
                id="checkInDate"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 pl-10 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                min={new Date().toISOString().split("T")[0]}
              />
              <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            <label
              htmlFor="checkOutDate"
              className="font-medium text-gray-700 mb-2 flex items-center gap-2"
            >
              <FaCalendarAlt className="text-blue-500" />
              Check-Out
            </label>
            <div className="relative">
              <input
                type="date"
                name="checkOutDate"
                id="checkOutDate"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 pl-10 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                min={checkInDate || new Date().toISOString().split("T")[0]}
              />
              <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            <label
              htmlFor="guests"
              className="font-medium text-gray-700 mb-2 flex items-center gap-2"
            >
              <FaUser className="text-blue-500" />
              Guests
            </label>
            <div className="relative">
              <input
                type="number"
                name="guests"
                id="guests"
                value={guests}
                onChange={handleGuestsChange}
                min="1"
                max={room.capacity}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 pl-10 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Maximum: {room.capacity} guests
            </p>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={!room.isAvailable || bookingLoading}
              className={`rounded-lg w-full md:w-auto px-8 py-3.5 text-base font-medium cursor-pointer shadow-md hover:shadow-lg transition-all ${
                room.isAvailable && !bookingLoading
                  ? "bg-blue-600 hover:bg-blue-700 active:scale-95 text-white"
                  : "bg-gray-400 text-gray-200 cursor-not-allowed"
              }`}
            >
              {bookingLoading ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Booking...
                </span>
              ) : room.isAvailable ? (
                "Book Now"
              ) : (
                "Not Available"
              )}
            </button>
          </div>
        </div>

        {checkInDate && checkOutDate && nights > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="font-medium text-gray-700 mb-2">Price Summary</h3>
            <div className="flex justify-between">
              <span>
                ${room.price} × {nights} night{nights > 1 ? "s" : ""}
              </span>
              <span>${totalPrice}</span>
            </div>
            <div className="flex justify-between font-semibold mt-2 pt-2 border-t border-gray-100">
              <span>Total</span>
              <span>${totalPrice}</span>
            </div>
          </div>
        )}
      </form>

      <div className="flex flex-col items-start gap-4 mt-20">
        <div className="flex gap-4">
          <img
            src={
              room.images && room.images.length > 0
                ? room.images[0]
                : defaultImages[0]
            }
            alt="host"
            className="h-14 w-14 md:h-18 md:w-18 rounded-full object-cover"
            onError={(e) => {
              e.target.src = defaultImages[0];
            }}
          />
          <div>
            <p className="text-lg md:text-xl">Hosted by {room.name}</p>
            <div className="flex items-center mt-1">
              <StarRating rating={room.rating} size={16} />
              <span className="ml-2 text-sm text-gray-500">
                {room.reviews.length}+ Reviews
              </span>
            </div>
          </div>
        </div>
        <button className="px-6 py-2.5 mt-4 rounded text-white bg-blue-500 hover:bg-blue-600 active:scale-95 transition-all cursor-pointer">
          Contact Now
        </button>
      </div>
    </div>
  );
};

export default RoomDetail;
