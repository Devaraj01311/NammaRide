
import React from 'react';

const ConfirmRide = (props) => {
const vehicleImages = {
  car: "https://i.pinimg.com/originals/93/c1/05/93c105244c0a3de81267a89cb13386f7.png",
  motorcycle: "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,w_956,h_637/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png",
  auto: "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png",
};


  return (
    <div>
      <div className="relative text-center">
        <button
          className="p-1 absolute w-[93%] top-0"
          onClick={() => props.setConfirmRidePanel(false)}
        >
          <i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
        </button>
        <h1 className="text-2xl font-semibold mb-5 pt-10">Confirm your Ride</h1>
      </div>
      <div className="flex gap-2 justify-between items-center flex-col">
        <img
          className="h-20"
          src={vehicleImages[props.vehicleType]} 
          alt={props.vehicleType}
        />
        <div className="w-full mt-5 ">
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="text-lg ri-map-pin-2-fill text-green-500"></i>
            <div>
              <h3 className="text-lg font-semibold">Pickup</h3>
              <p className="text-sm -mt-1 text-gray-600">
                {props.pickup}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="text-lg ri-map-pin-user-fill text-red-500"></i>
            <div>
              <h3 className="text-lg font-medium">Destination</h3>
              <p className="text-sm -mt-1 text-gray-600">
                {props.destination}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="text-lg ri-currency-line text-yellow-500"></i>
            <div>
              <h3 className="text-lg font-medium ">
                ₹{props.fare[props.vehicleType]}
              </h3>
              <p className="text-sm -mt-1 text-gray-600">Cash</p>
            </div>
          </div>
        </div>
        <button
          onClick={() => {
            props.setVehicleFound(true);
            props.setConfirmRidePanel(false);
            props.createRide();
          }}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl shadow-md transition duration-200"
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default ConfirmRide;
