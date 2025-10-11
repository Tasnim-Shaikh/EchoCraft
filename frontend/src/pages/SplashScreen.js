import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMicrophone } from 'react-icons/fa'; // Using react-icons for the mic icon

const SplashScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#6D28D9]">
      <div className="text-center text-white">
        <h1 className="text-5xl font-bold mb-4">AI Podcast Generator</h1>
        <div className="flex justify-center mb-8">
            <div className="bg-white/20 p-8 rounded-full">
                <FaMicrophone size={60} className="text-white"/>
            </div>
        </div>
        <p className="text-lg mb-8 tracking-wider">Turn ideas into voices — Instantly!</p>
        <button
          onClick={() => navigate('/login')}
          className="bg-white text-[#6D28D9] font-semibold py-3 px-8 rounded-lg shadow-lg transition-transform transform hover:scale-105"
        >
          Get Started
        </button>
      </div>
      <div className="absolute bottom-4 right-4">
         <button
          onClick={() => navigate('/login?admin=true')} // Simple way to hint at admin login
          className="bg-transparent text-white/70 font-semibold py-2 px-4 rounded-lg hover:bg-white/10"
        >
          Admin Panel
        </button>
      </div>
    </div>
  );
};

export default SplashScreen;