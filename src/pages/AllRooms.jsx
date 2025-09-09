import React, { useState } from 'react';
import { FaBed, FaCity, FaCoffee, FaDog, FaFire, FaMountain, FaParking, FaSwimmingPool, FaUtensils, FaWifi } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import locationIcon from '../assets/locationIcon.svg';
import roomImg1 from '../assets/roomImg1.png';
import roomImg2 from '../assets/roomImg2.png';
import roomImg3 from '../assets/roomImg3.png';
import roomImg4 from '../assets/roomImg4.png';
import StarRating from '../components/StarRating';

const CheckBox = ({ label, selected, onChange = () => { } }) => (
    <label className='flex items-center gap-2 mb-2'>
        <input
            type='checkbox'
            checked={selected}
            onChange={(e) => onChange(e.target.checked, label)}
            className='form-checkbox h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
        />
        <span className='text-gray-700'>{label}</span>
    </label>
);

const RadioButton = ({ label, selected, onChange = () => { } }) => (
    <label className='flex items-center gap-2 mb-2'>
        <input
            type='radio'
            name='sortOptions'
            checked={selected}
            onChange={(e) => onChange(label)}
            className='form-checkbox h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
        />
        <span className='text-gray-700'>{label}</span>
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
        "Fireplace": <FaFire />,
        "Mountain View": <FaMountain />,
        "Private Pool": <FaSwimmingPool />,
        "Beach Access": <FaUtensils />,
        "BBQ Area": <FaUtensils />,
        "Gym Access": <FaCity />,
        "City View": <FaCity />,
        "Kitchenette": <FaUtensils />,
    };

    const roomDummyData = [
        {
            id: 1,
            name: "Luxury Suite",
            price: 250,
            description: "Experience the ultimate luxury with stunning views and premium amenities.",
            image: roomImg1,
            location: "123 Phố Lý Thường Kiệt, Quận Hoàn Kiếm, Hà Nội",
            rating: 4.8,
            amenities: ["Free WiFi", "Breakfast Included", "Ocean View", "King Bed"],
        },
        {
            id: 2,
            name: "Cozy Cabin",
            price: 120,
            description: "A charming cabin perfect for a peaceful getaway in nature.",
            image: roomImg2,
            location: "456 Đường Võ Nguyên Giáp, Quận Sơn Trà, Đà Nẵng",
            rating: 4.5,
            amenities: ["Free Parking", "Pet Friendly", "Fireplace", "Mountain View"],
        },
        {
            id: 3,
            name: "Beachfront Villa",
            price: 300,
            description: "Wake up to the sound of waves in this beautiful beachfront villa.",
            image: roomImg3,
            location: "789 Đường Trần Phú, Thành phố Nha Trang, Khánh Hòa",
            rating: 4.9,
            amenities: ["Private Pool", "Beach Access", "Free WiFi", "BBQ Area"],
        },
        {
            id: 4,
            name: "City Apartment",
            price: 180,
            description: "Modern apartment located in the heart of the city.",
            image: roomImg4,
            location: "101 Nguyễn Huệ, Quận 1, Hồ Chí Minh",
            rating: 4.7,
            amenities: ["Free WiFi", "Gym Access", "City View", "Kitchenette"],
        },
    ];

    const roomTypes = [
        "Single Bed",
        "Double Bed",
        "Suite",
        "Deluxe Room",
        "Family Room",
        "King Room",
    ];
    const priceRanges = [
        "$50 - $100",
        "$101 - $200",
        "$201 - $300",
        "$301 - $400",
        "$401 and above"
    ];
    const sortOptions = [
        "Price: Low to High",
        "Price: High to Low",
    ];

    const navigate = useNavigate();

    const [openFilter, setOpenFilter] = useState(false);

    return (
        <div className='flex flex-col-reverse lg:flex-row items-start justify-between pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32'>
            <div>
                <div className='flex flex-col items-start text-left'>
                    <h1 className='font-bold text-4xl md:text-[40px]'>Hotel rooms</h1>
                    <p className='text-sm md:text-base text-gray-500/90 mt-2'>Take a look at our hotel rooms limited offers and special packages to enhance your experience</p>
                </div>
                {/* rooms list */}
                {roomDummyData.map((room) => (
                    <div className='mt-8 flex flex-col md:flex-row items-start gap-6 py-10 border-b border-gray-300 last:pb-30 last:border-0 md:gap-8' key={room.id}>
                        <img
                            src={room.image} alt="hotel-img"
                            title='View Room Details'
                            className='max-h-65 md:w-1/2 rounded-xl shadow-lg object-cover cursor-pointer'
                            onClick={() => { navigate(`/rooms/${room.id}`); scrollTo(0, 0) }}
                        />
                        <div className='md:w-1/2 flex flex-col gap-2'>
                            <p className='text-gray-800 text-3xl font-semibold cursor-pointer'>{room.name}</p>
                            <StarRating rating={room.rating} size={20} />
                            <div className='flex items-center gap-1 text-gray-500 mt-2 text-sm'>
                                <img src={locationIcon} alt="" />
                                <span className='text-gray-500'>{room.location}</span>
                            </div>
                            {/* Rooms Amenities */}
                            <div className='flex flex-wrap gap-2 mt-2'>
                                {room.amenities.map((amenity, index) => (
                                    <span key={index} className='flex items-center gap-1 text-gray-600 text-sm mr-2'>
                                        {amenitiesIcons[amenity]} {amenity}
                                    </span>
                                ))}
                            </div>
                            {/* Price per night */}
                            <div className='mt-4 flex items-center gap-2'>
                                <span className='text-gray-800 text-xl font-semibold'>${room.price}</span>
                                <span className='text-gray-800 text-xl'> /night</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {/* filter */}
            <div className='bg-white w-80 border border-gray-300 text-gray-600 max-lg:mb-8 min-lg:mt-16'>
                <div className={`flex items-center justify-between px-4 py-2 border-b border-gray-300 ${openFilter ? 'bg-gray-100' : ''}`}>
                    <p className='text-base font-medium text-gray-800'>filters</p>
                    <div className='text-xs cursor-pointer'>
                        <span onClick={() => setOpenFilter(!openFilter)} className='lg:hidden'>{openFilter ? 'HIDE' : 'SHOW'}</span>
                        <span className='hidden lg:block'>clear</span>
                    </div>
                </div>
                {/*show */}
                <div className={`${openFilter ? 'h-auto' : 'h-0 lg:h-auto overflow-hidden transition-all duration-700'}`}>
                    <div className='px-5 pt-5'>
                        <p className='font-medium text-gray-800 pb-2'>Popular filters</p>
                        {/* room type */}
                        <div className='mb-4'>
                            <p className='text-gray-700 font-medium mb-2'>Room Type</p>
                            {roomTypes.map((type, index) => (
                                <CheckBox
                                    key={index}
                                    label={type}
                                    selected={false}
                                    onChange={(checked) => console.log(`${type} is ${checked ? 'selected' : 'deselected'}`)}
                                />
                            ))}
                        </div>
                        {/* price range */}
                        <div className='mb-4'>
                            <p className='text-gray-700 font-medium mb-2'>Price Range</p>
                            {priceRanges.map((range, index) => (
                                <CheckBox
                                    key={index}
                                    label={range}
                                    selected={false}
                                    onChange={(checked) => console.log(`${range} is ${checked ? 'selected' : 'deselected'}`)}
                                />
                            ))}
                        </div>
                        {/* sort by */}
                        <div className='mb-4'>
                            <p className='text-gray-700 font-medium mb-2'>Sort By</p>
                            {sortOptions.map((option, index) => (
                                <RadioButton
                                    key={index}
                                    label={option}
                                    selected={false}
                                    onChange={(value) => console.log(`Sorted by ${value}`)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AllRooms;