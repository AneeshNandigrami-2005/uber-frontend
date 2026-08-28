import React, {
  useState,
  useRef,
  useContext,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { toast } from "react-toastify";

import LocationSearchPanel from "../components/LocationSearchPanel";
import VehiclePanel from "../components/VehiclePanel";
import ConfirmRide from "../components/ConfirmRide";
import LookingForDriver from "../components/LookingForDriver";
import WaitingForDriver from "../components/WaitingForDriver";
import pickupNotificationSound from "../assets/pickup-notification.mp3";
import VehiclePanel from "./components/vehiclePanel";
import { SocketDataContext } from "../context/SocketContext";
import { UserDataContext } from "../context/UserContext";

const Home = () => {

  // ================= STATES =================

  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");

  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);

  const [activeField, setActiveField] = useState("pickup");

  const [panelOpen, setPanelOpen] = useState(false);

  const [vehiclePanel, setVehiclePanel] = useState(false);
  const [confirmRidePanel, setConfirmRidePanel] = useState(false);
  const [vehicleFound, setVehicleFound] = useState(false);

  const [fare, setFare] = useState({});
  const [distance, setDistance] = useState(0);

  const [selectedVehicle, setSelectedVehicle] = useState("car");

  // ================= WAITING DRIVER =================

  const [waitingForDriverPanel, setWaitingForDriverPanel] =
    useState(false);

  const [acceptedRideData, setAcceptedRideData] =
    useState(null);

  const [otpReceived, setOtpReceived] =
    useState(null);

  const pickupAudioRef = useRef(new Audio(pickupNotificationSound));

  // ================= CONTEXT =================

  const { sendMessage, socket } =
    useContext(SocketDataContext);
  const { user, setUser } = useContext(UserDataContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser({
      _id: "",
      email: "",
      fullName: { firstName: "", lastName: "" },
    });
    toast.error("Logged out");
    navigate("/login");
  };

  const playPickupSound = async () => {
    const audio = pickupAudioRef.current;
    if (!audio) return;

    try {
      audio.pause();
      audio.currentTime = 0;
      await audio.play();
    } catch (err) {
      console.log("🔇 Pickup sound blocked:", err);
    }
  };

  // ================= REFS =================

  const panelRef = useRef(null);

  const pickupDebounce = useRef(null);
  const destinationDebounce = useRef(null);

  // ================= SOCKET JOIN =================

  useEffect(() => {

    if (!user?._id) return;

    const timer = setTimeout(() => {

      sendMessage("join", {
        userId: user._id,
        userType: "user",
      });

      console.log("✅ JOIN SENT:", user._id);

    }, 1000);

    return () => clearTimeout(timer);

  }, [user]);

  // ================= SOCKET EVENTS =================

  useEffect(() => {

    if (!socket) return;

    // ===== RIDE ACCEPTED =====

    const handleRideAccepted = (data) => {

      console.log("🎉 Ride Accepted:", data);

      setAcceptedRideData(data);
      setOtpReceived(data?.ride?.otp ?? null);

      setWaitingForDriverPanel(true);

      setVehicleFound(false);

      toast.success(
        `✅ Driver ${
          data?.captain?.fullname?.firstname || "accepted"
        } your ride!`
      );

    };

    // ===== RIDE STARTED =====

    const handleRideStarted = (data) => {

      console.log("🚗 Ride Started:", data);

      setAcceptedRideData(data);
      setOtpReceived(data?.ride?.otp ?? null);

      toast.success(
        data?.message || "🎉 Your ride has started!"
      );

      playPickupSound();

    };


    socket.on("ride-accepted", handleRideAccepted);

    socket.on("ride-started", handleRideStarted);

    return () => {

      socket.off("ride-accepted", handleRideAccepted);

      socket.off("ride-started", handleRideStarted);

    };

  }, [socket]);

  // ================= PANEL ANIMATION =================

  useGSAP(() => {

    if (panelOpen) {

      gsap.to(panelRef.current, {
        height: "70%",
        opacity: 1,
        padding: 24,
        duration: 0.5,
      });

    } else {

      gsap.to(panelRef.current, {
        height: "0%",
        opacity: 0,
        padding: 0,
        duration: 0.5,
      });

    }

  }, [panelOpen]);

  // ================= FETCH SUGGESTIONS =================

  const fetchSuggestions = async (input, type) => {

    try {

      const query = input?.trim();

      const finalInput =
        query?.length > 0
          ? query
          : "kolkata";

      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`,
        {
          params: {
            input: finalInput,
          },

          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (type === "pickup") {

        setPickupSuggestions(response.data || []);

      } else {

        setDestinationSuggestions(response.data || []);

      }

    } catch (error) {

      console.log(
        "Suggestion Error:",
        error.response?.data || error.message
      );

    }

  };

  // ================= PICKUP CHANGE =================

  const handlePickupChange = (e) => {

    const value = e.target.value;

    setPickup(value);

    clearTimeout(pickupDebounce.current);

    pickupDebounce.current = setTimeout(() => {

      fetchSuggestions(value, "pickup");

    }, 150);

  };

  // ================= DESTINATION CHANGE =================

  const handleDestinationChange = (e) => {

    const value = e.target.value;

    setDestination(value);

    clearTimeout(destinationDebounce.current);

    destinationDebounce.current = setTimeout(() => {

      fetchSuggestions(value, "destination");

    }, 150);

  };

  // ================= FIND TRIP =================

  const findTrip = async () => {

    try {

      if (!pickup || !destination) {

        toast.error(
          "Please enter pickup and destination"
        );

        return;

      }

      if (
        pickup.trim().toLowerCase() ===
        destination.trim().toLowerCase()
      ) {
        toast.error(
          "Pickup and destination location was same"
        );
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/get-fare`,
        {
          pickup,
          destination,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log(
        "FARE RESPONSE:",
        response.data
      );

      setFare(response.data.fare);

      setDistance(response.data.distance);

      setVehiclePanel(true);

    } catch (error) {

      console.log(
        "Find Trip Error:",
        error.response?.data || error.message
      );

      toast.error(
        error.response?.data?.message ||
        "Something went wrong"
      );

    }

  };

  return (

    <div className="h-screen relative overflow-hidden">

      {/* ================= BACKGROUND ================= */}

      <img
        className="h-screen w-screen object-cover"
        src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
        alt="map"
      />

      {/* ================= MAIN ================= */}

      <div className="absolute top-0 w-full h-screen flex flex-col justify-end">

        <div className="bg-white p-5 rounded-t-3xl relative z-10">

          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-bold">
              Find a Trip
            </h2>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 bg-black text-white px-3 py-2 rounded-full shadow-sm"
            >
              <i className="ri-logout-box-line text-lg"></i>
              Logout
            </button>
          </div>

          {/* ================= PICKUP ================= */}

          <input
            value={pickup}

            onFocus={() => {

              setPanelOpen(true);

              setActiveField("pickup");

              fetchSuggestions("", "pickup");

            }}

            onChange={handlePickupChange}

            placeholder="Enter Pickup Location"

            className="w-full p-4 bg-gray-100 rounded-xl outline-none text-lg"
          />

          {/* ================= DESTINATION ================= */}

          <input
            value={destination}

            onFocus={() => {

              setPanelOpen(true);

              setActiveField("destination");

              fetchSuggestions("", "destination");

            }}

            onChange={handleDestinationChange}

            placeholder="Enter Destination"

            className="w-full p-4 bg-gray-100 rounded-xl outline-none text-lg mt-4"
          />

          {/* ================= BUTTON ================= */}

          <button
            onClick={findTrip}
            className="w-full bg-black text-white p-4 mt-5 rounded-xl text-lg"
          >
            Find Trip
          </button>

        </div>

        {/* ================= LOCATION PANEL ================= */}

        <div
          ref={panelRef}
          className="bg-white overflow-hidden opacity-0"
          style={{ height: "0%" }}
        >

          <LocationSearchPanel
            suggestions={
              activeField === "pickup"
                ? pickupSuggestions
                : destinationSuggestions
            }

            activeField={activeField}

            setPickup={setPickup}

            setDestination={setDestination}

            setPanelOpen={setPanelOpen}
          />

        </div>

      </div>

      {/* ================= VEHICLE PANEL ================= */}

      <div
        className={`fixed bottom-0 left-0 w-full z-50 bg-white rounded-t-3xl transition-transform duration-500 ${
          vehiclePanel
            ? "translate-y-0"
            : "translate-y-full"
        }`}
      >

        <VehiclePanel
          fare={fare}
          distance={distance}
          selectedVehicle={selectedVehicle}
          setSelectedVehicle={setSelectedVehicle}
          setVehiclePanel={setVehiclePanel}
          setConfirmRidePanel={setConfirmRidePanel}
        />

      </div>

      {/* ================= CONFIRM RIDE ================= */}

      <div
        className={`fixed bottom-0 left-0 w-full z-[60] bg-white rounded-t-3xl transition-transform duration-500 ${
          confirmRidePanel
            ? "translate-y-0"
            : "translate-y-full"
        }`}
      >

        <ConfirmRide
          pickupLocation={pickup}
          destinationLocation={destination}
          fare={fare}
          selectedVehicle={selectedVehicle}
          setConfirmRidePanel={setConfirmRidePanel}
          setVehicleFound={setVehicleFound}
          setVehiclePanel={setVehiclePanel}
        />

      </div>

      {/* ================= LOOKING FOR DRIVER ================= */}

      <div
        className={`fixed bottom-0 left-0 w-full z-[70] bg-white rounded-t-3xl transition-transform duration-500 ${
          vehicleFound
            ? "translate-y-0"
            : "translate-y-full"
        }`}
      >

        <LookingForDriver
          pickupLocation={pickup}
          destinationLocation={destination}
          selectedVehicle={selectedVehicle}
          fare={fare}
          setVehicleFound={setVehicleFound}
        />

      </div>

      {/* ================= WAITING FOR DRIVER ================= */}

      <div
        className={`fixed bottom-0 left-0 w-full z-[80] bg-white rounded-t-3xl transition-transform duration-500 ${
          waitingForDriverPanel
            ? "translate-y-0"
            : "translate-y-full"
        }`}
      >

        {acceptedRideData && (

          <WaitingForDriver
            setWaitingForDriver={setWaitingForDriverPanel}
            rideData={acceptedRideData}
            otpReceived={otpReceived}
          />

        )}

      </div>

    </div>

  );

};

export default Home;