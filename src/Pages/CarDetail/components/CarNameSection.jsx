import { Star, Heart } from "lucide-react";

export default function CarNameSection({ car }) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div>
        <h1 className="text-3xl font-bold">
          {car.name} {car.year}
        </h1>
        <div className="flex items-center mt-2 text-sm">
          <span className="bg-gray-200 px-2 py-1 rounded mr-2">
            {car.transmission}
          </span>
          <span className="bg-gray-200 px-2 py-1 rounded mr-2">{car.fuel}</span>
          <span className="bg-gray-200 px-2 py-1 rounded mr-2">
            {car.seats} Seats
          </span>
          <div className="flex items-center ml-2">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            <span className="ml-1 font-medium">{car.rating}</span>
            <span className="text-gray-500 ml-1">
              ({car.reviewCount} Reviews)
            </span>
          </div>
        </div>
      </div>
      <button className="text-black hover:text-gray-600">
        <Heart className="h-6 w-6" />
      </button>
    </div>
  );
}
