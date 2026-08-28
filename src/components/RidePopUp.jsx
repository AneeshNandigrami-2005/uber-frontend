import React from "react";
import { toast } from "react-toastify";

const RidePopUp = ({ ride, onAccept, onReject }) => {

  // ================= ACCEPT RIDE =================
  const handleAcceptClick = async () => {
    try {
      if (!ride?._id) {
        toast.error("Ride ID missing");
        return;
      }

      console.log("✅ Accepting ride (delegated):", ride._id);

      if (typeof onAccept === "function") {
        await onAccept(ride);
      }

    } catch (err) {
      const errorMsg = err?.response?.data?.message || err?.message || String(err);
      toast.error(`❌ ${errorMsg}`);
      console.log("Accept ride error:", err);
    }
  };

  // ================= REJECT =================
  const handleIgnoreClick = () => {
    console.log("Ignoring ride...");
    if (typeof onReject === "function") {
      onReject();
    }
  };

  // ================= SAFE DATA =================
  const riderName = ride?.user?.fullname
    ? typeof ride.user.fullname === "string"
      ? ride.user.fullname
      : `${ride.user.fullname.firstname || ""} ${
          ride.user.fullname.lastname || ""
        }`.trim()
    : "New Rider";

  const rideDistance = ride?.distance
    ? `${Number(ride.distance).toFixed(1)} km`
    : "N/A";

  const pickupLocation = ride?.pickup || "Pickup location";
  const dropoffLocation = ride?.destination || "Destination location";

  const rideFare =
    ride?.fare != null
      ? `₹${Number(ride.fare).toFixed(2)}`
      : "₹0.00";

  const vehicleType = ride?.vehicleType || "Vehicle";

  const rideStatus = ride?.status || "pending";

  const requestTime = ride?.createdAt
    ? new Date(ride.createdAt).toLocaleString()
    : "Now";

  return (
    <div className="w-full bg-white rounded-t-3xl">

      {/* CLOSE BUTTON */}
      <div
        className="flex justify-center py-2 cursor-pointer"
        onClick={handleIgnoreClick}
      >
        <i className="ri-arrow-down-wide-line text-3xl text-gray-400"></i>
      </div>

      <div className="px-5 pb-5">

        <h3 className="text-2xl font-bold text-center mb-5">
          New Ride Request
        </h3>

        {/* STATUS + DISTANCE */}
        <div className="mt-3 flex justify-between">
          <span className="font-medium capitalize">{rideStatus}</span>
          <span className="font-bold">{rideDistance}</span>
        </div>

        {/* PICKUP */}
        <div className="flex items-start gap-4 border-b py-4">
          <i className="ri-map-pin-user-fill text-xl"></i>
          <div>
            <h4 className="font-semibold">Pickup</h4>
            <p className="text-sm text-gray-600">{pickupLocation}</p>
          </div>
        </div>

        {/* DESTINATION */}
        <div className="flex items-start gap-4 border-b py-4">
          <i className="ri-map-pin-2-fill text-xl"></i>
          <div>
            <h4 className="font-semibold">Destination</h4>
            <p className="text-sm text-gray-600">{dropoffLocation}</p>
          </div>
        </div>

        {/* FARE */}
        <div className="flex items-start gap-4 border-b py-4">
          <i className="ri-money-rupee-circle-line text-xl"></i>
          <div>
            <h4 className="font-semibold">{rideFare}</h4>
            <p className="text-sm text-gray-600">{vehicleType}</p>
          </div>
        </div>

        {/* TIME */}
        <div className="flex items-start gap-4 py-4">
          <i className="ri-time-line text-xl"></i>
          <div>
            <h4 className="font-semibold">Requested At</h4>
            <p className="text-sm text-gray-600">{requestTime}</p>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex gap-3 mt-5">

          <button
            onClick={handleAcceptClick}
            className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Accept Ride
          </button>

          <button
            onClick={handleIgnoreClick}
            className="flex-1 bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition"
          >
            Ignore
          </button>

        </div>

      </div>
    </div>
  );
};

export default RidePopUp;