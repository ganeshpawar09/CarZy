import React, { useState } from "react";
import { Menu, MapPin, Calendar, Search } from "lucide-react";
import { Link } from "react-router-dom";
import LocationModal from "../Home/components/LocationModal";
import { useSearch } from "../Context/SearchContext";
import carzyLogo from "../../assets/carzy1.png"; 


export default function Navbar() {
  const [showLocationModal, setShowLocationModal] = useState(false);
  const { searchParams, updateLocation, updateDates } = useSearch();

  const handleLocationClick = () => setShowLocationModal(true);

  const handleLocationSelect = (name, coords, address) => {
    updateLocation(name, coords, address);
    setShowLocationModal(false);
  };


  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white font-monda text-sm border-b border-gray-300 px-4 md:px-6 py-2">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex justify-center">
              <Link to="/">
                <img
                  src={carzyLogo}
                  alt="CarZy Logo"
                  className="h-11"
                />
              </Link>
            </div>

            {/* Search Controls - All in one row */}
            <div className="flex items-center space-x-2 flex-grow mx-4">
              {/* Location */}
              <div
                className="flex items-center border border-gray-300 rounded p-3 cursor-pointer flex-grow max-w-xs"
                onClick={handleLocationClick}
              >
                <MapPin size={16} className="mr-1 text-black" />
                <input
                  type="text"
                  className="bg-transparent w-full outline-none cursor-pointer text-sm"
                  placeholder="Your Location"
                  value={searchParams.selectedAddress || searchParams.location}
                  readOnly
                />
              </div>

              {/* Pick-up DateTime */}
              <div className="border border-gray-300 rounded p-3 flex-grow max-w-xs">
                <div className="flex items-center">
                  <Calendar size={16} className="mr-1 text-gray-500 flex-shrink-0" />
                  <input
                    type="datetime-local"
                    className="w-full outline-none text-sm"
                    value={searchParams.startDateTime}
                    onChange={(e) => updateDates(e.target.value, searchParams.endDateTime)}
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </div>
              </div>

              {/* Drop-off DateTime */}
              <div className="border border-gray-300 rounded p-3 flex-grow max-w-xs">
                <div className="flex items-center">
                  <Calendar size={16} className="mr-1 text-gray-500 flex-shrink-0" />
                  <input
                    type="datetime-local"
                    className="w-full outline-none text-sm"
                    value={searchParams.endDateTime}
                    onChange={(e) => updateDates(searchParams.startDateTime, e.target.value)}
                    min={searchParams.startDateTime}
                  />
                </div>
              </div>

              {/* Search Button
              <Link to="/car">
                <button
                  className="font-monda text-sm border border-black px-5 py-3 rounded bg-black text-white hover:bg-white hover:text-black transition-colors flex items-center"
                  disabled={!searchParams.coordinates || !isDateTimeValid()}
                >
                  <Search size={16} className="mr-1" />
                  Modify Search
                </button>
              </Link> */}
            </div>
          </div>
        </div>
      </nav>

      {showLocationModal && (
        <LocationModal
        onClose={() => setShowLocationModal(false)}
        onSelect={handleLocationSelect}
      />
      
      )}
    </>
  );
}
