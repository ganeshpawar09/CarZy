import React, { useState } from "react";
import { MapPin, ArrowLeft, AlertCircle, Check } from "lucide-react";
import { useCarListing } from "../../Context/CarListingContext";
import LocationModal from "../../Home/components/LocationModal";

export default function Location() {
  const {
    formData,
    setFormData,
    setActiveSection,
    handleSubmit,
    resetForm,
    isSubmitting,
    isUploading,
  } = useCarListing();
  
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleLocationSelect = (name, coordinates, address) => {
    setFormData({
      ...formData,
      location: address,
      latitude: coordinates.lat,
      longitude: coordinates.lng
    });
    setShowLocationModal(false);
  };

  const handleFormSubmit = async () => {
    setApiError("");
    try {
      
      await handleSubmit();
      // Success will be handled in the context with setFormSuccess
    } catch (error) {
      setApiError(error.message || "Failed to submit car listing. Please try again.");
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4 border-b border-gray-200 pb-2">
        Location & Submission
      </h2>
      
      <div className="mb-6">
        <label className="block text-black font-medium mb-2">
          Car Location *
        </label>
        <div 
          onClick={() => setShowLocationModal(true)}
          className="flex items-center justify-between border border-black rounded-md px-4 py-3 cursor-pointer hover:bg-gray-50"
        >
          <div className="flex items-center">
            <MapPin size={20} className="text-gray-500 mr-3" />
            <span>
              {formData.location ? formData.location : "Select car location"}
            </span>
          </div>
          <span className="text-sm text-blue-600">Change</span>
        </div>
        {!formData.location && 
          <p className="text-sm text-red-500 mt-1">
            <AlertCircle size={14} className="inline mr-1" />
            Location is required
          </p>
        }
      </div>

      {apiError && (
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex items-center">
          <AlertCircle size={20} className="mr-2" />
          {apiError}
        </div>
      )}
      
      <div className="mt-6 flex justify-between">
        <button
          type="button"
          onClick={() => setActiveSection("pricing")}
          className="border border-black text-black font-bold py-2 px-6 rounded-md hover:bg-gray-100 transition duration-300 flex items-center"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back
        </button>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={resetForm}
            className="border border-red-500 text-red-500 font-bold py-2 px-6 rounded-md hover:bg-red-50 transition duration-300"
          >
            Reset Form
          </button>
          <button
            type="button"
            onClick={handleFormSubmit}
            disabled={isSubmitting || isUploading || !formData.location}
            className="bg-black text-white font-bold py-2 px-8 rounded-md hover:bg-gray-800 transition duration-300 disabled:opacity-50"
          >
            {isUploading
              ? "Uploading Images..."
              : isSubmitting
              ? "Submitting..."
              : "Submit"}
          </button>
        </div>
      </div>
      
      {/* Location Modal */}
      {showLocationModal && (
        <LocationModal 
          onClose={() => setShowLocationModal(false)}
          onSelect={handleLocationSelect}
        />
      )}
    </div>
  );
}