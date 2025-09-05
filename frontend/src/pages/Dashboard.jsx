import React from "react";
import { useNavigate } from 'react-router-dom';
import  image from '../assets/7563799.jpg';
// frontend\src\assets
export default function Dashboard() {
    const navigate = useNavigate();

    return (
      <div className="flex flex-col md:flex-row h-screen w-screen bg-gradient-to-r from-blue-400 to-purple-600 text-white">
        
        {/* ---------------- Left Side: Welcome Info ---------------- */}
        <div className="flex-1 flex flex-col justify-center items-center p-8 md:p-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-center md:text-left">
            Welcome to ChatApp
          </h1>
          <p className="text-lg md:text-xl text-center md:text-left mb-8 max-w-md">
            Connect with your friends and family instantly. Chat, share, and stay in touch wherever you are.
          </p>
  
          <div className="flex flex-col md:flex-row gap-4">
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-3 rounded-lg bg-white text-blue-600 font-semibold hover:bg-gray-200 transition"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="px-6 py-3 rounded-lg border-2 border-white text-white hover:bg-white hover:text-blue-600 transition"
            >
              Register
            </button>
          </div>
        </div>
  
        {/* ---------------- Right Side: Illustration ---------------- */}
        <div className="flex-1 hidden md:flex justify-center items-center p-8">
          <img
            src={image} // Replace with your illustration
            alt="Chat Illustration"
            className="w-3/4 h-auto"
          />
        </div>
      </div>
    
  );
}