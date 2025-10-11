// src/pages/auth/Signup.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, database } from '../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { FaArrowLeft } from 'react-icons/fa';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user info to Realtime Database
      await set(ref(database, 'users/' + user.uid), {
        username: username,
        email: user.email,
        registrationDate: new Date().toLocaleDateString('en-US'),
      });

      navigate('/dashboard');
    } catch (error) {
      alert(`Signup failed: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg flex flex-col">
        <div className="bg-[#8B5CF6] p-8 rounded-t-2xl text-white relative">
          <button onClick={() => navigate('/login')} className="absolute top-4 left-4 p-2 rounded-full hover:bg-white/20">
            <FaArrowLeft />
          </button>
          <h1 className="text-3xl font-bold">Create Account</h1>
          <p className="text-sm opacity-90">Get started with AI Podcasts</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Username</label>
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                required
              />
            </div>
             <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] text-white py-3 rounded-lg font-semibold shadow-md hover:opacity-90 transition mt-4"
            >
              Sign Up
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <span onClick={() => navigate('/login')} className="text-[#8B5CF6] font-semibold cursor-pointer hover:underline">
              Sign In
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;