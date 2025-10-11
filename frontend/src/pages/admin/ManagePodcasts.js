
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { database } from '../../firebase';
import { ref, onValue, remove } from 'firebase/database';

const ManagePodcasts = () => {
  const [podcasts, setPodcasts] = useState([]);
  const [selectedPodcast, setSelectedPodcast] = useState(null); // For modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // Fetch podcasts from Firebase
  useEffect(() => {
    const podcastsRef = ref(database, 'podcasts');
    onValue(podcastsRef, (snapshot) => {
      const data = snapshot.val();
      const loadedPodcasts = data ? Object.entries(data).map(([id, value]) => ({ id, ...value })) : [];
      setPodcasts(loadedPodcasts);
    });
  }, []);

  const handleDeletePodcast = async (podcastId) => {
    if (window.confirm("Are you sure you want to delete this podcast?")) {
      const podcastRef = ref(database, `podcasts/${podcastId}`);
      await remove(podcastRef);
    }
  };

  const handleViewPodcast = (podcast) => {
    setSelectedPodcast(podcast);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedPodcast(null);
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Podcasts</h1>
        <button 
          onClick={() => navigate('/admin/upload')} 
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
        >
          Add Podcast
        </button>
      </div>

      <div className="bg-[#2D3748] rounded-lg p-1">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-600">
              <th className="p-4">ID</th>
              <th className="p-4">Title</th>
              <th className="p-4">Duration</th>
              <th className="p-4">Views</th>
              <th className="p-4">Date</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {podcasts.map((podcast, index) => (
              <tr key={podcast.id} className="border-b border-gray-700 hover:bg-[#3a475a]">
                <td className="p-4">{index + 1}</td>
                <td className="p-4">{podcast.title}</td>
                <td className="p-4">{podcast.duration || 'N/A'}</td>
                <td className="p-4">{podcast.views}</td>
                <td className="p-4">{podcast.date}</td>
                <td className="p-4 flex gap-2">
                  <button 
                    onClick={() => handleViewPodcast(podcast)} 
                    className="text-blue-400 hover:underline"
                  >
                    View
                  </button>
                  {/* <button className="text-gray-400 cursor-not-allowed">Edit</button> */}
                  <button 
                    onClick={() => handleDeletePodcast(podcast.id)} 
                    className="text-red-400 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- Podcast Modal --- */}
      {isModalOpen && selectedPodcast && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-[#1F2937] p-8 rounded-lg w-full max-w-2xl text-white relative">
            <button 
              onClick={handleCloseModal} 
              className="absolute top-4 right-4 text-2xl"
            >
              &times;
            </button>

            <h2 className="text-2xl font-bold mb-4">{selectedPodcast.title}</h2>
            
            {selectedPodcast.audioUrl ? (
              <audio controls className="w-full mb-4">
                <source src={selectedPodcast.audioUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            ) : (
              <p className="text-gray-400 mb-4">No audio available.</p>
            )}

            <h3 className="text-xl font-semibold mb-2">Generated Script / Content:</h3>
            <div className="bg-[#2D3748] p-4 rounded-lg max-h-80 overflow-y-auto">
              {selectedPodcast.script || selectedPodcast.content ? (
                <p>{selectedPodcast.script || selectedPodcast.content}</p>
              ) : (
                <p className="text-gray-400 italic">No script or content available for this podcast.</p>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ManagePodcasts;
