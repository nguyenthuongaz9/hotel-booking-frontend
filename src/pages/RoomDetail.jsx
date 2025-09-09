import React, { useEffect, useState } from 'react';
import { FaBed, FaCalendarAlt, FaCity, FaCoffee, FaDog, FaFire, FaMountain, FaParking, FaSwimmingPool, FaUser, FaUtensils, FaWifi } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import locationIcon from '../assets/locationIcon.svg';
import roomImg1 from '../assets/roomImg1.png';
import roomImg2 from '../assets/roomImg2.png';
import roomImg3 from '../assets/roomImg3.png';
import roomImg4 from '../assets/roomImg4.png';
import StarRating from '../components/StarRating';

const RoomDetail = () => {
    const { id } = useParams();
    const [room, setRoom] = useState(null);
    const [mainImage, setMainImage] = useState(null);
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [guests, setGuests] = useState(1);

    const roomDummyData = [
        {
            id: 1,
            name: "Luxury Suite",
            price: 250,
            description: "Experience the ultimate luxury with stunning views and premium amenities.",
            image: [roomImg1, roomImg2, roomImg3, roomImg4],
            location: "123 Phố Lý Thường Kiệt, Quận Hoàn Kiếm, Hà Nội",
            rating: 4.8,
            amenities: ["Free WiFi", "Breakfast Included", "Ocean View", "King Bed"],
            roomTypes: ["Double Bed"],
        }
    ];

    const amenitiesIcons = {
        "Free WiFi": <FaWifi />,
        "Breakfast Included": <FaCoffee />,
        "Ocean View": <FaSwimmingPool />,
        "King Bed": <FaBed />,
        "Free Parking": <FaParking />,
        "Pet Friendly": <FaDog />,
        "Fireplace": <FaFire />,
        "Mountain View": <FaMountain />,
        "Private Pool": <FaSwimmingPool />,
        "Beach Access": <FaUtensils />,
        "BBQ Area": <FaUtensils />,
        "Gym Access": <FaCity />,
        "City View": <FaCity />,
        "Kitchenette": <FaUtensils />,
    };

    useEffect(() => {
        const foundRoom = roomDummyData.find(room => room.id === parseInt(id));
        if (foundRoom) {
            setRoom(foundRoom);
            setMainImage(roomImg1);

            // Set default check-in to tomorrow and check-out to day after tomorrow
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            setCheckInDate(tomorrow.toISOString().split('T')[0]);

            const dayAfterTomorrow = new Date();
            dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
            setCheckOutDate(dayAfterTomorrow.toISOString().split('T')[0]);
        }
    }, [id]);

    const handleGuestsChange = (e) => {
        const value = Math.max(1, parseInt(e.target.value) || 1);
        setGuests(value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle booking submission here
        alert(`Booking request for ${room.name} from ${checkInDate} to ${checkOutDate} for ${guests} guests`);
    };

    return room && (
        <div className='py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32'>
            <h1 className='pt-4'>RoomDetail</h1>
            <div className='flex flex-col md:flex-row items-start md:items-center gap-2'>
                <h1 className='text-3xl md:text-4xl font-semibold'>{room.name} <span className='font-thin text-sm'>({room.roomTypes})</span></h1>
                <p className='font-extrabold text-xs py-1.5 px-3 text-white bg-orange-500 rounded-full'>20% OFF</p>
            </div>

            {/* star */}
            <div className='flex items-center gap-1 mt-2'>
                <StarRating rating={room.rating} size={20} />
                <p className='ml-2'>200+ Reviews</p>
            </div>

            {/* address */}
            <div className='flex items-center gap-1 mt-2 text-gray-500'>
                <img src={locationIcon} alt="" />
                <span className='ml-2'>{room.location}</span>
            </div>

            {/* image */}
            <div className='flex flex-col lg:flex-row items-center gap-4 mt-6'>
                <div className='lg:w-1/2 w-full'>
                    <img src={mainImage} alt="room-image" className='w-full h-80 lg:h-96 rounded-xl shadow-lg object-cover' />
                </div>
                <div className='grid grid-cols-2 gap-4 lg:w-1/2 w-full'>
                    {room?.image.length > 1 && room?.image.map((image, index) => (
                        <img src={image} alt="room-image" className={`w-full h-36 lg:h-44 rounded-xl shadow-md object-cover cursor-pointer ${mainImage === image ? 'ring-2 ring-amber-500' : ''}`} key={index}
                            onClick={() => setMainImage(image)}
                        />
                    ))}
                </div>
            </div>

            {/* highlight */}
            <div className='mt-10 space-y-6 md:space-y-0 md:flex md:justify-between md:items-start md:gap-8'>
                <div className='space-y-6 md:max-w-2xl'>
                    <h1 className='text-2xl md:text-3xl lg:text-4xl font-light leading-tight text-gray-800'>
                        Experience the ultimate luxury with stunning views and premium amenities.
                    </h1>
                    <div className='flex flex-wrap gap-3 p-4 rounded-xl bg-gray-50 shadow-sm'>
                        {room.amenities.map((amenity, index) => (
                            <span key={index} className='flex items-center gap-2 px-3 py-2 text-sm text-gray-600 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200'>
                                <span className='text-orange-500'>{amenitiesIcons[amenity]}</span>
                                {amenity}
                            </span>
                        ))}
                    </div>
                </div>

                {/* room price*/}
                <div className='flex flex-col items-end space-y-2'>
                    <p className='text-2xl md:text-3xl font-semibold text-gray-800'>${room.price}</p>
                    <p className='text-sm text-gray-500'>per night</p>
                </div>
            </div>

            {/* check in - check out - guests - UPDATED LAYOUT */}
            <form onSubmit={handleSubmit} className='bg-white shadow-[0px_0px_20px_rgba(0,0,0,0.15)] p-6 rounded-xl mx-auto mt-16 max-w-6xl'>
                <h2 className='text-xl font-semibold mb-6 text-gray-800'>Book Your Stay</h2>

                <div className='flex flex-col md:flex-row items-stretch gap-4 md:gap-6'>
                    {/* Check-in Date */}
                    <div className='flex-1 flex flex-col'>
                        <label htmlFor="checkInDate" className='font-medium text-gray-700 mb-2 flex items-center gap-2'>
                            <FaCalendarAlt className='text-blue-500' />
                            Check-In
                        </label>
                        <div className='relative'>
                            <input
                                type="date"
                                name="checkInDate"
                                id="checkInDate"
                                value={checkInDate}
                                onChange={(e) => setCheckInDate(e.target.value)}
                                className='w-full rounded-lg border border-gray-300 px-4 py-3 pl-10 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                required
                            />
                            <FaCalendarAlt className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
                        </div>
                    </div>

                    {/* Check-out Date */}
                    <div className='flex-1 flex flex-col'>
                        <label htmlFor="checkOutDate" className='font-medium text-gray-700 mb-2 flex items-center gap-2'>
                            <FaCalendarAlt className='text-blue-500' />
                            Check-Out
                        </label>
                        <div className='relative'>
                            <input
                                type="date"
                                name="checkOutDate"
                                id="checkOutDate"
                                value={checkOutDate}
                                onChange={(e) => setCheckOutDate(e.target.value)}
                                className='w-full rounded-lg border border-gray-300 px-4 py-3 pl-10 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                required
                            />
                            <FaCalendarAlt className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
                        </div>
                    </div>

                    {/* Guests */}
                    <div className='flex-1 flex flex-col'>
                        <label htmlFor="guests" className='font-medium text-gray-700 mb-2 flex items-center gap-2'>
                            <FaUser className='text-blue-500' />
                            Guests
                        </label>
                        <div className='relative'>
                            <input
                                type="number"
                                name="guests"
                                id="guests"
                                value={guests}
                                onChange={handleGuestsChange}
                                min="1"
                                max="10"
                                className='w-full rounded-lg border border-gray-300 px-4 py-3 pl-10 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                required
                            />
                            <FaUser className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
                        </div>
                    </div>

                    {/* Book Now Button */}
                    <div className='flex items-end'>
                        <button
                            type='submit'
                            className='bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all text-white rounded-lg w-full md:w-auto px-8 py-3.5 text-base font-medium cursor-pointer shadow-md hover:shadow-lg'
                        >
                            Book Now
                        </button>
                    </div>
                </div>

                {/* Price Summary */}
                {checkInDate && checkOutDate && (
                    <div className='mt-6 pt-6 border-t border-gray-200'>
                        <h3 className='font-medium text-gray-700 mb-2'>Price Summary</h3>
                        <div className='flex justify-between'>
                            <span>${room.price} × {Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24))} nights</span>
                            <span>${room.price * Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24))}</span>
                        </div>
                        <div className='flex justify-between font-semibold mt-2 pt-2 border-t border-gray-100'>
                            <span>Total</span>
                            <span>${room.price * Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24))}</span>
                        </div>
                    </div>
                )}
            </form>

            {/*Host by */}
            <div className="flex flex-col items-start gap-4 mt-20">
                <div className="flex gap-4">
                    <img src={room.image} alt="host" className='h-14 w-14 md:h-18 md:w-18 rounded-full'/>
                    <div>
                        <p className='text-lg md:text-xl'>Host by {room.name}</p>
                        <div className='flex items-center mt-1'>
                            <StarRating rating={room.rating} size={16} />
                            <span className='ml-2 text-sm text-gray-500'>200+ Reviews</span>
                        </div>
                    </div>
                </div>
                <button className='px-6 py-2.5 mt-4 rounded text-white bg-blue-500 hover:bg-blue-600 active:scale-95 transition-all cursor-pointer'>Contact Now</button>
            </div>
        </div>
    )
}

export default RoomDetail;