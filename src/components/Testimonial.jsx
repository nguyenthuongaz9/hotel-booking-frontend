import React, { useState, useEffect } from "react";
import Title from "./Title";

const API_BASE_URL = "http://localhost:8900/api";
const Testimonial = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/rooms/featured-reviews`);
      conole.log(response);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setTestimonials(data);
    } catch (err) {
      console.error("Error fetching testimonials:", err);
      setError("Failed to load testimonials");
      setTestimonials(getFallbackTestimonials());
    } finally {
      setLoading(false);
    }
  };

  const getFallbackTestimonials = () => [
    {
      id: 1,
      userName: "Emma Rodriguez",
      userEmail: "emma@example.com",
      rating: 5,
      comment:
        "Exceptional service and attention to detail. Everything was handled professionally and efficiently from start to finish. Highly recommended!",
    },
    {
      id: 2,
      userName: "Liam Johnson",
      userEmail: "liam@example.com",
      rating: 4,
      comment:
        "I'm truly impressed by the quality and consistency. The entire process was smooth, and the results exceeded all expectations. Thank you!",
    },
    {
      id: 3,
      userName: "Sophia Lee",
      userEmail: "sophia@example.com",
      rating: 5,
      comment:
        "Fantastic experience! From start to finish, the team was professional, responsive, and genuinely cared about delivering great results.",
    },
  ];

  const Star = ({ filled }) => (
    <svg
      className="w-4 h-4 text-yellow-400"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 17.25l-6.16 3.73 1.64-7.03L2.5 9.77l7.19-.61L12 2.5l2.31 6.66 7.19.61-5 4.18 1.64 7.03z"
      />
    </svg>
  );

  const getAvatarUrl = (name, email) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
  };

  const getLocationFromEmail = (email) => {
    const domain = email.split("@")[1];
    if (domain.includes("gmail")) return "California, USA";
    if (domain.includes("yahoo")) return "New York, USA";
    if (domain.includes("hotmail")) return "London, UK";
    return "Global Traveler";
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center px-6 md:px-6 lg:px-24 bg-slate-50 pt-30 pb-4">
        <Title
          title="What Our Customers Say"
          subtitle="Discover what our customers have to say about their experiences with our services."
        />
        <div className="flex flex-wrap items-center justify-center gap-6 mt-20 mb-10">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="bg-white p-6 rounded-xl shadow max-w-xs w-80 animate-pulse"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-24"></div>
                  <div className="h-3 bg-gray-300 rounded w-20"></div>
                </div>
              </div>
              <div className="flex gap-1 mt-4">
                {Array(5)
                  .fill(0)
                  .map((_, index) => (
                    <div
                      key={index}
                      className="w-4 h-4 bg-gray-300 rounded"
                    ></div>
                  ))}
              </div>
              <div className="space-y-2 mt-4">
                <div className="h-3 bg-gray-300 rounded"></div>
                <div className="h-3 bg-gray-300 rounded"></div>
                <div className="h-3 bg-gray-300 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error && testimonials.length === 0) {
    return (
      <div className="flex flex-col items-center px-6 md:px-6 lg:px-24 bg-slate-50 pt-30 pb-4">
        <Title
          title="What Our Customers Say"
          subtitle="Discover what our customers have to say about their experiences with our services."
        />
        <div className="text-center text-red-500 mt-4">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center px-6 md:px-6 lg:px-24 bg-slate-50 pt-30 pb-4">
      <Title
        title="What Our Customers Say"
        subtitle="Discover what our customers have to say about their experiences with our services."
      />

      <div className="flex flex-wrap items-center justify-center gap-6 mt-20 mb-10">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="bg-white p-6 rounded-xl shadow max-w-xs hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex items-center gap-3">
              <img
                className="w-12 h-12 rounded-full object-cover"
                src={getAvatarUrl(
                  testimonial.userName || "User",
                  testimonial.userEmail,
                )}
                alt={testimonial.userName || "User"}
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.userName || "User")}&background=random`;
                }}
              />
              <div>
                <p className="font-playfair text-xl font-semibold">
                  {testimonial.userName || "Anonymous User"}
                </p>
                <p className="text-gray-500 text-sm">
                  {getLocationFromEmail(testimonial.userEmail)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-4">
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <Star key={index} filled={testimonial.rating > index} />
                ))}
              <span className="ml-2 text-sm text-gray-600">
                {testimonial.rating}/5
              </span>
            </div>
            <p className="text-gray-600 mt-4 leading-relaxed italic">
              "{testimonial.comment || testimonial.review}"
            </p>
            {testimonial.createdAt && (
              <p className="text-gray-400 text-xs mt-3">
                {new Date(testimonial.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            )}
          </div>
        ))}
      </div>

      {testimonials.length === 0 && !loading && (
        <div className="text-center text-gray-500 mt-8">
          No testimonials available at the moment.
        </div>
      )}
    </div>
  );
};

export default Testimonial;
