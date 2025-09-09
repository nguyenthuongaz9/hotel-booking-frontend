import React from 'react'
import FeaturedDestination from '../components/FeaturedDestination'
import Hero from '../components/Hero'
import Newsletter from '../components/Newsletter'
import Offer from '../components/Offer'
import Testimonial from '../components/Testimonial'

const Home = () => {
    return (
        <>
            <Hero />
            <FeaturedDestination />
            <Offer />
            <Testimonial />
            <Newsletter />
        </>
    )
}

export default Home