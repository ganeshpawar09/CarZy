import React, { useState, useEffect } from "react";
import {
  Car, Check, X, Plus, Edit, AlertCircle, Clock, Eye, EyeOff,
  ChevronDown, ChevronUp, Calendar, MapPin, Settings, Shield, Camera
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../../../API_ENDPOINTS";

const MyCarsTab = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCarId, setExpandedCarId] = useState(null);
  const [visibilityLoading, setVisibilityLoading] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserCars();
  }, []);

  const fetchUserCars = async () => {
    try {
      setLoading(true);
      const userId = JSON.parse(localStorage.getItem("user"))?.id;

      if (!userId) {
        setError("User not found. Please login again.");
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_ENDPOINTS.USER_CARS}/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch cars: ${response.status}`);
      }

      const data = await response.json();
      setCars(data.reverse());
      setLoading(false);
    } catch (err) {
      console.error("Error fetching user cars:", err);
      setError("Failed to load your cars. Please try again later.");
      setLoading(false);
    }
  };

  const toggleVisibility = async (carId, currentVisibility) => {
    try {
      setVisibilityLoading(carId);
      const response = await fetch(`${API_ENDPOINTS.CHANGE_VISIBILITY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ car_id: carId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update visibility: ${response.status}`);
      }

      // Update the local state
      setCars(
        cars.map((car) =>
          car.id === carId ? { ...car, is_visible: !car.is_visible } : car
        )
      );

      // Show success message
      const status = !currentVisibility ? "visible" : "hidden";
      showToast(`Car is now ${status} to renters`, "success");
    } catch (err) {
      console.error("Error updating car visibility:", err);
      showToast("Failed to update visibility. Please try again.", "error");
    } finally {
      setVisibilityLoading(null);
    }
  };

  const showToast = (message, type) => {
    // Implement toast notification functionality
    // This is just a placeholder - you would use your app's toast system
    alert(message);
  };

  const toggleDetails = (carId) => {
    setExpandedCarId(expandedCarId === carId ? null : carId);
    setSelectedImageUrl(null); // Reset selected image when toggling details
  };

  const getVerificationBadge = (status, rejectionReason) => {
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
      case "in_process":
        return (
          <div className="flex items-center text-blue-600 bg-blue-50 px-2 py-1 rounded text-xs">
            <Clock size={12} className="mr-1" />
            <span>In Process</span>
          </div>
        );
      case "rejected":
        return (
          <div>
            <div className="flex items-center text-red-600 bg-red-50 px-2 py-1 rounded text-xs">
              <X size={12} className="mr-1" />
              <span>Rejected</span>
            </div>
            {rejectionReason && (
              <div className="mt-1 text-xs text-red-600 max-w-xs">
                {rejectionReason}
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const handleAddCar = () => {
    navigate("/listyourcar");
  };

  const handleViewCar = (carId) => {
    navigate(`/car/${carId}`);
  };

  const handleEditCar = (carId) => {
    // Find the car data from the existing cars array
    const carToUpdate = cars.find(car => car.id === carId);

    if (carToUpdate) {
      // Store the car data in localStorage to be used in the update form
      localStorage.setItem("updateCarData", JSON.stringify(carToUpdate));

      // Navigate to the list your car page with update mode parameter
      navigate(`/listyourcar?mode=update`);
    } else {
      showToast("Car data not found. Please try again.", "error");
    }
  };

 

  const getFilteredCars = () => {
    switch (activeTab) {
      case "visible":
        return cars.filter(car => car.is_visible);
      case "hidden":
        return cars.filter(car => !car.is_visible);
      case "verified":
        return cars.filter(car => car.verification_status === "approved");
      case "pending":
        return cars.filter(car =>
          car.verification_status === "pending" ||
          car.verification_status === "in_process"
        );
      case "rejected":
        return cars.filter(car => car.verification_status === "rejected");
      default:
        return cars;
    }
  };


  if (loading) {
    return (
      <div className="py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading your cars...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center text-red-600">
        <AlertCircle size={32} className="mx-auto mb-4" />
        <p>{error}</p>
        <button
          className="mt-4 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded text-gray-700"
          onClick={fetchUserCars}
        >
          Try Again
        </button>
      </div>
    );
  }

  const filteredCars = getFilteredCars();

  return (
    <div className="py-4">
      <div className="flex justify-between items-center mb-6">
        <div className="overflow-x-auto">
          <div className="flex space-x-2 min-w-max">
            {["all", "visible", "hidden", "verified", "pending", "rejected"].map((tab) => (
              <button
                key={tab}
                className={`px-3 py-1.5 text-sm rounded-md ${activeTab === tab
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <button
          className="flex items-center bg-black text-white px-4 py-2 rounded-md whitespace-nowrap"
          onClick={handleAddCar}
        >
          <Plus size={16} className="mr-1" />
          Add Car
        </button>
      </div>

      {filteredCars.length > 0 ? (
        <div className="space-y-4">
          {filteredCars.map((car) => (
            <div key={car.id} className="border rounded-lg overflow-hidden">
              <div className="flex md:flex-row flex-col">
                <div className="p-4 w-full">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start">
                      {car.front_view_image_url && (
                        <div className="hidden sm:block mr-4">
                          <img
                            src={car.front_view_image_url}
                            alt={`${car.company_name} ${car.model_name}`}
                            className="w-20 h-20 object-cover rounded"

                          />
                        </div>
                      )}
                      <div>
                        <h3 className="font-medium text-lg">
                          {car.company_name} {car.model_name}
                        </h3>
                        <p className="text-gray-600 text-sm mt-1">
                          {car.manufacture_year} • {car.car_number}
                        </p>
                        <div className="flex items-center text-gray-600 text-sm mt-1">
                          <MapPin size={14} className="mr-1" />
                          {car.location}
                        </div>
                        <div className="flex items-center mt-2 text-gray-800">
                          <span className="font-medium">₹{car.price_per_hour}/hour</span>
                          {car.car_rating && (
                            <div className="ml-3 flex items-center text-sm text-yellow-600">
                              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                              </svg>
                              <span className="ml-1">{car.car_rating}</span>
                              <span className="ml-1 text-gray-500">({car.no_of_car_rating || 0})</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {getVerificationBadge(car.verification_status || "pending", car.rejection_reason)}
                      <div className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-700 rounded">
                        {car.is_visible ? "Visible" : "Hidden"}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4">
                    <button
                      className="flex items-center border border-black px-3 py-1.5 rounded-md text-sm"
                      onClick={() => handleEditCar(car.id)}
                    >
                      <Edit size={14} className="mr-1" />
                      Update
                    </button>

                    <button
                      onClick={() => handleViewCar(car.id)}
                      className="px-3 py-1 text-sm bg-purple-50 text-purple-600 rounded border border-purple-200 hover:bg-purple-100 flex items-center"
                    >
                      <Car size=
                        {14} className="mr-1" />
                      View Car
                    </button>
                    <button
                      className={`flex items-center px-3 py-1.5 rounded-md text-sm ${car.is_visible ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                        }`}
                      onClick={() => toggleVisibility(car.id, car.is_visible)}
                      disabled={visibilityLoading === car.id}
                    >
                      {visibilityLoading === car.id ? (
                        <div className="flex items-center">
                          <div className="animate-spin w-3 h-3 border-2 border-t-transparent border-current rounded-full mr-2"></div>
                          Updating...
                        </div>
                      ) : car.is_visible ? (
                        <>
                          <EyeOff size={14} className="mr-1" />
                          Hide Car
                        </>
                      ) : (
                        <>
                          <Eye size={14} className="mr-1" />
                          Show Car
                        </>
                      )}
                    </button>
                  </div>

                  {car.verification_status === "rejected" && (
                    <div className="mt-3 p-2 bg-red-50 rounded-md text-sm">
                      <p className="font-medium">Action required:</p>
                      <p>Please update your car details and resubmit for approval.</p>
                    </div>
                  )}


                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <div className="bg-gray-100 inline-block rounded-full p-3 mb-3">
            <Car size={24} />
          </div>
          <h3 className="font-medium">
            {activeTab === "all"
              ? "No cars yet"
              : `No ${activeTab} cars found`}
          </h3>
          <p className="text-gray-600 text-sm mt-1 mb-4">
            {activeTab === "all"
              ? "Add your first car to start earning"
              : `Try selecting a different filter or add a new car`}
          </p>
          <button
            className="flex items-center bg-black text-white px-4 py-2 rounded-md mx-auto"
            onClick={handleAddCar}
          >
            <Plus size={16} className="mr-1" />
            Add Car
          </button>
        </div>
      )}
    </div>
  );
};

export default MyCarsTab;