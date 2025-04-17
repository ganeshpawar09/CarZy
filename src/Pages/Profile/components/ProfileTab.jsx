import React, { useState } from "react";
import {
  User,
  Car,
  Map,
  Phone,
  Check,
  X,
  Plus,
  Edit,
  AlertCircle,
  Download,
  Upload,
  CheckCircle,
  Save,
} from "lucide-react";

const ProfileTab = ({ userData }) => {
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

  // License states
  const [selectedFile, setSelectedFile] = useState(null);

  const getVerificationBadge = (status) => {
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
      case "rejected":
        return (
          <div className="flex items-center text-red-600 bg-red-50 px-2 py-1 rounded">
            <X size={16} className="mr-1" />
            <span className="text-sm">Verification Rejected</span>
          </div>
        );
      default:
        return null;
    }
  };

  const handleUpdatePhone = () => {
    if (!otpVerified) {
      // Send OTP first
      sendOtp();
      return;
    }

    // Here you would make an API call to update the phone number
    setIsEditingPhone(false);
    setShowOtpInput(false);
    setOtpVerified(false);
    setOtpSent(false);
    // After successful update, you could refresh the user data
  };

  const handleUpdateName = () => {
    // Here you would make an API call to update the name
    setIsEditingName(false);
    // After successful update, you could refresh the user data
  };

  const sendOtp = () => {
    // Mock API call to send OTP
    setOtpSent(true);
    setShowOtpInput(true);
    // In a real app, you would make an API call here
  };

  const verifyOtp = () => {
    // Mock OTP verification
    if (otp.length === 6) {
      setOtpVerified(true);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const uploadLicense = () => {
    // Here you would make an API call to upload the license
    // For now, we'll just simulate success
    if (selectedFile) {
      // Upload logic would go here
      console.log("Uploading file:", selectedFile.name);
    }
  };

  const downloadLicense = () => {
    // Here you would make an API call to download the license
    console.log("Downloading license");
    // In a real app, you would trigger a file download here
  };

  const hasLicense = userData.license_document; // Assuming this field exists in userData

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <div className="bg-gray-200 rounded-full p-4">
          <User size={48} />
        </div>
        <div>
          <div className="flex items-center">
            <h2 className="text-2xl font-bold">{userData.full_name}</h2>
            <div className="ml-3">
              {getVerificationBadge(userData.verification_status)}
            </div>
          </div>
          <p className="text-gray-600">+91 {userData.mobile_number}</p>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-medium mb-4">Personal Information</h3>
        <div className="grid md:grid-cols-2 gap-6">
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
                <button
                  onClick={handleUpdateName}
                  className="bg-black text-white px-4 py-2 rounded-r-md flex items-center"
                >
                  <Save size={16} className="mr-1" />
                  Save
                </button>
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
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="border rounded-l-md px-4 py-2 bg-white flex-grow"
                    placeholder="Enter phone number"
                  />
                  {otpVerified ? (
                    <button
                      onClick={handleUpdatePhone}
                      className="bg-black text-white px-4 py-2 rounded-r-md flex items-center"
                    >
                      <Save size={16} className="mr-1" />
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={sendOtp}
                      className="bg-blue-600 text-white px-4 py-2 rounded-r-md"
                    >
                      {otpSent ? "Resend OTP" : "Send OTP"}
                    </button>
                  )}
                </div>

                {showOtpInput && (
                  <div className="flex">
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="border rounded-l-md px-4 py-2 bg-white flex-grow"
                      placeholder="Enter 6-digit OTP"
                      maxLength={6}
                    />
                    <button
                      onClick={verifyOtp}
                      className={`px-4 py-2 rounded-r-md text-white ${
                        otpVerified ? "bg-green-600" : "bg-gray-600"
                      }`}
                      disabled={otpVerified}
                    >
                      {otpVerified ? (
                        <div className="flex items-center">
                          <CheckCircle size={16} className="mr-1" />
                          Verified
                        </div>
                      ) : (
                        "Verify"
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

        {userData.verification_status === "pending" && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <h4 className="font-medium text-yellow-800 flex items-center">
              <AlertCircle size={16} className="mr-2" />
              Verification Pending
            </h4>
            <p className="text-sm text-yellow-700 mt-1">
              Your profile is currently under verification. This typically takes
              1-2 business days.
            </p>
          </div>
        )}

        {userData.verification_status === "rejected" && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <h4 className="font-medium text-red-800 flex items-center">
              <X size={16} className="mr-2" />
              Verification Failed
            </h4>
            <p className="text-sm text-red-700 mt-1">
              Your verification was rejected. Please update your information and
              try again.
            </p>
          </div>
        )}
      </div>

      {userData.user_type !== "admin" && (
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium mb-4">License Information</h3>

          {hasLicense ? (
            <div className="border rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-gray-100 rounded-full p-3 mr-4">
                    <Car size={24} />
                  </div>
                  <div>
                    <h4 className="font-medium">Driving License</h4>
                    <p className="text-sm text-gray-500">
                      {userData.license_document
                        ? userData.license_document.name || "license.pdf"
                        : "No file name available"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={downloadLicense}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md flex items-center"
                >
                  <Download size={16} className="mr-2" />
                  Download
                </button>
              </div>

              <div className="mt-4 pt-4 border-t border-dashed">
                <h5 className="text-sm font-medium mb-2">Update License</h5>
                <div className="flex">
                  <input
                    type="file"
                    id="license-file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  <label
                    htmlFor="license-file"
                    className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-l-md flex-grow flex items-center justify-center"
                  >
                    {selectedFile ? selectedFile.name : "Choose File"}
                  </label>
                  <button
                    onClick={uploadLicense}
                    disabled={!selectedFile}
                    className={`px-4 py-2 rounded-r-md flex items-center ${
                      selectedFile
                        ? "bg-black text-white"
                        : "bg-gray-300 text-gray-500"
                    }`}
                  >
                    <Upload size={16} className="mr-1" />
                    Upload
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="border border-dashed border-gray-300 rounded-lg p-8 text-center">
              <div className="flex justify-center mb-3">
                <div className="bg-gray-100 rounded-full p-3">
                  <Car size={24} />
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                Upload your driving license for verification
              </p>
              <div className="flex justify-center">
                <input
                  type="file"
                  id="license-file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                <label
                  htmlFor="license-file"
                  className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-l-md"
                >
                  {selectedFile ? selectedFile.name : "Choose File"}
                </label>
                <button
                  onClick={uploadLicense}
                  disabled={!selectedFile}
                  className={`px-4 py-2 rounded-r-md flex items-center ${
                    selectedFile
                      ? "bg-black text-white"
                      : "bg-gray-300 text-gray-500"
                  }`}
                >
                  <Upload size={16} className="mr-1" />
                  Upload
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileTab;
