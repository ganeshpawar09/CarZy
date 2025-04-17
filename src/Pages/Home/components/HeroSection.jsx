import React, { useState, useEffect } from "react";
import { MapPin, Calendar, Search, X } from "lucide-react";
import { Link } from "react-router-dom";
// Main Hero Section Component
export default function HeroSection() {
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);

  // Background images for the slideshow
  const backgroundImages = [
    "src/assets/background/1.jpg",
    "src/assets/background/2.jpg",
    "src/assets/background/3.png",
  ];

  useEffect(() => {
    // Define today and tomorrow dates
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    // Format dates as DD MMM YYYY
    const formatDate = (date) => {
      // Format for display
      const day = date.getDate();
      const month = date.toLocaleString("default", { month: "short" });
      return `${day} ${month}`;
    };

    // Format dates for input value (YYYY-MM-DD)
    const formatDateForInput = (date) => {
      return date.toISOString().split("T")[0]; // Returns YYYY-MM-DD
    };

    setStartDate(formatDateForInput(today));
    setEndDate(formatDateForInput(tomorrow));

    // Slideshow timer
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % backgroundImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleLocationClick = () => {
    setShowLocationModal(true);
  };

  const handleLocationSelect = (selectedLocation) => {
    setLocation(selectedLocation);
    setShowLocationModal(false);
  };

  const handleDateSelect = (start, end) => {
    setStartDate(start);
    setEndDate(end);
    setShowDateModal(false);
  };

  return (
    <section
      id="hero"
      className="font-monda relative h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Slideshow */}
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

      {/* Dark overlay for better text visibility */}
      <div className="absolute inset-0 bg-black opacity-50 z-10"></div>

      {/* Content */}
      <div className="container mx-auto text-center z-20 px-6 relative">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-white">
          Rent a Car, Anywhere, Anytime
        </h1>
        <p className="text-2xl mb-12 max-w-2xl mx-auto text-white">
          Experience the freedom of travel with CarZy - your car rental service.
        </p>

        <div className="bg-white p-6 rounded-lg max-w-3xl mx-auto shadow-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative max-w-xl ">
              <div
                className="flex items-center border border-gray-300 rounded p-3 cursor-pointer"
                onClick={handleLocationClick}
              >
                <MapPin size={30} className="mr-2 text-black" />
                <input
                  type="text"
                  className="bg-transparent w-full outline-none cursor-pointer"
                  placeholder="Your Location"
                  value={location}
                  style={{ height: "40px" }}
                  readOnly
                />
              </div>
            </div>

            <div className="relative">
              <div className="flex items-center border border-gray-300 rounded p-3">
                <Calendar size={30} className="mr-2 text-black" />
                <input
                  type="date"
                  className="bg-transparent w-full outline-none text-base"
                  placeholder="Start Date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  style={{ height: "40px" }}
                />
              </div>
            </div>

            <div className="relative">
              <div className="flex items-center border border-gray-300 rounded p-3">
                <Calendar size={30} className="mr-2 text-black" />
                <input
                  type="date"
                  className="bg-transparent w-full outline-none text-base"
                  placeholder="End Date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  style={{ height: "40px" }}
                />
              </div>
            </div>
          </div>
          <Link to="/car">
            <button className="font-monda mt-8 text-xl border border-black px-8 py-3 rounded-lg bg-black text-white hover:bg-white hover:text-black transition-colors  flex items-center justify-center w-full md:w-auto md:mx-auto">
              <Search size={20} className="mr-2" />
              Search Available Cars
            </button>
          </Link>
        </div>
      </div>

      {/* Location Modal */}
      {showLocationModal && (
        <LocationModal
          onClose={() => setShowLocationModal(false)}
          onSelect={handleLocationSelect}
        />
      )}

      {/* Date Selection Modal */}
      {showDateModal && (
        <DateModal
          onClose={() => setShowDateModal(false)}
          onSelect={handleDateSelect}
          startDate={startDate}
          endDate={endDate}
        />
      )}
    </section>
  );
}

// Location Modal Component
const LocationModal = ({ onClose, onSelect }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Simulated Google Maps Autocomplete results
  const suggestedLocations = [
    {
      name: "Lonavala railway station",
      address: "PCK5+Q2P, Siddharth Nagar, Lonavala, Maharashtra 410401, India",
    },
    {
      name: "Hinjewadi, Mulshi, Maharashtra, India",
      address: "Hinjewadi, Mulshi, Maharashtra, India",
    },
    {
      name: "Katraj, Pune, Maharashtra, India",
      address: "Katraj, Pune, Maharashtra, India",
    },
    {
      name: "Baner, Pune, Maharashtra, India",
      address: "Baner, Pune, Maharashtra, India",
    },
  ];

  const getCurrentLocation = () => {
    setIsLoading(true);
    // This would be replaced with actual browser geolocation API usage
    // For now, we're simulating the detection
    setTimeout(() => {
      onSelect("Current Location");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-lg mx-4">
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Location</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>
          <input
            type="text"
            className="w-full border border-gray-300 rounded p-2 mt-2"
            placeholder="Search for location"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="max-h-64 overflow-y-auto">
          {searchQuery &&
            suggestedLocations
              .filter(
                (loc) =>
                  loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  loc.address.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((location, index) => (
                <div
                  key={index}
                  className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                  onClick={() => onSelect(location.name)}
                >
                  <div className="font-medium">{location.name}</div>
                  <div className="text-sm text-gray-500">
                    {location.address}
                  </div>
                </div>
              ))}
        </div>

        <div className="p-4 bg-gray-50">
          <button
            className="flex items-center w-full bg-gray-100 p-4 rounded-lg hover:bg-gray-200"
            onClick={getCurrentLocation}
            disabled={isLoading}
          >
            <div className="bg-gray-200 p-2 rounded-full mr-3">
              <MapPin size={20} />
            </div>
            <span>
              {isLoading ? "Detecting location..." : "Use Current Location"}
            </span>
          </button>
        </div>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => onSelect(searchQuery || "Select location")}
            className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors"
          >
            CONTINUE
          </button>
        </div>
      </div>
    </div>
  );
};

// Date Modal Component (stub - you may need to implement this)
const DateModal = ({ onClose, onSelect, startDate, endDate }) => {
  // Implementation for date selection modal
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-lg mx-4">
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Select Dates</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Add date picker implementation here */}
        <div className="p-4">
          <p>Calendar implementation would go here</p>
        </div>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => onSelect(startDate, endDate)}
            className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors"
          >
            CONFIRM DATES
          </button>
        </div>
      </div>
    </div>
  );
};
