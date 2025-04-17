import { ArrowLeft } from "lucide-react";
import car from "./Car";
import Navbar from "../Cars/Navbar";
import CarImageSection from "./components/CarImageSection";
import CarNameSection from "./components/CarNameSection";
import TabSection from "./components/TabSection";
import PricingSection from "./components/PricingSection";

export default function CarDetails() {
  return (
    <div className="font-monda container mx-auto px-4 py-8 pt-20">
      <Navbar />
      {/* Back Button */}
      <div className="h-11 px-4 lg:px-6 max-w-50 border border-black rounded-lg bg-white  hover:bg-black hover:text-white transition-colors text-sm lg:text-base flex items-center whitespace-nowrap">
        <button
          onClick={() => window.history.back()}
          className="flex items-center text-black hover:text-white transition-colors"
        >
          <ArrowLeft size={16} className="mr-2" />
          <span>Back to listings</span>
        </button>
      </div>

      <div className="pt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CarNameSection car={car} />
          <CarImageSection images={car.images} carName={car.name} />
          <TabSection car={car} />
        </div>

        {/* Right Column - Booking */}
        <div className="lg:col-span-1">
          <PricingSection car={car} />
        </div>
      </div>
    </div>
  );
}
