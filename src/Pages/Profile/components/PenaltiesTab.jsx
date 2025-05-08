import { useState, useEffect } from "react";
import { Calendar, DollarSign, AlertCircle, RefreshCw, Shield, CreditCard, Check } from "lucide-react";
import { API_ENDPOINTS } from "../../../API_ENDPOINTS";

export default function PenaltiesTab() {
  const [penalties, setPenalties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(null);
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchPenalties();
    // Get user from localStorage on component mount
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
    }
  }, []);

  // Load the Razorpay script
  useEffect(() => {
    if (!isRazorpayLoaded) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => {
        console.log("Razorpay script loaded successfully");
        setIsRazorpayLoaded(true);
      };
      script.onerror = () => {
        console.error("Failed to load Razorpay script");
      };
      document.body.appendChild(script);

      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }
  }, [isRazorpayLoaded]);

  const fetchPenalties = async () => {
    try {
      setLoading(true);
      const userId = JSON.parse(localStorage.getItem("user"))?.id;
      
      if (!userId) {
        setError("User not found. Please login again.");
        setLoading(false);
        return;
      }
      const response = await fetch(`${API_ENDPOINTS.PENALTIES}/${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch penalties");
      }
      const data = await response.json();
      setPenalties(data.reverse());
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

  const getReasonLabel = (reason) => {
    const reasonMap = {
      'cancelled_by_owner': 'Cancelled by Owner',
      'late_return': 'Late Return',
      'late_drop': 'Late Drop',
      'damage': 'Property Damage',
      'rule_violation': 'Rule Violation',
      'other': 'Other'
    };
    
    return reasonMap[reason] || reason.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const handlePayPenalty = async (penaltyId, amount) => {
    if (!isRazorpayLoaded) {
      setError("Payment system is still loading. Please try again in a moment.");
      return;
    }
    
    try {
      setPaymentLoading(penaltyId);
      console.log("Starting penalty payment process for ID:", penaltyId);
      
      // 1. Create Razorpay order
      const orderData = await createRazorpayOrder(penaltyId, amount);
      
      if (!orderData) {
        console.error("Failed to create Razorpay order");
        throw new Error("Failed to create payment order");
      }
      
      // 2. Open Razorpay checkout
      openRazorpayCheckout(orderData, penaltyId);
      
    } catch (err) {
      console.error("Payment error:", err);
      setError(err.message || "Payment failed. Please try again.");
      setPaymentLoading(null);
    }
  };
  
  // Create Razorpay order
  const createRazorpayOrder = async (penaltyId, amount) => {
    try {
      const orderData = {
        amount: amount * 100, // Convert to paise
        currency: "INR",
        receipt: `penalty_${penaltyId}_user_${user?.id}_${Date.now()}`,
        penalty_id: penaltyId
      };
    
      console.log("Creating Razorpay order with data:", orderData);
    
      const response = await fetch(API_ENDPOINTS.CREATE_RAZORPAY_ORDER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
    
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create payment order');
      }
    
      const orderResponse = await response.json();
      console.log("Razorpay order created successfully:", orderResponse);
      return orderResponse;
    } catch (error) {
      console.error("Order creation error:", error);
      setError(error.message || 'Failed to create payment order');
      return null;
    }
  };
  
  // Open Razorpay payment window
  const openRazorpayCheckout = (orderData, penaltyId) => {
    console.log("Opening Razorpay checkout with order:", orderData);
    
    if (!window.Razorpay) {
      console.error("Razorpay SDK is not loaded");
      setError('Payment system failed to load. Please try again later.');
      setPaymentLoading(null);
      return;
    }

    // Use the actual Razorpay key from environment variables
    const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || process.env.REACT_APP_RAZORPAY_KEY_ID;
    
    if (!RAZORPAY_KEY_ID) {
      console.error("Razorpay Key ID is missing");
      setError('Payment configuration error. Please contact support.');
      setPaymentLoading(null);
      return;
    }

    const options = {
      key: RAZORPAY_KEY_ID,
      amount: orderData.amount,
      currency: orderData.currency,
      name: "Car Rental Service",
      description: `Payment for Penalty #${penaltyId}`,
      order_id: orderData.id,
      handler: function(response) {
        console.log("Payment successful:", response);
        // Handle successful payment
        handlePaymentSuccess(response, penaltyId);
      },
      prefill: {
        name: user?.name || "",
        email: user?.email || "",
        contact: user?.phone || ""
      },
      notes: {
        penalty_id: penaltyId,
        user_id: user?.id
      },
      theme: {
        color: "#000000"
      },
      modal: {
        ondismiss: function() {
          console.log("Razorpay checkout closed by user");
          setPaymentLoading(null);
        }
      }
    };

    try {
      const razorpayInstance = new window.Razorpay(options);
      console.log("Razorpay instance created, opening checkout");
      razorpayInstance.open();
    } catch (error) {
      console.error("Error opening Razorpay checkout:", error);
      setError('Failed to open payment form. Please try again.');
      setPaymentLoading(null);
    }
  };

  // Handle payment success
  const handlePaymentSuccess = async (paymentResponse, penaltyId) => {
    console.log("Processing successful payment", paymentResponse);
    try {
      // Verify payment with server
      const verifyResponse = await fetch(API_ENDPOINTS.VERIFY_PAYMENT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          razorpay_order_id: paymentResponse.razorpay_order_id,
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_signature: paymentResponse.razorpay_signature,
          penalty_id: penaltyId  // Pass penalty ID to update in database
        }),
      });

      if (!verifyResponse.ok) {
        const errorText = await verifyResponse.text();
        console.error("Payment verification failed:", errorText);
        throw new Error('Payment verification failed');
      }

      console.log("Payment verified successfully");
      
      // Update penalty status in the database
      await updatePenaltyStatus(penaltyId, paymentResponse.razorpay_payment_id);
      
    } catch (error) {
      console.error('Payment verification failed:', error);
      setError('Payment verification failed. Please contact support.');
    } finally {
      setPaymentLoading(null);
    }
  };
  
  // Update penalty status after payment
  const updatePenaltyStatus = async (penaltyId, paymentId) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.PAY_PENALTY}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          penalty_id: penaltyId,
          razorpay_payment_id: paymentId,
          status: 'paid'
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update penalty status");
      }
      
      console.log("Penalty status updated successfully");
      setPaymentSuccess(penaltyId);
      // Refresh penalties list
      fetchPenalties();
      
    } catch (error) {
      console.error("Error updating penalty status:", error);
      setError("Payment was successful, but status update failed. Please contact support.");
    }
  };

  // Calculate total penalties and unpaid penalties
  const totalPenaltyAmount = penalties.reduce((sum, penalty) => sum + penalty.penalty_amount, 0);
  const unpaidPenalties = penalties.filter(p => p.payment_status === "unpaid");
  const unpaidAmount = unpaidPenalties.reduce((sum, penalty) => sum + penalty.penalty_amount, 0);

  if (loading) return (
    <div className="flex justify-center items-center py-16">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></div>
      <span className="ml-3 text-gray-600">Loading penalties...</span>
    </div>
  );
  
  if (error) return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 my-6">
      <div className="flex items-center">
        <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
        <p className="text-red-700">{error}</p>
      </div>
      <button 
        onClick={() => { setError(null); fetchPenalties(); }}
        className="mt-3 text-sm text-red-700 hover:text-red-900 flex items-center"
      >
        <RefreshCw className="h-4 w-4 mr-1" /> Try again
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      {penalties.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Total Penalties</p>
                <p className="text-2xl font-bold">₹ {totalPenaltyAmount.toLocaleString('en-IN')}</p>
              </div>
              <DollarSign className="h-10 w-10 text-red-500 opacity-80" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-orange-500">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Unpaid Amount</p>
                <p className="text-2xl font-bold">₹ {unpaidAmount.toLocaleString('en-IN')}</p>
              </div>
              <CreditCard className="h-10 w-10 text-orange-500 opacity-80" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Penalty Count</p>
                <p className="text-2xl font-bold">{penalties.length}</p>
                <p className="text-xs text-gray-500 mt-1">{unpaidPenalties.length} unpaid</p>
              </div>
              <Shield className="h-10 w-10 text-purple-500 opacity-80" />
            </div>
          </div>
        </div>
      )}

      {/* We don't need this script tag anymore as we're loading Razorpay dynamically */}

      {penalties.length === 0 ? (
        <div className="bg-white text-center py-16 rounded-lg shadow">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-green-500" />
          </div>
          <h3 className="text-lg font-medium">No Penalties!</h3>
          <p className="text-gray-500 mt-2">You don't have any penalties on your account.</p>
          <p className="text-gray-400 text-sm mt-1">Keep up the good work!</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">Penalty History</h3>
            <button 
              onClick={fetchPenalties}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
            >
              <RefreshCw className="h-4 w-4 mr-1" /> Refresh
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {penalties.map((penalty) => (
                  <tr key={penalty.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">#{penalty.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(penalty.created_at)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">#{penalty.booking_id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        {getReasonLabel(penalty.reason)}
                      </span>
                      {penalty.penalty_reason && (
                        <div className="text-xs text-gray-500 mt-1">{penalty.penalty_reason}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-red-600">₹ {penalty.penalty_amount.toLocaleString('en-IN')}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {penalty.payment_status === "paid" ? (
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Paid
                        </span>
                      ) : (
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Unpaid
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {penalty.payment_status === "unpaid" && (
                        <button
                          onClick={() => handlePayPenalty(penalty.id, penalty.penalty_amount)}
                          disabled={paymentLoading === penalty.id}
                          className={`inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white 
                            ${paymentLoading === penalty.id ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'}`}
                        >
                          {paymentLoading === penalty.id ? (
                            <>
                              <div className="animate-spin h-3 w-3 mr-1 border-2 border-white border-t-transparent rounded-full"></div>
                              Processing...
                            </>
                          ) : (
                            <>
                              <CreditCard className="h-3 w-3 mr-1" /> Pay Now
                            </>
                          )}
                        </button>
                      )}
                      {penalty.payment_status === "paid" && penalty.razorpay_payment_id && (
                        <span className="text-xs text-gray-500">
                          No Action Required
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {paymentSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="h-8 w-8 text-green-500" />
              </div>
            </div>
            <h3 className="text-xl font-medium text-center mb-2">Payment Successful!</h3>
            <p className="text-gray-600 text-center mb-4">Your penalty payment has been processed successfully.</p>
            <div className="flex justify-center">
              <button
                onClick={() => setPaymentSuccess(null)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}