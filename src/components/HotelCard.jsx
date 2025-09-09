import React from 'react';
import { RiMapPinLine } from "react-icons/ri";
import { Link } from 'react-router-dom';

const HotelCard = ({ room, index }) => {
    const displayRoom = {
        ...room,
        location: room.location || "Địa chỉ không xác định",
        rating: room.rating || 4.0,
        image: room.image || 'placeholder-image-url',
    };

    return (
        <Link to={`/rooms/${displayRoom._id}`}
            className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 flex flex-col"
            onClick={() => scrollTo(0, 0)}
            key={displayRoom._id}
        >
            <div className="relative">
                <img
                    src={displayRoom.image}
                    alt={displayRoom.name}
                    className="w-full h-40 object-cover"
                />
                <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-full text-sm font-semibold">
                    ${displayRoom.price}/night
                </div>
            </div>

            <div className="p-3 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold">{displayRoom.name}</h3>
                    <div className="flex items-center">
                        <span className="text-yellow-400">★</span>
                        <span className="ml-1 text-sm">{displayRoom.rating}</span>
                    </div>
                </div>

                <div className="flex items-center text-gray-600 text-sm mb-2 gap-1">
                    <RiMapPinLine className="flex-shrink-0" />
                    <p className="flex-grow min-w-0 font-semibold">{displayRoom.location}</p>
                </div>

                <button
                    className="w-full bg-blue-500 text-white py-2 rounded-md font-medium hover:bg-blue-600 transition-colors mt-auto"
                    onClick={(e) => {
                        e.preventDefault();
                        alert(`Booking ${displayRoom.name}`);
                    }}
                >
                    Book Now
                </button>
            </div>
        </Link>
    )
}

export default HotelCard