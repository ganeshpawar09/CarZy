import React from "react";
import { MapPin, Calendar, Car, Check } from "lucide-react";

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="font-monda py-24 px-6 bg-gradient-to-b from-white to-gray-100 "
    >
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center mb-4">
          Simple and easy steps to rent
        </h2>
        <p className="text-center text-xl text-gray-600 mb-16 max-w-lg mx-auto">
          A few simple steps separate you from your upcoming journey. See how
          easy it is to rent a car.
        </p>

        <div className="relative">
          {/* Dotted Path Line - visible only on desktop */}
          <div className="hidden md:block absolute top-40 left-0 right-0">
            <svg viewBox="0 0 1000 50" className="w-full">
              <path
                d="M0,25 L1000,25"
                stroke="#ddd"
                strokeWidth="4"
                strokeDasharray="6 6"
                fill="none"
              />

              {/* Path dots at specific locations */}
              <circle cx="105" cy="25" r="8" fill="#fffff" />
              <circle cx="375" cy="25" r="8" fill="#fffff" />
              <circle cx="625" cy="25" r="8" fill="#fffff" />
              <circle cx="890" cy="25" r="8" fill="#fffff" />
            </svg>
          </div>

          {/* Steps Container */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 bg-blue-50 p-4 rounded-full">
                <MapPin size={24} className="text-black" />
              </div>
              <h3 className="font-bold text-xl">Choose a location</h3>
              <p className="text-gray-600 text-x">
                Select the pickup location of the car.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 bg-blue-50 p-4 rounded-full">
                <Calendar size={24} className="text-black" />
              </div>
              <h3 className="font-bold text-xl">Select a date</h3>
              <p className="text-gray-600 text-x">
                Select the date you need the car.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 bg-blue-50 p-4 rounded-full">
                <Car size={24} className="text-black" />
              </div>
              <h3 className="font-bold text-xl">Find the right car</h3>
              <p className="text-gray-600 text-x">
                Choose the perfect car for your needs.
              </p>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 bg-blue-50 p-4 rounded-full">
                <Check size={24} className="text-black" />
              </div>
              <h3 className="font-bold text-xl">Book a car</h3>
              <p className="text-gray-600 text-x">
                Ready! Now you can enjoy your trip.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
