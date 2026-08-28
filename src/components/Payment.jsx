import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { SocketDataContext } from "../context/SocketContext";

const UberPaymentFixed = () => {
  const [seconds, setSeconds] = useState(94);
  const [ride, setRide] = useState(null);
  const navigate = useNavigate();
  const { socket } = useContext(SocketDataContext);

  useEffect(() => {
    const stored = localStorage.getItem('captainRide');
    if (stored) {
      try {
        setRide(JSON.parse(stored));
      } catch (err) {
        console.log('Failed to parse ride data:', err);
      }
    }
  }, []);

  useEffect(() => {
    if (seconds > 0) {
      const timer = setInterval(() => {
        setSeconds((s) => s - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [seconds]);

  const formatTime = (s) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;

    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="h-screen w-full bg-[#f5f5f5] flex justify-center items-center overflow-hidden">
      
      {/* Mobile Payment Card */}
      <div className="w-full max-w-sm h-screen bg-white flex flex-col overflow-hidden">

        {/* Header */}
        <div className="pt-5 pb-3 flex justify-center border-b border-gray-100">
          <img
            className="w-16 object-contain"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSVCO4w_adxK32rCXFeKq3_NbLcR9b_js14w&s"
            alt="Uber"
          />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-5 text-center">

          {/* Timer */}
          <div className="mb-4 flex items-center gap-2 bg-red-50 text-red-600 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            PAY IN {formatTime(seconds)}
          </div>

          {/* Amount */}
          <div className="mb-4">
            <p className="text-[10px] uppercase tracking-[3px] text-gray-400 font-bold">
              Total Fare
            </p>

            <h1 className="text-3xl font-bold text-black mt-1">
              ₹{ride?.fare ?? ride?.ride?.fare ?? 450}
            </h1>
          </div>

          {/* QR */}
          <div className="bg-white border-[2px] border-black rounded-2xl p-3 shadow-md mb-4">
            <img
              src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=uber.ride@icici&pn=Uber&am=450"
              alt="QR"
              className="w-40 h-40"
            />
          </div>

          {/* UPI */}
          <div className="mb-4">
            <p className="text-gray-400 text-xs font-medium">
              Merchant UPI ID
            </p>

            <h3 className="text-lg font-bold mt-1">
              uber.ride@icici
            </h3>
          </div>

          {/* Receiving */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce delay-150"></div>
              <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce delay-300"></div>
            </div>

            <p className="italic text-sm text-gray-700 font-medium">
              Receiving payment...
            </p>
          </div>

          {/* Security */}
          <div className="bg-gray-100 rounded-xl px-4 py-3 w-full">
            <p className="text-xs font-semibold text-gray-700">
              Secure UPI Payment
            </p>

            <p className="text-[11px] text-gray-500 mt-1">
              Encrypted & secure transaction
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="p-4 border-t border-gray-100 bg-white">
          <button
            onClick={() => {
              if (ride?.ride?._id) {
                socket?.emit("ride-completed", {
                  rideId: ride.ride._id,
                });
              } else if (ride?._id) {
                socket?.emit("ride-completed", {
                  rideId: ride._id,
                });
              }

              toast.success("Payment accepted");

              localStorage.removeItem('captainRide');
              navigate('/Captain-home');
            }}
            className="w-full bg-orange-500 text-black h-12 rounded-xl from-2xl text-base active:scale-95 transition flex items-center justify-center"
          >
            Confirm Payment
          </button>

          <p className="text-center text-[10px] text-gray-400 mt-2">
            Keep this screen active
          </p>
        </div>
      </div>
    </div>
  );
};

export default UberPaymentFixed;