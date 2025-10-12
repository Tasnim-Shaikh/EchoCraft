import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { FaArrowLeft, FaGoogle } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Check for Admin Credentials
      if (email === "admin@example.com" && password === "admin123") {
        await signInWithEmailAndPassword(auth, email, password);
        navigate('/admin/dashboard');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        navigate('/dashboard');
      }
    } catch (error) {
      alert(`Login failed: ${error.message}`);
    }
  };
  
    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            navigate("/dashboard");
        } catch (error) {
            alert(error.message);
        }
    };


  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg flex flex-col">
        {/* Header Section */}
        <div className="bg-[#8B5CF6] p-8 rounded-t-2xl text-white relative">
          <button onClick={() => navigate('/')} className="absolute top-4 left-4 p-2 rounded-full hover:bg-white/20">
            <FaArrowLeft />
          </button>
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="text-sm opacity-90">Sign in to continue</p>
        </div>

        {/* Form Section */}
        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
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
              className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] text-white py-3 rounded-lg font-semibold shadow-md hover:opacity-90 transition"
            >
              Sign In
            </button>
          </form>

    
          
          {/* Sign Up Link */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <span onClick={() => navigate('/signup')} className="text-[#8B5CF6] font-semibold cursor-pointer hover:underline">
              Sign Up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
