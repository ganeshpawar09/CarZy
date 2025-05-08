import React, { createContext, useContext, useState, useEffect } from "react";
import { API_ENDPOINTS } from "../../API_ENDPOINTS";

// Initial form data structure
const initialFormData = {
  company_name: "",
  model_name: "",
  car_number: "",
  manufacture_year: new Date().getFullYear(),
  purchase_type: "new",
  ownership_count: 1,
  price_per_hour: 0,
  car_rating: 0,
  no_of_car_rating: 0,
  location: "",
  last_serviced_on: "",
  fuel_type: "petrol",
  car_type: "sedan", // Added car type
  transmission_type: "manual", // Added transmission type
  latitude: 0,
  longitude: 0,
  is_visible: true,
  future_booking_datetime: "",
  features: "",
  puc_expiry_date: "",
  rc_expiry_date: "",
  insurance_expiry_date: "",
  verification_status: "pending",
  rejection_reason: "",
};

// Initial images state
const initialImages = {
  front_view_image_url: null,
  rear_view_image_url: null,
  left_side_image_url: null,
  right_side_image_url: null,
  puc_image_url: null,
  rc_image_url: null,
  insurance_image_url: null,
};

// Create the context
const CarListingContext = createContext();

// Custom hook to use the car listing context
export const useCarListing = () => {
  const context = useContext(CarListingContext);
  if (!context) {
    throw new Error("useCarListing must be used within a CarListingProvider");
  }
  return context;
};

// Provider component
export const CarListingProvider = ({ children }) => {
  // Initialize state from localStorage if available, otherwise use defaults
  const [formData, setFormData] = useState(() => {
    const savedFormData = localStorage.getItem("carListingFormData");
    return savedFormData ? JSON.parse(savedFormData) : initialFormData;
  });

  const [images, setImages] = useState(() => {
    const savedImages = localStorage.getItem("carListingImages");
    return savedImages ? JSON.parse(savedImages) : initialImages;
  });

  const [previews, setPreviews] = useState(() => {
    const savedPreviews = localStorage.getItem("carListingPreviews");
    return savedPreviews ? JSON.parse(savedPreviews) : initialImages;
  });

  const [uploadStatus, setUploadStatus] = useState({});
  const [activeSection, setActiveSection] = useState(() => {
    return localStorage.getItem("carListingActiveSection") || "basic";
  });
  
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("carListingFormData", JSON.stringify(formData));
  }, [formData]);

  // Save images to localStorage
  useEffect(() => {
    localStorage.setItem("carListingImages", JSON.stringify(images));
  }, [images]);

  // Save previews to localStorage
  useEffect(() => {
    localStorage.setItem("carListingPreviews", JSON.stringify(previews));
  }, [previews]);

  // Save active section to localStorage
  useEffect(() => {
    localStorage.setItem("carListingActiveSection", activeSection);
  }, [activeSection]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "number" ? parseFloat(value) : value,
    });
  };

  // Upload image to Cloudinary
  const uploadToCloudinary = async (file) => {
    if (!file) return null;
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append('upload_preset', 'ganesh'); 
    formData.append('cloud_name', import.meta.env.VITE_CLOUDINARY_NAME); 
    try {
      setUploadStatus(prev => ({ ...prev, [file.name]: 'uploading' }));
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
        setUploadStatus(prev => ({ ...prev, [file.name]: 'success' }));
        setIsUploading(false);
        return data.secure_url;
      } else {
        setUploadStatus(prev => ({ ...prev, [file.name]: 'failed' }));
        setIsUploading(false);
        throw new Error("Upload failed");
      }
    } catch (error) {
      setUploadStatus(prev => ({ ...prev, [file.name]: 'failed' }));
      setIsUploading(false);
      console.error("Upload error:", error);
      throw error;
    }
  };

  // Handle file selection and upload
  const handleFileChange = async (file, field) => {
    if (!file) return;
    
    // Update the images state
    setImages(prev => ({
      ...prev,
      [field]: file,
    }));
    
    // Create and set preview URL
    const previewUrl = URL.createObjectURL(file);
    setPreviews(prev => ({
      ...prev,
      [field]: previewUrl,
    }));
    
    try {
      // Upload to Cloudinary immediately
      const cloudinaryUrl = await uploadToCloudinary(file);
      
      if (cloudinaryUrl) {
        // Update the previews with the Cloudinary URL
        setPreviews(prev => ({
          ...prev,
          [field]: cloudinaryUrl
        }));
        
        // Store the URL in our images state (for form submission)
        setImages(prev => ({
          ...prev,
          [field]: cloudinaryUrl
        }));
      }
    } catch (error) {
      setFormError(`Failed to upload ${field.replace(/_/g, ' ')}. Please try again.`);
    }
  };

  // Reset a specific image
  const resetImage = (field) => {
    // Reset the specific image
    setImages(prev => ({
      ...prev,
      [field]: null
    }));
    
    // Reset the preview
    setPreviews(prev => ({
      ...prev,
      [field]: null
    }));
    
    // Reset upload status
    setUploadStatus(prev => {
      const newStatus = { ...prev };
      delete newStatus[field];
      return newStatus;
    });
  };

  // Submit to API
  const submitToAPI = async (data) => {
    try {
      console.log("Submitting data to API:", data);
      const user = JSON.parse(localStorage.getItem('user'));
      data.owner_id = user.id;
      
      const response = await fetch(API_ENDPOINTS.CAR_VERIFICATION, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add authentication headers if required
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit car listing');
      }
  
      user.user_type = 'owner';
      localStorage.setItem('user', JSON.stringify(user));
  
      return await response.json();
    } catch (error) {
      console.error('API submission error:', error);
      throw error;
    }
  };
  
  // Inside CarListingProvider component

