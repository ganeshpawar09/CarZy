import React, { useState } from "react";
import { Car, Check, X, Plus, Edit, AlertCircle } from "lucide-react";
const MyCarsTab = () => {
  const cars = [
    {
      id: 1,
      model_name: "Honda City",
      company_name: "Honda",
      manufacture_year: "2022",
      car_number: "MH01AB1234",
      location: "Mumbai",
      price_per_day: 2500,
      verification_status: "approved",
    },
    {
      id: 2,
      model_name: "Hyundai i20",
      company_name: "Hyundai",
      manufacture_year: "2020",
      car_number: "MH02CD5678",
      location: "Pune",
      price_per_day: 2000,
      verification_status: "pending",
    },
  ];

  const getVerificationBadge = (status) => {
    switch (status) {
      case "approved":
        return (
          <div className="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded text-xs">
            <Check size={12} className="mr-1" />
            <span>Verified</span>
          </div>
        );
      case "pending":
        return (
          <div className="flex items-center text-yellow-600 bg-yellow-50 px-2 py-1 rounded text-xs">
            <AlertCircle size={12} className="mr-1" />
            <span>Pending</span>
          </div>
        );
      case "rejected":
        return (
          <div className="flex items-center text-red-600 bg-red-50 px-2 py-1 rounded text-xs">
            <X size={12} className="mr-1" />
            <span>Rejected</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="py-4">
      <div className="flex-end items-center mb-6">
        <button className="flex items-center bg-black text-white px-4 py-2 rounded-md">
          <Plus size={16} className="mr-1" />
          Add Car
        </button>
      </div>

      <div className="space-y-4">
        {cars.map((car) => (
          <div key={car.id} className="border rounded-lg overflow-hidden">
            <div className="flex md:flex-row flex-col">
              <div className="p-4  w-full">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-lg">
                      {car.company_name} {car.model_name}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {car.manufacture_year} • {car.car_number}
                    </p>
                    <p className="text-gray-600 text-sm mt-1">
                      Location: {car.location}
                    </p>
                    <p className="font-medium mt-2">₹{car.price_per_day}/day</p>
                  </div>
                  <div>{getVerificationBadge(car.verification_status)}</div>
                </div>

                <div className="flex space-x-2 mt-4">
                  <button className="flex items-center border border-black px-3 py-1.5 rounded-md text-sm">
                    <Edit size={14} className="mr-1" />
                    Update
                  </button>
                  <button className="flex items-center bg-gray-100 px-3 py-1.5 rounded-md text-sm">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {cars.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <div className="bg-gray-100 inline-block rounded-full p-3 mb-3">
            <Car size={24} />
          </div>
          <h3 className="font-medium">No cars yet</h3>
          <p className="text-gray-600 text-sm mt-1 mb-4">
            Add your first car to start earning
          </p>
          <button className="flex items-center bg-black text-white px-4 py-2 rounded-md mx-auto">
            <Plus size={16} className="mr-1" />
            Add Car
          </button>
        </div>
      )}
    </div>
  );
};

export default MyCarsTab;
