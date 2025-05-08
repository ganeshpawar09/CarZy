import { useState, useEffect } from "react";
import { Calendar, MapPin, ChevronDown, ChevronUp, Clock, X, AlertTriangle, Tag } from "lucide-react";
import { useSearch } from "../../Context/SearchContext";
import { API_ENDPOINTS } from "../../../API_ENDPOINTS";

export default function PricingSection({ car }) {
  const [showPriceBreakdown, setShowPriceBreakdown] = useState(false);
  const [showSummaryPopup, setShowSummaryPopup] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [user, setUser] = useState(null);
  const { searchParams } = useSearch(); // Use the search context
  
  // Coupon related states
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  
  // Razorpay related states
  const [razorpayOrder, setRazorpayOrder] = useState(null);
  // Track if Razorpay script is loaded
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);
  
  // Get user from localStorage on component mount
  useEffect(() => {
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

  // Check if user is verified
  const isUserVerified = user && user.verification_status === 'approved';
  
  // Calculate the total hours between start and end dates
  const calculateTotalHours = () => {
    if (!searchParams.startDateTime || !searchParams.endDateTime) return 0;
    
    const startDate = new Date(searchParams.startDateTime);
    const endDate = new Date(searchParams.endDateTime);
    
    const diffMs = endDate - startDate;
    const diffHours = diffMs / (1000 * 60 * 60);
    
    return Math.max(Math.round(diffHours), 1); // Ensure at least 1 hour
  };
  
  const totalHours = calculateTotalHours();
  
  // Calculate pricing
  const hourlyRate = car.price_per_hour || 0;
  const subAmount = hourlyRate * totalHours;
  const securityDeposit = hourlyRate * 5; // 5 times hourly rate
  
  // Calculate discount amount if coupon is applied
  const discountAmount = appliedCoupon ? 
    (subAmount * appliedCoupon.discount_percentage / 100) : 0;
  
  // Calculate total after discount
  const mainAmount = Math.max(subAmount - discountAmount, 0);
  const grandTotal = mainAmount + securityDeposit;
  
  const formatPrice = (price) => {
    if (!price) return "₹ 0";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    })
      .format(price)
      .replace("₹", "₹ ");
  };
  
  // Format the dates for display
  const formatDates = () => {
    if (!searchParams.startDateTime || !searchParams.endDateTime) return "No dates selected";
    
    const options = { 
      day: "numeric", 
      month: "short",
      hour: "numeric", 
      minute: "numeric", 
      hour12: true 
    };
    
    const startDate = new Date(searchParams.startDateTime).toLocaleString("en-IN", options);
    const endDate = new Date(searchParams.endDateTime).toLocaleString("en-IN", options);
    
    return `${startDate} - ${endDate}`;
  };

  // Format individual date for detailed view
  const formatDate = (dateString) => {
    if (!dateString) return "";
    
    const options = { 
      day: "numeric", 
      month: "short",
      year: "numeric",
      hour: "numeric", 
      minute: "numeric", 
      hour12: true 
    };
    
    return new Date(dateString).toLocaleString("en-IN", options);
  };

  // Handle coupon code application
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }

    if (!user) {
      setCouponError("Please login to apply coupon");
      return;
    }

    setIsApplyingCoupon(true);
    setCouponError("");

    try {
      const response = await fetch(`${API_ENDPOINTS.COUPON_APPLY}/${couponCode}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to apply coupon');
      }
      
      // Get the discount percentage directly from the response
      const discountPercentage = await response.json();
      
      // Check if we received a valid percentage (positive number, not -1)
      if (typeof discountPercentage === 'number' && discountPercentage > 0) {
        // Create a coupon object with the code and discount percentage
        const newCoupon = {
          code: couponCode,
          discount_percentage: discountPercentage
        };
        
        setAppliedCoupon(newCoupon);
        setCouponCode("");
      } else if (discountPercentage === -1) {
        // Handle invalid coupon case (discount is -1)
        setCouponError("Invalid coupon code");
      } else {
        setCouponError("Invalid coupon or no discount available");
      }
    } catch (error) {
      console.error('Error applying coupon:', error);
      setCouponError(error.message || "Failed to apply coupon");
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  // Remove applied coupon
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  };

  const handleProceedToPay = () => {
    // Check if user exists and is verified
    if (!user) {
      // No user is logged in
      alert('Please login to continue with booking');
      // You could redirect to login page here
      return;
    }
    
    if (!isUserVerified) {
      // User is logged in but not verified
      alert('Your account verification is pending. You cannot proceed with booking until verification is approved.');
      return;
    }
    
    // User is logged in and verified, show summary popup
    setShowSummaryPopup(true);
  };

  // Create Razorpay order
  const createRazorpayOrder = async () => {
    if (!car || !user || !searchParams?.startDateTime || !searchParams?.endDateTime) {
      alert('Missing booking information. Please check all fields.');
      return null;
    }
  
    try {
      const orderData = {
        amount: Math.round(grandTotal) * 100, // Convert to paise
        currency: "INR",
        receipt: `car_${car.id}_user_${user.id}_${Date.now()}`
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
        const errorJson = await response.json(); // Properly parse JSON
        throw new Error(errorJson.detail || 'Failed to create Razorpay order.');
      }
  
      const orderResponse = await response.json();
      console.log("Razorpay order created successfully:", orderResponse);
      return orderResponse;
    } catch (error) {
      alert(error.message || 'Failed to create Razorpay order. Please try again.');
      return null;
    }
  };
  

  // Open Razorpay payment window
  const openRazorpayCheckout = (orderData) => {
    console.log("Opening Razorpay checkout with order:", orderData);
    
    if (!window.Razorpay) {
      console.error("Razorpay SDK is not loaded");
      alert('Razorpay SDK failed to load. Please try again later.');
      setIsBooking(false);
      return;
    }

    // Use the actual Razorpay key from environment variables or config
    const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;
    
    if (!RAZORPAY_KEY_ID) {
      console.error("Razorpay Key ID is missing");
      alert('Payment configuration error. Please contact support.');
      setIsBooking(false);
      return;
    }
    
    console.log("Initializing Razorpay with key:", RAZORPAY_KEY_ID);

    const options = {
      key: RAZORPAY_KEY_ID,
      amount: Math.round(orderData.amount),
      currency: orderData.currency,
      name: "Car Rental Service",
      description: `Booking ${car.name} for ${totalHours} hours`,
      order_id: orderData.id,
      handler: function(response) {
        console.log("Payment successful:", response);
        // Handle successful payment
        handlePaymentSuccess(response);
      },
      prefill: {
        name: user.name || "",
        email: user.email || "",
        contact: user.phone || ""
      },
      notes: {
        car_id: car.id,
        user_id: user.id,
        booking_hours: totalHours
      },
      theme: {
        color: "#000000"
      },
      modal: {
        ondismiss: function() {
          console.log("Razorpay checkout closed by user");
          setIsBooking(false);
        }
      }
    };

    try {
      const razorpayInstance = new window.Razorpay(options);
      console.log("Razorpay instance created, opening checkout");
      razorpayInstance.open();
    } catch (error) {
      console.error("Error opening Razorpay checkout:", error);
      alert('Failed to open payment form. Please try again.');
      setIsBooking(false);
    }
  };

  // Handle payment success
  const handlePaymentSuccess = async (paymentResponse) => {
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
          razorpay_signature: paymentResponse.razorpay_signature
        }),
      });

      if (!verifyResponse.ok) {
        const errorText = await verifyResponse.text();
        console.error("Payment verification failed:", errorText);
        throw new Error('Payment verification failed');
      }

      console.log("Payment verified successfully");
      // If payment is verified, create the booking
      await createBooking(paymentResponse.razorpay_payment_id);
    } catch (error) {
      console.error('Payment verification failed:', error);
      alert('Payment verification failed. Please contact support.');
      setIsBooking(false);
    }
  };

  const createBooking = async (paymentId) => {
    if (!car || !user || !searchParams?.startDateTime || !searchParams?.endDateTime) {
      alert('Missing booking information. Please check all fields.');
      return;
    }
  
    try {
      const bookingData = {
        car_id: car.id,
        car_owner_id: car.owner_id,
        user_id: user.id,
  
        start_datetime: new Date(searchParams.startDateTime).toISOString(),
        end_datetime: new Date(searchParams.endDateTime).toISOString(),
  
        pickup_delivery_location: car.location.address,
        latitude: car.latitude,
        longitude: car.longitude,
  
        total_hours: totalHours,
        price_per_hour: hourlyRate,
        discount_amount: discountAmount,
        main_amount: mainAmount,
        security_deposit: securityDeposit,
        coupon_id: appliedCoupon?.code || null,
        coupon_discount: appliedCoupon?.discount_percentage || null,
        razorpay_payment_id: paymentId
      };
     
      console.log("Creating booking with data:", bookingData);
      
      const response = await fetch(API_ENDPOINTS.CAR_BOOKING, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Booking creation failed:", errorText);
        throw new Error('Failed to create booking');
      }
      setAppliedCoupon(null); // Clear applied coupon after booking
      setCouponCode("");
      const result = await response.json();
      console.log("Booking created successfully:", result);
      alert("Booking successful!");
      setShowSummaryPopup(false);
      
      // Optional: Redirect to my bookings page
      // window.location.href = "/my-bookings";
    } catch (error) {
      console.error('Booking failed:', error);
      alert('Failed to complete booking. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  const handleConfirmBooking = async () => {
    if (!isRazorpayLoaded) {
      alert('Payment system is still loading. Please try again in a moment.');
      return;
    }
    
    setIsBooking(true);
    console.log("Starting booking process");
    
    // Create Razorpay order
    const orderData = await createRazorpayOrder();
    
    if (!orderData) {
      console.error("Failed to create Razorpay order");
      setIsBooking(false);
      return;
    }
    
    // Store order data
    setRazorpayOrder(orderData);
    
    // Open Razorpay checkout
    openRazorpayCheckout(orderData);
  };
  
  // Determine the button styling and text based on user verification status
  const getActionButtonProps = () => {
    if (!user) {
      return {
        text: "Login to Book",
        className: "w-full bg-black text-white rounded-md py-3 font-medium hover:bg-gray-800 transition duration-300 mb-3"
      };
    } else if (!isUserVerified) {
      return {
        text: "Verification Pending",
        className: "w-full bg-gray-400 text-white rounded-md py-3 font-medium cursor-not-allowed mb-3"
      };
    } else {
      return {
        text: "Proceed to Pay",
        className: "w-full bg-black text-white rounded-md py-3 font-medium hover:bg-gray-800 transition duration-300 mb-3"
      };
    }
  };

  const buttonProps = getActionButtonProps();

  return (
    <div className="sticky ">
      <div className="bg-white border rounded-lg p-6 shadow-md mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold">{formatPrice(mainAmount)}</h3>
          <span className="text-gray-500 text-sm">Hourly Rate: {formatPrice(hourlyRate)}</span>
        </div>

        <div className="border-t border-b py-4 my-4 space-y-3">
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-gray-500 mr-2" />
            <span className="text-gray-700 text-sm">{formatDates()}</span>
          </div>

          <div className="flex items-center">
            <Clock className="h-5 w-5 text-gray-500 mr-2" />
            <span className="text-gray-700 text-sm">{totalHours} {totalHours === 1 ? 'hour' : 'hours'}</span>
          </div>

          <div className="flex items-center">
            <MapPin className="h-5 w-5 text-gray-500 mr-2" />
            <span className="text-gray-700 text-sm">
              {car.location?.address?.split(',')[0] || searchParams.selectedAddress?.split(',')[0] || "Location not specified"}
            </span>
          </div>
        </div>

        {/* Coupon Section */}
        <div className="mb-4">
          {!appliedCoupon ? (
            <>
              <div className="flex space-x-2 mb-1">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon code"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                    disabled={isApplyingCoupon || !user}
                  />
                  {couponCode && (
                    <button 
                      onClick={() => setCouponCode("")}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <button
                  onClick={handleApplyCoupon}
                  disabled={isApplyingCoupon || !couponCode || !user}
                  className="bg-gray-800 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-black transition duration-300 disabled:bg-gray-400"
                >
                  {isApplyingCoupon ? "Applying..." : "Apply"}
                </button>
              </div>
              {couponError && (
                <p className="text-red-500 text-xs mt-1">{couponError}</p>
              )}
              {!user && (
                <p className="text-gray-500 text-xs mt-1">Login to apply coupon</p>
              )}
            </>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-md p-3 flex justify-between items-center">
              <div className="flex items-center">
                <Tag className="h-4 w-4 text-green-600 mr-2" />
                <div>
                  <p className="text-green-700 text-sm font-medium">{appliedCoupon.code}</p>
                  <p className="text-green-600 text-xs">
                    {appliedCoupon.discount_percentage}% off
                  </p>
                </div>
              </div>
              <button
                onClick={handleRemoveCoupon}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        <div className="space-y-3 mb-4">
          <button 
            className="flex justify-between items-center w-full text-gray-800 font-medium"
            onClick={() => setShowPriceBreakdown(!showPriceBreakdown)}
          >
            <span>Price breakdown</span>
            {showPriceBreakdown ? 
              <ChevronUp className="h-5 w-5 text-gray-500" /> : 
              <ChevronDown className="h-5 w-5 text-gray-500" />
            }
          </button>
          
          {showPriceBreakdown && (
            <div className="space-y-2 border-t pt-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Base fare ({totalHours} {totalHours === 1 ? 'hour' : 'hours'})</span>
                <span className="font-medium">{formatPrice(subAmount)}</span>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between items-center text-green-600">
                  <span>Discount ({appliedCoupon.code})</span>
                  <span>- {formatPrice(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-gray-700">Security deposit <span className="text-xs text-gray-500">(Refundable)</span></span>
                <span className="font-medium">{formatPrice(securityDeposit)}</span>
              </div>
            </div>
          )}
        </div>

        <div className="border-t pt-4 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <span className="font-semibold">Total</span>
              <div className="text-xs text-gray-500">Inclusive of taxes</div>
            </div>
            <span className="font-bold text-xl">{formatPrice(grandTotal)}</span>
          </div>
        </div>

        {/* Verification Warning for non-verified users */}
        {user && !isUserVerified && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4 flex items-start">
            <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-700">
              <p className="font-medium">Account verification pending</p>
              <p className="mt-1">Your account needs to be verified before you can book a car. Please check your email or profile for verification status.</p>
            </div>
          </div>
        )}

        <button 
          className={buttonProps.className}
          onClick={handleProceedToPay}
          disabled={user && !isUserVerified}
        >
          {buttonProps.text}
        </button>
      </div>

      {/* Booking Summary Popup - Only shown for verified users */}
      {showSummaryPopup && isUserVerified && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl  mt-50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Booking Summary</h3>
              <button 
                onClick={() => setShowSummaryPopup(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="border-b pb-3">
                <h4 className="font-medium mb-2">{car.name || "Selected Car"}</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex items-start">
                    <Calendar className="h-4 w-4 text-gray-500 mr-2 mt-1" />
                    <div>
                      <div><strong>Start:</strong> {formatDate(searchParams.startDateTime)}</div>
                      <div><strong>End:</strong> {formatDate(searchParams.endDateTime)}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-gray-500 mr-2" />
                    <span>Duration: {totalHours} {totalHours === 1 ? 'hour' : 'hours'}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                    <span>{car.location?.address || searchParams.selectedAddress || "Location not specified"}</span>
                  </div>
                </div>
              </div>

              <div className="border-b pb-3">
                <h4 className="font-medium mb-2">Payment Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Hourly Rate</span>
                    <span>{formatPrice(hourlyRate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Base fare ({totalHours} {totalHours === 1 ? 'hour' : 'hours'})</span>
                    <span>{formatPrice(subAmount)}</span>
                  </div>
                  
                  {appliedCoupon && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({appliedCoupon.code} - {appliedCoupon.discount_percentage}%)</span>
                      <span>- {formatPrice(discountAmount)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between font-medium">
                    <span className="text-gray-700">Subtotal</span>
                    <span>{formatPrice(mainAmount)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-700">Security deposit <span className="text-xs text-gray-500">(Refundable)</span></span>
                    <span>{formatPrice(securityDeposit)}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center font-bold">
                <span>Total Amount</span>
                <span>{formatPrice(grandTotal)}</span>
              </div>

              <div className="bg-gray-50 rounded-md p-3 text-sm">
                <p className="text-gray-700">Payment will be processed securely via Razorpay.</p>
              </div>
            </div>

            <div className="flex flex-col space-y-3">
              <button 
                className="w-full bg-black text-white rounded-md py-3 font-medium hover:bg-gray-800 transition duration-300 disabled:bg-gray-400"
                onClick={handleConfirmBooking}
                disabled={isBooking}
              >
                {isBooking ? "Processing..." : "Proceed to Payment"}
              </button>
              <button 
                className="w-full border border-gray-300 text-gray-700 rounded-md py-2.5 font-medium hover:bg-gray-50 transition duration-300"
                onClick={() => setShowSummaryPopup(false)}
                disabled={isBooking}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}