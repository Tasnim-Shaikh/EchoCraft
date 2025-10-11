import React from "react";
import { useNavigate } from "react-router-dom";

export default function SplashScreen() {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
      <h1 className="text-6xl font-bold mb-4 animate-bounce">AI Podcast Generator</h1>
      <p className="text-xl mb-8 animate-pulse">Turn ideas into voices — Instantly!</p>
      <button
        onClick={() => navigate("/login")}
        className="px-6 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-gray-200 transition transform hover:scale-105 shadow-lg"
      >
        Get Started
      </button>
    </div>
  );
}
