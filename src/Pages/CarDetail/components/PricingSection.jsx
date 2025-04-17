import { Calendar, MapPin } from "lucide-react";

export default function PricingSection({ car }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    })
      .format(price)
      .replace("₹", "₹ ");
  };

  return (
    <div className="sticky top-24">
      <div className="bg-white border rounded-lg p-6 shadow-md mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold">{formatPrice(car.price)}</h3>
          <span className="text-sm text-gray-500">Total Price</span>
        </div>

        <div className="border-t border-b py-4 my-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-gray-500 mr-2" />
              <span className="text-gray-700">
                12 Apr'25, 5PM - 12 Apr'25, 9PM
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-gray-500 mr-2" />
              <span className="text-gray-700">Delhi</span>
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Base fare</span>
            <span className="font-medium">{formatPrice(car.baseFare)}</span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-gray-700">Home delivery fee</span>
              <span className="text-sm text-gray-500 ml-2">
                ({car.additionalKmCharge}/KM)
              </span>
            </div>
            <span className="font-medium">+ ₹ Calculated at checkout</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-700">Trip Protection Fee</span>
            <span className="font-medium">
              {formatPrice(car.tripProtectionFee)}
            </span>
          </div>
        </div>

        <div className="border-t pt-4 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <span className="font-semibold">Total</span>
              <div className="text-xs text-gray-500">Inclusive of taxes</div>
            </div>
            <span className="font-bold text-xl">{formatPrice(car.price)}</span>
          </div>
        </div>

        <button className="w-full bg-black text-white rounded-md py-3 font-medium hover:bg-gray-800 transition duration-300 mb-3">
          Proceed to Pay
        </button>
      </div>
    </div>
  );
}
