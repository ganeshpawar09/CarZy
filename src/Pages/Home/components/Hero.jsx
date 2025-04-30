import React, { useState, useEffect } from "react";
import { MapPin, Search, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import LocationModal from "./LocationModal";
import { useSearch } from "../../Context/SearchContext";

export default function Hero() {
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Use the search context instead of local state
  const { searchParams, updateLocation, updateDates } = useSearch();

  const backgroundImages = [
    "src/assets/background/1.jpg",
    "src/assets/background/2.jpg",
    "src/assets/background/3.png",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % backgroundImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleLocationClick = () => setShowLocationModal(true);

  const handleLocationSelect = (name, coords, address) => {
    updateLocation(name, coords, address);
    setShowLocationModal(false);
  };
  
  // Validate datetime selections
  const isDateTimeValid = () => {
    if (!searchParams.startDateTime || !searchParams.endDateTime) return false;
    
    const startDate = new Date(searchParams.startDateTime);
    const endDate = new Date(searchParams.endDateTime);
    const now = new Date();
    
    // Check if start date is not in the past
    if (startDate < now) {
      return false;
    }
    
    // Check if end date is after start date
    return endDate > startDate;
  };

  return (
    <section
      id="hero"
      className="font-monda relative h-screen flex items-center justify-center overflow-hidden"
    >
      {backgroundImages.map((image, index) => (
        <div
          key={index}
          className="absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out"
          style={{
            backgroundImage: `url('${image}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: currentSlide === index ? 1 : 0,
            zIndex: 0,
          }}
        />
      ))}
      <div className="absolute inset-0 bg-black opacity-50 z-10"></div>

      <div className="container mx-auto text-center z-20 px-6 relative">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 mt-10 text-white">
          Rent a Car, Anywhere, Anytime
        </h1>
        <p className="text-2xl mb-12 max-w-2xl mx-auto text-white">
          Experience the freedom of travel with CarZy - your car rental service.
        </p>

        <div className="bg-white p-6 rounded-lg max-w-3xl mx-auto shadow-lg border border-gray-200">
          {/* First Row: Location Selector */}
          <div
            className="flex items-center border border-gray-300 rounded p-3 cursor-pointer"
            onClick={handleLocationClick}
          >
            <MapPin size={24} className="mr-2 text-black" />
            <input
              type="text"
              className="bg-transparent w-full outline-none cursor-pointer"
              placeholder="Your Location"
              value={searchParams.selectedAddress || searchParams.location}
              readOnly
            />
          </div>
          
          {/* Second Row: Date Time Picker */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {/* Pick-up DateTime */}
            <div className="border border-gray-300 rounded p-3">
              <p className="text-left text-gray-700 font-medium mb-2">Pick-up Date & Time</p>
              <div className="flex items-center">
                <Calendar size={20} className="mr-2 text-gray-500 flex-shrink-0" />
                <input
                  type="datetime-local"
                  className="w-full outline-none"
                  value={searchParams.startDateTime}
                  onChange={(e) => updateDates(e.target.value, searchParams.endDateTime)}
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>
            </div>
            
            {/* Drop-off DateTime */}
            <div className="border border-gray-300 rounded p-3">
              <p className="text-left text-gray-700 font-medium mb-2">Drop-off Date & Time</p>
              <div className="flex items-center">
                <Calendar size={20} className="mr-2 text-gray-500 flex-shrink-0" />
                <input
                  type="datetime-local"
                  className="w-full outline-none"
                  value={searchParams.endDateTime}
                  onChange={(e) => updateDates(searchParams.startDateTime, e.target.value)}
                  min={searchParams.startDateTime}
                />
              </div>
            </div>
          </div>

          <Link to="/car">
            <button
              className="font-monda mt-8 text-xl border border-black px-8 py-3 rounded-lg bg-black text-white hover:bg-white hover:text-black transition-colors flex items-center justify-center w-full md:w-auto md:mx-auto"
              disabled={!searchParams.coordinates || !isDateTimeValid()}
            >
              <Search size={20} className="mr-2" />
              Search Available Cars
            </button>
          </Link>
        </div>
      </div>

      {showLocationModal && (
        <LocationModal onClose={() => setShowLocationModal(false)} onSelect={handleLocationSelect} />
      )}
    </section>
  );
}