import React, { useState } from 'react';
import closeIcon from '../../assets/closeIcon.svg';
import regImage from '../../assets/regImage.png';
import { PROVINCES } from '../../util/provinces';

const HotelReg = ({ onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        city: '',
    });
    const [showCityDropdown, setShowCityDropdown] = useState(false);
    const [filterText, setFilterText] = useState('');

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
    };

    const filteredProvinces = PROVINCES.filter(province =>
        province.toLowerCase().includes(filterText.toLowerCase())
    );

    const handleCitySelect = (city) => {
        setFormData(prev => ({ ...prev, city }));
        setShowCityDropdown(false);
        setFilterText('');
    };

    return (
        <div className='fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black/70 z-50 overflow-y-auto py-6'>
            <div className='relative bg-white rounded-xl max-w-4xl w-full mx-4 overflow-hidden shadow-2xl'>
                <button
                    onClick={onClose}
                    className='absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors'
                    aria-label="Close registration form"
                >
                    <img src={closeIcon} alt="close-icon" className='h-4 w-4' />
                </button>

                <div className='flex flex-col md:flex-row'>
                    <div className='hidden md:block md:w-2/5'>
                        <img
                            src={regImage}
                            alt="Hotel registration"
                            className='w-full h-full object-cover'
                        />
                    </div>

                    <div className='w-full md:w-3/5 p-6 md:p-8'>
                        <h2 className='text-2xl font-bold text-gray-800 mb-2'>Register Your Hotel</h2>
                        <p className='text-gray-600 mb-6'>Join our platform to reach thousands of potential guests</p>

                        <form onSubmit={handleSubmit} className='space-y-4'>
                            <div>
                                <label htmlFor="name" className='block text-sm font-medium text-gray-700 mb-1'>
                                    Hotel Name <span className='text-red-500'>*</span>
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter hotel name"
                                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition'
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="phone" className='block text-sm font-medium text-gray-700 mb-1'>
                                    Phone Number <span className='text-red-500'>*</span>
                                </label>
                                <input
                                    id="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Enter phone number"
                                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition'
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="address" className='block text-sm font-medium text-gray-700 mb-1'>
                                    Address <span className='text-red-500'>*</span>
                                </label>
                                <input
                                    id="address"
                                    type="text"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Enter full address"
                                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition'
                                    required
                                />
                            </div>

                            {/* Custom City Dropdown for Mobile */}
                            <div className="relative">
                                <label htmlFor="city" className='block text-sm font-medium text-gray-700 mb-1'>
                                    City/Province <span className='text-red-500'>*</span>
                                </label>

                                {/* Mobile-friendly custom dropdown */}
                                <div
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition appearance-none bg-white flex justify-between items-center cursor-pointer"
                                    onClick={() => setShowCityDropdown(!showCityDropdown)}
                                >
                                    <span className={formData.city ? "text-gray-800" : "text-gray-400"}>
                                        {formData.city || "-- Select city/province --"}
                                    </span>
                                    <svg
                                        className={`w-5 h-5 text-gray-400 transition-transform ${showCityDropdown ? 'rotate-180' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>

                                {showCityDropdown && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                        {/* Search filter for cities */}
                                        <div className="sticky top-0 bg-white p-2 border-b">
                                            <input
                                                type="text"
                                                placeholder="Search cities..."
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                value={filterText}
                                                onChange={(e) => setFilterText(e.target.value)}
                                            />
                                        </div>

                                        {/* City list */}
                                        <div className="py-1">
                                            {filteredProvinces.length > 0 ? (
                                                filteredProvinces.map((province, index) => (
                                                    <div
                                                        key={index}
                                                        className="px-4 py-2 hover:bg-indigo-50 cursor-pointer"
                                                        onClick={() => handleCitySelect(province)}
                                                    >
                                                        {province}
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="px-4 py-2 text-gray-500">No matching cities found</div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button
                                type="submit"
                                className='w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition mt-2'
                            >
                                Register Hotel
                            </button>
                        </form>

                        <p className='text-xs text-gray-500 mt-6 text-center'>
                            By registering, you agree to our Terms of Service and Privacy Policy.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HotelReg;