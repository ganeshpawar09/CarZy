import React, { useState, useEffect } from "react";
import { Map, Check, Car, ArrowRight, CheckCircle, AlertCircle, Clock, Navigation, Calendar, Camera, X, Upload, Loader } from "lucide-react";
import { API_ENDPOINTS } from "../../../API_ENDPOINTS";
import { useNavigate } from "react-router-dom";
const MyTripsTab = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showPickupModal, setShowPickupModal] = useState(false);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [otp, setOtp] = useState("");
  const [refundAmount, setRefundAmount] = useState(0);

  // Image states
  const [images, setImages] = useState({
    front: null,
    rear: null,
    left: null,
    right: null,
    interior: null
  });

  // Image upload status
  const [uploadStatus, setUploadStatus] = useState({});
  const [imageUrls, setImageUrls] = useState({
    front: null,
    rear: null,
    left: null,
    right: null,
    interior: null
  });

  // Overall uploading state
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const userId = JSON.parse(localStorage.getItem("user"))?.id;

      if (!userId) {
        setError("User not found. Please login again.");
        setLoading(false);
        return;
      }
      // Replace with your actual API endpoint
      const response = await fetch(`${API_ENDPOINTS.MY_BOOKING}/${userId}`);
      const data = await response.json();
      setTrips(data.reverse());
      setLoading(false);
    } catch (err) {
      setError('Failed to load trips data');
      setLoading(false);
    }
  };

  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return "N/A";
    const date = new Date(dateTimeStr);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateTimeStr) => {
    if (!dateTimeStr) return "N/A";
    const date = new Date(dateTimeStr);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };


  // Function to upload image to Cloudinary
  const uploadToCloudinary = async (file, field) => {
    if (!file) return null;

    const formData = new FormData();
    formData.append("file", file);
    formData.append('upload_preset', 'ganesh');
    formData.append('cloud_name', import.meta.env.VITE_CLOUDINARY_NAME);
    try {
      setUploadStatus(prev => ({ ...prev, [field]: 'uploading' }));
      setIsUploading(true);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (data.secure_url) {
        // Update upload status and image URL
        setUploadStatus(prev => ({ ...prev, [field]: 'success' }));
        setImageUrls(prev => ({ ...prev, [field]: data.secure_url }));
        setIsUploading(false);
        return data.secure_url;
      } else {
        setUploadStatus(prev => ({ ...prev, [field]: 'failed' }));
        setIsUploading(false);
        throw new Error("Upload failed");
      }
    } catch (error) {
      setUploadStatus(prev => ({ ...prev, [field]: 'failed' }));
      setIsUploading(false);
      console.error("Upload error:", error);
      throw error;
    }
  };

  const handleCancelTrip = (trip) => {
    setSelectedTrip(trip);
    // Calculate refund amount (example calculation - adjust as needed)
    const refund = Math.floor(trip.total_amount * 0.7);
    setRefundAmount(refund);
    setShowCancelModal(true);
  };

  const confirmCancelTrip = async () => {
    try {
      // Call API to cancel trip

      await fetch(API_ENDPOINTS.BOOKING_CANCEL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: selectedTrip.user_id,
          booking_id: selectedTrip.id,
          refund_percentage: calculateRefundRate(selectedTrip.start_datetime)
        }),
      });

      // Refresh trips data
      fetchTrips();
      setShowCancelModal(false);
    } catch (err) {
      setError('Failed to cancel trip');
    }
  };

  const handlePickupTrip = (trip) => {
    setSelectedTrip(trip);
    resetImages();
    setOtp("");
    setShowPickupModal(true);
  };

  const handleDeliveryTrip = (trip) => {
    setSelectedTrip(trip);
    resetImages();
    setOtp("");
    setShowDeliveryModal(true);
  };

  const resetImages = () => {
    setImages({
      front: null,
      rear: null,
      left: null,
      right: null,
      interior: null
    });
    setImageUrls({
      front: null,
      rear: null,
      left: null,
      right: null,
      interior: null
    });
    setUploadStatus({});
  };

  const handleImageChange = async (e, type) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Update the images state with the file for preview
      setImages(prev => ({
        ...prev,
        [type]: file
      }));

      // Create preview URL for immediate display
      const previewUrl = URL.createObjectURL(file);
      setImageUrls(prev => ({
        ...prev,
        [type]: previewUrl
      }));

      try {
        // Upload to Cloudinary
        const cloudinaryUrl = await uploadToCloudinary(file, type);

        if (cloudinaryUrl) {
          // Update with the Cloudinary URL
          setImageUrls(prev => ({
            ...prev,
            [type]: cloudinaryUrl
          }));
        }
      } catch (error) {
        setError(`Failed to upload ${type} image. Please try again.`);
      }
    }
  };

  const confirmPickup = async () => {
    try {
      // Check if any images are still uploading
      if (isUploading || Object.values(uploadStatus).some(status => status === 'uploading')) {
        setError("Please wait for all images to finish uploading");
        return;
      }

      // Prepare the data for API submission
      const pickupData = {
        booking_id: selectedTrip.id,
        otp: otp,
        before_front_image_url: imageUrls.front,
        before_rear_image_url: imageUrls.rear,
        before_left_side_image_url: imageUrls.left,
        before_right_side_image_url: imageUrls.right,
        before_interior_image_url: imageUrls.interior
      };

      // Call API to confirm pickup
      await fetch(API_ENDPOINTS.CAR_PICKUP, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pickupData)
      });

      // Refresh trips data
      fetchTrips();
      setShowPickupModal(false);
    } catch (err) {
      setError('Failed to confirm pickup');
    }
  };

  const confirmDelivery = async () => {
    try {
      // Check if any images are still uploading
      if (isUploading || Object.values(uploadStatus).some(status => status === 'uploading')) {
        setError("Please wait for all images to finish uploading");
        return;
      }

      // Prepare the data for API submission
      const deliveryData = {
        booking_id: selectedTrip.id,
        otp: otp,
        after_front_image_url: imageUrls.front,
        after_rear_image_url: imageUrls.rear,
        after_left_side_image_url: imageUrls.left,
        after_right_side_image_url: imageUrls.right,
        after_interior_image_url: imageUrls.interior
      };

      // Call API to confirm delivery/return
      await fetch(API_ENDPOINTS.CAR_DROP, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(deliveryData)
      });

      // Refresh trips data
      fetchTrips();
      setShowDeliveryModal(false);
    } catch (err) {
      setError('Failed to confirm delivery');
    }
  };

  // Image upload component with upload status indicator
  const ImageUploadField = ({ label, onChange, type }) => (
    <div className="mb-3">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <label className={`flex items-center justify-center border-2 border-dashed ${uploadStatus[type] === 'failed' ? 'border-red-300' : 'border-gray-300'} rounded-md p-2 w-full cursor-pointer hover:border-blue-500`}>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onChange(e, type)}
          />

          {imageUrls[type] ? (
            <div className="flex items-center w-full">
              {uploadStatus[type] === 'uploading' ? (
                <div className="flex items-center text-sm text-yellow-600">
                  <Loader size={16} className="mr-1 animate-spin" />
                  Uploading...
                </div>
              ) : uploadStatus[type] === 'success' ? (
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center text-sm text-green-600">
                    <Check size={16} className="mr-1" />
                    Uploaded successfully
                  </div>
                  <img
                    src={imageUrls[type]}
                    alt={label}
                    className="h-10 w-10 object-cover rounded"
                  />
                </div>
              ) : (
                <div className="flex items-center text-sm">
                  <Camera size={16} className="mr-1" />
                  {images[type]?.name?.length > 20
                    ? images[type].name.substring(0, 20) + '...'
                    : images[type]?.name || 'Selected image'}
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center text-sm text-gray-500">
              <Upload size={16} className="mr-1" />
              Upload {label}
            </div>
          )}
        </label>

        {uploadStatus[type] === 'failed' && (
          <div className="text-xs text-red-600 mt-1">
            Upload failed. Click to try again.
          </div>
        )}
      </div>
    </div>
  );
const navigate = useNavigate();
  const handleViewCar = (carId) => {
    navigate(`/car/${carId}`);
  };

  const getActionButtons = (trip) => {
    return (
      <div className="flex space-x-2 mt-3">
        <button 
          onClick={() => handleViewCar(trip.car_id)}
          className="px-3 py-1 text-sm bg-purple-50 text-purple-600 rounded border border-purple-200 hover:bg-purple-100 flex items-center"
        >
          <Car size={14} className="mr-1" />
          View Car
        </button>
        
        {trip.status === "booked" && (
          <>
            <button 
              onClick={() => handleCancelTrip(trip)}
              className="px-3 py-1 text-sm bg-red-50 text-red-600 rounded border border-red-200 hover:bg-red-100"
            >
              Cancel Trip
            </button>
            <button 
              onClick={() => handlePickupTrip(trip)}
              className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded border border-blue-200 hover:bg-blue-100"
            >
              Pickup Car
            </button>
          </>
        )}
        
        {trip.status === "picked" && (
          <button 
            onClick={() => handleDeliveryTrip(trip)}
            className="px-3 py-1 text-sm bg-green-50 text-green-600 rounded border border-green-200 hover:bg-green-100"
          >
            Return Car
          </button>
        )}
      </div>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Update the getStatusBadge function to match TripCard style
  const getStatusBadge = (status) => {
    const statusConfig = {
      booked: { bg: "bg-blue-100", text: "text-blue-800", icon: Clock, label: "Booked" },
      completed: { bg: "bg-green-100", text: "text-green-800", icon: CheckCircle, label: "Completed" },
      cancelled: { bg: "bg-red-100", text: "text-red-800", icon: AlertCircle, label: "Cancelled" },
      cancelled_by_owner: { bg: "bg-orange-100", text: "text-orange-800", icon: AlertCircle, label: "Cancelled by Owner" },
      ongoing: { bg: "bg-yellow-100", text: "text-yellow-800", icon: Clock, label: "Ongoing" },
      picked: { bg: "bg-purple-100", text: "text-purple-800", icon: CheckCircle, label: "Picked Up" }
    };

    const config = statusConfig[status] || { bg: "bg-gray-100", text: "text-gray-800", icon: Clock, label: status };
    const IconComponent = config.icon;

    return (
      <div className={`px-2.5 py-0.5 rounded text-xs font-medium flex items-center ${config.bg} ${config.text}`}>
        <IconComponent size={12} className="mr-1" />
        {config.label}
      </div>
    );
  };

  // Add this function to get directions via Google Maps
  const getDirections = (latitude, longitude) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    window.open(url, '_blank');
  };

  const getTripStatusMessage = (trip) => {
    if (trip.status === "cancelled_by_owner") {
      return (
        <div className="bg-orange-50 p-3 rounded-md mt-3 text-sm">
          <div className="flex items-center">
            <AlertCircle size={16} className="mr-2 text-orange-600" />
            <span className="text-orange-800 font-medium">This trip was cancelled by the car owner</span>
          </div>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return <div className="py-4 flex justify-center">Loading trips...</div>;
  }

  if (error) {
    return <div className="py-4 text-red-500">{error}</div>;
  }


  const calculateDaysRemaining = (startDateTime) => {
    const startDate = new Date(startDateTime);
    const currentDate = new Date();
    const diffTime = startDate - currentDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const calculateRefundRate = (startDateTime) => {
    const daysRemaining = calculateDaysRemaining(startDateTime);

    if (daysRemaining >= 7) return 90;
    if (daysRemaining >= 5) return 70;
    if (daysRemaining >= 3) return 50;
    if (daysRemaining >= 1) return 30;
    return 10;
  };

  const calculateRefundableAmount = (trip) => {
    const baseAmount = trip.total_amount - trip.security_deposit;
    const netBaseAmount = baseAmount - (baseAmount * trip.coupon_discount)/100;
    const refundRate = calculateRefundRate(trip.start_datetime);

    return Math.floor(netBaseAmount * (refundRate / 100));
  };
  return (
    <div className="font-monda py-4">
      {trips.map((trip) => (
        <div key={trip.id} className="mt-5 w-full bg-white rounded-xl shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-blue-50 p-4 border-b">
            <div className="flex justify-between items-center">
             
              {getStatusBadge(trip.status)}
            </div>
          </div>

          {/* Trip Details */}
          <div className="p-4 grid sm:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Trip Period</h4>
                <div className="flex items-center mt-1">
                  <Calendar size={16} className="text-gray-500 mr-2" />
                  <div>
                    <span className="font-medium">{formatDate(trip.start_datetime)}</span>
                    <ArrowRight className="inline mx-1 h-3" />
                    <span className="font-medium">{formatDate(trip.end_datetime)}</span>
                  </div>
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  Duration: {trip.total_hours} hours
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500">Pickup Location</h4>
                <div className="flex items-center mt-1">
                  <Map size={16} className="text-gray-500 mr-2" />
                  <span>{trip.pickup_delivery_location}</span>
                </div>
              </div>

              {trip.latitude && trip.longitude && (
                <button
                  onClick={() => getDirections(trip.latitude, trip.longitude)}
                  className="flex items-center space-x-2 text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md mt-2 transition-colors"
                >
                  <Navigation size={16} />
                  <span>Get Directions</span>
                </button>
              )}

              {/* Action buttons */}
              {getActionButtons(trip)}
            </div>

            {/* Timeline and Price Details */}
            <div className="space-y-3">
              {/* Timeline section */}
              <h4 className="text-sm font-medium text-gray-500">Trip Timeline</h4>

              {trip.picked_time && (
                <div className="flex items-start">
                  <div className="h-10 w-10 flex-shrink-0 flex items-center justify-center bg-green-100 rounded-full text-green-600">
                    <CheckCircle size={16} />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">Picked up</p>
                    <p className="text-xs text-gray-500">{formatDateTime(trip.picked_time)}</p>
                  </div>
                </div>
              )}

              {trip.returned_time && (
                <div className="flex items-start">
                  <div className="h-10 w-10 flex-shrink-0 flex items-center justify-center bg-blue-100 rounded-full text-blue-600">
                    <CheckCircle size={16} />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">Returned</p>
                    <p className="text-xs text-gray-500">{formatDateTime(trip.returned_time)}</p>
                  </div>
                </div>
              )}

              {/* Status message */}
              {getTripStatusMessage(trip)}
            </div>
          </div>

          {/* Bill Section */}
          <div className="border-t bg-gray-50 p-4">
            <h4 className="font-medium mb-3">Payment Details</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Base Rate</span>
                <span>{formatCurrency(trip.price_per_hour)}/hr</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Trip Duration</span>
                <span>{trip.total_hours} hours</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Security Deposit</span>
                <span>{formatCurrency(trip.security_deposit)}</span>
              </div>

              {trip.coupon_discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Coupon Discount</span>
                  <span>- {((trip.total_hours*trip.price_per_hour)*trip.coupon_discount)/100}</span>
                </div>
              )}

              {trip.late_fees_charged && (
                <div className="flex justify-between text-sm text-red-600">
                  <span>Late Fees</span>
                  <span>{formatCurrency(trip.late_fees_amount)}</span>
                </div>
              )}

              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-medium">
                  <span>Total Amount</span>
                  <span>{formatCurrency(trip.total_amount)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Cancel Modal */}
      {showCancelModal && selectedTrip && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4  bg-white pb-2">
              <h3 className="font-medium text-lg">Cancel Trip</h3>
              <button onClick={() => setShowCancelModal(false)} className="text-gray-500">
                <X size={20} />
              </button>
            </div>

            <p className="mb-4">Are you sure you want to cancel this trip?</p>

            {/* Trip Details */}
            <div className="border border-gray-200 p-3 rounded-md mb-4">
              <h4 className="font-medium text-sm mb-2">Trip Details</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-600">Start Date:</div>
                <div className="font-medium">{formatDate(selectedTrip.start_datetime)}</div>
                <div className="text-gray-600">End Date:</div>
                <div className="font-medium">{formatDate(selectedTrip.end_datetime)}</div>
                <div className="text-gray-600">Total Amount:</div>
                <div className="font-medium">₹{selectedTrip.total_amount}</div>
                <div className="text-gray-600">Security Deposit:</div>
                <div className="font-medium">₹{selectedTrip.security_deposit}</div>
                {selectedTrip.coupon_discount > 0 && (
                  <>
                    <div className="text-gray-600">Discount Applied:</div>
                    <div className="font-medium">₹{selectedTrip.coupon_discount}</div>
                  </>
                )}
              </div>
            </div>

            {/* Cancellation Policy */}
            <div className="border border-gray-200 p-3 rounded-md mb-4 bg-gray-50">
              <h4 className="font-medium text-sm mb-2">Cancellation Policy</h4>
              <ul className="text-sm text-gray-700 ml-4 list-disc">
                <li>≥ 7 days before start: 90% refund</li>
                <li>≥ 5 days before start: 70% refund</li>
                <li>≥ 3 days before start: 50% refund</li>
                <li>≥ 1 day before start: 30% refund</li>
                <li>&lt; 1 day before start: 10% refund</li>
              </ul>
            </div>

            {/* Refund Calculation */}
            <div className="border border-gray-300 p-3 rounded-md mb-4">
              <h4 className="font-medium text-sm mb-3">Refund Calculation</h4>

              {/* Calculate days remaining */}
              <div className="text-sm mb-3 p-2 bg-gray-100 rounded">
                <span className="font-medium">{calculateDaysRemaining(selectedTrip.start_datetime)}</span> days remaining until trip start
              </div>

              {/* Refund breakdown */}
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-600">Base Amount:</div>
                  <div className="font-medium">₹{selectedTrip.total_amount - selectedTrip.security_deposit}</div>

                  {selectedTrip.coupon_discount > 0 && (
                    <>
                      <div className="text-gray-600">Applied Discount:</div>
                      <div className="font-medium">₹{selectedTrip.coupon_discount}</div>
                      <div className="text-gray-600">Net Base Amount:</div>
                      <div className="font-medium">₹{selectedTrip.total_amount - selectedTrip.security_deposit - selectedTrip.coupon_discount}</div>
                    </>
                  )}

                  <div className="text-gray-600">Refund Rate:</div>
                  <div className="font-medium">{calculateRefundRate(selectedTrip.start_datetime)}%</div>

                  <div className="text-gray-600">Refundable Amount:</div>
                  <div className="font-medium">₹{calculateRefundableAmount(selectedTrip)}</div>

                  <div className="text-gray-600">Security Deposit:</div>
                  <div className="font-medium">₹{selectedTrip.security_deposit}</div>
                </div>
              </div>

              {/* Total refund amount */}
              <div className="border-t border-gray-300 mt-3 pt-3">
                <div className="grid grid-cols-2 gap-2 text-sm font-bold">
                  <div>Total Refund:</div>
                  <div>₹{calculateRefundableAmount(selectedTrip) + selectedTrip.security_deposit}</div>
                </div>
              </div>
            </div>
            <div className="flex justify-between bg-white pt-6">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-100"
              >
                No, Keep Trip
              </button>
              <button
                onClick={confirmCancelTrip}
                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
              >
                Yes, Cancel Trip
              </button>
            </div>

          </div>
        </div>
      )}



      {/* Pickup Modal */}
      {showPickupModal && selectedTrip && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-lg">Car Pickup</h3>
              <button onClick={() => setShowPickupModal(false)} className="text-gray-500">
                <X size={20} />
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Enter OTP</label>
              <input
                type="text"
                value={otp}
                maxLength={4}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter the 4-digit OTP"
              />
            </div>

            <div className="mb-4">
              <div className="flex items-center mb-2">
                <Camera size={16} className="mr-2" />
                <h4 className="text-sm font-medium">Car Images</h4>
              </div>
              <p className="text-xs text-gray-500 mb-3">
                These photos are for your safety as they will act as proof for any damage reports.
              </p>

              <ImageUploadField label="Front View" onChange={handleImageChange} type="front" />
              <ImageUploadField label="Rear View" onChange={handleImageChange} type="rear" />
              <ImageUploadField label="Left Side" onChange={handleImageChange} type="left" />
              <ImageUploadField label="Right Side" onChange={handleImageChange} type="right" />
              <ImageUploadField label="Interior" onChange={handleImageChange} type="interior" />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowPickupModal(false)}
                className="px-4 py-2 text-gray-600 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmPickup}
                disabled={!otp || isUploading}
                className={`px-4 py-2 ${!otp || isUploading ? 'bg-blue-300' : 'bg-blue-600'} text-white rounded flex items-center`}
              >
                {isUploading ? (
                  <>
                    <Loader size={16} className="mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  'Confirm Pickup'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delivery/Return Modal */}
      {showDeliveryModal && selectedTrip && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 ">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-lg">Car Return</h3>
              <button onClick={() => setShowDeliveryModal(false)} className="text-gray-500">
                <X size={20} />
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Enter OTP</label>
              <input
                type="text"
                maxLength={4}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter the 4-digit OTP"
              />
            </div>

            <div className="mb-4">
              <div className="flex items-center mb-2">
                <Camera size={16} className="mr-2" />
                <h4 className="text-sm font-medium">Return Condition Images</h4>
              </div>
              <p className="text-xs text-gray-500 mb-3">
                These photos are for your safety as they will act as proof for any damage reports.
              </p>

              <ImageUploadField label="Front View" onChange={handleImageChange} type="front" />
              <ImageUploadField label="Rear View" onChange={handleImageChange} type="rear" />
              <ImageUploadField label="Left Side" onChange={handleImageChange} type="left" />
              <ImageUploadField label="Right Side" onChange={handleImageChange} type="right" />
              <ImageUploadField label="Interior" onChange={handleImageChange} type="interior" />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeliveryModal(false)}
                className="px-4 py-2 text-gray-600 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelivery}
                disabled={!otp || isUploading}
                className={`px-4 py-2 ${!otp || isUploading ? 'bg-green-300' : 'bg-green-600'} text-white rounded flex items-center`}
              >
                {isUploading ? (
                  <>
                    <Loader size={16} className="mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  'Confirm Return'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTripsTab;