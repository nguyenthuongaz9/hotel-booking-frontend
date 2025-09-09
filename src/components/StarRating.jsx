import React from 'react';
import { BsStar } from 'react-icons/bs';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';

const StarRating = ({ rating, size = 16 }) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
        stars.push(
            <FaStar
                key={`full-${i}`}
                className="text-yellow-500"
                size={size}
            />
        );
    }

    // Add half star if needed
    if (hasHalfStar) {
        stars.push(
            <FaStarHalfAlt
                key="half"
                className="text-yellow-500"
                size={size}
            />
        );
    }

    // Add empty stars
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars.push(
            <BsStar
                key={`empty-${i}`}
                className="text-yellow-500"
                size={size}
            />
        );
    }

    return (
        <div className="flex items-center gap-1">
            {stars}
            <span className="text-gray-600 ml-1">{rating}</span>
        </div>
    );
};

export default StarRating; 