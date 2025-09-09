import React from 'react';
import { useNavigate } from 'react-router-dom';
import roomImg1 from '../assets/roomImg1.png';
import roomImg2 from '../assets/roomImg2.png';
import roomImg3 from '../assets/roomImg3.png';
import roomImg4 from '../assets/roomImg4.png';
import HotelCard from './HotelCard';
import Title from './Title';


const roomDummyData = [
    {
        id: 1,
        name: "Luxury Suite",
        price: 250,
        description: "Experience the ultimate luxury with stunning views and premium amenities.",
        image: roomImg1,
        location: "123 Phố Lý Thường Kiệt, Quận Hoàn Kiếm, Hà Nội",
        rating: 4.8,
    },
    {
        id: 2,
        name: "Cozy Cabin",
        price: 120,
        description: "A charming cabin perfect for a peaceful getaway in nature.",
        image: roomImg2,
        location: "456 Đường Võ Nguyên Giáp, Quận Sơn Trà, Đà Nẵng",
        rating: 4.5,
    },
    {
        id: 3,
        name: "Beachfront Villa",
        price: 300,
        description: "Wake up to the sound of waves in this beautiful beachfront villa.",
        image: roomImg3,
        location: "789 Đường Trần Phú, Thành phố Nha Trang, Khánh Hòa",
        rating: 4.9,
    },
    {
        id: 4,
        name: "City Apartment",
        price: 180,
        description: "Modern apartment located in the heart of the city.",
        image: roomImg4,
        location: "101 Nguyễn Huệ, Quận 1, Hồ Chí Minh",
        rating: 4.7,
    },
];

const FeaturedDestination = () => {
    const navigate = useNavigate();
    return (
        <div className="container-fluid mx-auto px-4 py-16">
            <Title title='Featured Destination' subtitle='Discover our handpicked selection of exceptional properties around the world, offering unparalleled luxury and unforgettable experiences.' />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
                {roomDummyData.map((room, index) => (
                    <HotelCard key={room.id} room={room} index={index} />
                ))}
            </div>
            <div className="text-center mt-10">
                <button
                    onClick={() => { navigate('/rooms'); scrollTo(0, 0) }}
                    className="my-4 px-4 py-2 text-sm font-medium border border-gray-300 rounded bg-white hover:bg-gray-100 transition-colors duration-300 shadow-md hover:shadow-lg text-gray-700 hover:text-gray-900"
                >
                    View All Rooms
                </button>
            </div>
        </div>
    )
}

export default FeaturedDestination