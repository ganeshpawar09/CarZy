import React, { useState } from "react";
import { useCarListing } from "../../Context/CarListingContext";

export default function BasicInfo() {
  const {
    formData,
    handleInputChange,
    getFilteredMakes,
    getFilteredModels,
    handleMakeSelect,
    handleModelSelect,
    setActiveSection,
    resetForm,
  } = useCarListing();

  // State for suggestions visibility
  const [showMakeSuggestions, setShowMakeSuggestions] = useState(false);
  const [showModelSuggestions, setShowModelSuggestions] = useState(false);

  // Get filtered suggestions
  const filteredMakes = getFilteredMakes(formData.company_name);
  const filteredModels = getFilteredModels(formData.company_name, formData.model_name);

  // Custom handlers with fixed behavior
  const handleMakeInputChange = (e) => {
    handleInputChange(e);
    setShowMakeSuggestions(true);
  };

  const handleModelInputChange = (e) => {
    handleInputChange(e);
    setShowModelSuggestions(true);
  };

  const handleMakeSelection = (make) => {
    handleMakeSelect(make);
    setShowMakeSuggestions(false);
  };

  const handleModelSelection = (model) => {
    handleModelSelect(model);
    setShowModelSuggestions(false);
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4 border-b border-gray-200 pb-2">
        Basic Car Information
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Car Company/Make with Auto-suggest */}
        <div className="relative">
          <label
            className="block text-black font-medium mb-2"
            htmlFor="company_name"
          >
            Car Company/Make *
          </label>
          <input
            type="text"
            id="company_name"
            name="company_name"
            value={formData.company_name}
            onChange={handleMakeInputChange}
            onClick={() => setShowMakeSuggestions(true)}
            onFocus={() => setShowMakeSuggestions(true)}
            className="w-full border border-black rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            required
            autoComplete="off"
          />
          {showMakeSuggestions && filteredMakes.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
              {filteredMakes.map((make) => (
                <div
                  key={make}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleMakeSelection(make)}
                >
                  {make}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Car Model with Auto-suggest */}
        <div className="relative">
          <label
            className="block text-black font-medium mb-2"
            htmlFor="model_name"
          >
            Car Model *
          </label>
          <input
            type="text"
            id="model_name"
            name="model_name"
            value={formData.model_name}
            onChange={handleModelInputChange}
            onClick={() => setShowModelSuggestions(true)}
            onFocus={() => setShowModelSuggestions(true)}
            className="w-full border border-black rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            required
            autoComplete="off"
            disabled={!formData.company_name}
          />
          {showModelSuggestions && filteredModels.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
              {filteredModels.map((model) => (
                <div
                  key={model}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleModelSelection(model)}
                >
                  {model}
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label
            className="block text-black font-medium mb-2"
            htmlFor="car_number"
          >
            Car Number *
          </label>
          <input
            type="text"
            id="car_number"
            name="car_number"
            value={formData.car_number}
            onChange={handleInputChange}
            className="w-full border border-black rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            required
          />
        </div>

        {/* Car Type Selection */}
        <div>
          <label
            className="block text-black font-medium mb-2"
            htmlFor="car_type"
          >
            Car Type *
          </label>
          <select
            id="car_type"
            name="car_type"
            value={formData.car_type}
            onChange={handleInputChange}
            className="w-full border border-black rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            required
          >
            <option value="sedan">Sedan</option>
            <option value="suv">SUV</option>
            <option value="hatchback">Hatchback</option>
          </select>
        </div>

        <div>
          <label
            className="block text-black font-medium mb-2"
            htmlFor="fuel_type"
          >
            Fuel Type *
          </label>
          <select
            id="fuel_type"
            name="fuel_type"
            value={formData.fuel_type}
            onChange={handleInputChange}
            className="w-full border border-black rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            required
          >
            <option value="petrol">Petrol</option>
            <option value="diesel">Diesel</option>
            <option value="cng">CNG</option>
            <option value="electric">Electric</option>
          </select>
        </div>

        {/* Transmission Type Selection */}
        <div>
          <label
            className="block text-black font-medium mb-2"
            htmlFor="transmission_type"
          >
            Transmission Type *
          </label>
          <select
            id="transmission_type"
            name="transmission_type"
            value={formData.transmission_type}
            onChange={handleInputChange}
            className="w-full border border-black rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            required
          >
            <option value="manual">Manual</option>
            <option value="automatic">Automatic</option>
          </select>
        </div>

        <div>
          <label
            className="block text-black font-medium mb-2"
            htmlFor="manufacture_year"
          >
            Manufacture Year *
          </label>
          <input
            type="number"
            id="manufacture_year"
            name="manufacture_year"
            min="1990"
            max={new Date().getFullYear()}
            value={formData.manufacture_year}
            onChange={handleInputChange}
            className="w-full border border-black rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            required
          />
        </div>

        <div>
          <label
            className="block text-black font-medium mb-2"
            htmlFor="last_serviced_on"
          >
            Last Serviced Date *
          </label>
          <input
            type="date"
            id="last_serviced_on"
            name="last_serviced_on"
            value={formData.last_serviced_on}
            onChange={handleInputChange}
            max={new Date().toISOString().split("T")[0]}
            className="w-full border border-black rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            required
          />
        </div>

        <div>
          <label
            className="block text-black font-medium mb-2"
            htmlFor="purchase_type"
          >
            Purchase Type *
          </label>
          <select
            id="purchase_type"
            name="purchase_type"
            value={formData.purchase_type}
            onChange={handleInputChange}
            className="w-full border border-black rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            required
          >
            <option value="new">New</option>
            <option value="used">Used</option>
          </select>
        </div>

        <div>
          <label
            className="block text-black font-medium mb-2"
            htmlFor="ownership_count"
          >
            Ownership Count *
          </label>
          <input
            type="number"
            id="ownership_count"
            name="ownership_count"
            min="1"
            value={formData.ownership_count}
            onChange={handleInputChange}
            className="w-full border border-black rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            required
          />
        </div>
      </div>
      
      <div className="mt-6 flex justify-between">
      <button
            type="button"
            onClick={resetForm}
            className="border border-red-500 text-red-500 font-bold py-2 px-6 rounded-md hover:bg-red-50 transition duration-300"
          >
            Reset Form
          </button>
        <button
          type="button"
          onClick={() => setActiveSection("car-photos")}
          className="bg-black text-white font-bold py-2 px-6 rounded-md hover:bg-gray-800 transition duration-300"
        >
          Next: Car Photos
        </button>
      </div>
    </div>
  );
}