// src/pages/Home.jsx
import React, { useState, useRef, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import CaptainDetails from '../Components/CaptainDetails';
import RidePopUp from '../Components/RidePopUp';
import ConfirmRidePopUp from '../Components/ConfirmRidePopUp';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { CaptainDataContext } from '../context/CaptainContext';
import { SocketContext } from '../context/SocketContex';
import axios from 'axios';

gsap.registerPlugin(useGSAP);

const CaptainHome = () => {
  const [ridePopupPanel, setRidePopupPanel] = useState(false);
  const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false);
  const [ride, setRide] = useState(null);

  const ridePopupPanelRef = useRef(null);
  const confirmRidePopupPanelRef = useRef(null);

  const { socket } = useContext(SocketContext);
  const { captain } = useContext(CaptainDataContext);

  // Join socket room and send location
  useEffect(() => {
    if (!captain?._id || !socket) return;

    // Join the captain socket room
    socket.emit('join', { userId: captain._id, userType: 'captain' });

    // One-time location log
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const locationData = {
          userId: captain._id,
          location: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
        };
        console.log('Captain location:', locationData);
        socket.emit('update-location-captain', locationData);
      });

      // Optional: continuous location updates
      const watchId = navigator.geolocation.watchPosition((position) => {
        const locationData = {
          userId: captain._id,
          location: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
        };
        socket.emit('update-location-captain', locationData);
      });

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [captain?._id, socket]);

  // Listen for new rides
 useEffect(() => {
  if (!socket) return;

  const handleNewRide = (rideData) => {
    console.log("New ride received:", rideData);
    setRide(rideData);
    setRidePopupPanel(true);
  };

  socket.on("new-ride", handleNewRide);

  return () => socket.off("new-ride", handleNewRide);
}, [socket]);


async function confirmRide(){
 const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/confirm`,{

  rideId:ride._id,
  captainId:captain._id,


 },{
    headers:{
    Authorization:`Bearer ${localStorage.getItem('token')}`
  }
  
 })

 setRidePopupPanel(false);
 setConfirmRidePopupPanel(true);
}


  // GSAP: ride popup animation
  useGSAP(() => {
    if (ridePopupPanel) {
      gsap.to(ridePopupPanelRef.current, { transform: 'translateY(0)' });
    } else {
      gsap.to(ridePopupPanelRef.current, { transform: 'translateY(100%)' });
    }
  }, [ridePopupPanel]);

  // GSAP: confirm ride popup animation
  useGSAP(() => {
    if (confirmRidePopupPanel) {
      gsap.to(confirmRidePopupPanelRef.current, { transform: 'translateY(0)' });
    } else {
      gsap.to(confirmRidePopupPanelRef.current, { transform: 'translateY(100%)' });
    }
  }, [confirmRidePopupPanel]);

  return (
    <div className="h-screen">

      <div className="fixed p-2 top-0 flex items-center justify-between w-screen">
        <img className="w-28" src="/image.png" alt="logo" />
        <Link
          to="/captain-login"
          className="h-10 w-10 bg-white flex items-center justify-center rounded-full"
        >
          <i className="text-lg font-medium ri-logout-box-r-line"></i>
        </Link>
      </div>

      <div className="h-3/5">
        <img
          className="w-full h-full object-cover"
          src="https://miro.medium.com/max/1280/0*gwMx05pqII5hbfmX.gif"
          alt="map"
        />
      </div>
      <div className="h-2/5 p-6">
        <CaptainDetails />
      </div>
      <div
        ref={ridePopupPanelRef}
        className="fixed w-full z-10 bottom-0 px-3 py-10 pt-12 bg-white rounded-t-3xl translate-y-full"
      >
        <RidePopUp
          ride={ride}
          setRidePopupPanel={setRidePopupPanel}
          setConfirmRidePopupPanel={setConfirmRidePopupPanel}
          confirmRide={confirmRide}
        />
      </div>
      <div
        ref={confirmRidePopupPanelRef}
        className="fixed w-full h-screen z-10 bottom-0 px-3 py-10 pt-12 rounded-t-3xl bg-white translate-y-full"
      >
        <ConfirmRidePopUp
         ride={ride}
          setConfirmRidePopupPanel={setConfirmRidePopupPanel}
          setRidePopupPanel={setRidePopupPanel}
        />
      </div>
    </div>
  );
};

export default CaptainHome;
