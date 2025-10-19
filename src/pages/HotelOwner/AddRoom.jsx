import { useState } from 'react';

const AddRoom = () => {
  const [images, setImages] = useState({
    roomImage1: "",
    roomImage2: "",
    roomImage3: "",
    roomImage4: "",
  });
  const [inputs, setInputs] = useState({
    roomType: "",
    pricePerNight: 0,
    amenities: {
      'Free Wi-Fi': false,
      'Free-Breakfast': false,
      'Room-Service': false,
      'Mountain-View': false,
      'Pool-Access': false,
    },
  });

  // Handle image change
  const handleImageChange = (key, file) => {
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImages({ ...images, [key]: imageUrl });
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };

  // Handle amenities change
  const handleAmenityChange = (amenity) => {
    setInputs({
      ...inputs,
      amenities: {
        ...inputs.amenities,
        [amenity]: !inputs.amenities[amenity],
      },
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-xl">
      <form className="space-y-8">
        {/* Title Section */}
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Add New Room</h1>
          <p className="mt-2 text-gray-600 text-lg">
            Provide accurate details for room type, pricing, and amenities to create an appealing listing.
          </p>
        </div>

        {/* Images Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Room Images</h2>
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
                    <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
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
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Room Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="roomType" className="block text-sm font-medium text-gray-700 mb-2">
                Room Type
              </label>
              <div className="relative">
                <select
                  id="roomType"
                  name="roomType"
                  value={inputs.roomType}
                  onChange={handleInputChange}
                  className="appearance-none w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                >
                  <option value="">Select Room Type</option>
                  <option value="single-bed">Single Bed</option>
                  <option value="double-bed">Double Bed</option>
                  <option value="luxury-room">Luxury Room</option>
                  <option value="family-room">Family Room</option>
                </select>
                <svg
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <div>
              <label htmlFor="pricePerNight" className="block text-sm font-medium text-gray-700 mb-2">
                Price Per Night ($)
              </label>
              <input
                type="number"
                id="pricePerNight"
                name="pricePerNight"
                value={inputs.pricePerNight}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                placeholder="e.g., 150"
              />
            </div>
          </div>
        </div>

        {/* Amenities Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Amenities</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {Object.keys(inputs.amenities).map((amenity) => (
              <label
                key={amenity}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
              >
                <input
                  type="checkbox"
                  checked={inputs.amenities[amenity]}
                  onChange={() => handleAmenityChange(amenity)}
                  className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className="text-gray-700 text-sm font-medium">{amenity}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all duration-200"
          >
            Add Room
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddRoom;