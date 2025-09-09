import React from 'react';
import calenderIcon from '../assets/calenderIcon.svg';
import heroImage from '../assets/heroImage.png';
import searchIcon from '../assets/searchIcon.svg';
import { vietnamProvinces } from '../util/data';

const Hero = () => {
    return (
        <div
            className="relative flex flex-col items-center justify-center text-white min-h-screen py-20"
            style={{
                backgroundImage: `url(${heroImage})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50"></div>

            {/* Content */}
            <div className="relative z-10 text-center px-4 md:px-16 lg:px-24 xl:px-32 mb-8">
                <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-4">
                    Find the Perfect Hotel
                </h1>
                <p className="text-base md:text-lg lg:text-xl mb-6 md:mb-8">
                    Discover amazing hotels and experiences in Vietnam
                </p>
                <button className="bg-white text-black px-6 md:px-8 py-2.5 md:py-3 rounded-full font-medium hover:bg-opacity-90 transition-all">
                    Start Searching
                </button>
            </div>

            {/* Search Form - Responsive */}
            <form className="relative z-10 bg-white text-gray-500 rounded-lg w-full max-w-sm md:max-w-4xl mx-4 md:mx-auto shadow-lg">

                {/* Mobile Layout */}
                <div className="block md:hidden p-4 space-y-4">
                    {/* Destination */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <img src={calenderIcon} alt="Calendar Icon" className="h-4" />
                            <label htmlFor="destinationInputMobile" className="text-sm font-medium">
                                Destination
                            </label>
                        </div>
                        <input
                            list="destinationsMobile"
                            id="destinationInputMobile"
                            type="text"
                            className="w-full rounded border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                            placeholder="Enter destination"
                        />
                        <datalist id="destinationsMobile">
                            {vietnamProvinces.map((province) => (
                                <option key={province.id} value={province.name}>
                                    {province.name}
                                </option>
                            ))}
                        </datalist>
                    </div>

                    {/* Check-in & Check-out in row */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <img src={calenderIcon} alt="" className="h-4" />
                                <label htmlFor="checkInMobile" className="text-sm font-medium">
                                    Check-in
                                </label>
                            </div>
                            <input
                                id="checkInMobile"
                                type="date"
                                className="w-full rounded border border-gray-200 px-2 py-2.5 text-sm outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <img src={calenderIcon} alt="" className="h-4" />
                                <label htmlFor="checkOutMobile" className="text-sm font-medium">
                                    Check-out
                                </label>
                            </div>
                            <input
                                id="checkOutMobile"
                                type="date"
                                className="w-full rounded border border-gray-200 px-2 py-2.5 text-sm outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>

                    {/* Guests */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <label htmlFor="guestsMobile" className="text-sm font-medium">
                                Guests
                            </label>
                        </div>
                        <input
                            min={1}
                            max={4}
                            id="guestsMobile"
                            type="number"
                            className="w-full rounded border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                            placeholder="Number of guests"
                        />
                    </div>

                    {/* Search Button */}
                    <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 rounded-md bg-black py-3 px-6 text-white hover:bg-opacity-90 transition-all font-medium"
                    >
                        <img src={searchIcon} alt="searchIcon" className="h-5" />
                        <span>Search Hotels</span>
                    </button>
                </div>

                {/* Desktop Layout */}
                <div className="hidden md:flex items-end gap-4 p-6">
                    {/* Destination Input */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                            <img src={calenderIcon} alt="Calendar Icon" className="h-4" />
                            <label htmlFor="destinationInput" className="text-sm font-medium">
                                Destination
                            </label>
                        </div>
                        <input
                            list="destinations"
                            id="destinationInput"
                            type="text"
                            className="w-full rounded border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                            placeholder="Enter destination"
                        />
                        <datalist id="destinations">
                            {vietnamProvinces.map((province) => (
                                <option key={province.id} value={province.name}>
                                    {province.name}
                                </option>
                            ))}
                        </datalist>
                    </div>

                    {/* Check-in Input */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                            <img src={calenderIcon} alt="" className="h-4" />
                            <label htmlFor="checkIn" className="text-sm font-medium">
                                Check-in
                            </label>
                        </div>
                        <input
                            id="checkIn"
                            type="date"
                            className="w-full rounded border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Check-out Input */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                            <img src={calenderIcon} alt="" className="h-4" />
                            <label htmlFor="checkOut" className="text-sm font-medium">
                                Check-out
                            </label>
                        </div>
                        <input
                            id="checkOut"
                            type="date"
                            className="w-full rounded border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Guests Input */}
                    <div className="flex-1 min-w-0 max-w-[120px]">
                        <div className="flex items-center gap-2 mb-2">
                            <label htmlFor="guests" className="text-sm font-medium">
                                Guests
                            </label>
                        </div>
                        <input
                            min={1}
                            max={4}
                            id="guests"
                            type="number"
                            className="w-full rounded border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                            placeholder="0"
                        />
                    </div>

                    {/* Search Button */}
                    <button
                        type="submit"
                        className="flex items-center justify-center gap-2 rounded-md bg-black py-2.5 px-6 text-white hover:bg-opacity-90 transition-all whitespace-nowrap"
                    >
                        <img src={searchIcon} alt="searchIcon" className="h-5" />
                        <span>Search</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Hero;