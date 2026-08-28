import React, { useEffect } from "react";
import { motion } from "framer-motion";

import carImage from "../assets/car.png";

const SplashScreen = ({ onFinish }) => {
  useEffect(() => {
    // Open app after animation
    const timer = setTimeout(() => {
      onFinish();
    }, 7000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 bg-black overflow-hidden z-50">

      {/* TOP TEXT */}
      <motion.div
        className="absolute top-10 w-full text-center"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2 }}
      >
        <h1 className="text-white text-4xl md:text-6xl font-bold">
          Uber Ride
        </h1>

        <p className="text-white text-xl md:text-2xl mt-3">
          Safe Life
        </p>
      </motion.div>

      {/* BIG CAR ANIMATION */}
      <motion.img
        src={carImage}
        alt="Car"
        className="w-[420px] md:w-[550px] absolute bottom-20 right-10"
        initial={{
          x: "100vw"
        }}
        animate={{
          x: "-150vw"
        }}
        transition={{
          duration: 6,
          ease: "linear",
        }}
      />

    </div>
  );
};

export default SplashScreen;