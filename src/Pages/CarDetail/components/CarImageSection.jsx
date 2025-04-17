import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CarImageSection({ images, carName }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const handleNextImage = () => {
    setActiveImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrevImage = () => {
    setActiveImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <>
      {/* Car Images */}
      <div className="relative mb-8 rounded-lg overflow-hidden h-96 bg-gray-100">
        <img
          src={images[activeImageIndex]}
          alt={`${carName} ${activeImageIndex + 1}`}
          className="w-full h-full object-cover"
        />

        <button
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
          onClick={handlePrevImage}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <button
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
          onClick={handleNextImage}
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === activeImageIndex ? "bg-white" : "bg-gray-300"
              }`}
              onClick={() => setActiveImageIndex(index)}
            />
          ))}
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex space-x-2 mb-8 overflow-x-auto pb-2">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`${carName} thumbnail ${index + 1}`}
            className={`h-20 w-28 object-cover rounded cursor-pointer ${
              index === activeImageIndex
                ? "border-2 border-black"
                : "opacity-70"
            }`}
            onClick={() => setActiveImageIndex(index)}
          />
        ))}
      </div>
    </>
  );
}
