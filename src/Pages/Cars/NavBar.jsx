import React, { useState, useEffect } from "react";
import { Menu, X, User, MapPin, Calendar, Search } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Search functionality states
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);

  useEffect(() => {
    // Define today and tomorrow dates
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    // Format dates for input value (YYYY-MM-DD)
    const formatDateForInput = (date) => {
      return date.toISOString().split("T")[0]; // Returns YYYY-MM-DD
    };

    setStartDate(formatDateForInput(today));
    setEndDate(formatDateForInput(tomorrow));
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

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
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white font-monda text-xl border-b border-gray-300 px-4 md:px-6 py-2">
        <div className="container mx-auto pt-5 py-5">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 mr-4">
              <img
                src="src/assets/carzy.png"
                alt="CarZy Logo"
                className="h-11"
              />
            </Link>

            {/* Search Filters */}
            <div className="flex flex-1 items-center space-x-2 lg:space-x-4 max-w-3xl">
              {/* Location */}
              <div className="w-1/3">
                <div
                  className="flex items-center border border-gray-300 rounded p-2 cursor-pointer h-11"
                  onClick={handleLocationClick}
                >
                  <MapPin size={18} className="mr-1 text-black flex-shrink-0" />
                  <input
                    type="text"
                    className="bg-transparent w-full outline-none cursor-pointer text-sm lg:text-base truncate"
                    placeholder="Your Location"
                    value={location}
                    readOnly
                  />
                </div>
              </div>

              {/* Start Date */}
              <div className="w-1/3">
                <div className="flex items-center border border-gray-300 rounded p-2 h-11">
                  <Calendar
                    size={18}
                    className="mr-1 text-black flex-shrink-0"
                  />
                  <input
                    type="date"
                    className="bg-transparent w-full outline-none text-sm lg:text-base"
                    placeholder="Start Date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
              </div>

              {/* End Date */}
              <div className="w-1/3">
                <div className="flex items-center border border-gray-300 rounded p-2 h-11">
                  <Calendar
                    size={18}
                    className="mr-1 text-black flex-shrink-0"
                  />
                  <input
                    type="date"
                    className="bg-transparent w-full outline-none text-sm lg:text-base"
                    placeholder="End Date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
            </div>
           
            {/* Search Button */}
            <Link to="/car" className="ml-4">
              <button className="h-11 px-4 lg:px-6 border border-black bg-black text-white rounded-lg bg-black text-white hover:bg-white hover:text-black transition-colors text-sm lg:text-base flex items-center whitespace-nowrap">
                <Search size={16} className="mr-2" />
                <span>Search Cars</span>
              </button>
            </Link>
          </div>

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center justify-between">
            {/* Mobile Menu Button */}
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={toggleMobileMenu}
            >
              <Menu size={24} />
            </button>

            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <img
                src="src/assets/carzy.png"
                alt="CarZy Logo"
                className="h-10"
              />
            </Link>

            {/* Search Icon */}
            <Link to="/car">
              <button className="text-gray-500 hover:text-gray-700">
                <Search size={24} />
              </button>
            </Link>
          </div>

          {/* Mobile Menu Drawer */}
          {mobileMenuOpen && (
            <div className="md:hidden fixed inset-0 bg-white z-50 pt-16">
              <div className="flex justify-end p-4 absolute top-0 right-0">
                <button
                  onClick={toggleMobileMenu}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-4 space-y-4">
                <h3 className="font-medium text-lg mb-2">Find Your Car</h3>

                {/* Location */}
                <div
                  className="flex items-center border border-gray-300 rounded p-3 cursor-pointer"
                  onClick={handleLocationClick}
                >
                  <MapPin size={20} className="mr-2 text-black" />
                  <input
                    type="text"
                    className="bg-transparent w-full outline-none cursor-pointer"
                    placeholder="Your Location"
                    value={location}
                    readOnly
                  />
                </div>

                {/* Start Date */}
                <div className="flex items-center border border-gray-300 rounded p-3">
                  <Calendar size={20} className="mr-2 text-black" />
                  <input
                    type="date"
                    className="bg-transparent w-full outline-none"
                    placeholder="Start Date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>

                {/* End Date */}
                <div className="flex items-center border border-gray-300 rounded p-3">
                  <Calendar size={20} className="mr-2 text-black" />
                  <input
                    type="date"
                    className="bg-transparent w-full outline-none"
                    placeholder="End Date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>

                {/* Search Button */}
                <Link to="/car" onClick={toggleMobileMenu}>
                  <button className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center">
                    <Search size={20} className="mr-2" />
                    <span>Search Cars</span>
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Add appropriate spacing to prevent content from being hidden under navbar */}
      <div className="h-16"></div>

      {/* Location Modal */}
      {showLocationModal && (
        <LocationModal
          onClose={() => setShowLocationModal(false)}
          onSelect={handleLocationSelect}
        />
      )}

      {/* Date Modal */}
      {showDateModal && (
        <DateModal
          onClose={() => setShowDateModal(false)}
          onSelect={handleDateSelect}
          startDate={startDate}
          endDate={endDate}
        />
      )}
    </>
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
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-lg">
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

// Date Modal Component
const DateModal = ({ onClose, onSelect, startDate, endDate }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-lg">
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
