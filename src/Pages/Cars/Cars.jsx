import React, { useState, useEffect } from "react";
import Navbar from "./NavBar";
import CarCard from "./components/CarCard";
import { useSearch } from "../Context/SearchContext";
import { API_ENDPOINTS } from "../../API_ENDPOINTS";

export default function Cars() {
  const [cars, setCars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { searchParams } = useSearch();
  
  // Filter states
  const [distance, setDistance] = useState(1000);
  const [carType, setCarType] = useState("All");
  const [transmission, setTransmission] = useState("All");
  const [fuelType, setFuelType] = useState("All");
  const [rating, setRating] = useState("All");
  const [sortBy, setSortBy] = useState("nearest");

  // Function to fetch cars from API
  const fetchCars = async () => {
    if (!searchParams?.coordinates) {
      console.warn("Coordinates are missing. Skipping fetch.");
      return;
    }
  
    setIsLoading(true);
    try {
      console.log(searchParams.coordinates.lat, searchParams.coordinates.lng);

      const response = await fetch(API_ENDPOINTS.SEARCH_CARS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          latitude: searchParams.coordinates.lat,
          longitude: searchParams.coordinates.lng,
          startDateTime: searchParams.startDateTime,
          endDateTime: searchParams.endDateTime,
          distance: distance,
          carType: carType !== "All" ? carType : undefined,
          transmission: transmission !== "All" ? transmission : undefined, 
          fuelType: fuelType !== "All" ? fuelType : undefined,
          minRating: getRatingValue(rating),
          sortBy: sortBy
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch cars');
      }
  
      const data = await response.json();
      console.log("Fetched cars:", data);
      setCars(data);
  
    } catch (error) {
      console.error('Error fetching cars:', error);
      setCars([]);
    } finally {
      setIsLoading(false);
    }
  };
  

  // Helper function to get rating value
  const getRatingValue = (ratingFilter) => {
    switch (ratingFilter) {
      case "4.5+": return 4.5;
      case "4.0+": return 4.0;
      case "3.5+": return 3.5;
      default: return undefined;
    }
  };

  
  // Fetch cars on initial load and when search params change
  useEffect(() => {
    fetchCars();
  }, [distance, carType, transmission, fuelType, rating, sortBy, searchParams]);
  

  // In a real implementation with API, we would call fetchCars when filters change
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
     
      setIsLoading(false);
    }, 300); 
    
    return () => clearTimeout(timer);
  }, [distance, carType, transmission, fuelType, rating, sortBy, searchParams]);

  return (
    <div className="font-monda min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-grow mt-20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Filter Sidebar - Black and White Theme */}
            <div className="md:w-72 bg-white rounded-lg border border-gray-200 p-5">
              <h2 className="text-lg font-bold mb-6 text-black">Filters</h2>
              <button 
                onClick={() => {
                  setDistance(1000);
                  setCarType("All");
                  setTransmission("All");
                  setFuelType("All");
                  setRating("All");
                }}
                className="w-full bg-black text-white py-2 rounded font-medium hover:bg-gray-800 transition-colors"
              >
                Reset Filters
              </button>
              {/* Distance Filter */}
              <div className="mb-6 mt-8">
                <label className="block text-sm font-bold text-black mb-2">
                  Distance: {distance} km
                </label>
                <input
                  type="range"
                  min="1"
                  max="1000"
                  value={distance}
                  onChange={(e) => setDistance(parseInt(e.target.value))}
                  className="w-full accent-black"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1 km</span>
                  <span>1000 km</span>
                </div>
              </div>
              
              {/* Car Type Filter */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-black mb-3">
                  Car Type
                </label>
                <div className="space-y-2">
                  {["All", "SUV", "Sedan", "Hatchback"].map((type) => (
                    <div key={type} className="flex items-center">
                      <input
                        type="radio"
                        id={`type-${type}`}
                        name="carType"
                        value={type}
                        checked={carType === type}
                        onChange={() => setCarType(type)}
                        className="mr-3 h-4 w-4 accent-black"
                      />
                      <label htmlFor={`type-${type}`} className="text-sm text-gray-800">
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Transmission Filter */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-black mb-3">
                  Transmission
                </label>
                <div className="space-y-2">
                  {["All", "Manual", "Automatic"].map((type) => (
                    <div key={type} className="flex items-center">
                      <input
                        type="radio"
                        id={`transmission-${type}`}
                        name="transmission"
                        value={type}
                        checked={transmission === type}
                        onChange={() => setTransmission(type)}
                        className="mr-3 h-4 w-4 accent-black"
                      />
                      <label htmlFor={`transmission-${type}`} className="text-sm text-gray-800">
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Fuel Type Filter */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-black mb-3">
                  Fuel Type
                </label>
                <div className="space-y-2">
                  {["All", "Petrol", "Diesel", "Electric", "CNG"].map((type) => (
                    <div key={type} className="flex items-center">
                      <input
                        type="radio"
                        id={`fuel-${type}`}
                        name="fuelType"
                        value={type}
                        checked={fuelType === type}
                        onChange={() => setFuelType(type)}
                        className="mr-3 h-4 w-4 accent-black"
                      />
                      <label htmlFor={`fuel-${type}`} className="text-sm text-gray-800">
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Rating Filter */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-black mb-3">
                  Rating
                </label>
                <div className="space-y-2">
                  {["All", "4.5+", "4.0+", "3.5+"].map((ratingValue) => (
                    <div key={ratingValue} className="flex items-center">
                      <input
                        type="radio"
                        id={`rating-${ratingValue}`}
                        name="rating"
                        value={ratingValue}
                        checked={rating === ratingValue}
                        onChange={() => setRating(ratingValue)}
                        className="mr-3 h-4 w-4 accent-black"
                      />
                      <label htmlFor={`rating-${ratingValue}`} className="text-sm text-gray-800">
                        {ratingValue}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Reset Button */}
              
            </div>
            
            {/* Car Results */}
            <div className="flex-1">
              {/* Sorting Options */}
              <div className="mb-6 flex items-center justify-between bg-white rounded-lg border border-gray-200 p-4">
                <div className="text-sm font-medium text-black">
                  {cars.length} cars found
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-medium mr-3">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="text-sm border border-gray-300 rounded py-1 px-3 bg-white text-black focus:outline-none focus:ring-1 focus:ring-black"
                  >
                    <option value="nearest">Nearest first</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>
              </div>
              
              {isLoading ? (
                <div className="flex flex-wrap -mx-3">
                  {[1, 2, 3, 4].map((placeholder) => (
                    <div key={placeholder} className="w-full md:w-1/2 p-3">
                      <div className="bg-gray-100 rounded-lg h-96 animate-pulse"></div>
                    </div>
                  ))}
                </div>
              ) : cars.length > 0 ? (
                <div className="flex flex-wrap -mx-3">
                  {cars.map((car) => (
                    <CarCard key={car.id} car={car} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                  <p className="text-gray-800">
                    No cars found matching your filters. Try adjusting your criteria.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};