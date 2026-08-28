import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { SocketDataContext } from "../context/SocketContext";

const WaitingForDriver = (props) => {
  const {
    rideData = {},
    otpReceived = null,
    setWaitingForDriver,
  } = props;

  // ================= RIDE =================
  const ride = rideData?.ride || rideData || {};

  // captain fallback (VERY IMPORTANT FOR SOCKETS)
  const captain =
    rideData?.captain ||
    rideData?.driver ||
    ride?.captain ||
    {};

  // ================= CAPTAIN NAME =================
  const captainName =
    captain?.fullname
      ? `${captain?.fullname?.firstname || ""} ${captain?.fullname?.lastname || ""}`.trim()
      : captain?.name ||
        captain?.fullname ||
        "Driver";

  // ================= CAPTAIN IMAGE (ROBUST) =================
  const captainPhoto =
    captain?.profileImage ||
    captain?.vehicle?.photo ||
    captain?.profilePic ||
    captain?.avatar ||
    captain?.image ||
    captain?.photo ||
    "https://cdn.pixabay.com/photo/2022/03/11/06/14/indian-man-7061278_960_720.jpg";

  // ================= VEHICLE (ROBUST MULTI FORMAT) =================
  const vehicle = captain?.vehicle || {};

  const vehicleType =
    vehicle?.vehicleType ||
    vehicle?.type ||
    captain?.vehicleType ||
    "Car";

  const vehicleModel =
    vehicle?.vehicleModel ||
    vehicle?.model ||
    captain?.vehicleModel ||
    "Swift Dzire";

  const vehicleColor =
    vehicle?.vehicleColor ||
    vehicle?.color ||
    captain?.vehicleColor ||
    "White";

  const licensePlate =
    vehicle?.plate ||
    vehicle?.licensePlate ||
    vehicle?.numberPlate ||
    vehicle?.plateNumber ||
    captain?.licensePlate ||
    captain?.vehicleNumber ||
    captain?.vehicleNo ||
    "WB 00 XX 0000";

  // ================= RIDE INFO =================
  const pickup = ride?.pickup || "Pickup Location";
  const destination = ride?.destination || "Destination";
  const fare = ride?.fare ? `₹${ride.fare}` : "₹0";

  // ================= OTP =================
  const otp =
    otpReceived ||
    (ride?.otp ? String(ride.otp).padStart(6, "0") : null) ||
    "------";

  const navigate = useNavigate();
  const { socket } = useContext(SocketDataContext);

  useEffect(() => {
    if (!socket) return;

    const handleRideCompleted = (data) => {
      toast.success("Happy journey! Your ride is complete.");
      setWaitingForDriver?.(false);
      navigate("/home");
    };

    socket.on("ride-completed", handleRideCompleted);

    return () => {
      socket.off("ride-completed", handleRideCompleted);
    };
  }, [socket, navigate, setWaitingForDriver]);

  return (
    <div className="p-5 bg-white rounded-t-3xl shadow-2xl w-full relative">

      {/* CLOSE */}
      <div
        className="absolute top-2 left-0 w-full text-center cursor-pointer"
        onClick={() => setWaitingForDriver?.(false)}
      >
        <i className="ri-arrow-down-s-line text-3xl text-gray-400"></i>
      </div>

      {/* TITLE */}
      <h2 className="text-2xl font-bold text-center mt-5">
        Driver is Coming
      </h2>

      <p className="text-center text-gray-500 mt-1">
        Share OTP with Captain to start ride
      </p>

      {/* CAPTAIN INFO */}
      <div className="flex items-center justify-between mt-6">

        <div className="flex items-center gap-3">

          <img
            src={captainPhoto}
            alt="captain"
            className="w-16 h-16 rounded-full object-cover border-2 border-yellow-400"
          />

          <div>
            <h3 className="text-lg font-bold">{captainName}</h3>
            <p className="text-gray-500 text-sm">{vehicleType}</p>
          </div>

        </div>

        <div className="text-right">
          <h2 className="text-xl font-bold">{licensePlate}</h2>
          <p className="text-sm text-gray-500">
            {vehicleModel} {vehicleColor}
          </p>
        </div>

      </div>

      {/* OTP */}
      <div className="bg-black rounded-2xl p-5 mt-6 text-center">
        <p className="text-white text-sm mb-2">YOUR RIDE OTP</p>
        <h1 className="text-5xl font-bold tracking-[10px] text-yellow-400">
          {otp}
        </h1>
      </div>

      {/* INFO */}
      <div className="bg-yellow-100 border border-yellow-300 rounded-xl p-4 mt-5">

        <div className="flex gap-3">
          <i className="ri-information-fill text-2xl text-yellow-700"></i>

          <div>
            <h3 className="font-bold text-yellow-800">
              Give this OTP to Captain
            </h3>
            <p className="text-sm text-yellow-700 mt-1">
              Captain will enter OTP to start the ride.
            </p>
          </div>
        </div>

      </div>

      {/* TRIP DETAILS */}
      <div className="mt-6">

        <div className="flex gap-4 border-b py-4">
          <i className="ri-map-pin-user-fill text-xl"></i>
          <div>
            <h3 className="font-semibold">{pickup}</h3>
            <p className="text-sm text-gray-500">Pickup</p>
          </div>
        </div>

        <div className="flex gap-4 border-b py-4">
          <i className="ri-map-pin-2-fill text-xl"></i>
          <div>
            <h3 className="font-semibold">{destination}</h3>
            <p className="text-sm text-gray-500">Destination</p>
          </div>
        </div>

        <div className="flex gap-4 py-4">
          <i className="ri-money-rupee-circle-fill text-xl"></i>
          <div>
            <h3 className="font-semibold">{fare}</h3>
            <p className="text-sm text-gray-500">Fare</p>
          </div>
        </div>

      </div>

      {/* STATUS */}
      <div className="mt-5">
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full w-2/3 bg-black animate-pulse"></div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-2">
          Waiting for captain OTP verification...
        </p>
      </div>

    </div>
  );
};

export default WaitingForDriver;