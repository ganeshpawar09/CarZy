import React, { useRef } from "react";
import { ArrowLeft, Check, X, AlertCircle, Camera } from "lucide-react";
import { useCarListing } from "../../Context/CarListingContext";

export default function Documents() {
  const {
    formData,
    images,
    previews,
    uploadStatus,
    handleInputChange,
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
        Vehicle Documents
      </h2>
      <p className="text-sm text-gray-600 mb-6">
        Please upload clear photos of all your vehicle documents with valid expiry dates.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          {renderImageUploader(
            "puc_image_url",
            "PUC Certificate *",
            "Clear photo of your valid PUC certificate"
          )}
          <div className="mt-2">
            <label
              className="block text-black font-medium mb-2"
              htmlFor="puc_expiry_date"
            >
              PUC Expiry Date *
            </label>
            <input
              type="date"
              id="puc_expiry_date"
              name="puc_expiry_date"
              value={formData.puc_expiry_date}
              onChange={handleInputChange}
              min={new Date().toISOString().split("T")[0]}
              className="w-full border border-black rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>
        </div>

        <div>
          {renderImageUploader(
            "rc_image_url",
            "Registration Certificate (RC) *",
            "Clear photo of your valid RC"
          )}
          <div className="mt-2">
            <label
              className="block text-black font-medium mb-2"
              htmlFor="rc_expiry_date"
            >
              RC Expiry Date *
            </label>
            <input
              type="date"
              id="rc_expiry_date"
              name="rc_expiry_date"
              value={formData.rc_expiry_date}
              onChange={handleInputChange}
              min={new Date().toISOString().split("T")[0]}
              className="w-full border border-black rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>
        </div>

        <div>
          {renderImageUploader(
            "insurance_image_url",
            "Insurance Policy *",
            "Clear photo of your valid Insurance policy"
          )}
          <div className="mt-2">
            <label
              className="block text-black font-medium mb-2"
              htmlFor="insurance_expiry_date"
            >
              Insurance Expiry Date *
            </label>
            <input
              type="date"
              id="insurance_expiry_date"
              name="insurance_expiry_date"
              value={formData.insurance_expiry_date}
              onChange={handleInputChange}
              min={new Date().toISOString().split("T")[0]}
              className="w-full border border-black rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex justify-between">
        <button
          type="button"
          onClick={() => setActiveSection("car-photos")}
          className="border border-black text-black font-bold py-2 px-6 rounded-md hover:bg-gray-100 transition duration-300 flex items-center"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back
        </button>
        <button
          type="button"
          onClick={() => setActiveSection("pricing")}
          className="bg-black text-white font-bold py-2 px-6 rounded-md hover:bg-gray-800 transition duration-300"
        >
          Next: Pricing & Features
        </button>
      </div>
    </div>
  );
}