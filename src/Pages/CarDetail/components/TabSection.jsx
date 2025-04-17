import { useState } from "react";
import { MapPin, Star, Check, X, Calendar } from "lucide-react";

export default function TabSection({ car }) {
  const [activeTab, setActiveTab] = useState("location");

  return (
    <>
      {/* Tabs */}
      <div className="border-b mb-6">
        <div className="flex space-x-8">
          {[
            "location",
            "reviews",
            "features",
            "benefits",
            "cancellation",
            "faqs",
            "agreement",
          ].map((tab) => (
            <button
              key={tab}
              className={`py-2 px-1 font-medium capitalize ${
                activeTab === tab
                  ? "text-black border-b-2 border-black"
                  : "text-gray-500 hover:text-black"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mb-8">
        {activeTab === "location" && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Car Location</h3>
            <div className="flex items-start mb-4">
              <MapPin className="h-5 w-5 text-gray-500 mr-2 mt-1 flex-shrink-0" />
              <p className="text-gray-700">{car.location.address}</p>
            </div>
            <div className="bg-gray-200 h-64 rounded-lg mb-4">
              {/* Map would go here in a real implementation */}
              <div className="flex items-center justify-center h-full text-gray-500">
                Map View (Google Maps integration would be here)
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">
                <span className="font-semibold">{car.distance} Kms</span> Away
                from you
              </span>
              <button className="text-blue-600 hover:text-blue-800 font-medium">
                Get Directions
              </button>
            </div>
          </div>
        )}

        {activeTab === "reviews" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Reviews</h3>
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                <span className="ml-1 font-semibold text-lg">{car.rating}</span>
                <span className="text-gray-500 ml-1">
                  ({car.reviewCount} Reviews)
                </span>
              </div>
            </div>

            {car.reviewCount > 0 ? (
              <div className="space-y-6">
                {/* Sample review, would be mapped from actual reviews in real implementation */}
                <div className="border-b pb-6">
                  <div className="flex items-center mb-3">
                    <img
                      src="/api/placeholder/48/48"
                      alt="User"
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <div className="font-medium">Vikram Mehta</div>
                      <div className="text-sm text-gray-500">April 2025</div>
                    </div>
                  </div>
                  <div className="flex mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 text-yellow-400 fill-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-gray-700">
                    Great car! Very well maintained and comfortable for long
                    drives. The pickup and delivery process was smooth, and the
                    staff was professional. Would definitely rent this car
                    again.
                  </p>
                </div>

                <button className="font-medium text-black border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-50">
                  View All Reviews
                </button>
              </div>
            ) : (
              <div className="text-gray-500 text-center py-8">
                No reviews yet for this car.
              </div>
            )}
          </div>
        )}

        {activeTab === "features" && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {car.features.map((feature, index) => (
                <div key={index} className="flex items-center">
                  {feature.available ? (
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                  ) : (
                    <X className="h-5 w-5 text-red-500 mr-2" />
                  )}
                  <span
                    className={
                      feature.available ? "text-gray-800" : "text-gray-400"
                    }
                  >
                    {feature.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "benefits" && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Benefits</h3>
            <div className="space-y-3">
              {car.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-gray-800">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "cancellation" && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Cancellation Policy</h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                      Cancellation Time
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                      Fee
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {car.cancellationPolicy.map((policy, index) => (
                    <tr key={index}>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {policy.time}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {policy.fee}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              Note: Cancellation request must be made through the app or
              website. Refunds will be processed in 5-7 business days.
            </p>
          </div>
        )}

        {activeTab === "faqs" && (
          <div>
            <h3 className="text-xl font-semibold mb-4">
              Frequently Asked Questions
            </h3>
            <div className="space-y-4">
              {car.faqs.map((faq, index) => (
                <div key={index} className="border-b pb-4">
                  <h4 className="font-medium mb-2">{faq.question}</h4>
                  <p className="text-gray-700">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "agreement" && (
          <div>
            <h3 className="text-xl font-semibold mb-4">
              Rental Agreement Highlights
            </h3>
            <div className="bg-gray-50 p-6 rounded-lg border">
              <p className="text-sm text-gray-500 mb-4">
                By proceeding with the booking, you agree to the following terms
                and conditions:
              </p>
              <ul className="space-y-3">
                {car.agreementHighlights.map((highlight, index) => (
                  <li key={index} className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-black text-white flex items-center justify-center text-xs mt-0.5 mr-2">
                      {index + 1}
                    </div>
                    <span className="text-gray-800">{highlight}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <button className="text-blue-600 hover:text-blue-800 font-medium">
                  View Full Agreement
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
