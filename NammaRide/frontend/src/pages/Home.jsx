// src/pages/Home.jsx
import React, { useRef, useState, useEffect, useContext } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import 'remixicon/fonts/remixicon.css';
import LocationSearchPanel from '../Components/LocationSearchPanel';
import VehiclePanel from '../Components/VehiclePanel';
import ConfirmRide from '../Components/ConfirmRide';
import LookingForDriver from '../Components/LookingForDriver';
import WaitingForDriver from '../Components/WaitingForDriver'; 
import { SocketContext } from '../context/SocketContex';
import { UserDataContext } from '../context/UserContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";

const Home = () => {
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [panelOpen, setPanelOpen] = useState(false);
  const [activeField, setActiveField] = useState(null);

  const navigate = useNavigate();

  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);

  const vehiclePanelRef = useRef(null);
  const vehicleFoundRef = useRef(null);
  const confirmRidePanelRef = useRef(null);
  const panelRef = useRef(null);
  const panelCloseRef = useRef(null);
  const waitingForDriverRef = useRef(null);

  const [vehiclePanel, setVehiclePanel] = useState(false);
  const [confirmRidePanel, setConfirmRidePanel] = useState(false);
  const [vehicleFound, setVehicleFound] = useState(false);
  const [waitingForDriver, setWaitingForDriver] = useState(false);
  const [fare, setFare] = useState({});
  const [vehicleType, setVehicleType] = useState(null);
  const [ride, setRide] = useState(null);

  const { socket } = useContext(SocketContext);
  const { user } = useContext(UserDataContext);

  // Join socket room
  useEffect(() => {
    if (user && user._id) {
      socket.emit("join", { userType: "user", userId: user._id });
    }
  }, [user, socket]);

  // Listen for ride confirmed
  useEffect(() => {
    if (!socket) return;

    const handleRideConfirmed = async (rideData) => {
      try {
        // Fetch full ride details including captain & user
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/rides/${rideData._id}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        const fullRide = response.data;

        setVehicleFound(false);
        setWaitingForDriver(true);
        setRide(fullRide);
      } catch (err) {
        console.error("Error fetching ride details:", err);
      }
    };

    socket.on("ride-confirmed", handleRideConfirmed);

    return () => {
      socket.off("ride-confirmed", handleRideConfirmed);
    };
  }, [socket]);

  // Listen for ride started
  useEffect(() => {
    if (!socket) return;

    const handleRideStarted = async (rideData) => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/rides/${rideData._id}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        const fullRide = response.data;

        setWaitingForDriver(false);
        navigate('/riding', { state: { ride: fullRide } });
      } catch (err) {
        console.error("Error fetching ride details:", err);
      }
    };

    socket.on("ride-started", handleRideStarted);

    return () => {
      socket.off("ride-started", handleRideStarted);
    };
  }, [socket, navigate]);

  // Pickup & Destination input handlers
  const handlePickupChange = async (e) => {
    const value = e.target.value;
    setPickup(value);

    if (value.trim().length < 3) {
      setPickupSuggestions([]);
      return;
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`,
        { params: { input: value }, headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setPickupSuggestions(response.data || []);
    } catch (error) {
      console.error("Error fetching pickup suggestions:", error);
    }
  };

  const handleDestinationChange = async (e) => {
    const value = e.target.value;
    setDestination(value);

    if (value.trim().length < 3) {
      setDestinationSuggestions([]);
      return;
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`,
        { params: { input: value }, headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setDestinationSuggestions(response.data || []);
    } catch (error) {
      console.error("Error fetching destination suggestions:", error);
    }
  };

  const submitHandler = (e) => e.preventDefault();

  // GSAP Animations
  useGSAP(() => {
    if (panelOpen) {
      gsap.to(panelRef.current, { height: '70%', opacity: 1 });
      gsap.to(panelCloseRef.current, { opacity: 1 });
    } else {
      gsap.to(panelRef.current, { height: '0%', opacity: 0 });
      gsap.to(panelCloseRef.current, { opacity: 0 });
    }
  }, [panelOpen]);

  useGSAP(() => {
    gsap.to(vehiclePanelRef.current, {
      transform: vehiclePanel ? 'translateY(0)' : 'translateY(100%)',
    });
  }, [vehiclePanel]);

  useGSAP(() => {
    gsap.to(confirmRidePanelRef.current, {
      transform: confirmRidePanel ? 'translateY(0)' : 'translateY(100%)',
    });
  }, [confirmRidePanel]);

  useGSAP(() => {
    gsap.to(vehicleFoundRef.current, {
      transform: vehicleFound ? 'translateY(0)' : 'translateY(100%)',
    });
  }, [vehicleFound]);

  useGSAP(() => {
    gsap.to(waitingForDriverRef.current, {
      transform: waitingForDriver ? 'translateY(0)' : 'translateY(100%)',
    });
  }, [waitingForDriver]);

  // Fare calculation
  async function findTrip() {
    setVehiclePanel(true);
    setPanelOpen(false);

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/rides/get-fare`,
        {
          params: { pickup, destination },
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setFare(response.data);
    } catch (err) {
      console.error("Error fetching fare:", err);
    }
  }

  // Create ride
  async function createRide() {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/create`,
        { pickup, destination, vehicleType },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      console.log("Ride created:", response.data);
    } catch (err) {
      console.error("Error creating ride:", err);
    }
  }

  return (
    <div className='h-screen relative'>
      {/* Header */}
      <div className='fixed p-2 top-0 flex items-center justify-between w-screen '>
        <img className='w-28 top-0 left-2 ' src="/image.png" alt="logo" />
        <Link to='/login' className='h-10 w-10 bg-white flex items-center justify-center rounded-full'>
          <i className='text-lg font-medium ri-logout-box-r-line'></i>
        </Link>
      </div>

      {/* Background map */}
      <div onClick={() => setVehiclePanel(false)} className='h-screen w-screen'>
        <img className='w-full h-full object-cover' src="https://miro.medium.com/max/1280/0*gwMx05pqII5hbfmX.gif" alt="map"/>
      </div>

      {/* Form */}
      <div className='flex flex-col justify-end h-screen absolute top-0 w-full '>
        <div className='h-[30%] p-5 rounded-t-3xl bg-white relative'>
          <h5 ref={panelCloseRef} onClick={() => setPanelOpen(false)} className='absolute opacity-0 top-6 right-6 text-2xl'>
            <i className='ri-arrow-down-wide-line'></i>
          </h5>
          <h4 className='text-2xl font-semibold'>Find a trip</h4>
          <form onSubmit={submitHandler}>
            <input className='line absolute h-16 w-1 top-[45%] left-9 bg-gray-700 rounded-full' />
            <input
              onClick={() => { setPanelOpen(true); setActiveField('pickup'); }}
              value={pickup}
              onChange={handlePickupChange}
              className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-5'
              type='text'
              placeholder='Add a pick-up location'
            />
            <input
              onClick={() => { setPanelOpen(true); setActiveField('destination'); }}
              value={destination}
              onChange={handleDestinationChange}
              className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-3'
              type='text'
              placeholder='Enter your destination'
            />
          </form>
          <button onClick={findTrip} className='bg-black text-white font-semibold px-4 py-2 rounded-lg mt-3 w-full'>Find Trip</button>
        </div>

        {/* Suggestions Panel */}
        <div ref={panelRef} className='h-0 bg-white overflow-y-auto'>
          <LocationSearchPanel
            query={activeField === 'pickup' ? pickup : destination}
            setPanelOpen={setPanelOpen}
            setVehiclePanel={setVehiclePanel}
            setPickup={setPickup}
            setDestination={setDestination}
            activeField={activeField}
            pickupSuggestions={pickupSuggestions}
            destinationSuggestions={destinationSuggestions}
          />
        </div>
      </div>

      {/* Vehicle Selection */}
      <div ref={vehiclePanelRef} className='fixed w-full z-10 bottom-0 translate-y-full px-3 py-10 pt-12 bg-white rounded-t-3xl'>
        <VehiclePanel selectVehicle={setVehicleType} fare={fare} setConfirmRidePanel={setConfirmRidePanel} setVehiclePanel={setVehiclePanel} />
      </div>

      {/* Confirm Ride */}
      <div ref={confirmRidePanelRef} className='fixed w-full z-10 bottom-0 translate-y-full px-3 py-6 pt-12 bg-white rounded-t-3xl'>
        <ConfirmRide
          createRide={createRide}
          pickup={pickup}
          destination={destination}
          fare={fare}
          vehicleType={vehicleType}
          setConfirmRidePanel={setConfirmRidePanel}
          setVehicleFound={setVehicleFound}
        />
      </div>

      {/* Looking for Driver */}
      <div ref={vehicleFoundRef} className='fixed w-full z-10 bottom-0 translate-y-full px-3 py-6 pt-12 bg-white rounded-t-3xl'>
        <LookingForDriver
          createRide={createRide}
          pickup={pickup}
          destination={destination}
          fare={fare}
          vehicleType={vehicleType}
          setVehicleFound={setVehicleFound}
          setWaitingForDriver={setWaitingForDriver}
        />
      </div>

      {/* Waiting for Driver */}
      <div ref={waitingForDriverRef} className='fixed w-full z-10 bottom-0 translate-y-full px-3 py-6 pt-12 bg-white rounded-t-3xl'>
        <WaitingForDriver
          ride={ride}
          setVehicleFound={setVehicleFound}
          setWaitingForDriver={setWaitingForDriver}
          waitingForDriver={waitingForDriver}
        />
      </div>
    </div>
  );
};

export default Home;
