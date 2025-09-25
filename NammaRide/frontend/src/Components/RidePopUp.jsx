import React, { useEffect, useRef } from "react";
import "./RidePopup.css";

const RidePopUp = ({ ride, ridePopupPanel, setRidePopupPanel, setConfirmRidePopupPanel, confirmRide, autoCloseTime = 5000 }) => {
  const audioRef = useRef(null);

  // Force audio unlock on first user interaction
  useEffect(() => {
    const unlockAudio = () => {
      if (audioRef.current) {
        audioRef.current.play().catch((err) => console.log("Audio blocked:", err));
      }
      document.removeEventListener("click", unlockAudio);
    };
    document.addEventListener("click", unlockAudio);
    return () => document.removeEventListener("click", unlockAudio);
  }, []);

  // Play/stop ringtone and auto-close popup
  useEffect(() => {
    let timer;
    if (ridePopupPanel && audioRef.current) {
      audioRef.current.loop = true;
      audioRef.current.volume = 1.0;
      audioRef.current.play().catch((err) => console.log("Autoplay blocked:", err));

      timer = setTimeout(() => {
        stopSound();
        setRidePopupPanel(false);
      }, autoCloseTime);
    } else {
      stopSound();
    }

    return () => {
      clearTimeout(timer);
      stopSound();
    };
  }, [ridePopupPanel, autoCloseTime, setRidePopupPanel]);

  const stopSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const handleAccept = () => {
    stopSound();
    setConfirmRidePopupPanel(true);
    confirmRide();
  };

  const handleIgnore = () => {
    stopSound();
    setRidePopupPanel(false);
  };

  return (
    <div>
      <audio ref={audioRef} src="/DriverAudio.mp3" preload="auto" />

      <div className="relative text-center">
        <button className="p-1 absolute w-[93%] top-0" onClick={handleIgnore}>
          <i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
        </button>

        <h1 className="text-2xl font-semibold mb-2">New Ride Available</h1>

        <div className="flex items-center justify-between p-3 bg-[#d0db9b] rounded-lg mt-4">
          <div className="flex items-center gap-3">
            <img
              className="h-12 w-10 rounded-full object-cover"
              src={ride?.user?.avatar || "https://th.bing.com/th/id/OIP.jSFa5zJREQf6N6zOSAEOfgHaE8?w=249&h=180&c=7&r=0&o=5&pid=1.7"}
              alt={ride?.user?.fullname || "Rider"}
            />
            <h3 className="text-lg font-medium">{ride?.user?.fullname || "Unknown Rider"}</h3>
          </div>
          <h3 className="text-lg font-semibold">{ride?.distance ? `${ride.distance} KM` : "Calculating..."}</h3>
        </div>
      </div>

      <div className="flex gap-2 justify-between items-center flex-col mt-5 w-full">
        <div className="w-full">
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="text-lg ri-map-pin-2-fill text-blue-500"></i>
            <div>
              <h3 className="text-lg font-medium">Pickup</h3>
              <p className="text-sm -mt-1 text-gray-600">{ride?.pickup || "Unknown pickup"}</p>
            </div>
          </div>

          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="text-lg ri-map-pin-user-fill text-red-500"></i>
            <div>
              <h3 className="text-lg font-medium">Destination</h3>
              <p className="text-sm -mt-1 text-gray-600">{ride?.destination || "Unknown destination"}</p>
            </div>
          </div>

          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="text-lg ri-currency-line text-yellow-500"></i>
            <div>
              <h3 className="text-lg font-medium">₹{ride?.fare || "N/A"}</h3>
              <p className="text-sm -mt-1 text-gray-600">Cash</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col mt-5 w-full items-center">
          <button
            onClick={handleAccept}
            className="w-full text-white font-semibold p-3 px-10 rounded-lg bg-green-600 animated-accept"
          >
            Accept
          </button>
          <button
            onClick={handleIgnore}
            className="w-full mt-1 bg-gray-300 text-gray-700 font-semibold p-3 px-10 rounded-lg"
          >
            Ignore
          </button>
        </div>
      </div>
    </div>
  );
};

export default RidePopUp;
