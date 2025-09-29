import React from "react";

const LoadingCircle = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-20 h-20 rounded-full border-8 border-t-transparent animate-spin"
        style={{
          borderImage: "conic-gradient(#9333ea, #3b82f6) 1",
          borderImageSlice: 1,
        }}>
      </div>
    </div>
  );
};

export default LoadingCircle;
