import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ConfirmRidePopUp = (props) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!otp.trim()) return alert("Please enter OTP");

    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/rides/start-ride`,
        {
          params: { rideId: props.ride._id, otp },
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );

      if (response.status === 200 || response.status === 201) {
        props.setConfirmRidePopupPanel(false);
        props.setRidePopupPanel(false);
        navigate('/captain-riding', { state: { ride: response.data } });
      }
    } catch (err) {
      console.error(err);
      alert("Failed to start ride. Check OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 w-full max-w-md mx-auto bg-white rounded-t-3xl shadow-xl p-5 z-50 animate-slideUp">
      <div className="relative text-center">
        <button
          className="p-1 absolute top-0 right-0 text-gray-400 hover:text-gray-600"
          onClick={() => props.setRidePopupPanel(false)}
        >
          <i className="text-3xl ri-arrow-down-wide-line"></i>
        </button>
        <h1 className="text-2xl font-semibold mb-4">Confirm this Ride</h1>

        <div className='flex items-center justify-between p-3 bg-green-100 rounded-xl'>
          <div className='flex items-center gap-3'>
            <img
              className='h-12 w-12 rounded-full object-cover border-2 border-green-400'
              src={props.ride?.user?.avatar || 'https://th.bing.com/th/id/OIP.jSFa5zJREQf6N6zOSAEOfgHaE8?w=249&h=180&c=7&r=0&o=5&pid=1.7'}
              alt={props.ride?.user?.fullname || 'User'}
            />
            <h3 className='text-lg font-medium'>{props.ride?.user?.fullname}</h3>
          </div>
          <h3 className='text-lg font-semibold text-green-700'>
            {props.ride?.distance ? `${props.ride.distance} KM` : "Calculating..."}
          </h3>
        </div>
      </div>
      <div className="mt-5 bg-gray-50 rounded-xl shadow-inner divide-y divide-gray-200">
        <div className="flex items-center gap-4 p-4">
          <i className="text-lg ri-map-pin-2-fill text-green-500"></i>
          <div>
            <p className="text-gray-800 font-medium">Pickup</p>
            <p className="text-gray-500 text-sm">{props.ride?.pickup}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-4">
          <i className="text-lg ri-map-pin-user-fill text-red-500"></i>
          <div>
            <p className="text-gray-800 font-medium">Destination</p>
            <p className="text-gray-500 text-sm">{props.ride?.destination}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-4">
          <i className="text-lg ri-currency-line text-yellow-500"></i>
          <div>
            <p className="text-gray-800 font-medium">Fare</p>
            <p className="text-gray-500 text-sm">₹{props.ride?.fare} Cash</p>
          </div>
        </div>
      </div>
      <form onSubmit={submitHandler} className="mt-6 w-full flex flex-col gap-3">
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className='bg-gray-100 p-3 font-mono text-lg rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none w-full'
          placeholder='Enter OTP'
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full p-3 rounded-xl font-semibold ${loading ? 'bg-gray-400' : 'bg-green-600 text-white'} transition-all hover:scale-105`}
        >
          {loading ? "Confirming..." : "Confirm"}
        </button>

        <button
          type='button'
          onClick={() => { props.setConfirmRidePopupPanel(false); props.setRidePopupPanel(false); }}
          className="w-full p-3 rounded-xl font-semibold bg-red-500 text-white transition-all hover:scale-105"
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default ConfirmRidePopUp;
