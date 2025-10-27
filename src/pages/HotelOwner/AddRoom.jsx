import { useState } from "react";
import { roomService } from "../../services/RoomService";
import toast from "react-hot-toast";

const AddRoom = () => {
  const [images, setImages] = useState({
    roomImage1: null,
    roomImage2: null,
    roomImage3: null,
    roomImage4: null,
  });
  const [imageFiles, setImageFiles] = useState({
    roomImage1: null,
    roomImage2: null,
    roomImage3: null,
    roomImage4: null,
  });
  const [inputs, setInputs] = useState({
    roomNumber: "",
    type: "",
    pricePerNight: 0,
    capacity: 1,
    location: "",
    description: "",
    isAvailable: true,
    amenities: [],
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const amenitiesOptions = [
    "FREE_WIFI",
    "FREE_BREAKFAST",
    "ROOM_SERVICE",
    "MOUNTAIN_VIEW",
    "POOL_ACCESS",
  ];

  // Handle image change
  const handleImageChange = (key, file) => {
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImages({ ...images, [key]: imageUrl });
      setImageFiles({ ...imageFiles, [key]: file });
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setInputs({
      ...inputs,
      [name]: type === "number" ? Number(value) : value,
    });
  };

  // Handle amenities change
  const handleAmenityChange = (amenity) => {
    setInputs((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const roomData = {
        roomNumber: inputs.roomNumber,
        type: inputs.type,
        pricePerNight: inputs.pricePerNight,
        capacity: inputs.capacity,
        location: inputs.location,
        description: inputs.description,
        amenities: inputs.amenities,
        isAvailable: inputs.isAvailable,
      };

      console.log(roomData);

      const files = Object.values(imageFiles).filter((file) => file !== null);

      const result = await roomService.createRoom(roomData, files);
      toast.success("Room created susscessfull");

      setMessage({
        type: "success",
        text: "Room added successfully!",
      });

      setInputs({
        roomNumber: "",
        type: "",
        pricePerNight: 0,
        capacity: 1,
        description: "",
        isAvailable: true,
        amenities: [],
      });
      setImages({
        roomImage1: null,
        roomImage2: null,
        roomImage3: null,
        roomImage4: null,
      });
      setImageFiles({
        roomImage1: null,
        roomImage2: null,
        roomImage3: null,
        roomImage4: null,
      });

      console.log("Room added:", result);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Failed to add room. Please try again.",
      });
      console.error("Error adding room:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-xl">
      <form className="space-y-8" onSubmit={handleSubmit}>
        {/* Title Section */}
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Add New Room
          </h1>
          <p className="mt-2 text-gray-600 text-lg">
            Provide accurate details for room type, pricing, and amenities to
            create an appealing listing.
          </p>
        </div>

        {/* Hiển thị message */}
        {message.text && (
          <div
            className={`p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Images Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Room Images
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {Object.keys(images).map((key) => (
              <label
                key={key}
                className="relative flex items-center justify-center w-full h-40 bg-white rounded-xl border-2 border-dashed border-gray-300 hover:border-indigo-500 hover:shadow-md transition-all duration-300 cursor-pointer"
              >
                {images[key] ? (
                  <img
                    src={images[key]}
                    alt="Room preview"
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <div className="text-center">
                    <svg
                      className="mx-auto h-8 w-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                      />
                    </svg>
                    <span className="text-gray-500 text-sm">Upload Image</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  id={key}
                  className="hidden"
                  onChange={(e) => handleImageChange(key, e.target.files[0])}
                />
              </label>
            ))}
          </div>
        </div>

        {/* Room Details Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Room Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="roomNumber"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Room Number *
              </label>
              <input
                type="text"
                id="roomNumber"
                name="roomNumber"
                value={inputs.roomNumber}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                placeholder="e.g., 101"
              />
            </div>
            <div>
              <label
                htmlFor="type"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Room Type *
              </label>
              <div className="relative">
                <select
                  id="type"
                  name="type"
                  value={inputs.type}
                  onChange={handleInputChange}
                  required
                  className="appearance-none w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                >
                  <option value="">Select Room Type</option>
                  <option value="SINGLE">Single Room</option>
                  <option value="DOUBLE">Double Room</option>
                  <option value="DELUXE">Deluxe Room</option>
                  <option value="SUITE">Suite</option>
                  <option value="PRESIDENTIAL">Presidential Suite</option>
                </select>
                <svg
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
            <div>
              <label
                htmlFor="pricePerNight"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Price Per Night ($) *
              </label>
              <input
                type="number"
                id="pricePerNight"
                name="pricePerNight"
                value={inputs.pricePerNight}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                placeholder="e.g., 150.00"
              />
            </div>
            <div>
              <label
                htmlFor="capacity"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Capacity *
              </label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                value={inputs.capacity}
                onChange={handleInputChange}
                required
                min="1"
                max="10"
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                placeholder="e.g., 2"
              />
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Location
              </label>
              <textarea
                id="location"
                name="location"
                value={inputs.location}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                placeholder="Describe the room features, view, etc."
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={inputs.description}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                placeholder="Describe the room features, view, etc."
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isAvailable"
                name="isAvailable"
                checked={inputs.isAvailable}
                onChange={(e) =>
                  setInputs({ ...inputs, isAvailable: e.target.checked })
                }
                className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label
                htmlFor="isAvailable"
                className="ml-2 text-sm font-medium text-gray-700"
              >
                Available for booking
              </label>
            </div>
          </div>
        </div>

        {/* Amenities Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Amenities
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {amenitiesOptions.map((amenity) => (
              <label
                key={amenity}
                className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all duration-200"
              >
                <input
                  type="checkbox"
                  checked={inputs.amenities.includes(amenity)}
                  onChange={() => handleAmenityChange(amenity)}
                  className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className="text-gray-700 text-sm font-medium">
                  {amenity
                    .split("_")
                    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
                    .join(" ")}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-700"
            }`}
          >
            {loading ? "Adding Room..." : "Add Room"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddRoom;
