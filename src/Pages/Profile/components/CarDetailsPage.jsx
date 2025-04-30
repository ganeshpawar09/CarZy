import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, Car, Fuel, Award, ArrowLeft, MapPin, Wrench, FileCheck, Shield, User, Settings, Check } from "lucide-react";
import { API_ENDPOINTS } from "../../../API_ENDPOINTS";
import CarImageSection from "../../CarDetail/components/CarImageSection";
import CarNameSection from "../../CarDetail/components/CarNameSection";
import TabSection from "../../CarDetail/components/TabSection";
import Navbar from "./NavBar";

const CarDetailsPage = () => {
  const { carId } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCarDetails();
  }, [carId]);

  const fetchCarDetails = async () => {
    try {
      setLoading(true);
      // Replace with your actual API endpoint
      const response = await fetch(`${API_ENDPOINTS.CAR_DETAILS}/${carId}`);
      
      // Missing response parsing
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const parsedData = await response.json();
      const processedCar = processCarData(parsedData);
      setCar(processedCar);
      setLoading(false);
    } catch (err) {
      setError('Failed to load car details');
      setLoading(false);
      console.error(err);
    }
  };

  // Process and enrich car data with required format and additional info
  const processCarData = (rawCarData) => {
    // Format features if they're coming as a string
    const features = typeof rawCarData.features === 'string' 
      ? rawCarData.features.split(',').map(f => ({ name: f.trim(), available: true }))
      : Array.isArray(rawCarData.features)
        ? rawCarData.features 
        : [];
    
    // Calculate base hours for pricing (default to 4 hours)
    const hours = 4;
    const basePrice = rawCarData.price_per_hour * hours;
    const tripProtectionFee = Math.round(basePrice * 0.05); // Assuming 5% of base price
    const totalPrice = basePrice + tripProtectionFee;
    
    // Format location object
    const location = typeof rawCarData.location === 'string'
      ? { address: rawCarData.location, latitude: rawCarData.latitude, longitude: rawCarData.longitude }
      : rawCarData.location;
    
    // Add mock FAQs if not present
    
    // Prepare images array from various image URLs or use placeholders
    const images = [
      rawCarData.front_view_image_url,
      rawCarData.diagonal_front_left_image_url,
      rawCarData.rear_view_image_url,
      rawCarData.left_side_image_url,
      rawCarData.right_side_image_url,
      rawCarData.dashboard_image_url,
      rawCarData.front_seats_image_url,
      rawCarData.rear_seats_image_url,
      rawCarData.boot_space_image_url,
      rawCarData.speedometer_fuel_gauge_image_url,
      rawCarData.tyre_condition_image_url
    ].filter(Boolean);
    
    // Use placeholder if no images available
    if (images.length === 0) {
      images.push("/api/placeholder/400/300");
    }
    
    // Final processed car data
    return {
      ...rawCarData,
      features,
      images,
      location,
      baseFare: basePrice,
      tripProtectionFee,
      price: totalPrice,
      additionalKmCharge: rawCarData.extra_km_charge || 12,
      // UI-friendly names
      name: `${rawCarData.company_name} ${rawCarData.model_name}`,
      fuel: rawCarData.fuel_type,
      seats: rawCarData.seats || 5,
      year: rawCarData.manufacture_year,
      rating: rawCarData.car_rating,
      reviewCount: rawCarData.no_of_car_rating,
      transmission: rawCarData.transmission || 'Manual'
    };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  if (!car) {
    return <div className="text-center py-10">No car data found</div>;
  }

  return (
    <div className="font-monda container mx-auto px-4 py-8 pt-20">
      <Navbar />
      <button
        onClick={() => navigate(-1)}
        className="h-11 px-4 lg:px-6 border border-black rounded-lg bg-white hover:bg-black hover:text-white transition-colors text-sm lg:text-base flex items-center whitespace-nowrap"
      >
        <ArrowLeft size={16} className="mr-2" />
        <span>Back to listings</span>
      </button>

      <div className="pt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-3">
          <CarNameSection car={car} />
          <CarImageSection images={car.images} carName={car.name} />
          <TabSection car={car} />
        </div>
        
        {/* Pricing section could go here */}
        <div className="lg:col-span-1">
          {/* You might want to add a booking/pricing component here */}
        </div>
      </div>
    </div>
  );
};

export default CarDetailsPage;