import React, { useState } from 'react';
import {
    HiHome,
    HiMenu,
    HiPlusCircle,
    HiViewList,
    HiX
} from 'react-icons/hi';
import { NavLink } from 'react-router-dom';

const SideBar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const sidebarLink = [
        { name: 'Dashboard', path: '/owner', icon: <HiHome className="text-xl" /> },
        { name: 'Add Room', path: '/owner/add-room', icon: <HiPlusCircle className="text-xl" /> },
        { name: 'List Room', path: '/owner/list-room', icon: <HiViewList className="text-xl" /> },
    ];

    return (
        <>
            {/* Mobile menu button */}
            <button
                className="md:hidden fixed top-4 left-4 z-50 bg-indigo-600 text-white p-2 rounded-md"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <HiX /> : <HiMenu />}
            </button>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <div className={`bg-white shadow-lg z-40 fixed md:static h-full transition-all duration-300 ${isOpen ? 'left-0' : '-left-64'} md:left-0 w-64`}>
                <nav className="mt-6">
                    {sidebarLink.map((link, index) => (
                        <NavLink
                            key={index}
                            to={link.path}
                            className="flex items-center py-3 px-6 text-gray-600 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-300"
                        >
                            {link.icon}
                            <span className="ml-3">{link.name}</span>
                        </NavLink>
                    ))}
                </nav>
            </div>
        </>
    );
};
export default SideBar;
