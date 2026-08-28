import React, { useState, useContext, useEffect } from "react";

import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify'
import { CaptainDataContext } from "../context/CaptainContext";
import axios from "axios";

const CaptainSignup = () => {

  // =========================
  // BASIC STATES
  // =========================
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // =========================
  // PHOTO
  // =========================
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState("");

  // =========================
  // VEHICLE STATES
  // =========================
  const [vehicleColor, setVehicleColor] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [vehicleCapacity, setVehicleCapacity] = useState("");
  const [vehicleType, setVehicleType] = useState("");

  // =========================
  // CAPTCHA STATES
  // =========================
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [captchaAnswer, setCaptchaAnswer] = useState("");

  const { setCaptain } = useContext(CaptainDataContext);

  const navigate = useNavigate();

  // =========================
  // CAPTCHA GENERATOR
  // =========================
  const generateCaptcha = () => {

    const first =
      Math.floor(Math.random() * 9) + 1;

    const second =
      Math.floor(Math.random() * 9) + 1;

    setNum1(first);
    setNum2(second);

    setCaptchaAnswer("");
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  // =========================
  // PHOTO PREVIEW
  // =========================
  const handlePhotoChange = (e) => {

    const file = e.target.files[0];

    if (file) {

      setPhoto(file);

      setPreview(
        URL.createObjectURL(file)
      );
    }
  };

  // =========================
  // SUBMIT HANDLER
  // =========================
 const submitHandler = async (e) => {
  e.preventDefault();

  if (!firstName.trim()) {
    toast.warning("First Name is required");
    return;
  }

  if (!lastName.trim()) {
    toast.warning("Last Name is required");
    return;
  }

  if (!email.trim()) {
    toast.warning("Email is required");
    return;
  }

  if (!password.trim()) {
    toast.warning("Password is required");
    return;
  }

  if (password.length < 6) {
    toast.warning("Password must be at least 6 characters");
    return;
  }

  if (!vehicleColor.trim()) {
  toast.warning("Vehicle Color is required");
  return;
}

if (vehicleColor.trim().length < 3) {
  toast.warning("Vehicle Color must be at least 3 characters");
  return;
}


  if (!vehiclePlate.trim()) {
  toast.warning("Vehicle Number is required");
  return;
}

if (vehiclePlate.trim().length < 8) {
  toast.warning("Invalid Vehicle Number");
  return;
}

  if (!vehicleCapacity) {
    toast.warning("Vehicle Capacity is required");
    return;
  }

  if (!vehicleType) {
    toast.warning("Please select vehicle type");
    return;
  }

  if (!photo) {
    toast.warning("Captain photo is required");
    return;
  }

  if (parseInt(captchaAnswer) !== num1 + num2) {
    toast.warning("Wrong captcha answer");
    generateCaptcha();
    return;
  }

  try {
    const formData = new FormData();

    formData.append(
      "fullname",
      JSON.stringify({
        firstname: firstName,
        lastname: lastName,
      })
    );

    formData.append("email", email);
    formData.append("password", password);

    formData.append(
      "vehicle",
      JSON.stringify({
        color: vehicleColor,
        plate: vehiclePlate,
        capacity: vehicleCapacity,
        vehicleType,
      })
    );

    formData.append("photo", photo);

    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/captains/register`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.status === 201) {
      const data = response.data;

      setCaptain(data.captain);

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      toast.success("Account Created Successfully ✅");

      setTimeout(() => {
        navigate("/Captain-home");
      }, 1500);
    }
  } catch (error) {
    console.log(error);

    const errors = error.response?.data?.errors;

    if (errors && Array.isArray(errors)) {
      errors.forEach((err) => {
        toast.warning(err.msg);
      });
    } else {
      toast.warning(
        error.response?.data?.message ||
        "Signup Failed"
      );
    }
  }
};
  

  return (

    <div className="p-5 min-h-screen flex flex-col justify-between bg-gray-100">

      {/* MAIN */}
      <div className="max-w-md mx-auto w-full">

        {/* LOGO */}
        <img
          className="w-20 mb-2"
          src="https://www.svgrepo.com/show/505031/uber-driver.svg"
          alt="Uber Driver"
        />

        {/* FORM */}
        <form
          onSubmit={submitHandler}
          className="bg-white p-5 rounded-xl shadow-md"
        >

          {/* PHOTO */}
          <div className="flex flex-col items-center mb-5">

            <label className="cursor-pointer">

              <img
                className="w-28 h-28 rounded-full object-cover border-4 border-gray-200"
                src={
                  preview ||
                  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                }
                alt="Captain"
              />

              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />

            </label>

            <p className="text-sm mt-2 text-gray-500">
              Upload Captain Photo
            </p>

          </div>

          {/* NAME */}
          <h3 className="text-base mb-2 font-medium">
            Enter Captain Name
          </h3>

          <div className="flex gap-4 mb-5">

            <input
              required
              className="bg-[#eeeeee] w-1/2 rounded px-4 py-2 border text-base outline-none"
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) =>
                setFirstName(e.target.value)
              }
            />

            <input
              required
              className="bg-[#eeeeee] w-1/2 rounded px-4 py-2 border text-base outline-none"
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) =>
                setLastName(e.target.value)
              }
            />

          </div>

          {/* EMAIL */}
          <h3 className="text-base mb-2 font-medium">
            Captain Email ID
          </h3>

          <input
            required
            className="bg-[#eeeeee] mb-5 rounded px-4 py-2 border w-full text-base outline-none"
            type="email"
            placeholder="email@example.com"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          {/* PASSWORD */}
          <h3 className="text-base mb-2 font-medium">
            Enter Password
          </h3>

          <div className="relative mb-5">
            <input
              required
              className="bg-[#eeeeee] rounded px-4 py-2 border w-full pr-12 text-base outline-none"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              <i className={showPassword ? "ri-eye-off-line" : "ri-eye-line"}></i>
            </button>
          </div>

          {/* VEHICLE */}
          <h3 className="text-base mb-2 font-medium">
            Vehicle Information
          </h3>

          <div className="flex gap-4 mb-4">

            <input
              required
              className="bg-[#eeeeee] rounded px-4 py-2 border w-1/2 text-base outline-none"
              type="text"
              placeholder="Color"
              value={vehicleColor}
              onChange={(e) =>
                setVehicleColor(
                  e.target.value
                )
              }
            />

            <input
              required
              className="bg-[#eeeeee] rounded px-4 py-2 border w-1/2 text-base outline-none"
              type="text"
              placeholder="WB XX XXXX"
              value={vehiclePlate}
              onChange={(e) =>
                setVehiclePlate(
                  e.target.value
                )
              }
            />

          </div>

          <div className="flex gap-4 mb-5">

            <input
              required
              className="bg-[#eeeeee] rounded px-4 py-2 border w-1/2 text-base outline-none"
              type="number"
              placeholder="Capacity"
              value={vehicleCapacity}
              onChange={(e) =>
                setVehicleCapacity(
                  e.target.value
                )
              }
            />

            <select
              required
              className="bg-[#eeeeee] rounded px-4 py-2 border w-1/2 text-base outline-none"
              value={vehicleType}
              onChange={(e) =>
                setVehicleType(
                  e.target.value
                )
              }
            >
              <option value="">
                Type
              </option>

              <option value="car">
                Car
              </option>

              <option value="bike">
                Bike
              </option>

              <option value="toto">
                Toto
              </option>

            </select>

          </div>

          {/* CAPTCHA */}
          <div className="bg-gray-100 border rounded-lg p-4 mb-5">

            <div className="flex items-center justify-between mb-3">

              <h3 className="font-semibold text-red-500">
                Answer The Question
              </h3>

              <button
                type="button"
                onClick={generateCaptcha}
                className="text-sm bg-black text-white px-3 py-1 rounded"
              >
                Refresh
              </button>

            </div>

            <div className="flex items-center gap-3">

              <div className="bg-black text-white min-w-[120px] text-center px-4 py-3 rounded text-xl font-bold whitespace-nowrap">
                {num1} + {num2}
              </div>

              <input
                required
                type="number"
                placeholder="Answer"
                value={captchaAnswer}
                onChange={(e) =>
                  setCaptchaAnswer(
                    e.target.value
                  )
                }
                className="bg-white border rounded px-4 py-2 w-full outline-none"
              />

            </div>

          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            className="bg-black hover:bg-gray-900 transition text-white font-semibold mb-3 rounded px-4 py-3 w-full text-lg"
          >
            Create Account
          </button>

          {/* LOGIN */}
          <p className="text-center text-sm">

            Already have an account?{" "}

            <Link
              to="/captain-login"
              className="text-blue-600 font-medium"
            >
              Login here
            </Link>

          </p>

        </form>

      </div>

     
    </div>
  );
};

export default CaptainSignup;