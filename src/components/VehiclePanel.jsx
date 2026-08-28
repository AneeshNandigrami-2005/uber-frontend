import React from "react";

import carImg from "../assets/suzuki.png";
import bikeImg from "../assets/bike.png";
import autoImg from "../assets/auto.png";

const VehiclePanel = ({
  fare,
  selectedVehicle,
  setSelectedVehicle,
  setVehiclePanel,
  setConfirmRidePanel,
}) => {

  const vehicles = [
    {
      id: "car",
      name: "UberGo",
      image: carImg,
      price: fare?.car || 0,
      capacity: 4,
      
      time: "2 mins away",
    },
    {
      id: "bike",
      name: "UberMoto",
      image: bikeImg,
      price: fare?.bike || 0,
      capacity: 1,
      
      time: "3 mins away",
    },
    {
      id: "toto",
      name: "UberToto",
      image: autoImg,
      price: fare?.toto || 0,
      capacity: 5,
      
      time: "1 min away",
    },
  ];

  return (
    <div className="bg-white rounded-t-3xl p-5 shadow-2xl relative w-full border-t border-gray-100">

      {/* TOP DRAG BAR */}
      <div className="flex justify-center mb-2">
        <div className="w-12 h-1 bg-gray-200 rounded-full"></div>
      </div>

      {/* HEADER PANEL */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setVehiclePanel(false)}
          className="text-xl p-1.5 hover:bg-gray-100 rounded-full transition-all text-neutral-700"
        >
          <i className="ri-arrow-left-line"></i>
        </button>

        <h2 className="text-lg font-bold text-nowrap tracking-tight flex-1 text-center mr-8">
          Choose a ride
        </h2>
      </div>

      {/* VEHICLE INTERACTIVE LIST */}
      <div className="space-y-2.5">
        {vehicles.map((vehicle) => {
          const isSelected = selectedVehicle === vehicle.id;
          return (
            <div
              key={vehicle.id}
              onClick={() => setSelectedVehicle(vehicle.id)}
              className={`flex items-center justify-between border rounded-2xl p-3.5 cursor-pointer transition-all duration-200 ${
                isSelected
                  ? "border-black bg-neutral-50 scale-[1.01] shadow-sm"
                  : "border-gray-100 hover:border-gray-300 bg-white"
              }`}
            >
              {/* LEFT GROUP: PHOTO AND DESCRIPTION */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-12 flex items-center justify-center bg-transparent">
                  <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-neutral-900">
                      {vehicle.name}
                    </h3>
                    <span className="flex items-center gap-0.5 text-xs font-semibold text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded-md">
                      <i className="ri-user-fill text-[10px]"></i>
                      {vehicle.capacity}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-400 mt-0.5 font-medium line-clamp-1">
                    {vehicle.desc}
                  </p>

                  <p className="text-xs font-bold text-red-600 mt-1 flex items-center gap-1">
                    <i className="ri-map-pin-time-fill"></i>
                    {vehicle.time}
                  </p>
                </div>
              </div>

              {/* RIGHT GROUP: FARE PRICE */}
              <div className="text-right pl-2">
                <span className="text-pretty font-extrabold text-neutral-900 tracking-tight">
                  ₹{vehicle.price}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* CONFIRMATION SUBMIT BUTTON */}
      <button
        disabled={!selectedVehicle}
        onClick={() => {
          setVehiclePanel(false);
          setConfirmRidePanel(true);
        }}
        className="w-full bg-green-800   text-white py-3.5 rounded-xl font-semibold text-base mt-5 active:scale-[0.99] transition-all disabled:opacity-40 shadow-md shadow-neutral-200"
      >
        Confirm Ride Selection
      </button>

    </div>
  );
};

export default VehiclePanel;