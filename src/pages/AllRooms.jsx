import React, { useState, useEffect } from "react";
import {
  FaBed,
  FaCity,
  FaCoffee,
  FaDog,
  FaFire,
  FaMountain,
  FaParking,
  FaSwimmingPool,
  FaUtensils,
  FaWifi,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import locationIcon from "../assets/locationIcon.svg";
import roomImg1 from "../assets/roomImg1.png";
import roomImg2 from "../assets/roomImg2.png";
import roomImg3 from "../assets/roomImg3.png";
import roomImg4 from "../assets/roomImg4.png";
import StarRating from "../components/StarRating";
import { roomService } from "../services/RoomService";
const CheckBox = ({ label, selected, onChange = () => {} }) => (
  <label className="flex items-center gap-2 mb-2">
    <input
      type="checkbox"
      checked={selected}
      onChange={(e) => onChange(e.target.checked, label)}
      className="form-checkbox h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
    />
    <span className="text-gray-700">{label}</span>
  </label>
);

const RadioButton = ({ label, selected, onChange = () => {} }) => (
  <label className="flex items-center gap-2 mb-2">
    <input
      type="radio"
      name="sortOptions"
      checked={selected}
      onChange={(e) => onChange(label)}
      className="form-checkbox h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
    />
    <span className="text-gray-700">{label}</span>
  </label>
);

const AllRooms = () => {
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

  const roomTypes = [
    "Single",
    "Double",
    "Suite",
    "Family",
  ];
  const priceRanges = [
    "$50 - $100",
    "$101 - $200",
    "$201 - $300",
    "$301 - $400",
    "$401 and above",
  ];
  const sortOptions = ["Price: Low to High", "Price: High to Low"];

  const navigate = useNavigate();

  const [openFilter, setOpenFilter] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedRoomTypes, setSelectedRoomTypes] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState("");
  const [selectedSort, setSelectedSort] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const mapPriceRange = (range) => {
    switch (range) {
      case "$50 - $100":
        return { minPrice: 50, maxPrice: 100 };
      case "$101 - $200":
        return { minPrice: 101, maxPrice: 200 };
      case "$201 - $300":
        return { minPrice: 201, maxPrice: 300 };
      case "$301 - $400":
        return { minPrice: 301, maxPrice: 400 };
      case "$401 and above":
        return { minPrice: 401, maxPrice: null };
      default:
        return { minPrice: null, maxPrice: null };
    }
  };

  const mapSortOption = (option) => {
    switch (option) {
      case "Price: Low to High":
        return { sortBy: "price", sortOrder: "asc" };
      case "Price: High to Low":
        return { sortBy: "price", sortOrder: "desc" };
      default:
        return { sortBy: "roomNumber", sortOrder: "asc" };
    }
  };

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const priceRange = mapPriceRange(selectedPriceRange);
      const sortParams = mapSortOption(selectedSort);

      const params = {
        page: currentPage,
        size: 8,
        type: selectedRoomTypes.length > 0 ? selectedRoomTypes.join(",") : null,
        minPrice: priceRange.minPrice,
        maxPrice: priceRange.maxPrice,
        ...sortParams,
      };

      Object.keys(params).forEach((key) => {
        if (params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });

      const response = await roomService.getRooms(params);

      setRooms(response.content || response.data || response);
      setTotalPages(response.totalPages || 1);
    } catch (err) {
      console.error("Error fetching rooms:", err);
      setError("Failed to load rooms. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [currentPage, selectedRoomTypes, selectedPriceRange, selectedSort]);

  const handleRoomTypeChange = (checked, roomType) => {
    if (checked) {
      setSelectedRoomTypes((prev) => [...prev, roomType]);
    } else {
      setSelectedRoomTypes((prev) => prev.filter((type) => type !== roomType));
    }
    setCurrentPage(0);
  };

  const handlePriceRangeChange = (priceRange) => {
    setSelectedPriceRange(priceRange);
    setCurrentPage(0);
  };

  const handleSortChange = (sortOption) => {
    setSelectedSort(sortOption);
    setCurrentPage(0);
  };

  const mapRoomData = (apiRoom) => {
    const defaultImages = [roomImg1, roomImg2, roomImg3, roomImg4];
    const randomImage =
      defaultImages[Math.floor(Math.random() * defaultImages.length)];

    return {
      id: apiRoom.id,
      name: apiRoom.roomNumber || apiRoom.name || "Unnamed Room",
      price: apiRoom.pricePerNight || 0,
      description: apiRoom.description || "No description available.",
      image:
        apiRoom.images && apiRoom.images.length > 0
          ? apiRoom.images[0].image
          : randomImage,
      location: apiRoom.location || "Location not specified",
      rating: apiRoom.rating || 4.5,
      amenities: apiRoom.amenities || ["Free WiFi", "Breakfast Included"], // Default amenities
    };
  };

  const clearFilters = () => {
    setSelectedRoomTypes([]);
    setSelectedPriceRange("");
    setSelectedSort("");
    setCurrentPage(0);
  };

  if (loading && rooms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32 min-h-screen">
        <div className="text-gray-600 text-lg">Loading rooms...</div>
      </div>
    );
  }

  if (error && rooms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32 min-h-screen">
        <div className="text-red-600 text-lg">{error}</div>
        <button
          onClick={fetchRooms}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  const mappedRooms = rooms.map(mapRoomData);

  // console.log(mappedRooms);

  return (
    <div className="flex flex-col-reverse lg:flex-row items-start justify-between pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32">
      <div className="w-full lg:w-3/4">
        <div className="flex flex-col items-start text-left">
          <h1 className="font-bold text-4xl md:text-[40px]">Hotel rooms</h1>
          <p className="text-sm md:text-base text-gray-500/90 mt-2">
            Take a look at our hotel rooms limited offers and special packages
            to enhance your experience
          </p>
        </div>

        {loading && (
          <div className="text-center py-4 text-gray-600">
            Updating rooms...
          </div>
        )}

        {mappedRooms.length > 0 ? (
          mappedRooms.map((room) => (
            <div
              className="mt-8 flex flex-col md:flex-row items-start gap-6 py-10 border-b border-gray-300 last:pb-30 last:border-0 md:gap-8"
              key={room.id}
            >
              <img
                src={`${import.meta.env.VITE_API_IMAGE_UPLOADS}/${room.image}`}
                alt="hotel-img"
                title="View Room Details"
                className="max-h-65 md:w-1/2 rounded-xl shadow-lg object-cover cursor-pointer"
                onClick={() => {
                  navigate(`/rooms/${room.id}`);
                  scrollTo(0, 0);
                }}
              />
              <div className="md:w-1/2 flex flex-col gap-2">
                <p className="text-gray-800 text-3xl font-semibold cursor-pointer">
                  {room.name}
                </p>
                <StarRating rating={room.rating} size={20} />
                <div className="flex items-center gap-1 text-gray-500 mt-2 text-sm">
                  <img src={locationIcon} alt="" />
                  <span className="text-gray-500">{room.location}</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {room.amenities.map((amenity, index) => (
                    <span
                      key={index}
                      className="flex items-center gap-1 text-gray-600 text-sm mr-2"
                    >
                      {amenitiesIcons[amenity]} {amenity}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-gray-800 text-xl font-semibold">
                    ${room.price}
                  </span>
                  <span className="text-gray-800 text-xl"> /night</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-gray-600">
            No rooms found matching your criteria.
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center mt-8 gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
              disabled={currentPage === 0}
              className="px-4 py-2 border border-gray-300 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2">
              Page {currentPage + 1} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))
              }
              disabled={currentPage >= totalPages - 1}
              className="px-4 py-2 border border-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      <div className="bg-white w-full lg:w-80 border border-gray-300 text-gray-600 max-lg:mb-8 min-lg:mt-16">
        <div
          className={`flex items-center justify-between px-4 py-2 border-b border-gray-300 ${openFilter ? "bg-gray-100" : ""}`}
        >
          <p className="text-base font-medium text-gray-800">filters</p>
          <div className="text-xs cursor-pointer">
            <span
              onClick={() => setOpenFilter(!openFilter)}
              className="lg:hidden"
            >
              {openFilter ? "HIDE" : "SHOW"}
            </span>
            <span
              className="hidden lg:block cursor-pointer"
              onClick={clearFilters}
            >
              clear
            </span>
          </div>
        </div>
        <div
          className={`${openFilter ? "h-auto" : "h-0 lg:h-auto overflow-hidden transition-all duration-700"}`}
        >
          <div className="px-5 pt-5">
            <p className="font-medium text-gray-800 pb-2">Popular filters</p>
            <div className="mb-4">
              <p className="text-gray-700 font-medium mb-2">Room Type</p>
              {roomTypes.map((type, index) => (
                <CheckBox
                  key={index}
                  label={type}
                  selected={selectedRoomTypes.includes(type)}
                  onChange={handleRoomTypeChange}
                />
              ))}
            </div>
            <div className="mb-4">
              <p className="text-gray-700 font-medium mb-2">Price Range</p>
              {priceRanges.map((range, index) => (
                <RadioButton
                  key={index}
                  label={range}
                  selected={selectedPriceRange === range}
                  onChange={handlePriceRangeChange}
                />
              ))}
            </div>
            <div className="mb-4">
              <p className="text-gray-700 font-medium mb-2">Sort By</p>
              {sortOptions.map((option, index) => (
                <RadioButton
                  key={index}
                  label={option}
                  selected={selectedSort === option}
                  onChange={handleSortChange}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllRooms;
