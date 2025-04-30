import React from "react";
import { Shield, ThumbsUp, Coins, Clock, Star, Phone } from "lucide-react";

export default function WhyChooseUs() {
  return (
    <section
      id="why-choose-us"
      className="font-monda py-24 px-6 bg-gradient-to-b from-gray-100 to-white"
    >
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center mb-4">
          Why Choose CarZy
        </h2>
        <p className="text-center text-xl text-gray-600 mb-16 max-w-lg mx-auto">
          We take pride in offering a premium car rental experience with
          benefits that set us apart from the competition.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Benefit 1 */}
          <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100 transition-transform hover:scale-105">
            <div className="mb-6 bg-blue-50 p-4 rounded-full inline-block">
              <Shield size={30} className="text-black" />
            </div>
            <h3 className="font-bold text-2xl mb-3">Safety Guaranteed</h3>
            <p className="text-gray-600">
              All our vehicles undergo rigorous safety inspections and are
              regularly maintained to ensure your journey is safe and
              trouble-free.
            </p>
          </div>

          {/* Benefit 2 */}
          <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100 transition-transform hover:scale-105">
            <div className="mb-6 bg-blue-50 p-4 rounded-full inline-block">
              <Coins size={30} className="text-black" />
            </div>
            <h3 className="font-bold text-2xl mb-3">Transparent Pricing</h3>
            <p className="text-gray-600">
              No hidden fees or surprise charges. Our competitive rates include
              everything you need for a worry-free rental experience.
            </p>
          </div>

          {/* Benefit 3 */}
          <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100 transition-transform hover:scale-105">
            <div className="mb-6 bg-blue-50 p-4 rounded-full inline-block">
              <Clock size={30} className="text-black" />
            </div>
            <h3 className="font-bold text-2xl mb-3">24/7 Availability</h3>
            <p className="text-gray-600">
              Whether you need a car at midnight or early morning, our service
              is available around the clock to accommodate your schedule.
            </p>
          </div>

          {/* Benefit 4 */}
          <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100 transition-transform hover:scale-105">
            <div className="mb-6 bg-blue-50 p-4 rounded-full inline-block">
              <ThumbsUp size={30} className="text-black" />
            </div>
            <h3 className="font-bold text-2xl mb-3">Premium Vehicles</h3>
            <p className="text-gray-600">
              Drive in style with our diverse fleet of well-maintained, modern
              vehicles ranging from economy to luxury options.
            </p>
          </div>

          {/* Benefit 5 */}
          <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100 transition-transform hover:scale-105">
            <div className="mb-6 bg-blue-50 p-4 rounded-full inline-block">
              <Star size={30} className="text-black" />
            </div>
            <h3 className="font-bold text-2xl mb-3">Exceptional Service</h3>
            <p className="text-gray-600">
              Our dedicated team is committed to providing a seamless rental
              experience with personalized attention to your needs.
            </p>
          </div>

          {/* Benefit 6 */}
          <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100 transition-transform hover:scale-105">
            <div className="mb-6 bg-blue-50 p-4 rounded-full inline-block">
              <Phone size={30} className="text-black" />
            </div>
            <h3 className="font-bold text-2xl mb-3">Dedicated Support</h3>
            <p className="text-gray-600">
              Customer satisfaction is our priority. Our support team is always
              ready to assist you throughout your rental journey.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
