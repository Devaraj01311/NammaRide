import React from 'react';

const LoadingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-purple-100 to-pink-100 animate-fadeIn">
      
      {/* Simple colorful spinner */}
      <div className="w-16 h-16 border-4 border-t-transparent border-r-pink-500 border-b-blue-500 border-l-purple-500 rounded-full animate-spin mb-6"></div>

      {/* Animated colorful dots */}
      <div className="flex space-x-2">
        <span className="w-3 h-3 bg-pink-500 rounded-full animate-bounce delay-75"></span>
        <span className="w-3 h-3 bg-purple-500 rounded-full animate-bounce delay-150"></span>
        <span className="w-3 h-3 bg-blue-500 rounded-full animate-bounce delay-300"></span>
      </div>

      <p className="text-purple-700 text-lg font-semibold mt-4">Loading...</p>
    </div>
  );
};

export default LoadingPage;
