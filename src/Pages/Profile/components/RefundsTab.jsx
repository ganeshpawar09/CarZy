import { useState, useEffect } from "react";
import { Calendar, DollarSign, AlertCircle, ArrowLeft, Tag, RefreshCw, Check } from "lucide-react";
import { API_ENDPOINTS } from "../../../API_ENDPOINTS";

export default function RefundsTab() {
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRefund, setSelectedRefund] = useState(null);
  const [upiId, setUpiId] = useState("");
  const [claimLoading, setClaimLoading] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);
  const [claimError, setClaimError] = useState(null);

  useEffect(() => {
    fetchRefunds();
  }, []);

  const fetchRefunds = async () => {
    try {
      setLoading(true);
      const userId = JSON.parse(localStorage.getItem("user"))?.id;

      if (!userId) {
        setError("User not found. Please login again.");
        setLoading(false);
        return;
      }
      const response = await fetch(`${API_ENDPOINTS.REFUNDS}/${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch refunds");
      }
      const data = await response.json();
      setRefunds(data.reverse());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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

  const getTotalRefunded = () => {
    return refunds.reduce((sum, refund) => sum + (refund.refund_amount || 0), 0);
  };

  const getReasonLabel = (reason) => {
    const reasonMap = {
      'refundable': 'Security Deposit Return',
      'cancellation': 'Booking Cancellation',
      'cancelled_by_owner': 'Cancelled by Owner',
      'cancelled_by_user': 'Cancelled by User',
      'partial_refund': 'Partial Refund',
      'other': 'Other Reason'
    };

    return reasonMap[reason] || reason.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getReasonBadgeColor = (reason) => {
    const colorMap = {
      'refundable': 'bg-blue-100 text-blue-800',
      'cancellation': 'bg-yellow-100 text-yellow-800',
      'cancelled_by_owner': 'bg-purple-100 text-purple-800',
      'cancelled_by_user': 'bg-orange-100 text-orange-800',
      'partial_refund': 'bg-indigo-100 text-indigo-800',
      'other': 'bg-gray-100 text-gray-800'
    };

    return colorMap[reason] || 'bg-gray-100 text-gray-800';
  };

  const getStatusBadgeColor = (status) => {
    const colorMap = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'processing': 'bg-blue-100 text-blue-800',
      'completed': 'bg-green-100 text-green-800',
      'failed': 'bg-red-100 text-red-800'
    };

    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  const handleClaimRefund = async (refundId) => {
    if (!upiId || upiId.trim() === "") {
      setClaimError("Please enter a valid UPI ID");
      return;
    }

    try {
      setClaimLoading(true);
      setClaimError(null);

      // API call to claim refund
      const response = await fetch(`${API_ENDPOINTS.CLAIM_REFUND}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refund_id: refundId,
          upi_id: upiId
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to claim refund");
      }

      // Update the local state
      setRefunds(prevRefunds =>
        prevRefunds.map(refund =>
          refund.id === refundId ? { ...refund, status: "processing", upi_id: upiId } : refund
        )
      );

      setClaimSuccess(true);

      // If we're in the detailed view, update the selected refund
      if (selectedRefund && selectedRefund.id === refundId) {
        setSelectedRefund(prev => ({ ...prev, status: "processing", upi_id: upiId }));
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

  const renderClaimSection = (refund) => {
    if (refund.status !== "pending") {
      return (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(refund.status)}`}>
              {refund.status.charAt(0).toUpperCase() + refund.status.slice(1)}
            </span>
            {refund.upi_id && (
              <span className="text-sm text-gray-600">UPI: {refund.upi_id}</span>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <h4 className="font-medium text-yellow-800 mb-3">Claim Your Refund</h4>

        {claimSuccess && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-center">
            <Check className="h-5 w-5 mr-2" />
            Refund claim submitted successfully!
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
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
            />
            <p className="mt-1 text-xs text-gray-500">
              Enter your UPI ID in the format username@bankname or phonenumber@upi
            </p>
          </div>

          <button
            onClick={() => handleClaimRefund(refund.id)}
            disabled={claimLoading}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-md flex justify-center items-center disabled:bg-yellow-300"
          >
            {claimLoading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              "Claim Refund"
            )}
          </button>
        </div>
      </div>
    );
  };

  if (loading) return (
    <div className="flex justify-center items-center py-16">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
      <span className="ml-3 text-gray-600">Loading refunds...</span>
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

  // If a refund is selected, show the detailed view
  if (selectedRefund) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => setSelectedRefund(null)}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to all refunds
        </button>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="bg-green-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">
              Refund #{selectedRefund.id} for Booking #{selectedRefund.booking_id}
            </h2>
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getReasonBadgeColor(selectedRefund.reason)}`}>
                {getReasonLabel(selectedRefund.reason)}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(selectedRefund.status)}`}>
                {selectedRefund.status.charAt(0).toUpperCase() + selectedRefund.status.slice(1)}
              </span>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Refund Details</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Date Processed:</span>
                    <span className="font-medium">{formatDate(selectedRefund.created_at)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-bold text-green-600">₹ {selectedRefund.refund_amount.toLocaleString('en-IN')}</span>
                  </div>
                  {selectedRefund.deduction_amount > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Deduction:</span>
                      <span className="font-medium text-red-600">₹ {selectedRefund.deduction_amount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Notes</h3>
                <div className="bg-gray-50 rounded-lg p-4 h-full">
                  {selectedRefund.deduction_reason ? (
                    <div>
                      <h4 className="font-medium mb-2">Deduction Reason:</h4>
                      <p className="text-gray-700">{selectedRefund.deduction_reason}</p>
                    </div>
                  ) : (
                    selectedRefund.deduction_amount === 0 ? (
                      <p className="text-gray-700">Full refund processed without any deductions.</p>
                    ) : (
                      <p className="text-gray-500 italic">No deduction reason provided.</p>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Claim refund section for pending refunds */}
            {renderClaimSection(selectedRefund)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Total Refunded</p>
              <p className="text-2xl font-bold">₹ {getTotalRefunded().toLocaleString('en-IN')}</p>
            </div>
            <DollarSign className="h-10 w-10 text-green-500 opacity-80" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Refund Count</p>
              <p className="text-2xl font-bold">{refunds.length}</p>
            </div>
            <Tag className="h-10 w-10 text-blue-500 opacity-80" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Last Refund</p>
              <p className="text-lg font-medium">
                {refunds.length > 0
                  ? new Date(Math.max(...refunds.map(r => new Date(r.created_at)))).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
            <Calendar className="h-10 w-10 text-purple-500 opacity-80" />
          </div>
        </div>
      </div>

      {refunds.length === 0 ? (
        <div className="bg-white text-center py-16 rounded-lg shadow">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <DollarSign className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-gray-500 text-lg">No refund records found.</p>
          <p className="text-gray-400 text-sm mt-2">When you receive refunds, they will appear here.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-800">Refund History</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Refund ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {refunds.map((refund) => (
                  <tr key={refund.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">#{refund.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">#{refund.booking_id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(refund.created_at)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getReasonBadgeColor(refund.reason)}`}>
                        {getReasonLabel(refund.reason)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(refund.status)}`}>
                        {refund.status.charAt(0).toUpperCase() + refund.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-green-600">₹ {refund.refund_amount.toLocaleString('en-IN')}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">

                        {refund.status === "pending" && (
                          <button
                            onClick={() => {
                              setSelectedRefund(refund);
                              setUpiId("");
                              setClaimError(null);
                            }}
                            className="text-yellow-600 hover:text-yellow-900"
                          >
                            Claim
                          </button>
                        )}

                        {refund.status !== "pending" && (
                          <button
                            onClick={() => setSelectedRefund(refund)}
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