import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { CaptainDataContext } from "../context/CaptainContext";
import axios from "axios";

const CaptainProtectWrapper = ({ children }) => {
  // Get token from localStorage
  const token = localStorage.getItem("token");

  const { captain, setCaptain } = useContext(CaptainDataContext);

  // FIX: useState, not useContext
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // If no token → redirect
    if (!token) {
      setIsLoading(false);
      return;
    }

    axios
      .get(`${import.meta.env.VITE_BASE_URL}/captains/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setCaptain(response.data.captain);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        localStorage.removeItem("token");
        setIsLoading(false);
      });
  }, [token, setCaptain]);

  // Loading state
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Redirect if no token
  if (!token) {
    return <Navigate to="/captain-login" />;
  }

  // Allow access
  return <>{children}</>;
};

export default CaptainProtectWrapper;