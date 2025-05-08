import React, { useState, useEffect, useRef } from "react";
import {
  User,
  Check,
  X,
  Edit,
  AlertCircle,
  CheckCircle,
  Save,
  Upload,
  Camera,
  FileText,
  RefreshCw,
} from "lucide-react";
import { API_ENDPOINTS } from "../../../API_ENDPOINTS";

const ProfileTab = () => {
  const [userData, setUserData] = useState(() => {
    const storedUser = localStorage.getItem("user");
    try {
      return storedUser ? JSON.parse(storedUser) : {};
    } catch (error) {
      console.error("Error parsing user data:", error);
      return {};
    }
  });
  
  // States for form fields
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(userData.mobile_number);
  const [fullName, setFullName] = useState(userData.full_name);

  // OTP verification states
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpId, setOtpId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Document verification states
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [passportPhoto, setPassportPhoto] = useState(null);
  const [license, setLicense] = useState(null);
  const [passportPhotoPreview, setPassportPhotoPreview] = useState(null);
  const [licensePreview, setLicensePreview] = useState(null);
  const [uploadingDocuments, setUploadingDocuments] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);
  
  // Refs for file inputs
  const passportPhotoInputRef = useRef(null);
  const licenseInputRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserData(parsedUser);
        setPhoneNumber(parsedUser.mobile_number);
        setFullName(parsedUser.full_name);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const getVerificationBadge = (status, rejection_reason = "") => {
    switch (status) {
      case "approved":
        return (
          <div className="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded">
            <Check size={16} className="mr-1" />
            <span className="text-sm">Verified</span>
          </div>
        );
      case "pending":
        return (
          <div className="flex items-center text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
            <AlertCircle size={16} className="mr-1" />
            <span className="text-sm">Pending Verification</span>
          </div>
        );
      case "in_process":
        return (
          <div className="flex items-center text-blue-600 bg-blue-50 px-2 py-1 rounded">
            <AlertCircle size={16} className="mr-1" />
            <span className="text-sm">Verification In Process</span>
          </div>
        );
      case "rejected":
        return (
          <div className="flex flex-col text-red-600 bg-red-50 px-2 py-1 rounded">
            <div className="flex items-center">
              <X size={16} className="mr-1" />
              <span className="text-sm font-semibold">Verification Rejected</span>
            </div>
            {rejection_reason && (
              <span className="text-xs mt-1 ml-5">{rejection_reason}</span>
            )}
          </div>
        );
      default:
        return (
          <div className="flex items-center text-gray-600 bg-gray-50 px-2 py-1 rounded">
            <AlertCircle size={16} className="mr-1" />
            <span className="text-sm">Not Verified</span>
          </div>
        );
    }
  };

  const verifyOtp = async () => {
    if (otp.length !== 4) {
      setError("Please enter a valid 4-digit OTP");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      // API call to verify OTP
      const response = await fetch(API_ENDPOINTS.VERIFY_OTP, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userData.id,
          otp_id: otpId,
          otp: otp
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || "Invalid OTP");
      }
      setSuccess("Mobile Number updated successfully!");
      
      setOtpVerified(true);
      
      const updatedUser = { ...userData, mobile_number: phoneNumber };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUserData(updatedUser);
      
      // Reset states
      setIsEditingPhone(false);
      setShowOtpInput(false);
      setOtpVerified(false);
      setOtpSent(false);
      setOtp("");
      setOtpId("");
    } catch (err) {
      setError(err.message || "Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpdateName = async () => {
    setLoading(true);
    setError("");
    
    try {
      // API call to update the name
      const response = await fetch(API_ENDPOINTS.UPDATE_NAME, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userData.id,
          full_name: fullName,
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || "Failed to update name");
      }
      setSuccess("Name updated successfully!");
      // Update local storage with new user data
      const updatedUser = { ...userData, full_name: fullName };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUserData(updatedUser);
      
      setIsEditingName(false);
    } catch (err) {
      setError(err.message || "An error occurred while updating name");
    } finally {
      setLoading(false);
    }
  };

  const sendOtp = async () => {
    setLoading(true);
    setError("");
    
    try {
      // API call to send OTP
      const response = await fetch(API_ENDPOINTS.SEND_OTP, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobile_number: phoneNumber,
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || "Failed to send OTP");
      }
      setSuccess("OTP sent successfully!");
      setOtpId(result.otp_id); // Store the OTP ID for verification
      setOtpSent(true);
      setShowOtpInput(true);
    } catch (err) {
      setError(err.message || "An error occurred while sending OTP");
    } finally {
      setLoading(false);
    }
  };

  // Check verification status
  const checkVerificationStatus = async () => {
    setCheckingStatus(true);
    setError("");
    
    try {
      // API call to check verification status
      const response = await fetch(API_ENDPOINTS.USER_VERIFICATION_CHECK, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userData.id
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || "Failed to check verification status");
      }
      
      // Update user data with new verification status
      const updatedUser = { 
        ...userData, 
        verification_status: result.verification_status,
        rejection_reason: result.rejection_reason || ""
      };
      
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUserData(updatedUser);
      
      if (result.verification_status === "approved") {
        setSuccess("Congratulations! Your verification is approved.");
      } else if (result.verification_status === "rejected") {
        setError(`Verification rejected: ${result.rejection_reason || "No reason provided"}`);
      } else if (result.verification_status === "in_process") {
        setSuccess("Your verification is still in process. Please check again later.");
      }
      
    } catch (err) {
      setError(err.message || "An error occurred while checking verification status");
    } finally {
      setCheckingStatus(false);
    }
  };

  // Handle file selection for passport photo
  const handlePassportPhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if file is an acceptable image format
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        setError("Please select a valid image file (JPG, JPEG, or PNG)");
        return;
      }
      
      setPassportPhoto(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPassportPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle file selection for license
  const handleLicenseChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if file is an acceptable image format
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        setError("Please select a valid image file (JPG, JPEG, or PNG)");
        return;
      }
      
      setLicense(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLicensePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload documents to Cloudinary and submit to API
  const handleSubmitDocuments = async () => {
    if (!passportPhoto || !license) {
      setError("Please upload both passport photo and license");
      return;
    }

    setUploadingDocuments(true);
    setError("");
    
    try {
      // Upload passport photo to Cloudinary
      const passportFormData = new FormData();
      passportFormData.append('file', passportPhoto);
      passportFormData.append('upload_preset', 'ganesh'); 
      passportFormData.append('cloud_name', import.meta.env.VITE_CLOUDINARY_NAME); 

      
      const passportResponse = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_NAME}/image/upload`, {
        method: 'POST',
        body: passportFormData
      });
      
      const passportData = await passportResponse.json();
      
      if (!passportResponse.ok) {
        throw new Error(passportData.message || "Failed to upload passport photo");
      }
      
      // Upload license to Cloudinary
      const licenseFormData = new FormData();
      licenseFormData.append('file', license);
      licenseFormData.append('upload_preset', 'ganesh'); 
      licenseFormData.append('cloud_name', import.meta.env.VITE_CLOUDINARY_NAME); 
      
      const licenseResponse = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_NAME}/image/upload`, {
        method: 'POST',
        body: licenseFormData
      });
      
      const licenseData = await licenseResponse.json();
      
      if (!licenseResponse.ok) {
        throw new Error(licenseData.message || "Failed to upload license");
      }
      
      // Submit document URLs to API
      const response = await fetch(API_ENDPOINTS.USER_VERIFICATION, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: userData.id,
          passport_photo_url: passportData.secure_url,
          license_photo_url: licenseData.secure_url
        })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || "Failed to submit verification documents");
      }
      
      setSuccess("Documents submitted successfully! Your verification is now in process.");
      
      // Update user data
      const updatedUser = { ...userData, verification_status: "in_process" };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUserData(updatedUser);
      
      // Close modal and reset states
      setShowVerificationModal(false);
      setPassportPhoto(null);
      setLicense(null);
      setPassportPhotoPreview(null);
      setLicensePreview(null);
      
    } catch (err) {
      setError(err.message || "An error occurred during document submission");
    } finally {
      setUploadingDocuments(false);
    }
  };

  // Render verification modal
  const renderVerificationModal = () => {
    if (!showVerificationModal) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Document Verification</h3>
            <button 
              className="text-gray-500 hover:text-gray-700" 
              onClick={() => setShowVerificationModal(false)}
            >
              <X size={20} />
            </button>
          </div>
          
          <p className="text-gray-600 mb-4">
            Please upload a clear photo of your passport and driver's license for verification.
          </p>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            {/* Passport Photo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Passport Photo
              </label>
              <input
                type="file"
                ref={passportPhotoInputRef}
                onChange={handlePassportPhotoChange}
                accept="image/png, image/jpeg, image/jpg"
                className="hidden"
              />
              
              {passportPhotoPreview ? (
                <div className="relative w-full h-40 mb-2">
                  <img 
                    src={passportPhotoPreview} 
                    alt="Passport preview" 
                    className="w-full h-full object-contain rounded border"
                  />
                  <button
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                    onClick={() => {
                      setPassportPhoto(null);
                      setPassportPhotoPreview(null);
                    }}
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => passportPhotoInputRef.current.click()}
                  className="w-full border-2 border-dashed border-gray-300 p-4 rounded flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50"
                >
                  <Camera size={24} className="mb-2" />
                  <span>Upload Passport Photo</span>
                </button>
              )}
            </div>
            
            {/* License Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Driver's License
              </label>
              <input
                type="file"
                ref={licenseInputRef}
                onChange={handleLicenseChange}
                accept="image/png, image/jpeg, image/jpg"
                className="hidden"
              />
              
              {licensePreview ? (
                <div className="relative w-full h-40 mb-2">
                  <img 
                    src={licensePreview} 
                    alt="License preview" 
                    className="w-full h-full object-contain rounded border"
                  />
                  <button
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                    onClick={() => {
                      setLicense(null);
                      setLicensePreview(null);
                    }}
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => licenseInputRef.current.click()}
                  className="w-full border-2 border-dashed border-gray-300 p-4 rounded flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50"
                >
                  <FileText size={24} className="mb-2" />
                  <span>Upload Driver's License</span>
                </button>
              )}
            </div>
            
            <button
              onClick={handleSubmitDocuments}
              disabled={!passportPhoto || !license || uploadingDocuments}
              className={`w-full py-2 px-4 rounded-md text-white ${
                !passportPhoto || !license || uploadingDocuments
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-black hover:bg-gray-800"
              }`}
            >
              {uploadingDocuments ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <Upload size={16} className="mr-2" />
                  Submit Documents
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Get verification action buttons based on status
  const getVerificationActionButton = () => {
    switch (userData.verification_status) {
      case "in_process":
        return (
          <button
            onClick={checkVerificationStatus}
            disabled={checkingStatus}
            className="ml-auto bg-black text-white px-4 py-2 rounded-md flex items-center"
          >
            {checkingStatus ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Checking...
              </span>
            ) : (
              <>
                <RefreshCw size={16} className="mr-2" />
                Check Status
              </>
            )}
          </button>
        );
      case "rejected":
        return (
          <button
            onClick={() => setShowVerificationModal(true)}
            className="ml-auto bg-red-600 text-white px-4 py-2 rounded-md flex items-center"
          >
            <Upload size={16} className="mr-2" />
            Re-Verify
          </button>
        );
      case "pending":
        return (
          <button
            onClick={() => setShowVerificationModal(true)}
            className="ml-auto bg-black text-white px-4 py-2 rounded-md flex items-center"
          >
            <Upload size={16} className="mr-2" />
            Verify Now
          </button>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}
  
      <div className="flex items-center space-x-4">
        <div className="bg-gray-200 rounded-full p-4">
          <User size={48} />
        </div>
        <div className="flex-grow">
          <div className="flex items-center flex-wrap gap-3">
            <h2 className="text-2xl font-bold">{userData.full_name}</h2>
            <div>
              {getVerificationBadge(userData.verification_status, userData.rejection_reason)}
            </div>
            
            {/* Action button based on verification status */}
            {getVerificationActionButton()}
          </div>
          <p className="text-gray-600">+91 {userData.mobile_number}</p>
        </div>
      </div>
  
      <div className="border-t pt-6">
  <h3 className="text-lg font-medium mb-4">Personal Information</h3>
  <div className="grid md:grid-cols-2 gap-6">
    {/* Full Name Edit */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Full Name
      </label>
      {isEditingName ? (
        <div className="flex">
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="border rounded-l-md px-4 py-2 bg-white flex-grow"
            placeholder="Enter full name"
          />
          <div className="flex">
            <button
              onClick={() => {
                setIsEditingName(false);
                setFullName(userData.full_name); // Reset to original value
              }}
              className="bg-gray-200 text-gray-700 px-3 py-2 flex items-center"
            >
              <X size={16} className="mr-1" />
              Cancel
            </button>
            <button
              onClick={handleUpdateName}
              disabled={loading}
              className="bg-black text-white px-4 py-2 rounded-r-md flex items-center"
            >
              {loading ? "Saving..." : (
                <>
                  <Save size={16} className="mr-1" />
                  Save
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center">
          <div className="border rounded-l-md px-4 py-2 bg-gray-50 flex-grow">
            {userData.full_name}
          </div>
          <button
            onClick={() => setIsEditingName(true)}
            className="bg-gray-200 px-3 py-2 rounded-r-md"
          >
            <Edit size={16} />
          </button>
        </div>
      )}
    </div>

    {/* Phone Number Edit */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Phone Number
      </label>
      {isEditingPhone ? (
        <div className="space-y-2">
          <div className="flex">
            <input
              type="text"
              value={phoneNumber}
              maxLength={10}
              onChange={(e) => {
                // Only allow numbers and limit to 10 digits
                const value = e.target.value.replace(/[^0-9]/g, '');
                if (value.length <= 10) {
                  setPhoneNumber(value);
                }
              }}
              className="border rounded-l-md px-4 py-2 bg-white flex-grow"
              placeholder="Enter phone number"
            />
            <div className="flex">
              <button
                onClick={() => {
                  setIsEditingPhone(false);
                  setPhoneNumber(userData.mobile_number); // Reset to original value
                  setShowOtpInput(false);
                  setOtpSent(false);
                }}
                className="bg-gray-200 text-gray-700 px-3 py-2 flex items-center"
              >
                <X size={16} className="mr-1" />
                Cancel
              </button>
              <button
                onClick={sendOtp}
                disabled={loading || phoneNumber.length !== 10}
                className={`bg-black text-white px-4 py-2 rounded-r-md ${phoneNumber.length !== 10 ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? "Sending..." : (otpSent ? "Resend OTP" : "Send OTP")}
              </button>
            </div>
          </div>

          {showOtpInput && (
            <div className="flex">
              <input
                type="text"
                value={otp}
                onChange={(e) => {
                  // Only allow numbers and limit to 4 digits
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  if (value.length <= 4) {
                    setOtp(value);
                  }
                }}
                className="border rounded-l-md px-4 py-2 bg-white flex-grow"
                placeholder="Enter 4-digit OTP"
                maxLength={4}
              />
              <button
                onClick={verifyOtp}
                disabled={loading || otpVerified || otp.length !== 4}
                className={`px-4 py-2 rounded-r-md text-white ${
                  otpVerified ? "bg-green-600" : otp.length !== 4 ? "bg-gray-400" : "bg-gray-600"
                }`}
              >
                {loading ? "Verifying..." : (
                  otpVerified ? (
                    <div className="flex items-center">
                      <CheckCircle size={16} className="mr-1" />
                      Verified
                    </div>
                  ) : "Verify"
                )}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center">
          <div className="border rounded-l-md px-4 py-2 bg-gray-50 flex-grow">
            +91 {userData.mobile_number}
          </div>
          <button
            onClick={() => setIsEditingPhone(true)}
            className="bg-gray-200 px-3 py-2 rounded-r-md"
          >
            <Edit size={16} />
          </button>
        </div>
      )}
    </div>
  </div>
</div>
      {/* Render Verification Modal */}
      {renderVerificationModal()}
    </div>
  );
};  

export default ProfileTab;