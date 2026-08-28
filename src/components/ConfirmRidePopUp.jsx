import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const ConfirmRidePopUp = ({
  ride,
  setConfirmRidePopupPanel,
  setRidePopupPanel,
  stopRideSound,
  socket,
}) => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ================= RIDER NAME =================
  const riderName = ride?.user?.fullname
    ? typeof ride.user.fullname === "string"
      ? ride.user.fullname
      : `${ride.user.fullname.firstname || ""} ${
          ride.user.fullname.lastname || ""
        }`.trim()
    : "New Rider";

  // ================= RIDE INFO =================
  const rideDistance = ride?.distance
    ? `${Number(ride.distance).toFixed(1)} km`
    : "N/A";

  const pickupLocation = ride?.pickup || "Pickup location";
  const dropoffLocation = ride?.destination || "Destination location";

  const rideFare =
    ride?.fare != null ? `₹${Number(ride.fare).toFixed(2)}` : "₹0.00";

  const vehicleType = ride?.vehicleType || "Any Vehicle";

  // ================= CONFIRM RIDE =================
  const handleConfirmRide = async (e) => {
    e.preventDefault();

    if (!otp.trim()) {
      toast.error("Please enter OTP");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/confirm-otp`,
        {
          rideId: ride._id,
          otp: otp.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("🎉 OTP verified! Ride started!");
      console.log("Ride started:", response.data);

      // socket notify
      if (socket) {
        socket.emit("otp-verified", {
          rideId: ride._id,
          captainId: ride.captain,
        });
      }

      // store ride data for CaptainRiding page
      const rideDetail = response?.data?.ride || ride;
      localStorage.setItem("captainRide", JSON.stringify(rideDetail));

      // close panels
      setConfirmRidePopupPanel(false);
      setRidePopupPanel(false);
      setOtp("");

      // navigate to captain riding
      navigate("/captain-riding");
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      toast.error(`❌ ${errorMsg}`);
      console.log(err.response?.data || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (typeof stopRideSound === "function") stopRideSound();
    setConfirmRidePopupPanel(false);
    setRidePopupPanel(false);
    setOtp("");
  };

  return (
    <div className="h-full relative bg-white">

      {/* CLOSE BUTTON */}
      <h5
        onClick={handleCancel}
        className="p-2 text-center w-full absolute top-6 text-gray-400 cursor-pointer"
      >
        <i className="ri-arrow-down-wide-line text-3xl"></i>
      </h5>

      <div className="p-4 pt-12">

        <h3 className="text-2xl font-semibold mb-5 text-center">
          Confirm this ride to start
        </h3>

        {/* PASSENGER INFO */}
        <div className="flex justify-between items-center border-b pb-3">

          <h2 className="text-lg font-medium">{riderName}</h2>

          <h5 className="text-lg font-semibold text-gray-800">
            {rideDistance}
          </h5>

        </div>

        {/* PICKUP / DROP */}
        <div className="flex flex-col gap-2 w-full mt-5">

          {/* PICKUP */}
          <div className="border-b-2 py-3 flex items-center gap-5">
            <i className="ri-map-pin-user-fill text-xl text-gray-700"></i>

            <div>
              <h3 className="text-lg font-bold">{pickupLocation}</h3>
              <p className="text-sm text-gray-500">Pickup</p>
            </div>
          </div>

          {/* DROP */}
          <div className="border-b-2 py-3 flex items-center gap-5">
            <i className="ri-map-pin-2-fill text-xl text-gray-700"></i>

            <div>
              <h3 className="text-lg font-bold">{dropoffLocation}</h3>
              <p className="text-sm text-gray-500">Dropoff</p>
            </div>
          </div>

          {/* FARE */}
          <div className="py-3 flex items-center gap-5">
            <i className="ri-money-rupee-circle-line text-xl text-gray-700"></i>

            <div>
              <h3 className="text-lg font-bold">{rideFare}</h3>
              <p className="text-sm text-gray-500">{vehicleType}</p>
            </div>
          </div>

        </div>

        {/* OTP INPUT */}
        <div className="mt-6 w-full">

          <form onSubmit={handleConfirmRide}>

            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              type="text"
              placeholder="Enter OTP"
              className="bg-[#eee] px-6 py-4 font-mono text-lg rounded-lg w-full outline-none border-2 border-transparent focus:border-black"
              disabled={isLoading}
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-5 bg-green-600 text-white font-semibold p-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {isLoading ? "⏳ Verifying..." : "✓ Confirm & Start Ride"}
            </button>

            <button
              type="button"
              onClick={handleCancel}
              disabled={isLoading}
              className="w-full mt-2 bg-red-500 text-white font-semibold p-3 rounded-lg hover:bg-red-600 disabled:opacity-50"
            >
              Cancel
            </button>

          </form>

        </div>

      </div>

    </div>
  );
};

export default ConfirmRidePopUp;