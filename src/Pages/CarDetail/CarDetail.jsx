import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "../Cars/NavBar";
import CarImageSection from "./components/CarImageSection";
import CarNameSection from "./components/CarNameSection";
import TabSection from "./components/TabSection";
import PricingSection from "./components/PricingSection";

export default function CarDetails() {
  const { id } = useParams(); // Get the car ID from URL parameters
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState({
    start: new Date(),
    end: new Date(new Date().getTime() + 4 * 60 * 60 * 1000) // 4 hours later by default
  });

  useEffect(() => {
    // Try to get car data from localStorage first (set when clicking from CarCard)
    const storedCarData = localStorage.getItem("selectedCarData");
    if (storedCarData) {
      try {

        const parsedData = JSON.parse(storedCarData);
        // If the stored car ID matches the requested one, use it
        if (parsedData.id.toString() === id) {
          // Process and enrich car data
          const processedCar = processCarData(parsedData);
          setCar(processedCar);
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error("Error parsing stored car data", error);
      }
    }

    // If we don't have the car data in localStorage or the ID doesn't match,
    // we would normally fetch it from the API here
    // For this example, let's simulate an API call
    setLoading(true);

    // Simulate API fetch (replace this with your actual API call)
    setTimeout(() => {
      // This would be your API fetch logic
      // fetchCarById(id).then(data => {
      //   const processedCar = processCarData(data);
      //   setCar(processedCar);
      //   setLoading(false);
      // });

      // For now, just set a loading state
      setLoading(false);
    }, 500);
  }, [id]);

  // Process and enrich car data with required format and additional info
  const processCarData = (rawCarData) => {
    // Format features if they're coming as a string
    const features = typeof rawCarData.features === 'string'
      ? rawCarData.features.split(',').map(f => ({ name: f.trim(), available: true }))
      : Array.isArray(rawCarData.features)
        ? rawCarData.features
        : [];

    // Calculate base hours for pricing (default to 4 hours)
    const hours = 4;
    const basePrice = rawCarData.price_per_hour * hours;
    const tripProtectionFee = Math.round(basePrice * 0.05); // Assuming 5% of base price
    const totalPrice = basePrice + tripProtectionFee;

    // Format location object
    const location = typeof rawCarData.location === 'string'
      ? { address: rawCarData.location, latitude: rawCarData.latitude, longitude: rawCarData.longitude }
      : rawCarData.location;


    // Prepare images array from various image URLs or use placeholders
    const images = [
      rawCarData.front_view_image_url,
      rawCarData.diagonal_front_left_image_url,
      rawCarData.rear_view_image_url,
      rawCarData.left_side_image_url,
      rawCarData.right_side_image_url,
    ].filter(Boolean);

    // Final processed car data
    return {
      ...rawCarData,
      features,
      images,
      location,
      // Pricing info
      baseFare: basePrice,
      tripProtectionFee,
      price: totalPrice,
      additionalKmCharge: 12,
      // UI-friendly names
      name: `${rawCarData.company_name} ${rawCarData.model_name}`,
      fuel: rawCarData.fuel_type,
      seats: rawCarData.seats || 5,
      year: rawCarData.manufacture_year,
      rating: rawCarData.car_rating,
      reviewCount: rawCarData.no_of_car_rating,
      transmission: rawCarData.transmission || 'Manual'
    };
  };

  const handleDateChange = (newDates) => {
    setSelectedDate(newDates);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 pt-20">
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <div className="text-xl">Loading car details...</div>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="container mx-auto px-4 py-8 pt-20">
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <div className="text-xl">Car not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="font-monda container mx-auto px-4 py-8 pt-20">
      <Navbar />

      {/* Back Button */}
      <button
        onClick={() => window.history.back()}
        className="h-11 px-4 lg:px-6 border border-black rounded-lg bg-white hover:bg-black hover:text-white transition-colors text-sm lg:text-base flex items-center whitespace-nowrap"
      >
        <ArrowLeft size={16} className="mr-2" />
        <span>Back to listings</span>
      </button>

      <div className="pt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CarNameSection car={car} />
          <CarImageSection
            front_view_image_url={car.front_view_image_url}
            rear_view_image_url={car.rear_view_image_url}
            left_side_image_url={car.left_side_image_url}
            right_side_image_url={car.right_side_image_url}
            carName={car.name}
          />
          <TabSection car={car} />
        </div>

        {/* Right Column - Booking */}
        <div className="lg:col-span-1">
          <PricingSection
            car={car}
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
          />
        </div>
      </div>
    </div>
  );
} 