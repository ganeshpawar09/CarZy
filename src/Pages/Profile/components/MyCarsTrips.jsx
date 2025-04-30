import { useState, useEffect } from "react";
import { Calendar, Car, Clock, ArrowRight, DollarSign, AlertCircle, CheckCircle, XCircle, Map, Navigation } from "lucide-react";
import { API_ENDPOINTS } from "../../../API_ENDPOINTS";

export default function MyCarsTripsTab() {
  const [carTrips, setCarTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [selectedTripId, setSelectedTripId] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelPenalty, setCancelPenalty] = useState(0);
  const [selectedTrip, setSelectedTrip] = useState(null);

  useEffect(() => {
    fetchCarTrips();
  }, []);

  const fetchCarTrips = async () => {
    try {
      setLoading(true);
      const userId = JSON.parse(localStorage.getItem("user"))?.id;

      if (!userId) {
        setError("User not found. Please login again.");
        setLoading(false);
        return;
      }
      const response = await fetch(`${API_ENDPOINTS.MY_CAR_BOOKING}/${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch car trips");
      }
      const data = await response.json();
      setCarTrips(data.reverse());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleCancelClick = (trip) => {
    const penaltyAmount = trip.total_amount * 0.15;
    setCancelPenalty(penaltyAmount);
    setSelectedTripId(trip.id);
    setSelectedTrip(trip);
    setShowCancelModal(true);
  };

  const confirmCancellation = async () => {
    try {
      setCancelling(true);

      // Make API call to cancel booking
      const response = await fetch(`${API_ENDPOINTS.MY_CAR_BOOKING_CANCEL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          owner_id: selectedTrip.car_owner_id,
          booking_id: selectedTrip.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to cancel booking");
      }

      // Update local state to reflect cancellation
      setCarTrips(carTrips.map(trip =>
        trip.id === selectedTripId ? { ...trip, status: 'cancelled_by_owner' } : trip
      ));

      // Close modal and reset states
      setShowCancelModal(false);
      setSelectedTripId(null);

      // Fetch updated data
      fetchCarTrips();

    } catch (err) {
      setError(`Cancellation failed: ${err.message}`);
    } finally {
      setCancelling(false);
    }
  };

  const getDirections = (latitude, longitude) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`, '_blank');
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
  const handleViewCar = (carId) => {
    navigate(`/car/${carId}`);
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

  const getStatusBadge = (status) => {
    const statusConfig = {
      booked: { bg: "bg-blue-100", text: "text-blue-800", icon: Clock, label: "Booked" },
      completed: { bg: "bg-green-100", text: "text-green-800", icon: CheckCircle, label: "Completed" },
      cancelled: { bg: "bg-red-100", text: "text-red-800", icon: XCircle, label: "Cancelled" },
      cancelled_by_owner: { bg: "bg-orange-100", text: "text-orange-800", icon: AlertCircle, label: "Cancelled by Owner" },
      ongoing: { bg: "bg-yellow-100", text: "text-yellow-800", icon: Clock, label: "Ongoing" },
      picked: { bg: "bg-purple-100", text: "text-purple-800", icon: CheckCircle, label: "Picked Up" }
    };

    const config = statusConfig[status.toLowerCase()] || { bg: "bg-gray-100", text: "text-gray-800", icon: Clock, label: status };
    const IconComponent = config.icon;

    return (
      <div className={`px-2.5 py-0.5 rounded text-xs font-medium flex items-center ${config.bg} ${config.text}`}>
        <IconComponent size={12} className="mr-1" />
        {config.label}
      </div>
    );
  };

  if (loading) return <div className="text-center py-10">Loading your car trips...</div>;
  if (error) return <div className="text-red-500 py-10">Error: {error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        {carTrips.length > 0 && (
          <div className="text-sm text-gray-500">
            Total bookings: {carTrips.length}
          </div>
        )}
      </div>

      {carTrips.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <div className="inline-block p-3 bg-blue-100 rounded-full mb-4">
            <Calendar className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-medium">No Bookings Found</h3>
          <p className="text-gray-500 mt-1">Your cars haven't been booked yet.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          {carTrips.map((trip) => (
            <div key={trip.id} className="mt-5 w-full bg-white rounded-xl shadow-md overflow-hidden">
              {/* Header */}
              <div className="bg-blue-50 p-4 border-b">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Booking #{trip.id}</h3>
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

                  {/* OTP Section - Added */}
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <div className="bg-blue-50 p-3 rounded-md">
                      <h4 className="text-xs font-medium text-gray-500 mb-1">Pickup OTP</h4>
                      <div className="text-xl font-bold">{trip.pickup_otp || "N/A"}</div>
                    </div>
                    <div className="bg-green-50 p-3 rounded-md">
                      <h4 className="text-xs font-medium text-gray-500 mb-1">Drop OTP</h4>
                      <div className="text-xl font-bold">{trip.drop_otp || "N/A"}</div>
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

                  <button
                    onClick={() => handleViewCar(trip.car_id)}
            className="px-3 py-1 text-sm bg-purple-50 text-purple-600 rounded border border-purple-200 hover:bg-purple-100"

                  >
                    <span>View Car</span>
                  </button>

                  {/* Action buttons */}
                  {trip.status.toLowerCase() === "booked" && (
                    <div className="">
                      <button
                        onClick={() => handleCancelClick(trip)}
            className="px-3 py-1 text-sm bg-red-50 text-red-600 rounded border border-red-200 hover:bg-red-100"

                      >
                        Cancel Booking
                      </button>
                    </div>
                  )}
                </div>

                {/* Timeline and Price Details */}
                <div className="space-y-3">
                  {/* Timeline section */}
                  <h4 className="text-sm font-medium text-gray-500">Trip Timeline</h4>

                  {/* Booking Time */}
                  <div className="flex items-start">
                    <div className="h-10 w-10 flex-shrink-0 flex items-center justify-center bg-blue-100 rounded-full text-blue-600">
                      <Clock size={16} />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">Booked</p>
                      <p className="text-xs text-gray-500">{formatDateTime(trip.start_datetime)}</p>
                    </div>
                  </div>

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
                      <span>- {formatCurrency((trip.total_hours * trip.price_per_hour) * trip.coupon_discount / 100)}</span>
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
        </div>
      )}

      {/* Cancellation Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Confirm Cancellation</h3>
            <div className="mb-6">
              <p className="text-red-600 mb-2">
                <AlertCircle className="inline h-5 w-5 mr-1" />
                Cancellation Penalty Warning
              </p>
              <p className="mb-4">
                Cancelling this booking will incur a penalty charge of:
              </p>
              <p className="text-xl font-bold text-center mb-4">{formatCurrency(cancelPenalty)}</p>
              <p className="text-sm text-gray-600">
                This amount will be deducted from your account according to our cancellation policy.
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Keep Booking
              </button>
              <button
                onClick={confirmCancellation}
                disabled={cancelling}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:bg-red-300"
              >
                {cancelling ? "Processing..." : "Confirm Cancellation"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}