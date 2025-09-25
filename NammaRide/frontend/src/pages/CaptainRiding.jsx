import React, { useRef, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import FinishRide from "../Components/FinishRide.jsx";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import LiveTracking from "../Components/LiveTracking.jsx";

gsap.registerPlugin(Draggable);

const CaptainRiding = () => {
  const [finishRidePanel, setFinishRidePanel] = useState(false);
  const finishRidePanelRef = useRef(null);
  const location = useLocation();
  const rideData = location.state?.ride;

  // Animate panel open/close
  useEffect(() => {
    if (!finishRidePanelRef.current) return;
    gsap.to(finishRidePanelRef.current, {
      y: finishRidePanel ? 0 : "100%",
      duration: 0.4,
      ease: finishRidePanel ? "power3.out" : "power3.in",
    });
  }, [finishRidePanel]);

  // Draggable panel
  useEffect(() => {
    if (!finishRidePanelRef.current) return;

    Draggable.create(finishRidePanelRef.current, {
      type: "y",
      bounds: { minY: 0, maxY: window.innerHeight },
      inertia: true,
      handle: ".drag-handle", // Only drag by top handle
      onDragEnd: function () {
        if (this.y > window.innerHeight * 0.4) {
          setFinishRidePanel(false);
        } else {
          gsap.to(finishRidePanelRef.current, { y: 0, duration: 0.3 });
        }
      },
    });
  }, []);

  return (
    <div className="h-screen relative overflow-hidden">
      {/* Header */}
      <div className="fixed p-6 top-0 flex items-center justify-between w-screen z-20">
        <img className="w-32" src="/image.png" alt="logo" />
        <Link
          to="/captain-home"
          className="h-10 w-10 bg-white flex items-center justify-center rounded-full"
        >
          <i className="text-lg font-medium ri-logout-box-r-line"></i>
        </Link>
      </div>

      {/* Map */}
      <div className="h-4/5">
        <LiveTracking />
      </div>
      <div
        className="h-1/5 p-6 flex items-center justify-between relative bg-[#e7ebfc] pt-10 cursor-pointer"
        onClick={() => setFinishRidePanel(true)}
      >
        <h5 className="p-1 text-center absolute w-[90%] top-0">
          <i className="text-3xl relative text-black ri-arrow-up-wide-line"></i>
        </h5>
        <h4 className="text-xl font-semibold">
          {rideData?.distance ? `${rideData.distance} KM` : "Calculating..."}
        </h4>
        <button className="bg-green-600 text-white font-semibold p-3 px-10 rounded-lg">
          Complete Ride
        </button>
      </div>
      <div
        ref={finishRidePanelRef}
        className="fixed w-full z-30 bottom-0 translate-y-full px-3 py-10 pt-12 bg-white rounded-t-3xl"
      >
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1.5 rounded-full bg-gray-300 drag-handle"></div>
        <FinishRide ride={rideData} setFinishRidePanel={setFinishRidePanel} />
      </div>
    </div>
  );
};

export default CaptainRiding;
