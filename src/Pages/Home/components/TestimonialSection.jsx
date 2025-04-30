import React, { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { API_ENDPOINTS } from "../../../API_ENDPOINTS";

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  // Fetch testimonials from API
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_ENDPOINTS.TESTIMONIALS);
        if (!response.ok) {
          throw new Error('Failed to fetch testimonials');
        }
        const data = await response.json();
        setTestimonials(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // Auto-slide functionality
  useEffect(() => {
    if (testimonials.length === 0) return;
    
    const interval = setInterval(() => {
      goToNext();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [testimonials, currentIndex]);

  const goToPrevious = () => {
    if (animating) return;
    
    setAnimating(true);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
    
    setTimeout(() => setAnimating(false), 500);
  };

  const goToNext = () => {
    if (animating) return;
    
    setAnimating(true);
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
    
    setTimeout(() => setAnimating(false), 500);
  };

  const goToSlide = (index) => {
    if (animating) return;
    
    setAnimating(true);
    setCurrentIndex(index);
    
    setTimeout(() => setAnimating(false), 500);
  };

  // Render rating stars
  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, index) => (
      <Star 
        key={index} 
        size={20} 
        className={`${index < rating ? "text-black fill-black" : "text-gray-300"}`}
      />
    ));
  };

  // Determine badge style based on user type
  const getBadgeStyle = (userType) => {
    return userType === "owner" 
      ? "bg-gray-200 text-black border border-black" 
      : "bg-black text-white";
  };

  if (loading) {
    return (
      <div className="py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading testimonials...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 text-center">
        <p className="text-black">Error loading testimonials: {error}</p>
      </div>
    );
  }

  const displayTestimonials = testimonials;

  if (displayTestimonials.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-gray-600">No testimonials available yet.</p>
      </div>
    );
  }

  return (
    <section id="testimonials" className="font-monda py-16 px-6 bg-white">
      <div className="font-monda container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">What Our Customers Say</h2>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Don't just take our word for it — hear from our satisfied customers about their experience with our car rental service.
        </p>

        <div className="relative max-w-4xl mx-auto">
          {/* Testimonial Carousel */}
          <div className="overflow-hidden rounded-xl">
            <div 
              className={`transition-all duration-500 ease-in-out ${animating ? "opacity-50" : "opacity-100"}`}
              style={{ transform: `translateX(${-currentIndex * 100}%)` }}
            >
              <div className="flex">
                {displayTestimonials.map((testimonial, index) => (
                  <div 
                    key={testimonial.id} 
                    className="min-w-full p-6 md:p-10"
                  >
                    <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6 md:p-8">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <div className="flex space-x-1">
                            {renderStars(testimonial.rating)}
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            {new Date(testimonial.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <span 
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getBadgeStyle(testimonial.user_type)}`}
                        >
                          {testimonial.user_type === "owner" ? "Car Owner" : "Customer"}
                        </span>
                      </div>
                      
                      <blockquote className="text-gray-700 italic mb-6">
                        "{testimonial.description}"
                      </blockquote>
                      
                      <div className="flex items-center">
                        <div className="bg-black rounded-full w-10 h-10 flex items-center justify-center text-white font-bold">
                          {testimonial.user_name.charAt(0)}
                        </div>
                        <div className="ml-3">
                          <p className="font-medium">{testimonial.user_name}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <button 
            onClick={goToPrevious}
            className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white border border-gray-300 rounded-full shadow-md p-2 text-black hover:bg-gray-100 focus:outline-none"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={24} />
          </button>
          
          <button 
            onClick={goToNext}
            className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white border border-gray-300 rounded-full shadow-md p-2 text-black hover:bg-gray-100 focus:outline-none"
            aria-label="Next testimonial"
          >
            <ChevronRight size={24} />
          </button>

          {/* Dot Navigation */}
          <div className="flex justify-center mt-6 space-x-2">
            {displayTestimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full focus:outline-none transition-all duration-300 ${
                  currentIndex === index ? "bg-black w-6" : "bg-gray-300"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}