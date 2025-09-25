import React from "react";

function LocationSearchPanel({
  activeField,
  pickupSuggestions,
  destinationSuggestions,
  setPickup,
  setDestination,
  setVehiclePanel,
  setPanelOpen,
}) {
  const suggestions =
    activeField === "pickup" ? pickupSuggestions : destinationSuggestions;

  const handleSelect = (location) => {
    if (activeField === "pickup") {
      setPickup(location.description);
    } else {
      setDestination(location.description);
    }
  };

  return (
    <div className="px-4 py-3">
      {suggestions.length === 0 && (
        <p className="text-center mt-5 py-4 text-gray-400 text-sm">
          No suggestions found
        </p>
      )}

      <div className="space-y-3">
        {suggestions.map((location, idx) => (
          <div
            key={idx}
            onClick={() => handleSelect(location)}
            className="flex items-start gap-3 p-3 border rounded-xl bg-white mt-4 shadow-sm 
                       hover:shadow-md hover:border-gray-300 active:scale-[0.98] 
                       transition-all duration-200 cursor-pointer"
          >
            {/* Icon */}
            <div
              className={`h-10 w-10 flex items-center justify-center rounded-full flex-shrink-0
                ${activeField === "pickup" ? "bg-green-100" : "bg-blue-100"}`}
            >
              <i
                className={`${
                  activeField === "pickup"
                    ? "ri-map-pin-fill text-green-600"
                    : "ri-flag-fill text-blue-600"
                } text-lg`}
              ></i>
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0"> 
              <h4 className="font-medium text-gray-800 text-sm leading-snug truncate">
                {location.structured_formatting?.main_text ||
                  location.description}
              </h4>
              <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                {location.structured_formatting?.secondary_text ||
                  "Suggested location"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LocationSearchPanel;
