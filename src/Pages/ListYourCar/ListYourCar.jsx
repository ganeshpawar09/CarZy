import React, { useEffect } from "react";
import { AlertCircle, Check, ArrowLeft } from "lucide-react";
import { useLocation, useSearchParams } from "react-router-dom";
import Navbar from "./components/Navbar";
import { useCarListing } from "../Context/CarListingContext";
import BasicInfo from "./components/BasicInfo";
import CarPhotos from "./components/CarPhotos";
import Documents from "./components/Documents";
import PricingFeatures from "./components/PricingFeatures";
import Location from "./components/Location";

export default function ListYourCar() {
  // Use the car listing context
  const {
    formError,
    formSuccess,
    activeSection,
    setActiveSection,
    setFormData,
    setImages,
    setPreviews
  } = useCarListing();

  // Get search params to check for update mode
  const [searchParams] = useSearchParams();
  const isUpdateMode = searchParams.get("mode") === "update";
  
  // Set up car data for update mode
  useEffect(() => {
    console.log("isUpdateMode", isUpdateMode);
    if (isUpdateMode) {
      const carData = JSON.parse(localStorage.getItem("updateCarData"));
      
      if (carData) {
        // Initialize form data with car data
        setFormData(prevData => ({
          ...prevData,
          ...carData,
          car_id: carData.id 
        }));
        
        const imageFields = [
          "front_view_image_url",
          "rear_view_image_url",
          "left_side_image_url",
          "right_side_image_url",
          "diagonal_front_left_image_url",
          "diagonal_rear_right_image_url",
          "dashboard_image_url",
          "speedometer_fuel_gauge_image_url",
          "front_seats_image_url",
          "rear_seats_image_url",
          "boot_space_image_url",
          "tyre_condition_image_url",
          "puc_image_url",
          "rc_image_url",
          "insurance_image_url"
        ];
        
        const imagesObj = {};
        const previewsObj = {};
        
        imageFields.forEach(field => {
          if (carData[field]) {
            imagesObj[field] = carData[field];
            previewsObj[field] = carData[field];
          }
        });
        
        setImages(prevImages => ({
          ...prevImages,
          ...imagesObj
        }));
        
        setPreviews(prevPreviews => ({
          ...prevPreviews,
          ...previewsObj
        }));
      }
    }
  }, [isUpdateMode, setFormData, setImages, setPreviews]);


  const handleGoBack = () => {
    window.history.back();
  };
  // Section navigation
  const renderSectionNav = () => (
    <div className="flex justify-between mb-6 border-b border-gray-200 pb-4">
      <button 
        className={`py-2 px-4 ${activeSection === "basic" ? "text-black font-bold border-b-2 border-black" : "text-gray-600"}`}
        onClick={() => setActiveSection("basic")}
      >
        1. Basic Info
      </button>
      <button 
        className={`py-2 px-4 ${activeSection === "car-photos" ? "text-black font-bold border-b-2 border-black" : "text-gray-600"}`}
        onClick={() => setActiveSection("car-photos")}
      >
        2. Car Photos
      </button>
      <button 
        className={`py-2 px-4 ${activeSection === "documents" ? "text-black font-bold border-b-2 border-black" : "text-gray-600"}`}
        onClick={() => setActiveSection("documents")}
      >
        3. Documents
      </button>
      <button 
        className={`py-2 px-4 ${activeSection === "pricing" ? "text-black font-bold border-b-2 border-black" : "text-gray-600"}`}
        onClick={() => setActiveSection("pricing")}
      >
        4. Pricing & Features
      </button>
      <button 
        className={`py-2 px-4 ${activeSection === "location" ? "text-black font-bold border-b-2 border-black" : "text-gray-600"}`}
        onClick={() => setActiveSection("location")}
      >
        5. Location
      </button>
    </div>
  );

  return (
    <div className="font-monda bg-gray-50 min-h-screen">
      {/* Navigation */}
      <Navbar />
      
      {/* Main Content */}
      <div className="pt-20 font-monda container mx-auto px-6 py-8">
      
      <div className="hidden md:flex items-center space-x-10">
        <button
          onClick={handleGoBack}
          className="border border-black px-12 py-3 rounded hover:bg-black hover:text-white transition-colors flex items-center text-lg font-bold"
        >
          <ArrowLeft size={20} className="mr-3" />
          <span>Exit</span>
        </button>
      </div>



        <h1 className="text-3xl font-bold mb-6 mt-10">
          {isUpdateMode ? "Update Your Car" : "List Your Car"}
        </h1>
        <p className="text-lg mb-6">
          {isUpdateMode 
            ? "Update the details of your car listing below. All fields marked with * are required."
            : "Fill in the details below to list your car for rent. All fields marked with * are required."}
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

        <form className="bg-white rounded-lg shadow-md p-6 mb-8">
          {renderSectionNav()}

          {/* Basic Car Information */}
          {activeSection === "basic" && <BasicInfo isUpdateMode={isUpdateMode} />}

          {/* Car Photos Section */}
          {activeSection === "car-photos" && <CarPhotos isUpdateMode={isUpdateMode} />}

          {/* Documents Section */}
          {activeSection === "documents" && <Documents isUpdateMode={isUpdateMode} />}

          {/* Pricing & Features Section */}
          {activeSection === "pricing" && <PricingFeatures isUpdateMode={isUpdateMode} />}
          
          {/* Location & Availability Section */}
          {activeSection === "location" && <Location isUpdateMode={isUpdateMode} />}
          
          <div className="text-center text-sm text-gray-600 mt-4">
            By submitting this form, you agree to our Terms of Service and
            Privacy Policy. Your listing will be reviewed by our team before
            it goes live.
          </div>
        </form>
      </div>
    </div>
  );
}