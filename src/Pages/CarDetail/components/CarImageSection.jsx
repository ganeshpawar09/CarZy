import { useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

export default function CarImageSection({ images, carName }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

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

  const openLightbox = () => {
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  // Group images by type for easier navigation
  const imageCategories = {
    exterior: ['front_view', 'diagonal_front_left', 'rear_view', 'left_side', 'right_side', 'diagonal_rear_right'],
    interior: ['dashboard', 'front_seats', 'rear_seats', 'boot_space', 'speedometer_fuel_gauge']
  };

  // Get image type from URL or default to 'other'
  const getImageType = (imageUrl) => {
    if (!imageUrl) return 'other';
    
    for (const [category, types] of Object.entries(imageCategories)) {
      for (const type of types) {
        if (imageUrl.includes(type)) {
          return category;
        }
      }
    }
    
    return 'other';
  };
  
  // Organize images by category
  const categorizedImages = images.reduce((acc, imageUrl) => {
    const type = getImageType(imageUrl);
    if (!acc[type]) acc[type] = [];
    acc[type].push(imageUrl);
    return acc;
  }, {});

  return (
    <>
      {/* Main Image Carousel */}
      <div className="relative mb-4 rounded-lg overflow-hidden h-96 bg-gray-100 group">
        <img
          src={images[activeImageIndex]}
          alt={`${carName} ${activeImageIndex + 1}`}
          className="w-full h-full object-cover"
        />

        <button
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100"
          onClick={handlePrevImage}
          aria-label="Previous image"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <button
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100"
          onClick={handleNextImage}
          aria-label="Next image"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        <button
          onClick={openLightbox}
          className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100"
          aria-label="View full size"
        >
          <Maximize2 className="h-4 w-4" />
        </button>

        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index === activeImageIndex 
                  ? "bg-white w-4" 
                  : "bg-white/50 hover:bg-white/80"
              }`}
              onClick={() => setActiveImageIndex(index)}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Image Categories */}
      {Object.keys(categorizedImages).length > 1 && (
        <div className="mb-4 border-b">
          <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
            {Object.keys(categorizedImages).map((category) => (
              <button
                key={category}
                className="py-2 px-1 text-sm font-medium capitalize whitespace-nowrap border-b-2 border-transparent hover:border-gray-300 focus:outline-none"
                onClick={() => {
                  // Set active image to first image of this category
                  const firstImageOfCategory = images.findIndex(img => 
                    getImageType(img) === category);
                  if (firstImageOfCategory >= 0) {
                    setActiveImageIndex(firstImageOfCategory);
                  }
                }}
              >
                {category} ({categorizedImages[category].length})
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Thumbnails */}
      <div className="flex space-x-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`${carName} thumbnail ${index + 1}`}
            className={`h-20 w-28 flex-shrink-0 object-cover rounded cursor-pointer transition-all ${
              index === activeImageIndex
                ? "border-2 border-black"
                : "opacity-70 hover:opacity-100"
            }`}
            onClick={() => setActiveImageIndex(index)}
          />
        ))}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={closeLightbox}>
          <button
            className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full"
            onClick={closeLightbox}
            aria-label="Close lightbox"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="relative max-w-5xl max-h-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <img
              src={images[activeImageIndex]}
              alt={`${carName} full size ${activeImageIndex + 1}`}
              className="w-full h-auto max-h-screen object-contain"
            />
            
            <button
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full p-3"
              onClick={(e) => {
                e.stopPropagation();
                handlePrevImage();
              }}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <button
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full p-3"
              onClick={(e) => {
                e.stopPropagation();
                handleNextImage();
              }}
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
            
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === activeImageIndex 
                      ? "bg-white w-4" 
                      : "bg-white/50 hover:bg-white/80"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIndex(index);
                  }}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}