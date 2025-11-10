import React, { useEffect, useState } from "react";
import { RiMapPinLine } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";

const HotelCard = ({ room, index }) => {
  const [displayRoom, setDisplayRoom] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    setDisplayRoom({
      ...room,
      location: room.location || "Địa chỉ không xác định",
      rating: room.rating || 4.0,
      image: room.images[0].image,
    });
  }, []);

  console.log(displayRoom);
  if (!displayRoom) {
    return null;
  }

  return (
    <Link
      to={`/rooms/${displayRoom.id}`}
      className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 flex flex-col"
      onClick={() => scrollTo(0, 0)}
      key={displayRoom?.id || index}
    >
      <div className="relative">
        <img
          src={`${import.meta.env.VITE_API_IMAGE_UPLOADS}/${displayRoom.image}`}
          className="w-full h-40 object-cover"
        />
        <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-full text-sm font-semibold">
          ${displayRoom?.pricePerNight}/night
        </div>
      </div>

      <div className="p-3 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold">{displayRoom?.roomNumber}</h3>
          <div className="flex items-center">
            <span className="text-yellow-400">★</span>
            <span className="ml-1 text-sm">{displayRoom.rating}</span>
          </div>
        </div>

        <div className="flex items-center text-gray-600 text-sm mb-2 gap-1">
          <RiMapPinLine className="flex-shrink-0" />
          <p className="flex-grow min-w-0 font-semibold">
            {displayRoom.location}
          </p>
        </div>

        <button
          className="w-full bg-blue-500 text-white py-2 rounded-md font-medium hover:bg-blue-600 transition-colors mt-auto"
          onClick={() => navigate(`/rooms/${room?.id}`)}
        >
          Book Now
        </button>
      </div>
    </Link>
  );
};

export default HotelCard;
