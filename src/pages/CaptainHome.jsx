import React, {
    useState,
    useRef,
    useContext,
    useEffect
} from "react";

import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

import "remixicon/fonts/remixicon.css";

import CaptainDetails from "../components/CaptainDetails";
import RidePopUp from "../components/RidePopUp";
import ConfirmRidePopUp from "../components/ConfirmRidePopUp";

import notificationSound from "../assets/ride-notification.mp3";

import { SocketDataContext } from "../context/SocketContext";
import { CaptainDataContext } from "../context/CaptainContext";

const CaptainHome = () => {

    // =========================
    // STATES
    // =========================
    const [ridePopupPanel, setRidePopupPanel] = useState(false);

    const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false);

    const [rideData, setRideData] = useState(null);

    // =========================
    // REFS
    // =========================
    const audioRef = useRef(new Audio(notificationSound));

    const notificationIntervalRef = useRef(null);

    // =========================
    // CONTEXT
    // =========================
    const { socket, sendMessage } = useContext(SocketDataContext);

    const { captain, setCaptain } = useContext(CaptainDataContext);

    const navigate = useNavigate();

    // =========================
    // UNLOCK AUDIO
    // =========================
    useEffect(() => {

        const unlockAudio = async () => {

            try {

                const audio = audioRef.current;

                if (!audio) return;

                audio.volume = 1;

                await audio.play();

                audio.pause();

                audio.currentTime = 0;

                console.log("🔊 Audio unlocked");

            } catch (err) {

                console.log("🔇 Audio unlock blocked");

            }
        };

        window.addEventListener("click", unlockAudio, { once: true });

        return () => {
            window.removeEventListener("click", unlockAudio);
        };

    }, []);

    // =========================
    // STOP SOUND
    // =========================
    const stopSound = () => {

        const audio = audioRef.current;

        if (audio) {

            audio.pause();

            audio.currentTime = 0;

            audio.onended = null;
        }
    };

    // =========================
    // STOP LOOP
    // =========================
    const stopNotificationLoop = () => {

        if (notificationIntervalRef.current) {

            clearInterval(notificationIntervalRef.current);

            notificationIntervalRef.current = null;
        }

        stopSound();
    };

    // =========================
    // START LOOP
    // =========================
    const startNotificationLoop = () => {

        stopNotificationLoop();

        playSound();

        notificationIntervalRef.current = setInterval(() => {

            playSound();

        }, 10000);
    };

    // =========================
    // PLAY SOUND
    // =========================
    const playSound = async () => {

        const audio = audioRef.current;

        if (!audio) return;

        try {

            audio.pause();

            audio.currentTime = 0;

            await audio.play();

        } catch (err) {

            console.log("🔇 Sound blocked:", err);
        }
    };

    // =========================
    // RECEIVE NEW RIDE
    // =========================
    useEffect(() => {

        if (!socket) return;

        const handleNewRide = (data) => {

            console.log("🚖 NEW RIDE:", data);

            const incomingRide = data?.ride || data;

            setRideData(incomingRide);

            setRidePopupPanel(true);

            startNotificationLoop();
        };

        socket.on("new-ride", handleNewRide);

        // RIDE COMPLETED
        const handleRideCompleted = (data) => {

            console.log("✅ Ride completed:", data);

            if (data?.captain) {

                setCaptain(data.captain);

            } else if (data?.ride) {

                setCaptain((prev) => ({
                    ...(prev || {}),
                    earned:
                        (prev?.earned || 0) +
                        (data?.ride?.fare || 0),
                }));
            }

            stopNotificationLoop();

            toast.success("Ride Completed");
        };

        socket.on("ride-completed", handleRideCompleted);

        return () => {

            socket.off("new-ride", handleNewRide);

            socket.off("ride-completed", handleRideCompleted);
        };

    }, [socket]);

    // =========================
    // CLEANUP
    // =========================
    useEffect(() => {

        return () => {
            stopNotificationLoop();
        };

    }, []);

    // =========================
    // JOIN SOCKET
    // =========================
    useEffect(() => {

        if (!captain?._id) return;

        sendMessage("join", {

            userId: captain._id,

            userType: "captain",

        });

    }, [captain]);

    // =========================
    // UPDATE LOCATION
    // =========================
    useEffect(() => {

        if (!captain?._id) return;

        const updateLocation = () => {

            navigator.geolocation.getCurrentPosition((position) => {

                sendMessage("update-location", {

                    userId: captain._id,

                    userType: "captain",

                    location: {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    },

                });

            });
        };

        updateLocation();

        const interval = setInterval(updateLocation, 10000);

        return () => clearInterval(interval);

    }, [captain]);

    // =========================
    // LOGOUT
    // =========================
    const handleLogout = () => {

        // remove token first, navigate away, then clear captain state
        localStorage.removeItem("token");

        navigate("/captain-login");

        setCaptain(null);

        toast.error("Logged out");
    };

    // =========================
    // ACCEPT RIDE
    // =========================
    const handleAcceptRide = async (ride) => {

        try {

            const axios = (await import("axios")).default;

            const response = await axios.post(

                `${import.meta.env.VITE_BASE_URL}/rides/accept`,

                {
                    rideId: ride._id,
                },

                {
                    headers: {
                        Authorization:
                            `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            if (response?.data?.ride) {

                setRideData(response.data.ride);
            }

            stopNotificationLoop();

            setRidePopupPanel(false);

            setConfirmRidePopupPanel(true);

            toast.success("Ride Accepted");

        } catch (err) {

            console.log(err);

            toast.error(
                err.response?.data?.message || "Accept failed"
            );
        }
    };

    // =========================
    // REJECT RIDE
    // =========================
    const handleRejectRide = () => {

        stopNotificationLoop();

        setRidePopupPanel(false);

        setRideData(null);

        toast.error("Ride Ignored");
    };

    return (

        <div className="h-screen w-full relative overflow-hidden bg-gray-100">

            {/* =========================
                MAP
            ========================= */}
            <img
                className="h-screen w-screen object-cover"
                src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
                alt="map"
            />

            {/* =========================
                HEADER
            ========================= */}
            <div className="absolute top-0 left-0 w-full flex justify-between items-center p-5 z-20">

                {/* LOGO */}
                <img
                    className="w-16"
                    src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
                    alt="logo"
                />

                {/* LOGOUT BUTTON */}
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full shadow-lg"
                >
                    <i className="ri-logout-box-r-line text-lg"></i>

                    <span className="text-sm font-medium">
                        Logout
                    </span>
                </button>

            </div>

            {/* =========================
                CAPTAIN DETAILS
            ========================= */}
            <div className="absolute bottom-0 w-full z-10">

                {captain ? <CaptainDetails /> : null}

            </div>

            {/* =========================
                RIDE POPUP
            ========================= */}
            <div
                className={`fixed bottom-0 left-0 w-full bg-white z-30 transition-transform duration-500 ${ridePopupPanel
                        ? "translate-y-0"
                        : "translate-y-full"
                    }`}
            >

                <RidePopUp
                    ride={rideData}
                    onAccept={handleAcceptRide}
                    onReject={handleRejectRide}
                />

            </div>

            {/* =========================
                CONFIRM RIDE POPUP
            ========================= */}
            <div
                className={`fixed bottom-0 left-0 w-full bg-white z-40 transition-transform duration-500 ${confirmRidePopupPanel
                        ? "translate-y-0"
                        : "translate-y-full"
                    }`}
            >

                <ConfirmRidePopUp
                    ride={rideData}
                    stopRideSound={stopSound}
                    setConfirmRidePopupPanel={
                        setConfirmRidePopupPanel
                    }
                    setRidePopupPanel={setRidePopupPanel}
                    socket={socket}
                />

            </div>

        </div>
    );
};

export default CaptainHome;