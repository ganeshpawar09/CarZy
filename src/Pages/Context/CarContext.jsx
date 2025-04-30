// CarContext.js
import React, { createContext, useContext, useReducer, useEffect } from "react";

// Initial state for car filters and sorting
const initialState = {
  filteredCars: [],
  allCars: [],
  filters: {
    distance: { min: 0, max: 100 },
    fuelTypes: {
      petrol: false,
      diesel: false,
      electric: false,
      cng: false
    },
    vehicleTypes: {
      suv: false,
      sedan: false,
      more: false
    },
    rating: { min: 1, max: 5 },
    seats: { min: 5, max: 7 }
  },
  sortBy: "distance"
};

// Actions
const SET_ALL_CARS = "SET_ALL_CARS";
const UPDATE_FILTERED_CARS = "UPDATE_FILTERED_CARS";
const UPDATE_FILTER = "UPDATE_FILTER";
const UPDATE_SORT = "UPDATE_SORT";
const UPDATE_FUEL_TYPE = "UPDATE_FUEL_TYPE";
const UPDATE_VEHICLE_TYPE = "UPDATE_VEHICLE_TYPE";
const UPDATE_SEATS = "UPDATE_SEATS";

// Reducer function to handle state updates
const carReducer = (state, action) => {
  switch (action.type) {
    case SET_ALL_CARS:
      return {
        ...state,
        allCars: action.payload
      };
    case UPDATE_FILTERED_CARS:
      return {
        ...state,
        filteredCars: action.payload
      };
    case UPDATE_FILTER:
      return {
        ...state,
        filters: {
          ...state.filters,
          [action.payload.filterType]: {
            ...state.filters[action.payload.filterType],
            ...action.payload.value
          }
        }
      };
    case UPDATE_FUEL_TYPE:
      return {
        ...state,
        filters: {
          ...state.filters,
          fuelTypes: {
            ...state.filters.fuelTypes,
            [action.payload]: !state.filters.fuelTypes[action.payload]
          }
        }
      };
    case UPDATE_VEHICLE_TYPE:
      return {
        ...state,
        filters: {
          ...state.filters,
          vehicleTypes: {
            ...state.filters.vehicleTypes,
            [action.payload]: !state.filters.vehicleTypes[action.payload]
          }
        }
      };
    case UPDATE_SEATS:
      return {
        ...state,
        filters: {
          ...state.filters,
          seats: action.payload
        }
      };
    case UPDATE_SORT:
      return {
        ...state,
        sortBy: action.payload
      };
    default:
      return state;
  }
};

// Create context
const CarContext = createContext();

// Context provider component
export const CarProvider = ({ children }) => {
  const [state, dispatch] = useReducer(carReducer, initialState);

  // Actions
  const setAllCars = (cars) => {
    dispatch({ type: SET_ALL_CARS, payload: cars });
  };

  const updateFilter = (filterType, value) => {
    dispatch({ type: UPDATE_FILTER, payload: { filterType, value } });
  };

  const updateFuelType = (fuelType) => {
    dispatch({ type: UPDATE_FUEL_TYPE, payload: fuelType });
  };

  const updateVehicleType = (vehicleType) => {
    dispatch({ type: UPDATE_VEHICLE_TYPE, payload: vehicleType });
  };

  const updateSeats = (min, max) => {
    dispatch({ type: UPDATE_SEATS, payload: { min, max } });
  };

  const updateSort = (sortOption) => {
    dispatch({ type: UPDATE_SORT, payload: sortOption });
  };

  // Apply filters and sort whenever state changes
  useEffect(() => {
    if (state.allCars.length > 0) {
      let result = [...state.allCars];
      
      // Apply distance filter
      result = result.filter(car => 
        car.distance >= state.filters.distance.min && 
        car.distance <= state.filters.distance.max
      );
      
      // Apply fuel type filter if any selected
      const selectedFuelTypes = Object.entries(state.filters.fuelTypes)
        .filter(([_, isSelected]) => isSelected)
        .map(([type]) => type);
        
      if (selectedFuelTypes.length > 0) {
        result = result.filter(car => selectedFuelTypes.includes(car.fuelType.toLowerCase()));
      }
      
      // Apply vehicle type filter if any selected
      const selectedVehicleTypes = Object.entries(state.filters.vehicleTypes)
        .filter(([_, isSelected]) => isSelected)
        .map(([type]) => type);
        
      if (selectedVehicleTypes.length > 0) {
        result = result.filter(car => selectedVehicleTypes.includes(car.type.toLowerCase()));
      }
      
      // Apply rating filter
      result = result.filter(car => 
        car.rating >= state.filters.rating.min && 
        car.rating <= state.filters.rating.max
      );
      
      // Apply seats filter
      result = result.filter(car => 
        car.seats >= state.filters.seats.min && 
        car.seats <= state.filters.seats.max
      );
      
      // Apply sorting
      result.sort((a, b) => {
        switch (state.sortBy) {
          case "distance":
            return a.distance - b.distance;
          case "priceLowToHigh":
            return a.price - b.price;
          case "priceHighToLow":
            return b.price - a.price;
          case "ratingHighToLow":
            return b.rating - a.rating;
          default:
            return a.distance - b.distance;
        }
      });
      
      dispatch({ type: UPDATE_FILTERED_CARS, payload: result });
    }
  }, [state.allCars, state.filters, state.sortBy]);

  return (
    <CarContext.Provider
      value={{
        ...state,
        setAllCars,
        updateFilter,
        updateFuelType,
        updateVehicleType,
        updateSeats,
        updateSort
      }}
    >
      {children}
    </CarContext.Provider>
  );
};

// Custom hook to use the car context
export const useCars = () => {
  const context = useContext(CarContext);
  if (context === undefined) {
    throw new Error("useCars must be used within a CarProvider");
  }
  return context;
};