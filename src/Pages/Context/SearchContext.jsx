import React, { createContext, useState, useContext, useEffect } from "react";

// Create a context to store search parameters
const SearchContext = createContext();

export function SearchProvider({ children }) {
  // Initialize state with default values
  const [searchParams, setSearchParams] = useState({
    location: "",
    selectedAddress: "",
    coordinates: null,
    startDateTime: "",
    endDateTime: ""
  });

  // Load saved search parameters from localStorage on initial render
  useEffect(() => {
    // Load location data
    const storedLocation = localStorage.getItem("selectedLocation");
    if (storedLocation) {
      try {
        const { name, coords, address } = JSON.parse(storedLocation);
        setSearchParams(prev => ({
          ...prev,
          location: name,
          coordinates: coords,
          selectedAddress: address
        }));
      } catch (error) {
        console.error("Error parsing stored location", error);
        localStorage.removeItem("selectedLocation");
      }
    }
  
    // Load date/time data
    const storedDates = localStorage.getItem("rentalDates");
    if (storedDates) {
      try {
        const { start, end } = JSON.parse(storedDates);
        setSearchParams(prev => ({
          ...prev,
          startDateTime: start,
          endDateTime: end
        }));
      } catch (error) {
        console.error("Error parsing stored dates", error);
        localStorage.removeItem("rentalDates");
      }
    } else {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const dayAfterTomorrow = new Date(now);
      dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
      
      // Round both to nearest hour
      tomorrow.setMinutes(0, 0, 0);
      dayAfterTomorrow.setMinutes(0, 0, 0);
      
      // Format to datetime-local input format (YYYY-MM-DDTHH:MM)
      const formatDateTime = (date) => date.toISOString().slice(0, 16);
      
      const startDateTime = formatDateTime(tomorrow);
      const endDateTime = formatDateTime(dayAfterTomorrow);
      
      setSearchParams(prev => ({
        ...prev,
        startDateTime,
        endDateTime
      }));
      // Save default dates to localStorage
      localStorage.setItem(
        "rentalDates",
        JSON.stringify({
          start: startDateTime,
          end: endDateTime
        })
      );
    }
  }, []);
  

  // Update location
  const updateLocation = (name, coords, address) => {
    setSearchParams(prev => ({
      ...prev,
      location: name,
      coordinates: coords,
      selectedAddress: address
    }));
    
    // Save to localStorage
    localStorage.setItem(
      "selectedLocation", 
      JSON.stringify({ 
        name, 
        coords, 
        address 
      })
    );
  };
  
  // Update dates
  const updateDates = (start, end) => {
    setSearchParams(prev => ({
      ...prev,
      startDateTime: start,
      endDateTime: end
    }));
    
    // Save to localStorage
    localStorage.setItem(
      "rentalDates",
      JSON.stringify({
        start,
        end
      })
    );
  };

  return (
    <SearchContext.Provider 
      value={{ 
        searchParams, 
        updateLocation, 
        updateDates 
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

// Custom hook to use the search context
export function useSearch() {
  return useContext(SearchContext);
}