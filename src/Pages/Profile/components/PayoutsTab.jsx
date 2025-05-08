import { useState, useEffect } from "react";
import { Calendar, DollarSign, AlertCircle, ArrowLeft, Car, RefreshCw, Check } from "lucide-react";
import { API_ENDPOINTS } from "../../../API_ENDPOINTS";

export default function PayoutsTab() {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPayout, setSelectedPayout] = useState(null);
  const [upiId, setUpiId] = useState("");
  const [claimLoading, setClaimLoading] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);
  const [claimError, setClaimError] = useState(null);

  useEffect(() => {
    fetchPayouts();
  }, []);

  const fetchPayouts = async () => {
    try {
      setLoading(true);
      const ownerId = JSON.parse(localStorage.getItem("user"))?.id;

      if (!ownerId) {
        setError("User not found. Please login again.");
        setLoading(false);
        return;
      }
      const response = await fetch(`${API_ENDPOINTS.PAYOUTS}/${ownerId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch payouts");
      }
      const data = await response.json();
      setPayouts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const formatCurrency = (amount) => {
    amount=Math.round(amount);
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTotalPayouts = () => {
    return payouts.reduce((sum, payout) => sum + (payout.payout_amount || 0), 0);
  };

  const getStatusBadgeColor = (status) => {
    const colorMap = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'processing': 'bg-blue-100 text-blue-800',
      'claimed': 'bg-green-100 text-green-800',
    };

    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  const handleClaimPayout = async (payoutId) => {
    if (!upiId || upiId.trim() === "") {
      setClaimError("Please enter a valid UPI ID");
      return;
    }

    try {
      setClaimLoading(true);
      setClaimError(null);

      // API call to claim payout
      const response = await fetch(`${API_ENDPOINTS.CLAIM_PAYOUT}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payout_id: payoutId,
          upi_id: upiId
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to claim payout");
      }

      // Update the local state
      setPayouts(prevPayouts =>
        prevPayouts.map(payout =>
          payout.id === payoutId ? { ...payout, status: "processing", upi_id: upiId } : payout
        )
      );

      setClaimSuccess(true);

      // If we're in the detailed view, update the selected payout
      if (selectedPayout && selectedPayout.id === payoutId) {
        setSelectedPayout(prev => ({ ...prev, status: "processing", upi_id: upiId }));
      }

      setTimeout(() => {
        setClaimSuccess(false);
      }, 3000);

    } catch (err) {
      setClaimError(err.message);
    } finally {
      setClaimLoading(false);
    }
  };

  const renderClaimSection = (payout) => {
    if (payout.status !== "pending") {
      return (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(payout.status)}`}>
              {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
            </span>
            {payout.upi_id && (
              <span className="text-sm text-gray-600">UPI: {payout.upi_id}</span>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-medium text-blue-800 mb-3">Claim Your Payout</h4>

        {claimSuccess && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-center">
            <Check className="h-5 w-5 mr-2" />
            Payout claim submitted successfully!
          </div>
        )}

        {claimError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {claimError}
          </div>
        )}

        <div className="space-y-3">
          <div>
            <label htmlFor="upi-id" className="block text-sm font-medium text-gray-700 mb-1">
              Enter UPI ID to receive payment
            </label>
            <input
              id="upi-id"
              type="text"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="name@upi"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="mt-1 text-xs text-gray-500">
              Enter your UPI ID in the format username@bankname or phonenumber@upi
            </p>
          </div>

          <button
            onClick={() => handleClaimPayout(payout.id)}
            disabled={claimLoading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md flex justify-center items-center disabled:bg-blue-300"
          >
            {claimLoading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              "Claim Payout"
            )}
          </button>
        </div>
      </div>
    );
  };

  if (loading) return (
    <div className="flex justify-center items-center py-16">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      <span className="ml-3 text-gray-600">Loading payouts...</span>
    </div>
  );

  if (error) return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 my-6">
      <div className="flex items-center">
        <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
        <p className="text-red-700">{error}</p>
      </div>
    </div>
  );

  // If a payout is selected, show the detailed view
  if (selectedPayout) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => setSelectedPayout(null)}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to all payouts
        </button>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="bg-blue-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">
              Payout #{selectedPayout.id} for Booking #{selectedPayout.booking_id}
            </h2>
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(selectedPayout.status)}`}>
                {selectedPayout.status.charAt(0).toUpperCase() + selectedPayout.status.slice(1)}
              </span>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Payout Details</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Date Created:</span>
                    <span className="font-medium">{formatDate(selectedPayout.created_at)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Car ID:</span>
                    <span className="font-medium">{selectedPayout.car_id}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Price Per Hour:</span>
                    <span className="font-medium">{formatCurrency(selectedPayout.price_per_hour)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Hours:</span>
                    <span className="font-medium">{selectedPayout.total_hours} hrs</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Main Amount:</span>
                    <span className="font-medium">{formatCurrency(selectedPayout.total_hours* selectedPayout.price_per_hour)}</span>
                  </div>
                  
                  {selectedPayout.late_charge > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Late Charges:</span>
                      <span className="font-medium text-green-600">+{formatCurrency(selectedPayout.late_charge)}</span>
                    </div>
                  )}
                  {selectedPayout.coupon_discount > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Coupon Discount:</span>
                      <span className="font-medium text-red-600">-{formatCurrency(selectedPayout.total_hours* selectedPayout.price_per_hour* selectedPayout.coupon_discount/100)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Earnings (After Commission):</span>
                    <span className="font-bold text-blue-600">{formatCurrency(selectedPayout.payout_amount)}</span>
                  </div>
                  
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Payment Information</h3>
                <div className="bg-gray-50 rounded-lg p-4 h-full">
                  {selectedPayout.razorpay_payment_id ? (
                    <div>
                      <h4 className="font-medium mb-2">Payment ID:</h4>
                      <p className="text-gray-700">{selectedPayout.razorpay_payment_id}</p>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">
                      {selectedPayout.status === "pending" 
                        ? "Payment will be processed after you claim this payout."
                        : "Payment is being processed."}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Claim payout section for pending payouts */}
            {renderClaimSection(selectedPayout)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Total Earnings</p>
              <p className="text-2xl font-bold">{formatCurrency(getTotalPayouts())}</p>
            </div>
            <DollarSign className="h-10 w-10 text-blue-500 opacity-80" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Payout Count</p>
              <p className="text-2xl font-bold">{payouts.length}</p>
            </div>
            <Car className="h-10 w-10 text-green-500 opacity-80" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Last Payout</p>
              <p className="text-lg font-medium">
                {payouts.length > 0
                  ? new Date(Math.max(...payouts.map(p => new Date(p.created_at)))).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
            <Calendar className="h-10 w-10 text-purple-500 opacity-80" />
          </div>
        </div>
      </div>

      {payouts.length === 0 ? (
        <div className="bg-white text-center py-16 rounded-lg shadow">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <DollarSign className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-gray-500 text-lg">No payout records found.</p>
          <p className="text-gray-400 text-sm mt-2">When you receive payouts for your rentals, they will appear here.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-800">Payout History</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payout ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Car ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payouts.map((payout) => (
                  <tr key={payout.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">#{payout.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">#{payout.booking_id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">#{payout.car_id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(payout.created_at)}</div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(payout.status)}`}>
                        {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-blue-600">{formatCurrency(payout.payout_amount)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {payout.status === "pending" && (
                          <button
                            onClick={() => {
                              setSelectedPayout(payout);
                              setUpiId("");
                              setClaimError(null);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Claim
                          </button>
                        )}

                        {payout.status !== "pending" && (
                          <button
                            onClick={() => setSelectedPayout(payout)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Details
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}