import React, { useContext } from 'react';
import { CaptainDataContext } from '../context/CaptainContext';
import useFetchCaptain from '../hooks/useFetchCaptain'; 
import Loading from './Loading';

const CaptainDetails = () => {
  const { captain, stats, isLoading } = useContext(CaptainDataContext);
  useFetchCaptain();

   const formatHours = (hoursDecimal) => {
  if (!hoursDecimal) return "0h 0m";
  const totalMinutes = Math.round(hoursDecimal * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${h}h ${m}m`;
};


  if (isLoading || !captain) return <Loading/>;

  return (
    <div className="p-2  bg-white ">
      <div className="flex items-center px-2 rounded-lg py-2 bg-blue-50 justify-between">
        <div className="flex items-center gap-3">
          <img
            className="h-12 w-12 rounded-full object-cover "
            src="https://images.freeimages.com/images/premium/previews/1396/13965355-young-cheerful-indian-auto-rickshaw-driver.jpg"
            alt="Captain"
          />
          <h4 className="text-xl font-bold capitalize">
            {captain.fullname.firstname} {captain.fullname.lastname}
          </h4>
        </div>
        <div className="text-right">
          <h4 className="text-2xl  text-green-600 truncate font-bold">₹{captain?.totalEarnings || '0.00'}</h4>
          <p className="text-xs font-medium text-gray-600">Total Earned</p>
        </div>
      </div>
      <div className="flex px-3 py-4 bg-gray-100 mt-4 rounded-xl gap-5 justify-around items-center">
        <div className="text-center">
          <i className="text-3xl mb-2 text-blue-500 font-thin ri-timer-2-line"></i>
          <h5 className="text-lg font-medium">{formatHours(captain?.totalHours || 0)}</h5>
          <p className="text-sm text-gray-600">Hours Online</p>
        </div>
        <div className="text-center">
          <i className="text-3xl mb-2 font-thin text-purple-500 ri-roadster-line"></i>
          <h5 className="text-lg font-medium">{captain?.totalKm || '0.00'}</h5>
          <p className="text-sm text-gray-600">Total KM</p>
        </div>
        <div className="text-center">
          <i className="text-3xl mb-2 text-yellow-500 font-thin ri-booklet-line"></i>
          <h5 className="text-lg font-medium">{captain?.completedRides || 0}</h5>
          <p className="text-sm text-gray-600">Total Trips</p>
        </div>
      </div>
    </div>
  );
};

export default CaptainDetails;
