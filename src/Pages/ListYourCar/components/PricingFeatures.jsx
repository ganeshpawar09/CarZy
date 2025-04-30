import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useCarListing } from "../../Context/CarListingContext";

export default function PricingFeatures() {
  const {
    formData,
    handleInputChange,
    setActiveSection
  } = useCarListing();

  // Function to add a feature quickly
  const handleAddFeature = (feature) => {
    const currentFeatures = formData.features ? formData.features.split(', ') : [];
    if (!currentFeatures.includes(feature)) {
      const newFeatures = [...currentFeatures, feature].filter(Boolean).join(', ');
      handleInputChange({
        target: {
          name: "features",
          value: newFeatures,
          type: "text"
        }
      });
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4 border-b border-gray-200 pb-2">
        Pricing & Features
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label
            className="block text-black font-medium mb-2"
            htmlFor="price_per_hour"
          >
            Price Per Hour (₹) *
          </label>
          <input
            type="number"
            id="price_per_hour"
            name="price_per_hour"
            min="0"
            step="0.01"
            value={formData.price_per_hour}
            onChange={handleInputChange}
            className="w-full border border-black rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            required
          />
        </div>
      </div>

      <div className="mb-6">
        <label
          className="block text-black font-medium mb-2"
          htmlFor="features"
        >
          Car Features
        </label>
        <textarea
          id="features"
          name="features"
          value={formData.features}
          onChange={handleInputChange}
          rows="4"
          placeholder="Describe your car's features (e.g., AC, music system, leather seats, etc.)"
          className="w-full border border-black rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
        ></textarea>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Features Quick Add</h3>
        <div className="flex flex-wrap gap-2">
          {["Air Conditioning", "Power Steering", "Power Windows", "ABS", "Airbags", 
            "Bluetooth", "Reverse Camera", "Sunroof", "Leather Seats", "Keyless Entry", 
            "Cruise Control", "Navigation System"].map((feature) => (
            <button
              key={feature}
              type="button"
              onClick={() => handleAddFeature(feature)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-1 px-3 rounded-full text-sm"
            >
              + {feature}
            </button>
          ))}
        </div>
      </div>
      
      <div className="mt-6 flex justify-between">
        <button
          type="button"
          onClick={() => setActiveSection("documents")}
          className="border border-black text-black font-bold py-2 px-6 rounded-md hover:bg-gray-100 transition duration-300 flex items-center"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back
        </button>
        <button
          type="button"
          onClick={() => setActiveSection("location")}
          className="bg-black text-white font-bold py-2 px-6 rounded-md hover:bg-gray-800 transition duration-300"
        >
          Next: Location
        </button>
      </div>
    </div>
  );
}