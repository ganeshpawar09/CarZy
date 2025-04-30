import React, { useRef } from "react";
import { ArrowLeft, Check, X, AlertCircle, Camera } from "lucide-react";
import { useCarListing } from "../../Context/CarListingContext";

export default function CarPhotos() {
  const {
    images,
    previews,
    uploadStatus,
    handleFileChange,
    resetImage,
    setActiveSection
  } = useCarListing();

  // File input refs
  const fileInputRefs = {};
  Object.keys(images).forEach(key => {
    fileInputRefs[key] = useRef(null);
  });

  // Trigger file input click
  const triggerFileInput = (field) => {
    fileInputRefs[field].current.click();
  };

  // Image upload component
  const renderImageUploader = (field, label, description) => {
    const isUploaded = typeof images[field] === 'string';
    const isUploading = uploadStatus[images[field]?.name] === 'uploading';
    const hasError = uploadStatus[images[field]?.name] === 'failed';
    
    return (
      <div className="mb-6">
        <label className="block text-black font-medium mb-2">
          {label}
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center relative">
          {previews[field] ? (
            <div className="relative">
              <img 
                src={previews[field]} 
                alt={label} 
                className="h-48 mx-auto object-contain"
              />
              <button
                type="button"
                onClick={() => resetImage(field)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <X size={16} />
              </button>
              {isUploaded && (
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-green-100 text-green-700 px-2 py-1 rounded-md text-xs flex items-center">
                  <Check size={14} className="mr-1" /> Uploaded successfully
                </div>
              )}
              {isUploading && (
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs">
                  Uploading...
                </div>
              )}
              {hasError && (
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-red-100 text-red-700 px-2 py-1 rounded-md text-xs flex items-center">
                  <AlertCircle size={14} className="mr-1" /> Upload failed
                </div>
              )}
            </div>
          ) : (
            <div onClick={() => triggerFileInput(field)} className="cursor-pointer">
              <Camera size={36} className="mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500 text-sm mb-2">{description || "Click to upload"}</p>
              <button
                type="button"
                className="bg-black text-white py-1 px-4 rounded-md text-sm hover:bg-gray-800"
              >
                Browse Files
              </button>
            </div>
          )}
          <input
            type="file"
            ref={fileInputRefs[field]}
            onChange={(e) => handleFileChange(e.target.files[0], field)}
            className="hidden"
            accept="image/*"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4 border-b border-gray-200 pb-2">
        Car Photos
      </h2>
      <p className="text-sm text-gray-600 mb-6">
        Please upload clear photos of your car from different angles. All photos will be
        uploaded automatically to our secure server.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {renderImageUploader(
          "front_view_image_url",
          "Front View *",
          "Clear photo of the car from the front"
        )}
        
        {renderImageUploader(
          "rear_view_image_url",
          "Rear View *",
          "Clear photo of the car from the back"
        )}
        
        {renderImageUploader(
          "left_side_image_url",
          "Left Side View",
          "Clear photo of the car from the left side"
        )}
        
        {renderImageUploader(
          "right_side_image_url",
          "Right Side View",
          "Clear photo of the car from the right side"
        )}
        
        {renderImageUploader(
          "diagonal_front_left_image_url",
          "Diagonal Front Left View",
          "Clear photo of the car from the front-left angle"
        )}
        
        {renderImageUploader(
          "diagonal_rear_right_image_url",
          "Diagonal Rear Right View",
          "Clear photo of the car from the rear-right angle"
        )}
        
        {renderImageUploader(
          "dashboard_image_url",
          "Dashboard View",
          "Clear photo of the car's dashboard"
        )}
        
        {renderImageUploader(
          "speedometer_fuel_gauge_image_url",
          "Speedometer & Fuel Gauge",
          "Clear photo of the speedometer and fuel gauge"
        )}
        
        {renderImageUploader(
          "front_seats_image_url",
          "Front Seats",
          "Clear photo of the car's front seats"
        )}
        
        {renderImageUploader(
          "rear_seats_image_url",
          "Rear Seats",
          "Clear photo of the car's rear seats"
        )}
        
        {renderImageUploader(
          "boot_space_image_url",
          "Boot Space",
          "Clear photo of the car's boot/trunk space"
        )}
        
        {renderImageUploader(
          "tyre_condition_image_url",
          "Tyre Condition",
          "Clear photo showing the condition of the tyres"
        )}
      </div>
      
      <div className="mt-6 flex justify-between">
        <button
          type="button"
          onClick={() => setActiveSection("basic")}
          className="border border-black text-black font-bold py-2 px-6 rounded-md hover:bg-gray-100 transition duration-300 flex items-center"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back
        </button>
        <button
          type="button"
          onClick={() => setActiveSection("documents")}
          className="bg-black text-white font-bold py-2 px-6 rounded-md hover:bg-gray-800 transition duration-300"
        >
          Next: Documents
        </button>
      </div>
    </div>
  );
}