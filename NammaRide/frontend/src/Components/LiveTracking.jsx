import React, { useState, useEffect } from "react";
import { LoadScript, GoogleMap, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const defaultCenter = { lat: -3.745, lng: -38.523 };

const LiveTracking = () => {
  const [currentPosition, setCurrentPosition] = useState(defaultCenter);

  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation not supported by this browser.");
      return;
    }

    // Watch position in real-time
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentPosition({ lat: latitude, lng: longitude });
        console.log(" Position updated:", latitude, longitude);
      },
      (error) => {
        console.error("Error getting position:", error);
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  
  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={currentPosition}
        zoom={15}
      >
        <Marker position={currentPosition} />
      </GoogleMap>
    </LoadScript>
  );
};

export default LiveTracking;
