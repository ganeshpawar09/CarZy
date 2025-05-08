import React, { useState } from "react";
import { X, CheckCircle, ArrowRight, Phone, ArrowLeft } from "lucide-react";
import { API_ENDPOINTS } from "../../../API_ENDPOINTS";

export default function LoginModal({
  closeModal,
  onLoginSuccess,
  phoneNumber,
  setPhoneNumber,
}) {
  const [currentStep, setCurrentStep] = useState("phoneInput");
  const [otpValues, setOtpValues] = useState(["", "", "", ""]);
  const [otpId, setOtpId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("");
  const [userData, setUserData] = useState(null);

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      // Call the send OTP API with your specific endpoint
      const response = await fetch(API_ENDPOINTS.SEND_OTP, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mobile_number: phoneNumber }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to send OTP");
      }
      
      // Store the OTP ID for verification later
      setOtpId(data.otp_id);
      setCurrentStep("otpVerification");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeNumber = () => {
    setCurrentStep("phoneInput");
    setOtpValues(["", "", "", ""]);
    setError("");
  };

  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtpValues = [...otpValues];
      newOtpValues[index] = value;
      setOtpValues(newOtpValues);

      // Move to next input if value is entered
      if (value !== "" && index < 3) {
        document.getElementById(`otp-input-${index + 1}`).focus();
      }
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const otp = otpValues.join("");
    
    try {
      // Call the verify OTP API with your specific endpoint
      const response = await fetch(API_ENDPOINTS.VERIFY_OTP, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          otp_id: otpId,
          otp: otp
        }),
      });
      
      const userDataResponse = await response.json();
      
      if (!response.ok) {
        throw new Error(userDataResponse.message || "Invalid OTP");
      }
      
      // Store user data
      setUserData(userDataResponse);
      
      // Store user data in local storage
      localStorage.setItem("user", JSON.stringify(userDataResponse));
      
      // Check if user is a guest (needs to enter name)
      if (userDataResponse.full_name === "Guest") {
        setCurrentStep("enterName");
      } else {
        setCurrentStep("success");
        setTimeout(() => {
          onLoginSuccess(userDataResponse.full_name, userDataResponse.mobile_number);
        }, 1500);
      }
    } catch (err) {
      setError(err.message || "Failed to verify OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleNameSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      // Call the update name API with your specific endpoint
      const response = await fetch(API_ENDPOINTS.UPDATE_NAME, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userData?.token || ''}` // Include token if your API requires it
        },
        body: JSON.stringify({
          user_id: userData?.id,
          full_name: userName
        }),
      });
      
      const updatedUserData = await response.json();
      
      if (!response.ok) {
        throw new Error(updatedUserData.message || "Failed to update name");
      }
      
      // Create a copy of the current user data and update the name
      const newUserData = {
        ...userData,
        full_name: userName
      };
      
      // Update state with the new user data
      setUserData(newUserData);
      
      // Update user data in local storage
      localStorage.setItem("user", JSON.stringify(newUserData));
      
      setCurrentStep("success");
      setTimeout(() => {
        onLoginSuccess(userName, userData.mobile_number);
      }, 1500);
    } catch (err) {
      setError(err.message || "Failed to update name. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace to go to previous input
    if (e.key === "Backspace" && otpValues[index] === "" && index > 0) {
      document.getElementById(`otp-input-${index - 1}`).focus();
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    setError("");
    
    try {
      // Call the send OTP API again with your specific endpoint
      const response = await fetch(API_ENDPOINTS.SEND_OTP, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mobile_number: phoneNumber }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to resend OTP");
      }
      
      // Store the new OTP ID
      setOtpId(data.otp_id);
      setOtpValues(["", "", "", ""]);
    } catch (err) {
      setError(err.message || "Failed to resend OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-monda fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-md mb-4">
            {error}
          </div>
        )}

        {/* Phone Input Step */}
        {currentStep === "phoneInput" && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold">Login to CarZy</h2>
              <p className="text-gray-600 mt-2">
                Enter your phone number to receive a verification code
              </p>
            </div>

            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div className="flex flex-col space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">
                  Phone Number
                </label>
                <div className="flex items-center border rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
                  <div className="bg-gray-100 px-3 py-2 border-r">
                    <Phone size={20} className="text-gray-500" />
                  </div>
                  <div className="px-3 py-2 bg-gray-100 border-r">+91</div>
                  <input
                    id="phone"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="0000000000"
                    className="flex-1 px-3 py-2 outline-none"
                    required
                    maxLength={10}
                    pattern="[0-9]{10}"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !phoneNumber || phoneNumber.length !== 10}
                className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2 disabled:bg-gray-400"
              >
                <span>{loading ? "Sending..." : "Send OTP"}</span>
                {!loading && <ArrowRight size={16} />}
              </button>
            </form>
          </div>
        )}

        {/* OTP Verification Step */}
        {currentStep === "otpVerification" && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold">Verify Your Number</h2>
              <p className="text-gray-600 mt-2">
                We've sent a 4-digit code to +91 {phoneNumber}
              </p>
            </div>

            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <div className="flex flex-col space-y-4">
                <label className="text-sm font-medium text-center">
                  Enter Verification Code
                </label>
                <div className="flex justify-center space-x-4">
                  {[0, 1, 2, 3].map((index) => (
                    <input
                      key={index}
                      id={`otp-input-${index}`}
                      type="text"
                      value={otpValues[index]}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-12 text-center text-xl border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                      maxLength={1}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-sm">
                  <button 
                    type="button"
                    onClick={handleChangeNumber}
                    className="text-blue-600 font-medium flex items-center space-x-1"
                  >
                    <ArrowLeft size={14} />
                    <span>Change Number</span>
                  </button>
                  <button 
                    type="button"
                    onClick={handleResendOtp}
                    disabled={loading}
                    className="text-blue-600 font-medium disabled:text-blue-300"
                  >
                    Resend OTP
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || otpValues.some(val => val === "")}
                className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-400"
              >
                {loading ? "Verifying..." : "Verify & Continue"}
              </button>
            </form>
          </div>
        )}

        {/* Enter Name Step */}
        {currentStep === "enterName" && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold">Welcome to CarZy</h2>
              <p className="text-gray-600 mt-2">
                Please enter your name to continue
              </p>
            </div>

            <form onSubmit={handleNameSubmit} className="space-y-4">
              <div className="flex flex-col space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Your Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="John Doe"
                  className="px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading || !userName.trim()}
                className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-400"
              >
                {loading ? "Saving..." : "Continue"}
              </button>
            </form>
          </div>
        )}

        {/* Success Step */}
        {currentStep === "success" && (
          <div className="text-center space-y-4 py-6">
            <div className="flex justify-center">
              <CheckCircle size={64} className="text-green-500" />
            </div>
            <h2 className="text-2xl font-bold">Verification Successful</h2>
            <p className="text-gray-600">
              You have been successfully logged in
            </p>
          </div>
        )}
      </div>
    </div>
  );
}