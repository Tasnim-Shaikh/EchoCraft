import React, { useState, useEffect } from "react";
import { database } from "../firebase";
import { ref, onValue } from "firebase/database";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [polls, setPolls] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const pollRef = ref(database, "polls");
    onValue(pollRef, (snapshot) => {
      const data = snapshot.val();
      setPolls(data ? Object.values(data) : []);
    });
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Dashboard</h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Upload Content Card */}
        <div
          onClick={() => navigate("/upload")}
          className="p-6 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl shadow-lg cursor-pointer hover:scale-105 transition-transform"
        >
          <h3 className="text-xl font-semibold mb-2">Upload Content</h3>
          <p>Create new podcast content.</p>
        </div>

        {/* Podcast Generation Card */}
        <div
          onClick={() => navigate("/podcast")}
          className="p-6 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-xl shadow-lg cursor-pointer hover:scale-105 transition-transform"
        >
          <h3 className="text-xl font-semibold mb-2">Generate Podcast</h3>
          <p>Turn your topic into an AI podcast.</p>
        </div>

        {/* Video Podcast Card */}
        <div
          onClick={() => navigate("/video")}
          className="p-6 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-xl shadow-lg cursor-pointer hover:scale-105 transition-transform"
        >
          <h3 className="text-xl font-semibold mb-2">Video Podcast</h3>
          <p>View your AI-generated video podcasts.</p>
        </div>

        {/* Poll Creation Card */}
        <div
          onClick={() => navigate("/poll")}
          className="p-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl shadow-lg cursor-pointer hover:scale-105 transition-transform"
        >
          <h3 className="text-xl font-semibold mb-2">Create Poll</h3>
          <p>Engage users with interactive polls.</p>
        </div>

        {/* Admin Panel Card */}
        <div
          onClick={() => navigate("/admin")}
          className="p-6 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-xl shadow-lg cursor-pointer hover:scale-105 transition-transform"
        >
          <h3 className="text-xl font-semibold mb-2">Admin Panel</h3>
          <p>Manage polls and content uploads.</p>
        </div>
      </div>

      {/* Trending Polls Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Trending Polls</h2>
        <div className="grid gap-4">
          {polls.map((poll, index) => (
            <div
              key={index}
              className="p-4 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer"
            >
              <h3 className="text-lg font-semibold">{poll.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
