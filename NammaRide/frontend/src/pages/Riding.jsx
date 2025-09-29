import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SocketContext } from "../context/SocketContex";
import LiveTracking from "../Components/LiveTracking";
import { motion } from "framer-motion";

const Riding = () => {
  const location = useLocation();
  const { ride } = location.state || {};
  const { socket } = useContext(SocketContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!socket) return;
    socket.on("ride-ended", () => navigate("/home"));
    return () => socket.off("ride-ended");
  }, [socket, navigate]);

  const vehicleImages = {
    car: "https://i.pinimg.com/originals/93/c1/05/93c105244c0a3de81267a89cb13386f7.png",
    motorcycle:
      "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,w_956,h_637/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png",
    auto: "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png",
  };

  const vehicleType = ride?.captain?.vehicle?.vehicleType;

  return (
    <div className="h-screen w-full relative">
      <Link
        to="/home"
        className="fixed right-4 top-4 z-20 h-11 w-11 bg-white shadow-lg flex items-center justify-center rounded-full hover:bg-gray-100 transition"
      >
        <i className="text-xl font-medium ri-home-5-line text-gray-700"></i>
      </Link>
      <LiveTracking />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 120 }}
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-lg p-5 z-10"
      >
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4"></div>
        <div className="flex items-center justify-between gap-4">
          <img
            className="h-20 drop-shadow-md"
            src={vehicleImages[vehicleType]}
            alt={vehicleType}
          />
          <div className="text-right">
            <div className="flex justify-end  items-center">
                <img 
           className="h-8 w-8 rounded-full object-cover mx-auto mb-1"
            src="https://images.freeimages.com/images/premium/previews/1396/13965355-young-cheerful-indian-auto-rickshaw-driver.jpg"
            alt="Captain"
          />
            <h2 className="text-xl font-bold capitalize text-gray-800">
              {ride?.captain?.fullname?.firstname +
                " " +
                ride?.captain?.fullname?.lastname}
            </h2>
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              {ride?.captain?.vehicle?.plate}
            </h3>
            <p className="text-sm text-gray-500">
              {ride?.captain?.vehicle?.vehicleType} •{" "}
              {ride?.captain?.vehicle?.color}
            </p>
          </div>
        </div>
        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-4 p-3 rounded-lg bg-gray-50">
            <i className="text-xl ri-map-pin-user-fill text-green-600"></i>
            <p className="text-gray-700 text-sm font-medium">{ride?.destination}</p>
          </div>
          <div className="flex items-center gap-4 p-3 rounded-lg bg-gray-50">
            <i className="text-xl ri-currency-line text-yellow-600"></i>
            <div>
              <h4 className="text-lg font-semibold text-gray-800">
                ₹{ride?.fare}
              </h4>
              <p className="text-sm text-gray-500">Cash</p>
            </div>
          </div>
        </div>
        <button className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl shadow-md transition">
          Make a Payment
        </button>
      </motion.div>
    </div>
  );
};

export default Riding;
