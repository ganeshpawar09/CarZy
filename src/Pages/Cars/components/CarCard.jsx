import { Link, useNavigate } from "react-router-dom";
import { MapPin, Star } from "lucide-react";
import { useSearch } from "../../Context/SearchContext";
function CarCard({ car }) {
  const navigate = useNavigate();
  const { searchParams } = useSearch(); // Use the search context
  // Calculate the total price based on hourly rate and duration

  const calculateTotalHours = () => {
    if (!searchParams.startDateTime || !searchParams.endDateTime) return 0;
    
    const startDate = new Date(searchParams.startDateTime);
    const endDate = new Date(searchParams.endDateTime);
    
    const diffMs = endDate - startDate;
    const diffHours = diffMs / (1000 * 60 * 60);
    
    return Math.max(Math.round(diffHours), 1); // Ensure at least 1 hour
  };
  const calculateTotalPrice = (car) => {
    const totalHours = calculateTotalHours();
  
  // Calculate pricing
  const hourlyRate = car.price_per_hour || 0;
  const mainAmount = hourlyRate * totalHours;
  const securityDeposit = hourlyRate * 5; // 5 times hourly rate
  
  // Calculate total after discount
  const grandTotal = mainAmount + securityDeposit;

    return {
      totalHours,
      total: Math.round(grandTotal),
    };
    
  };

  // Format distance to show in Kms
  const formatDistance = (distanceInKm) => {
    if (distanceInKm === undefined || distanceInKm === null) {
      return "Distance unavailable";
    }
    return `${Math.round(distanceInKm)} km away`;
  };

  // Parse features from string to array if needed
  const getFeatures = (featuresString) => {
    if (!featuresString) return [];
    
    try {
      if (typeof featuresString === 'string') {
        return featuresString.split(', ');
      }
      return Array.isArray(featuresString) ? featuresString : [];
    } catch (error) {
      return [];
    }
  };

  const pricing = calculateTotalPrice(car);
  const distance = formatDistance(car.distance);
  const features = getFeatures(car.features);
  
  // Get primary image
  const carImages = [
    car.front_view_image_url,
    car.rear_view_image_url,
    car.left_side_image_url,
    car.right_side_image_url,
  ].filter(Boolean);

  const displayImage = carImages.length > 0 ? carImages[0] : "/api/placeholder/400/320";

  // Format ownership display
  const getOwnershipText = (count) => {
    if (!count) return "";
    if (count === 1) return "1st Owner";
    if (count === 2) return "2nd Owner";
    if (count === 3) return "3rd Owner";
    return `${count}th Owner`;
  };

  // Handle card click
  const handleCardClick = (e) => {
    e.preventDefault();
    
    // Store the car data in localStorage with pricing information
    const carWithPricing = {
      ...car,
      calculatedPricing: pricing,
      formattedDistance: distance,
      formattedFeatures: features
    };
    
    localStorage.setItem("selectedCarData", JSON.stringify(carWithPricing));
    
    // Navigate to the car detail page
    navigate(`/car-detail/${car.id}`);
  };

  return (
    <div className="block w-full md:w-1/2 lg:w-1/2 p-3">
      <div 
        onClick={handleCardClick}
        className="bg-white border border-gray-200 rounded-lg overflow-hidden h-full flex flex-col shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
      >
        {/* Car Image */}
        <div className="relative h-56 bg-gray-100">
          <img
            src={displayImage}
            alt={`${car.company_name} ${car.model_name}`}
            className="w-full h-full object-contain"
            loading="lazy"
          />
          
          {/* Image counter */}
          {carImages.length > 1 && (
            <div className="absolute bottom-3 right-3 bg-black bg-opacity-75 text-white text-xs font-medium px-2 py-1 rounded">
              1/{carImages.length}
            </div>
          )}
          
          {/* Price tag */}
          <div className="absolute top-3 right-3">
            <div className="bg-white text-black text-sm font-bold px-3 py-1 rounded shadow">
              ₹{Math.round(car.price_per_hour)}/hr
            </div>
          </div>
        </div>

        {/* Car Info */}
        <div className="flex-1 p-5">
          <div className="flex justify-between items-start mb-3">
            {/* Car name and year */}
            <div>
              <h3 className="text-base font-bold text-gray-900">
                {car.company_name} {car.model_name}
              </h3>
              <p className="text-sm text-gray-600 font-medium">{car.manufacture_year}</p>
            </div>
            
            {/* Rating */}
            <div className="flex items-center bg-gray-100 px-2 py-1 rounded">
              <Star className="h-3 w-3 text-black mr-1" />
              <span className="text-xs font-bold">{car.car_rating?.toFixed(1) || "-"}</span>
              <span className="text-xs text-gray-500 ml-1">
                ({car.no_of_car_rating || 0})
              </span>
            </div>
          </div>
          
          {/* Car specs */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-black text-white text-xs px-3 py-1 rounded-full">
              {car.fuel_type.toUpperCase()}
            </span>
            {/* Added car_type */}
            {car.car_type && (
              <span className="bg-black text-white text-xs px-3 py-1 rounded-full">
                {car.car_type.toUpperCase()}
              </span>
            )}
            {/* Added transmission_type */}
            {car.transmission_type && (
              <span className="bg-black text-white text-xs px-3 py-1 rounded-full">
                {car.transmission_type.toUpperCase()}
              </span>
            )}
            {car.ownership_count && (
              <span className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full">
                {getOwnershipText(car.ownership_count)}
              </span>
            )}
          </div>

          {/* Location and distance */}
          <div className="flex items-center mb-4 text-gray-700">
            <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
            <div>
              <div className="text-sm">{car.location}</div>
              <div className="text-xs font-medium text-gray-500">{distance}</div>
            </div>
          </div>
          
          {/* Features */}
          {features.length > 0 && (
            <div className="mb-4">
              <h4 className="text-xs uppercase text-gray-500 font-bold mb-2">Features</h4>
              <div className="flex flex-wrap gap-2">
                {features.slice(0, 3).map((feature, index) => (
                  <span
                    key={index}
                    className="border border-gray-200 text-gray-700 text-xs px-2 py-1 rounded"
                  >
                    {feature}
                  </span>
                ))}
                {features.length > 3 && (
                  <span className="text-xs text-gray-500 px-1">
                    +{features.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Price section */}
        <div className="bg-gray-50 p-4 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <div className="text-xs text-gray-500">
              For {pricing.hoursDiff} {pricing.hoursDiff === 1 ? 'hour' : 'hours'}
            </div>
            <div className="text-right">
              <div className="font-bold text-lg">₹{pricing.total}</div>
              <div className="text-xs text-gray-500">Total incl. taxes</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CarCard;