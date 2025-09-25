import React from 'react';

const LoadingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 animate-fadeIn">
      {/* Gradient spinner */}
      <div className="w-16 h-16 border-4 border-t-transparent border-blue-500 border-b-purple-500 rounded-full animate-spin mb-4"></div>

      {/* Animated dots */}
      <div className="flex space-x-2">
        <span className="w-3 h-3 bg-blue-500 rounded-full animate-bounce delay-75"></span>
        <span className="w-3 h-3 bg-blue-500 rounded-full animate-bounce delay-150"></span>
        <span className="w-3 h-3 bg-blue-500 rounded-full animate-bounce delay-300"></span>
      </div>

      <p className="text-gray-700 text-lg font-medium mt-4">Loading...</p>
    </div>
  );
};

export default LoadingPage;
