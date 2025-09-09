import React from 'react';
import Title from './Title';
//
import arrowIcon from '../assets/arrowIcon.svg';
import room1 from '../assets/roomImg1.png';
import room2 from '../assets/roomImg2.png';
import room3 from '../assets/roomImg3.png';
import room4 from '../assets/roomImg4.png';

const Offer = () => {

    const exclOffers = [
        {
            image: room1,
            priceOff: '20%',
            title: 'Luxury Beach Resort',
            description: 'Enjoy a luxurious stay at our exclusive beach resort.',
            expiryDate: 'June 30, 2025',
        },
        {
            image: room2,
            priceOff: '15%',
            title: 'Mountain Retreat',
            description: 'Escape to the mountains for a serene getaway.',
            expiryDate: 'July 15, 2025',
        },
        {
            image: room3,
            priceOff: '10%',
            title: 'City Hotel',
            description: 'Experience the vibrant city life with our special offers.',
            expiryDate: 'August 1, 2025',
        },
        {
            image: room4,
            priceOff: '25%',
            title: 'TPHCM Hotel',
            description: 'Experience the vibrant city life with our special offers.',
            expiryDate: 'August 5, 2025',
        },
    ];

    return (
        <section className='bg-gradient-to-b from-gray-50 to-white'>
            <div className='container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-16 lg:py-24'>
                {/* Header Section */}
                <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12 lg:mb-16'>
                    <Title
                        title='Exclusive Offers'
                        subtitle='Discover our handpicked selection of exceptional properties around the world, offering unparalleled luxury and unforgettable experiences.'
                        align="left"
                    />
                    <button className='group flex items-center gap-3 px-6 py-3 bg-white border-2 border-gray-200 hover:border-blue-500 rounded-full font-semibold text-gray-700 hover:text-blue-600 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 shrink-0'>
                        View All Offers
                        <img
                            src={arrowIcon}
                            alt="arrow"
                            className='w-4 h-4 group-hover:translate-x-1 transition-transform duration-300'
                        />
                    </button>
                </div>

                {/* Offers Grid */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8'>
                    {exclOffers.map((offer, index) => (
                        <div
                            key={index}
                            className="group relative overflow-hidden rounded-2xl bg-gray-900 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                        >
                            {/* Background Image with Overlay */}
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                style={{ backgroundImage: `url(${offer.image})` }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 group-hover:from-black/90 transition-all duration-500" />

                            {/* Content Container */}
                            <div className="relative z-10 flex flex-col justify-between h-full min-h-[320px] p-6">
                                <div className="flex justify-start">
                                    <span className='inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-sm font-bold rounded-full shadow-lg'>
                                        {offer.priceOff} OFF
                                    </span>
                                </div>

                                <div className="flex flex-col gap-3 mt-auto">
                                    <h3 className="text-xl lg:text-2xl font-bold text-white leading-tight">
                                        {offer.title}
                                    </h3>
                                    <p className="text-gray-200 text-sm lg:text-base leading-relaxed line-clamp-2">
                                        {offer.description}
                                    </p>
                                    <p className='text-xs text-gray-300 font-medium'>
                                        Expires {offer.expiryDate}
                                    </p>

                                    <button className="group/btn flex items-center gap-2 mt-4 px-4 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white hover:text-gray-900 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg w-fit">
                                        View Offers
                                        <img
                                            src={arrowIcon}
                                            alt="arrow"
                                            className='w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300 group-hover/btn:brightness-0'
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Offer