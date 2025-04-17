export default function FilterSidebar({
  showFilters,
  activeFilters,
  resetFilters,
  filterOptions,
  toggleFilter,
  handleSliderChange,
}) {
  return (
    <div
      className={`${
        showFilters ? "block" : "hidden"
      } md:block w-full md:w-64 lg:w-72 bg-white rounded-lg shadow-md p-4 h-fit sticky top-36`}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Filters</h2>
        <button
          className="text-sm text-gray-500 hover:text-black"
          onClick={resetFilters}
        >
          Clear All
        </button>
      </div>

      {/* Distance filter */}
      <div className="mb-6">
        <h3 className="font-medium mb-2">Distance from me</h3>
        <input
          type="range"
          min="1"
          max="50"
          value={activeFilters.distance}
          onChange={(e) =>
            handleSliderChange("distance", parseInt(e.target.value))
          }
          className="w-full"
        />
        <div className="flex justify-between text-sm text-gray-600">
          <span>1 km</span>
          <span>{activeFilters.distance} km</span>
          <span>50 km</span>
        </div>
      </div>

      {/* Car Type filter */}
      <div className="mb-6">
        <h3 className="font-medium mb-2">Car Type</h3>
        <div className="space-y-2">
          {filterOptions.carType.map((type) => (
            <label
              key={type}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={activeFilters.carType.includes(type)}
                onChange={() => toggleFilter("carType", type)}
                className="rounded text-black"
              />
              <span>{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Transmission filter */}
      <div className="mb-6">
        <h3 className="font-medium mb-2">Transmission</h3>
        <div className="space-y-2">
          {filterOptions.transmission.map((type) => (
            <label
              key={type}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={activeFilters.transmission.includes(type)}
                onChange={() => toggleFilter("transmission", type)}
                className="rounded text-black"
              />
              <span>{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Fuel Type filter */}
      <div className="mb-6">
        <h3 className="font-medium mb-2">Fuel Type</h3>
        <div className="space-y-2">
          {filterOptions.fuelType.map((type) => (
            <label
              key={type}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={activeFilters.fuelType.includes(type)}
                onChange={() => toggleFilter("fuelType", type)}
                className="rounded text-black"
              />
              <span>{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Seats filter */}
      <div className="mb-6">
        <h3 className="font-medium mb-2">Seats</h3>
        <div className="space-y-2">
          {filterOptions.seats.map((count) => (
            <label
              key={count}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={activeFilters.seats.includes(count)}
                onChange={() => toggleFilter("seats", count)}
                className="rounded text-black"
              />
              <span>{count} Seats</span>
            </label>
          ))}
        </div>
      </div>

      {/* User Ratings filter */}
      <div className="mb-6">
        <h3 className="font-medium mb-2">User Ratings</h3>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <label
              key={rating}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <input
                type="radio"
                checked={activeFilters.ratings === rating}
                onChange={() => toggleFilter("ratings", rating)}
                className="text-black"
              />
              <span>{rating}+ ★</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range filter */}
      <div className="mb-6">
        <h3 className="font-medium mb-2">Price Range</h3>
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>₹{activeFilters.price.min}</span>
          <span>₹{activeFilters.price.max}</span>
        </div>
        <input
          type="range"
          min="0"
          max="10000"
          step="500"
          value={activeFilters.price.max}
          onChange={(e) =>
            handleSliderChange("price", {
              ...activeFilters.price,
              max: parseInt(e.target.value),
            })
          }
          className="w-full"
        />
      </div>

      {/* Add-ons filter */}
      <div className="mb-2">
        <h3 className="font-medium mb-2">Add-ons</h3>
        <div className="space-y-2">
          {filterOptions.addOns.map((addon) => (
            <label
              key={addon}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={activeFilters.addOns.includes(addon)}
                onChange={() => toggleFilter("addOns", addon)}
                className="rounded text-black"
              />
              <span>{addon}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
