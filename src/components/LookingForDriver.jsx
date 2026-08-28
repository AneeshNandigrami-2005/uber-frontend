import React from "react";

import carImg from "../assets/suzuki.png";
import bikeImg from "../assets/bike.png";
import autoImg from "../assets/auto.png";

const LookingForDriver = ({
  setVehicleFound,
  pickupLocation,
  destinationLocation,
  fare,
  selectedVehicle,
}) => {

  // Centralized local image and data mapping 
  const vehicleData = {
    car: {
      name: "UberGo",
      image: carImg,
      fare: fare?.car || 0,
    },
    bike: {
      name: "UberMoto",
      image: bikeImg,
      fare: fare?.bike || 0,
    },
    toto: {
      name: "UberToto",
      image: autoImg,
      fare: fare?.toto || 0,
    },
  };

  // Safe fallback wrapper: If selectedVehicle is missing, default back to 'car'
  const currentVehicle = vehicleData[selectedVehicle] || vehicleData.car;

  return (
    <div className="bg-white rounded-t-3xl p-5 shadow-2xl relative w-full flex flex-col items-center border-t border-gray-100">

      {/* TOP DRAG BAR */}
      <div className="flex justify-center mb-2">
        <div className="w-12 h-1 bg-gray-200 rounded-full"></div>
      </div>

      {/* HEADER SECTION WITH BACK BUTTON */}
      <div className="flex items-center justify-between w-full mb-2">
        <button
          onClick={() => setVehicleFound(false)} // Closes panel to return to home/map screen
          className="text-xl p-1.5 hover:bg-gray-100 rounded-full transition-all text-neutral-700"
        >
          <i className="ri-arrow-left-line"></i>
        </button>

        <h2 className="text-lg font-bold text-neutral-800 tracking-tight flex-1 text-center mr-8">
          Finding your driver...
        </h2>
      </div>
      
      
      {/* DYNAMIC VEHICLE PHOTO CONTAINER */}
      <div className="w-full flex justify-center py-4 relative">
        
        {/* PULSE RADAR BACKGROUND EFFECT */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-36 h-36 bg-neutral-900 rounded-full animate-ping opacity-5"></div>
        </div>

        {/* Dynamic Photo Delivery */}
        <img
          className="h-24 w-36 object-contain relative z-10"
          src={currentVehicle.image} 
          alt={currentVehicle.name}
        />
      </div>

      {/* SELECTION LABELS */}
      <h3 className="text-base font-bold text-neutral-900">
        {currentVehicle.name}
      </h3>
      <p className="text-neutral-400 text-[10px] uppercase font-bold tracking-wider mt-0.5">
        Requesting Ride
      </p>

      {/* LOCATION & FARE DETAILS */}
      <div className="w-full space-y-3.5 my-3 border-t pt-4">

        {/* PICKUP ADDRESS */}
        <div className="flex items-start gap-4 border-b pb-3">
          <i className="ri-map-pin-user-fill text-lg text-neutral-900 mt-0.5"></i>
          <div>
            <p className="text-[11px] text-neutral-400 font-medium uppercase tracking-wider">Pickup</p>
            <h4 className="text-sm font-semibold text-neutral-800 mt-0.5 leading-tight">
              {pickupLocation || "Current Location"}
            </h4>
          </div>
        </div>

        {/* DESTINATION ADDRESS */}
        <div className="flex items-start gap-4 border-b pb-3">
          <i className="ri-map-pin-2-fill text-lg text-red-500 mt-0.5"></i>
          <div>
            <p className="text-[11px] text-neutral-400 font-medium uppercase tracking-wider">Destination</p>
            <h4 className="text-sm font-semibold text-neutral-800 mt-0.5 leading-tight">
              {destinationLocation}
            </h4>
          </div>
        </div>

        {/* FARE VALUE */}
        <div className="flex items-center gap-4 py-1">
          <i className="ri-currency-line text-lg text-neutral-900"></i>
          <div>
            <p className="text-[11px] text-neutral-400 font-medium uppercase tracking-wider">Total Fare</p>
            <h4 className="text-xl font-extrabold text-neutral-900 tracking-tight mt-0.5">
              ₹{currentVehicle.fare}
            </h4>
          </div>
        </div>

      </div>

      {/* SYSTEM ANIMATION PROGRESS BAR */}
      <div className="w-full h-1 bg-neutral-100 rounded-full mt-4 overflow-hidden">
        <div className="h-full bg-neutral-900 w-2/3 rounded-full animate-pulse"></div>
      </div>

    </div>
  );
};

export default LookingForDriver;