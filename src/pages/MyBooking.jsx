import React, { useState } from 'react';
import roomImg1 from '../assets/roomImg1.png';
import roomImg2 from '../assets/roomImg2.png';
import roomImg3 from '../assets/roomImg3.png';
import roomImg4 from '../assets/roomImg4.png';
import Title from '../components/Title';

const MyBooking = () => {
    const roomDummyData = [
        {
            _id: 1,
            name: "Luxury Suite",
            price: 250,
            description: "Experience the ultimate luxury with stunning views and premium amenities.",
            image: [roomImg1, roomImg2, roomImg3, roomImg4],
            location: "123 Phố Lý Thường Kiệt, Quận Hoàn Kiếm, Hà Nội",
            rating: 4.8,
            amenities: ["Free WiFi", "Breakfast Included", "Ocean View", "King Bed"],
            roomTypes: ["Double Bed"],
            checkIn: "2023-10-15",
            checkOut: "2023-10-20",
            guests: 2,
            status: "Confirmed",
            payment: "Paid"
        },
        {
            _id: 2,
            name: "Deluxe Room",
            price: 180,
            description: "Comfortable room with modern amenities for a pleasant stay.",
            image: [roomImg2, roomImg1, roomImg3, roomImg4],
            location: "456 Đường Nguyễn Huệ, Quận 1, TP. HCM",
            rating: 4.5,
            amenities: ["Free WiFi", "Swimming Pool", "Air Conditioning"],
            roomTypes: ["Twin Beds"],
            checkIn: "2023-11-05",
            checkOut: "2023-11-08",
            guests: 1,
            status: "Pending",
            payment: "Unpaid"
        }
    ];

    const [bookings, setBookings] = useState(roomDummyData);

    return (
        <div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-20 px-4 md:px-16 lg:px-24 xl:px-32'>
            <div className='max-w-7xl mx-auto'>
                <Title
                    title="My Booking"
                    subtitle='Easily manage your past, current, and upcoming hotel reservations in one place. Plan your trips seamlessly with just a few clicks and unlock a world of unforgettable experiences.'
                    align="left"
                />

                <div className='mt-12 space-y-6'>
                    {bookings.map((booking) => (
                        <div key={booking._id} className='bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100'>
                            <div className='p-8'>
                                <div className='grid grid-cols-1 lg:grid-cols-12 gap-8 items-start'>

                                    {/* Hotel Image and Info */}
                                    <div className='lg:col-span-5'>
                                        <div className='flex flex-col sm:flex-row gap-6'>
                                            <div className='w-full sm:w-48 h-48 rounded-xl overflow-hidden flex-shrink-0 shadow-lg'>
                                                <img
                                                    src={booking.image[0]}
                                                    alt={booking.name}
                                                    className='w-full h-full object-cover transition-transform hover:scale-110 duration-500'
                                                />
                                            </div>
                                            <div className='flex-1'>
                                                <div className='flex items-start justify-between mb-3'>
                                                    <h3 className='text-2xl font-bold text-gray-900 leading-tight'>{booking.name}</h3>
                                                </div>

                                                <div className='flex items-center mb-3'>
                                                    <svg className="w-4 h-4 text-gray-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                                    </svg>
                                                    <p className='text-gray-600 text-sm'>{booking.location}</p>
                                                </div>

                                                <div className='flex items-center gap-4 mb-4'>
                                                    <div className='flex items-center bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg'>
                                                        <svg className="w-4 h-4 mr-1.5 fill-current" viewBox="0 0 20 20">
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                        <span className='font-semibold text-sm'>{booking.rating}</span>
                                                    </div>

                                                    <div className='flex items-center text-gray-600'>
                                                        <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                        </svg>
                                                        <span className='text-sm font-medium'>{booking.guests} {booking.guests > 1 ? 'guests' : 'guest'}</span>
                                                    </div>
                                                </div>

                                                <div className='flex flex-wrap gap-2'>
                                                    {booking.amenities.slice(0, 3).map((amenity, index) => (
                                                        <span key={index} className='text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full font-medium border border-blue-200'>
                                                            {amenity}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Check-in/out Dates */}
                                    <div className='lg:col-span-3'>
                                        <div className='bg-gray-50 rounded-xl p-5'>
                                            <h4 className='text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide'>Booking Period</h4>

                                            <div className='space-y-4'>
                                                <div>
                                                    <p className='text-xs text-gray-500 uppercase tracking-wide mb-1'>Check-in</p>
                                                    <p className='font-bold text-gray-900 text-lg'>{booking.checkIn}</p>
                                                </div>

                                                <div className='flex justify-center'>
                                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                                    </svg>
                                                </div>

                                                <div>
                                                    <p className='text-xs text-gray-500 uppercase tracking-wide mb-1'>Check-out</p>
                                                    <p className='font-bold text-gray-900 text-lg'>{booking.checkOut}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Payment and Status */}
                                    <div className='lg:col-span-4'>
                                        <div className='flex flex-col h-full justify-between'>
                                            <div>
                                                <div className='flex flex-col sm:flex-row lg:flex-col gap-3 mb-6'>
                                                    <div className='flex items-center justify-between'>
                                                        <span className='text-sm text-gray-600 font-medium'>Payment Status</span>
                                                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide
                                                            ${booking.payment === 'Paid'
                                                                ? 'bg-green-100 text-green-800 border border-green-200'
                                                                : 'bg-red-100 text-red-800 border border-red-200'}`}>
                                                            {booking.payment}
                                                        </span>
                                                    </div>

                                                    <div className='flex items-center justify-between'>
                                                        <span className='text-sm text-gray-600 font-medium'>Booking Status</span>
                                                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide
                                                            ${booking.status === 'Confirmed'
                                                                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                                                : 'bg-yellow-100 text-yellow-800 border border-yellow-200'}`}>
                                                            {booking.status}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className='bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-6'>
                                                    <p className='text-sm text-gray-600 mb-1'>Total Amount</p>
                                                    <p className='text-3xl font-bold text-gray-900'>${booking.price * 5}</p>
                                                </div>
                                            </div>

                                            {booking.payment === 'Unpaid' && (
                                                <button className='w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl'>
                                                    Pay Now
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default MyBooking