// Submit form
const handleSubmit = async (e) => {
  if (e) e.preventDefault();
  setIsSubmitting(true);
  setFormError("");
  setFormSuccess("");

  try {
    // Validate required fields with specific error messages
    const missingFields = [];
    
    // Check basic required fields
    if (!formData.company_name) missingFields.push("Company/Make");
    if (!formData.model_name) missingFields.push("Model");
    if (!formData.car_number) missingFields.push("Car Number");
    if (!formData.fuel_type) missingFields.push("Fuel Type");
    if (!formData.car_type) missingFields.push("Car Type");
    if (!formData.transmission_type) missingFields.push("Transmission Type");
    if (!formData.location) missingFields.push("Location");
    
    // If any required fields are missing, throw error with specific fields listed
    if (missingFields.length > 0) {
      throw new Error(`Please fill the following required fields: ${missingFields.join(", ")}`);
    }

    // Validate essential images
    const missingImages = [];
    const requiredImages = [
      { field: "front_view_image_url", label: "Front View Image" },
      { field: "rear_view_image_url", label: "Rear View Image" },
      { field: "puc_image_url", label: "PUC Image" },
      { field: "rc_image_url", label: "RC Image" },
      { field: "insurance_image_url", label: "Insurance Image" }
    ];
    
    for (const { field, label } of requiredImages) {
      if (!images[field]) {
        missingImages.push(label);
      }
    }
    
    if (missingImages.length > 0) {
      throw new Error(`Please upload the following required images: ${missingImages.join(", ")}`);
    }

    // Check if any images are still uploading
    if (isUploading || Object.values(uploadStatus).some(status => status === 'uploading')) {
      throw new Error("Please wait for all images to finish uploading");
    }

    // Prepare final data
    const finalData = {
      ...formData,
      // Add owner_id from authenticated user (can be retrieved from auth context or local storage)
      owner_id: localStorage.getItem('userId') || 0 // Fallback to 0 if not available
    };

    // Add image URLs
    for (const [key, value] of Object.entries(images)) {
      if (value) {
        // If the value is a string, it's already a URL (from Cloudinary)
        if (typeof value === 'string') {
          finalData[key] = value;
        }
        // Otherwise, it's still a File object and hasn't been uploaded yet
        else if (value instanceof File) {
          throw new Error(`Please wait for ${key.replace(/_/g, ' ')} to finish uploading`);
        }
      }
    }

    // Send data to backend API
    console.log("Submitting data to API:", finalData);
    
    // Submit to API
    const result = await submitToAPI(finalData);
    
    setFormSuccess(
      "Your car has been listed successfully and is pending verification!"
    );
    setIsSubmitting(false);
    
    // Clear form data after successful submission
    resetForm();
    
    return result;
  } catch (error) {
    setFormError(error.message);
    setIsSubmitting(false);
    throw error;
  }
};

  // Reset the entire form
  const resetForm = () => {
    setFormData(initialFormData);
    setImages(initialImages);
    setPreviews(initialImages);
    setUploadStatus({});
    setFormError("");
    setFormSuccess("");
    setActiveSection("basic");
    
    // Clear localStorage
    localStorage.removeItem("carListingFormData");
    localStorage.removeItem("carListingImages");
    localStorage.removeItem("carListingPreviews");
    localStorage.removeItem("carListingActiveSection");
  };

  // Make suggestions for car makes
  const getFilteredMakes = (query) => {
    const CAR_MAKES = [
      "Maruti Suzuki", "Hyundai", "Tata", "Mahindra", "Toyota", "Honda", "Kia", 
      "Volkswagen", "MG", "Skoda", "Ford", "Renault", "Nissan", "Mercedes-Benz", 
      "BMW", "Audi"
    ];
    
    if (!query) return CAR_MAKES;
    return CAR_MAKES.filter(make => 
      make.toLowerCase().includes(query.toLowerCase())
    );
  };

  // Make suggestions for car models
  const getFilteredModels = (make, query) => {
    const CAR_MODELS = {
      "Maruti Suzuki": ["Swift", "Baleno", "Dzire", "WagonR", "Alto", "Ertiga", "Brezza", "Ciaz"],
      "Hyundai": ["i10", "i20", "Venue", "Creta", "Verna", "Tucson", "Alcazar", "Aura"],
      "Tata": ["Nexon", "Harrier", "Tiago", "Punch", "Altroz", "Safari", "Tigor"],
      "Mahindra": ["XUV700", "Scorpio", "Thar", "XUV300", "Bolero", "Marazzo"],
      "Toyota": ["Innova", "Fortuner", "Glanza", "Urban Cruiser", "Camry", "Vellfire"],
      "Honda": ["City", "Amaze", "WR-V", "Jazz", "Civic"],
    };
    
    if (!make || !CAR_MODELS[make]) return [];
    const models = CAR_MODELS[make];
    
    if (!query) return models;
    return models.filter(model => 
      model.toLowerCase().includes(query.toLowerCase())
    );
  };

  // Select a car make - Fixed implementation
  const handleMakeSelect = (make) => {
    console.log("Selected make:", make);
    setFormData(prevData => ({
      ...prevData,
      company_name: make,
      model_name: "", // Reset model when make changes
    }));
  };

  // Select a car model - Fixed implementation
  const handleModelSelect = (model) => {
    console.log("Selected model:", model);
    setFormData(prevData => ({
      ...prevData,
      model_name: model,
    }));
  };

  // Add a feature to features field
  const addFeature = (feature) => {
    const currentFeatures = formData.features ? formData.features.split(', ') : [];
    if (!currentFeatures.includes(feature)) {
      const newFeatures = [...currentFeatures, feature].filter(Boolean).join(', ');
      setFormData({...formData, features: newFeatures});
    }
  };

  // Value to be provided by the context
  const value = {
    formData,
    images,
    previews,
    uploadStatus,
    activeSection,
    formError,
    formSuccess,
    isUploading,
    isSubmitting,
    setFormData,
    setImages,
    setPreviews,
    setUploadStatus,
    setActiveSection,
    setFormError,
    setFormSuccess,
    handleInputChange,
    handleFileChange,
    resetImage,
    handleSubmit,
    resetForm,
    getFilteredMakes,
    getFilteredModels,
    handleMakeSelect,
    handleModelSelect,
    addFeature,
    submitToAPI
  };

  return (
    <CarListingContext.Provider value={value}>
      {children}
    </CarListingContext.Provider>
  );
};