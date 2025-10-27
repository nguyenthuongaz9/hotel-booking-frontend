import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { roomService } from "../services/RoomService"; // Điều chỉnh đường dẫn theo cấu trúc dự án của bạn
import HotelCard from "./HotelCard";
import Title from "./Title";

const FeaturedDestination = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedRooms = async () => {
      try {
        setLoading(true);
        // Lấy 4 phòng đầu tiên với các tham số phù hợp
        const params = {
          page: 0,
          size: 4,
          // Có thể thêm các tham số khác nếu muốn filter featured rooms
          // ví dụ: isFeatured: true nếu API hỗ trợ
        };

        const response = await roomService.getRooms(params);
        setRooms(response.content || response.data || response); // Tuỳ thuộc vào cấu trúc response của API
      } catch (err) {
        console.error("Error fetching featured rooms:", err);
        setError("Failed to load featured destinations");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedRooms();
  }, []);

  if (loading) {
    return (
      <div className="container-fluid mx-auto px-4 py-16">
        <Title
          title="Featured Destination"
          subtitle="Discover our handpicked selection of exceptional properties around the world, offering unparalleled luxury and unforgettable experiences."
        />
        <div className="flex justify-center items-center py-10">
          <div className="text-gray-600">Loading featured destinations...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid mx-auto px-4 py-16">
        <Title
          title="Featured Destination"
          subtitle="Discover our handpicked selection of exceptional properties around the world, offering unparalleled luxury and unforgettable experiences."
        />
        <div className="flex justify-center items-center py-10">
          <div className="text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  console.log(rooms[0].images[0].image);

  return (
    <div className="container-fluid mx-auto px-4 py-16">
      <Title
        title="Featured Destination"
        subtitle="Discover our handpicked selection of exceptional properties around the world, offering unparalleled luxury and unforgettable experiences."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
        {rooms.map((room, index) => (
          <HotelCard
            key={room.id}
            room={room}
            index={index}
            image={`${import.meta.env.VITE_API_IMAGE_UPLOADS}/${room.images[0].image}`}
          />
        ))}
      </div>
      <div className="text-center mt-10">
        <button
          onClick={() => {
            navigate("/rooms");
            scrollTo(0, 0);
          }}
          className="my-4 px-4 py-2 text-sm font-medium border border-gray-300 rounded bg-white hover:bg-gray-100 transition-colors duration-300 shadow-md hover:shadow-lg text-gray-700 hover:text-gray-900"
        >
          View All Rooms
        </button>
      </div>
    </div>
  );
};

export default FeaturedDestination;
