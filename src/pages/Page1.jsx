import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

const Page1 = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    setLoading(true); // show loader

    setTimeout(() => {
      navigate("/page2"); // go next page
    }, 800); // delay for animation
  };

  return (
    <div>
      {loading && <Loader />}
      <h1>Page 1</h1>
      <button onClick={handleNext}>Next Page</button>
    </div>
  );
};

export default Page1;