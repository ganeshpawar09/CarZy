import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Upload, Calendar, AlertCircle, Check } from "lucide-react";
import Navbar from "./components/Navbar";

export default function ListYourCar() {
  // Form state
  const [formData, setFormData] = useState({
    company_name: "",
    model_name: "",
    car_number: "",
    manufacture_year: new Date().getFullYear(),
    distance_traveled_km: 0,
    purchase_type: "new",
    ownership_count: 1,
    price_per_day: 0,
    last_serviced_on: "",
    location: "",
    features: "",
    puc_expiry_date: "",
    rc_expiry_date: "",
    insurance_expiry_date: "",
  });

  // Image uploads state
  const [images, setImages] = useState({
    car_image_url: null,
    puc_image_url: null,
    rc_image_url: null,
    insurance_image_url: null,
  });

  // Preview images
  const [previews, setPreviews] = useState({
    car_image_url: null,
    puc_image_url: null,
    rc_image_url: null,
    insurance_image_url: null,
  });

  // Loading states
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  // File input refs
  const fileInputRefs = {
    car_image_url: useRef(null),
    puc_image_url: useRef(null),
    rc_image_url: useRef(null),
    insurance_image_url: useRef(null),
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "number" ? parseFloat(value) : value,
    });
  };

  // Handle file selection
  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      // Update the images state
      setImages({
        ...images,
        [field]: file,
      });

      // Create and set preview URL
      const previewUrl = URL.createObjectURL(file);
      setPreviews({
        ...previews,
        [field]: previewUrl,
      });
    }
  };

  // Trigger file input click
  const triggerFileInput = (field) => {
    fileInputRefs[field].current.click();
  };

  // Mock Cloudinary upload function
  const uploadToCloudinary = async (file) => {
    // In a real implementation, you would use Cloudinary's API
    // This is a simulation for demonstration purposes
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`https://res.cloudinary.com/demo/image/upload/${file.name}`);
      }, 1000);
    });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError("");
    setFormSuccess("");

    try {
      // Validate required fields
      if (
        !formData.company_name ||
        !formData.model_name ||
        !formData.car_number ||
        !images.car_image_url
      ) {
        throw new Error(
          "Please fill all required fields and upload a car image"
        );
      }

      // Upload images to Cloudinary
      setIsUploading(true);
      const uploadPromises = {};

      for (const [key, file] of Object.entries(images)) {
        if (file) {
          uploadPromises[key] = uploadToCloudinary(file);
        }
      }

      const uploadedUrls = {};
      for (const [key, promise] of Object.entries(uploadPromises)) {
        uploadedUrls[key] = await promise;
      }

      setIsUploading(false);

      // Combine form data with uploaded URLs
      const finalData = {
        ...formData,
        ...uploadedUrls,
      };

      // Send data to backend API
      // In a real implementation, you would use fetch or axios
      console.log("Submitting data:", finalData);

      // Simulate successful submission
      setTimeout(() => {
        setFormSuccess(
          "Your car has been listed successfully and is pending verification!"
        );
        setIsSubmitting(false);
      }, 1000);
    } catch (error) {
      setFormError(error.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fond-monda bg-gray-50 min-h-screen">
      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <div className="pt-20  font-monda container mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-6">List Your Car</h1>
        <p className="text-lg mb-8">
          Fill in the details below to list your car for rent. All fields marked
          with * are required.
        </p>

        {formError && (
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex items-center">
            <AlertCircle size={20} className="mr-2" />
            {formError}
          </div>
        )}

        {formSuccess && (
          <div className="bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 flex items-center">
            <Check size={20} className="mr-2" />
            {formSuccess}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-md p-6 mb-8"
        >
          {/* Basic Car Information */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 border-b border-gray-200 pb-2">
              Car Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
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
                  onChange={handleInputChange}
                  className="w-full border border-black rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>

              <div>
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
                  onChange={handleInputChange}
                  className="w-full border border-black rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>

              <div>
                <label
                  className="block text-black font-medium mb-2"
                  htmlFor="car_number"
                >
                  Registration Number *
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
                  htmlFor="distance_traveled_km"
                >
                  Kilometers Traveled *
                </label>
                <input
                  type="number"
                  id="distance_traveled_km"
                  name="distance_traveled_km"
                  min="0"
                  value={formData.distance_traveled_km}
                  onChange={handleInputChange}
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

              <div>
                <label
                  className="block text-black font-medium mb-2"
                  htmlFor="price_per_day"
                >
                  Price Per Day (₹) *
                </label>
                <input
                  type="number"
                  id="price_per_day"
                  name="price_per_day"
                  min="0"
                  step="0.01"
                  value={formData.price_per_day}
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
                  Last Serviced Date
                </label>
                <input
                  type="date"
                  id="last_serviced_on"
                  name="last_serviced_on"
                  value={formData.last_serviced_on}
                  onChange={handleInputChange}
                  max={new Date().toISOString().split("T")[0]}
                  className="w-full border border-black rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label
                  className="block text-black font-medium mb-2"
                  htmlFor="location"
                >
                  Location *
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full border border-black rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 border-b border-gray-200 pb-2">
              Car Features
            </h2>
            <div>
              <label
                className="block text-black font-medium mb-2"
                htmlFor="features"
              >
                Features (AC, Music System, Sunroof, etc.) *
              </label>
              <textarea
                id="features"
                name="features"
                value={formData.features}
                onChange={handleInputChange}
                className="w-full border border-black rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black h-32"
                placeholder="List all features of your car separated by commas"
                required
              />
            </div>
          </div>

          {/* Car Images */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 border-b border-gray-200 pb-2">
              Car Images & Documents
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Car Image */}
              <div>
                <label className="block text-black font-medium mb-2">
                  Car Images *
                </label>
                <input
                  type="file"
                  ref={fileInputRefs.car_image_url}
                  onChange={(e) => handleFileChange(e, "car_image_url")}
                  accept="image/*"
                  className="hidden"
                  required
                />
                <div
                  onClick={() => triggerFileInput("car_image_url")}
                  className={`border-2 border-dashed ${
                    previews.car_image_url ? "border-green-500" : "border-black"
                  } rounded-lg p-4 h-48 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50`}
                >
                  {previews.car_image_url ? (
                    <div className="relative w-full h-full">
                      <img
                        src={previews.car_image_url}
                        alt="Car preview"
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute bottom-2 right-2 bg-green-500 text-white p-1 rounded-full">
                        <Check size={16} />
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload size={48} className="text-black mb-2" />
                      <p className="text-center text-black">
                        Click to upload car images
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* PUC Document */}
              <div>
                <label className="block text-black font-medium mb-2">
                  PUC Certificate
                </label>
                <input
                  type="file"
                  ref={fileInputRefs.puc_image_url}
                  onChange={(e) => handleFileChange(e, "puc_image_url")}
                  accept="image/*"
                  className="hidden"
                />
                <div
                  onClick={() => triggerFileInput("puc_image_url")}
                  className={`border-2 border-dashed ${
                    previews.puc_image_url ? "border-green-500" : "border-black"
                  } rounded-lg p-4 h-48 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50`}
                >
                  {previews.puc_image_url ? (
                    <div className="relative w-full h-full">
                      <img
                        src={previews.puc_image_url}
                        alt="PUC preview"
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute bottom-2 right-2 bg-green-500 text-white p-1 rounded-full">
                        <Check size={16} />
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload size={48} className="text-black mb-2" />
                      <p className="text-center text-black">
                        Click to upload PUC certificate
                      </p>
                    </>
                  )}
                </div>
                <div className="mt-2">
                  <label
                    className="block text-black font-medium mb-2"
                    htmlFor="puc_expiry_date"
                  >
                    PUC Expiry Date
                  </label>
                  <input
                    type="date"
                    id="puc_expiry_date"
                    name="puc_expiry_date"
                    value={formData.puc_expiry_date}
                    onChange={handleInputChange}
                    className="w-full border border-black rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>

              {/* RC Document */}
              <div>
                <label className="block text-black font-medium mb-2">
                  Registration Certificate (RC)
                </label>
                <input
                  type="file"
                  ref={fileInputRefs.rc_image_url}
                  onChange={(e) => handleFileChange(e, "rc_image_url")}
                  accept="image/*"
                  className="hidden"
                />
                <div
                  onClick={() => triggerFileInput("rc_image_url")}
                  className={`border-2 border-dashed ${
                    previews.rc_image_url ? "border-green-500" : "border-black"
                  } rounded-lg p-4 h-48 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50`}
                >
                  {previews.rc_image_url ? (
                    <div className="relative w-full h-full">
                      <img
                        src={previews.rc_image_url}
                        alt="RC preview"
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute bottom-2 right-2 bg-green-500 text-white p-1 rounded-full">
                        <Check size={16} />
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload size={48} className="text-black mb-2" />
                      <p className="text-center text-black">
                        Click to upload RC document
                      </p>
                    </>
                  )}
                </div>
                <div className="mt-2">
                  <label
                    className="block text-black font-medium mb-2"
                    htmlFor="rc_expiry_date"
                  >
                    RC Expiry Date
                  </label>
                  <input
                    type="date"
                    id="rc_expiry_date"
                    name="rc_expiry_date"
                    value={formData.rc_expiry_date}
                    onChange={handleInputChange}
                    className="w-full border border-black rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>

              {/* Insurance Document */}
              <div>
                <label className="block text-black font-medium mb-2">
                  Insurance Certificate
                </label>
                <input
                  type="file"
                  ref={fileInputRefs.insurance_image_url}
                  onChange={(e) => handleFileChange(e, "insurance_image_url")}
                  accept="image/*"
                  className="hidden"
                />
                <div
                  onClick={() => triggerFileInput("insurance_image_url")}
                  className={`border-2 border-dashed ${
                    previews.insurance_image_url
                      ? "border-green-500"
                      : "border-black"
                  } rounded-lg p-4 h-48 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50`}
                >
                  {previews.insurance_image_url ? (
                    <div className="relative w-full h-full">
                      <img
                        src={previews.insurance_image_url}
                        alt="Insurance preview"
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute bottom-2 right-2 bg-green-500 text-white p-1 rounded-full">
                        <Check size={16} />
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload size={48} className="text-black mb-2" />
                      <p className="text-center text-black">
                        Click to upload insurance document
                      </p>
                    </>
                  )}
                </div>
                <div className="mt-2">
                  <label
                    className="block text-black font-medium mb-2"
                    htmlFor="insurance_expiry_date"
                  >
                    Insurance Expiry Date
                  </label>
                  <input
                    type="date"
                    id="insurance_expiry_date"
                    name="insurance_expiry_date"
                    value={formData.insurance_expiry_date}
                    onChange={handleInputChange}
                    className="w-full border border-black rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="bg-black text-white font-bold py-3 px-8 rounded-md hover:bg-gray-800 transition duration-300 disabled:opacity-50"
            >
              {isUploading
                ? "Uploading Images..."
                : isSubmitting
                ? "Submitting..."
                : "List Your Car"}
            </button>
            <p className="mt-4 text-sm text-gray-600">
              By submitting this form, you agree to our Terms of Service and
              Privacy Policy. Your listing will be reviewed by our team before
              it goes live.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
