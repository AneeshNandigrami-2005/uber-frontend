import React, { useState } from "react";
import axios from "axios";

import carImg from "../assets/suzuki.png";
import bikeImg from "../assets/bike.png";
import autoImg from "../assets/auto.png";

const ConfirmRide = ({
  pickupLocation,
  destinationLocation,
  fare,
  selectedVehicle,
  setConfirmRidePanel,
  setVehicleFound,
  setVehiclePanel,
}) => {
  const [loading, setLoading] = useState(false);

  const handleConfirmRide = async () => {
    if (!pickupLocation || !destinationLocation) {
      alert("Pickup and destination are required.");
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/create`,
        {
          pickup: pickupLocation,
          destination: destinationLocation,
          vehicleType: selectedVehicle,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setConfirmRidePanel(false);
      setVehiclePanel(false);
      setVehicleFound(true);
    } catch (error) {
      console.error("Create Ride Error:", error.response?.data || error.message);
      alert(
        error.response?.data?.message ||
          "Unable to create ride. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };
  const vehicleData = {
    car: {
      name: "UberGo",
      image: carImg,
      fare: fare?.car || 0,
      rate: 27,
    },
    bike: {
      name: "UberMoto",
      image: bikeImg,
      fare: fare?.bike || 0,
      rate: 12,
    },
    toto: {
      name: "UberToto",
      image: autoImg,
      fare: fare?.toto || 0,
      rate: 18,
    },
  };

  const currentVehicle = vehicleData[selectedVehicle] || vehicleData.car;

  const distance = currentVehicle.rate
    ? (currentVehicle.fare / currentVehicle.rate).toFixed(1)
    : 0;

  return (
    <div className="bg-white rounded-t-3xl p-5">

      {/* HANDLE */}
      <div className="flex justify-center mb-3">
        <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
      </div>

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">

        <button
          onClick={() => {
            setConfirmRidePanel(false);
            setVehiclePanel(true);
          }}
          className="text-2xl p-2"
        >
          <i className="ri-arrow-left-line"></i>
        </button>

        <h2 className="text-2xl font-bold flex-1 text-center">
          Confirm your Ride
        </h2>

      </div>

      {/* VEHICLE */}
      <div className="flex flex-col items-center border-b pb-5">
        <img
          src={currentVehicle.image}
          className="w-40 h-28 object-contain"
        />
        <h3 className="text-3xl font-bold mt-2">
          {currentVehicle.name}
        </h3>
      </div>

      {/* DETAILS */}
      <div className="space-y-5 py-5">

        <div className="flex gap-4 border-b pb-4">
          <i className="ri-map-pin-user-fill text-2xl"></i>
          <div>
            <p className="text-gray-400">Pickup</p>
            <h4 className="font-semibold">{pickupLocation}</h4>
          </div>
        </div>

        <div className="flex gap-4 border-b pb-4">
          <i className="ri-map-pin-2-fill text-2xl text-red-500"></i>
          <div>
            <p className="text-gray-400">Destination</p>
            <h4 className="font-semibold">{destinationLocation}</h4>
          </div>
        </div>

        <div className="flex justify-between border-b pb-4 font-semibold">
          <span>Distance</span>
          <span className="font-bold">{distance} KM</span>
        </div>

        <div className="flex justify-between font-semibold">
          <span>Total Fare</span>
          <span className="text-2xl font-semibold">
            ₹{currentVehicle.fare}
          </span>
        </div>

      </div>

      {/* CONFIRM BUTTON */}
      <button
        onClick={handleConfirmRide}
        disabled={loading}
        className="w-full bg-black text-white py-4 rounded-2xl text-xl font-serif disabled:opacity-50"
      >
        {loading ? "Requesting..." : "Confirm Ride"}
      </button>

    </div>
  );
};

export default ConfirmRide;