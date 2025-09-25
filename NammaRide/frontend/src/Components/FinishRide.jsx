import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const FinishRide = ({ ride, setFinishRidePanel }) => {
  const navigate = useNavigate();

  const endRide = async () => {
    if (!ride?._id) {
      alert("Ride ID not found!");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/end-ride`,
        { rideId: ride._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setFinishRidePanel(false);
        navigate("/captain-home");
      }
    } catch (err) {
      console.error("Error ending ride:", err.response?.data || err.message);
      alert("Failed to end ride. Check console for details.");
    }
  };

  return (
    <div className="relative bg-white rounded-t-3xl p-6">
      {/* Title */}
      <h1 className="text-2xl font-semibold text-center mb-6 text-gray-800">
        Finish this Ride
      </h1>

      {/* Rider Info */}
      <div className="flex items-center justify-between p-3 border-2 border-green-400 rounded-lg">
        <div className="flex items-center gap-3">
          <img
            className="h-12 w-12 rounded-full object-cover border-2 border-green-400"
            src={
              ride?.user?.avatar ||
              "https://th.bing.com/th/id/OIP.jSFa5zJREQf6N6zOSAEOfgHaE8?w=249&h=180&c=7&r=0&o=5&pid=1.7"
            }
            alt="User"
          />
          <h3 className="text-lg font-medium text-gray-800">{ride?.user?.fullname}</h3>
        </div>
        <h3 className="text-lg font-semibold text-green-600">
          {ride?.distance ? `${ride.distance} KM` : "Calculating..."}
        </h3>
      </div>

      {/* Ride Details */}
      <div className="mt-6 flex flex-col gap-4">
        <div className="flex items-center gap-4 p-3 border-b border-gray-200">
          <i className="text-xl ri-map-pin-2-fill text-blue-500"></i>
          <div>
            <h3 className="text-sm font-semibold text-gray-700">Pickup</h3>
            <p className="text-sm text-gray-600">{ride?.pickup}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-3 border-b border-gray-200">
          <i className="text-xl ri-map-pin-user-fill text-red-500"></i>
          <div>
            <h3 className="text-sm font-semibold text-gray-700">Destination</h3>
            <p className="text-sm text-gray-600">{ride?.destination}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-3 border-b border-gray-200">
          <i className="text-xl ri-currency-line text-yellow-500"></i>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">₹{ride?.fare}</h3>
            <p className="text-sm text-gray-600">Cash</p>
          </div>
        </div>
      </div>
      {/* Finish Ride Button */}
      <button
        onClick={endRide}
        className="w-full mt-8 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition-colors"
      >
        Finish Ride
      </button>
    </div>
  );
};

export default FinishRide;
