import { Link } from "react-router-dom";
import CarList from "./CarList";
import { MapPin, Calendar, Search } from "lucide-react";
import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";

function CarCard({ car }) {
  const calculateTotalPrice = (car) => {
    const baseFare = car.price;
    const deliveryFee = car.baseDeliveryFee + car.distance * car.deliveryPerKm;
    const tripProtectionFee = Math.round(baseFare * 0.05); // 5% of base fare
    const taxes = Math.round(
      (baseFare + deliveryFee + tripProtectionFee) * 0.18
    ); // 18% GST

    return {
      baseFare,
      deliveryFee,
      tripProtectionFee,
      taxes,
      total: baseFare + deliveryFee + tripProtectionFee + taxes,
    };
  };

  const pricing = calculateTotalPrice(car);

  return (
    <Link to="/car-detail" className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        {/* Car Image Carousel */}
        <div className="relative h-48 bg-gray-200">
          <img
            src={car.images[0]}
            alt={car.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 right-2 bg-white rounded-full px-2 py-1 text-xs font-medium">
            1/3
          </div>
        </div>

        <div className="p-4">
          {/* Car info header */}
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-lg font-semibold">
                {car.name} {car.year}
              </h3>
              <div className="flex items-center text-sm text-gray-600 space-x-2">
                <span>{car.transmission}</span>
                <span>•</span>
                <span>{car.fuel}</span>
                <span>•</span>
                <span>{car.seats} Seats</span>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center">
                <span className="font-semibold">{car.rating}</span>
                <span className="text-yellow-400 ml-1">★</span>
              </div>
              <span className="text-xs text-gray-600">
                ({car.reviews} reviews)
              </span>
            </div>
          </div>

          {/* Distance and location */}
          <div className="mb-3">
            <div className="flex items-center text-gray-600 mb-1">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-sm truncate">
                {car.location.split(",").slice(0, 2).join(",")}
              </span>
            </div>
            <div className="text-sm font-medium text-black">
              {car.distance} Kms Away
            </div>
          </div>

          {/* Features */}
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2">Features</h4>
            <div className="flex flex-wrap gap-2">
              {car.features.slice(0, 3).map((feature, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                >
                  {feature}
                </span>
              ))}
              {car.features.length > 3 && (
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                  +{car.features.length - 3} more
                </span>
              )}
            </div>
          </div>

          {/* Pricing and booking */}
          <div className="border-t pt-3">
            <div className="flex justify-between items-end">
              <div>
                <div className="text-sm text-gray-600">HOME DELIVERY</div>
                <div className="text-xs text-gray-500">
                  Base fare ₹{car.baseDeliveryFee} + Additional ₹
                  {car.deliveryPerKm}/KM
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg">₹{pricing.total}</div>
                <div className="text-xs text-gray-600">Total Price</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function Cars() {
  const [location, setLocation] = useState("New Delhi");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

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

  return (
    <div className="font-monda min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-grow mt-8">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CarList.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
