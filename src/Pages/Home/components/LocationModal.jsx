import React, { useState, useEffect } from "react";
import { Search, X, MapPin } from "lucide-react";

export default function LocationModal({ onClose, onSelect }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load Google Maps API script
  useEffect(() => {
    if (!window.google?.maps?.places) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_API}&libraries=places`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
      
      // Handle script load error
      script.onerror = () => {
        console.error("Failed to load Google Maps API");
        alert("Could not load location services. Please try again later.");
      };
    }
  }, []);

  // Search location based on input
  useEffect(() => {
    if (searchQuery && window.google?.maps?.places) {
      const service = new window.google.maps.places.AutocompleteService();
      const timer = setTimeout(() => {
        setIsLoading(true);
        service.getPlacePredictions(
          { input: searchQuery, types: ["geocode"] },
          (predictions, status) => {
            setIsLoading(false);
            if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
              setSearchResults(predictions.map(p => ({
                placeId: p.place_id,
                description: p.description,
              })));
            } else {
              setSearchResults([]);
            }
          }
        );
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  // Handle location selection from search results
  const handleLocationItemClick = (location) => {
    setIsLoading(true);
    // Update search query immediately with selected location description
    setSearchQuery(location.description);
    
    if (!window.google?.maps?.places) {
      alert("Location services not available yet. Please try again in a moment.");
      setIsLoading(false);
      return;
    }
    
    const service = new window.google.maps.places.PlacesService(document.createElement("div"));
    service.getDetails(
      { placeId: location.placeId, fields: ["geometry", "formatted_address", "name"] },
      (place, status) => {
        setIsLoading(false);
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          const coords = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          };
          setSelectedLocation({
            name: place.name || location.description.split(',')[0],
            address: place.formatted_address,
            coords,
          });
          
          // Clear search results after selection
          setSearchResults([]);
        } else {
          alert("Could not retrieve location details. Please try another location.");
        }
      }
    );
  };

  // Get current user location
  const getCurrentLocation = () => {
    setIsLoading(true);
    
    // Check if geolocation is available
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      setIsLoading(false);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        
        // Make sure Google Maps API is loaded
        if (!window.google?.maps) {
          const locationText = "Your current location";
          setSearchQuery(locationText);
          setSelectedLocation({
            name: "Current Location",
            address: locationText,
            coords,
          });
          setIsLoading(false);
          return;
        }
        
        // Reverse geocode to get address
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: coords }, (results, status) => {
          let address;
          if (status === window.google.maps.GeocoderStatus.OK && results?.[0]) {
            address = results[0].formatted_address;
          } else {
            address = `Lat: ${coords.lat.toFixed(4)}, Lng: ${coords.lng.toFixed(4)}`;
          }
          
          // Update search query immediately with the address
          setSearchQuery(address);
          
          setSelectedLocation({
            name: "Current Location",
            address: address,
            coords,
          });
          
          // Clear search results
          setSearchResults([]);
          setIsLoading(false);
        });
      },
      (error) => {
        setIsLoading(false);
        switch(error.code) {
          case error.PERMISSION_DENIED:
            alert("Location permission denied. Please enable location services and try again.");
            break;
          case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable. Please try again later.");
            break;
          case error.TIMEOUT:
            alert("Request to get location timed out. Please try again.");
            break;
          default:
            alert("An unknown error occurred while trying to get your location.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  // Handle continue button click
  const handleContinue = () => {
    if (selectedLocation) {
      onSelect(selectedLocation.name, selectedLocation.coords, selectedLocation.address);
    } else {
      alert("Please select a location.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-lg mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Location</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>
          </div>
          <div className="flex items-center border border-gray-300 rounded p-2 mt-3">
            <Search size={20} className="text-gray-400 mr-2" />
            <input
              type="text"
              className="w-full outline-none"
              placeholder="Search for location"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                onClick={() => {
                  setSearchQuery("");
                  setSearchResults([]);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        <div className="overflow-y-auto flex-grow max-h-72">
          <div className="px-4 py-3 border-b border-gray-100">
            <button 
              className="flex items-center w-full text-left" 
              onClick={getCurrentLocation}
              disabled={isLoading}
            >
              <div className="bg-gray-100 p-2 rounded-full mr-3">
                <MapPin size={20} />
              </div>
              <div>
                <div className="font-medium">
                  {isLoading ? "Detecting location..." : "Current Location"}
                </div>
                <div className="text-sm text-gray-500">Use device's GPS</div>
              </div>
            </button>
          </div>

          {searchResults.map((loc, idx) => (
            <div
              key={idx}
              className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                selectedLocation?.address === loc.description ? "bg-gray-100" : ""
              }`}
              onClick={() => handleLocationItemClick(loc)}
            >
              <div className="font-medium">{loc.description}</div>
            </div>
          ))}

          {isLoading && (
            <div className="p-4 text-center text-gray-500">Searching locations...</div>
          )}

          {!isLoading && searchQuery && searchResults.length === 0 && !selectedLocation && (
            <div className="p-4 text-center text-gray-500">No locations found.</div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleContinue}
            className={`w-full py-3 rounded-md transition-colors ${
              !selectedLocation
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-black text-white "
            }`}
            disabled={!selectedLocation}
          >
            CONTINUE
          </button>
        </div>
      </div>
    </div>
  );
}