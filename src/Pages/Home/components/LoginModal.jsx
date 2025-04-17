import React, { useState } from "react";
import { X, CheckCircle, ArrowRight, Phone } from "lucide-react";

export default function LoginModal({
  closeModal,
  onLoginSuccess,
  phoneNumber,
  setPhoneNumber,
}) {
  const [currentStep, setCurrentStep] = useState("phoneInput");
  const [otpValues, setOtpValues] = useState(["", "", "", ""]);

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would send the phone number to your backend
    // and trigger an OTP to be sent to the user's phone
    console.log("Sending OTP to", phoneNumber);
    setCurrentStep("otpVerification");
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

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would validate the OTP with your backend
    const otp = otpValues.join("");
    console.log("Verifying OTP:", otp);

    // Simulate successful verification
    setCurrentStep("success");
    setTimeout(() => {
      onLoginSuccess("John Doe", phoneNumber || "9876543210");
    }, 1500);
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace to go to previous input
    if (e.key === "Backspace" && otpValues[index] === "" && index > 0) {
      document.getElementById(`otp-input-${index - 1}`).focus();
    }
  };

  return (
    <div className="font-monda fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

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
                    placeholder="9876543210"
                    className="flex-1 px-3 py-2 outline-none"
                    required
                    maxLength={10}
                    pattern="[0-9]{10}"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2"
              >
                <span>Send OTP</span>
                <ArrowRight size={16} />
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
                <p className="text-center text-sm text-gray-500">
                  Didn't receive code?{" "}
                  <button className="text-blue-600 font-medium">Resend</button>
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-colors"
              >
                Verify & Continue
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
