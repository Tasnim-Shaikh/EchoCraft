// src/pages/user/CreatePodcast.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCloudUploadAlt, FaComments } from 'react-icons/fa';

const CreatePodcast = () => {
    const [content, setContent] = useState('');
    const navigate = useNavigate();

    const handleContentChange = (e) => {
        if (e.target.value.length <= 5000) { // Example limit
            setContent(e.target.value);
        }
    };
    
    return (
        <div className="bg-[#121212] text-white min-h-screen font-sans p-8">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => navigate('/dashboard')} className="p-2 rounded-full hover:bg-[#1E1E1E]">
                        <FaArrowLeft size={20} />
                    </button>
                    <h1 className="text-3xl font-bold">Create Your Podcast</h1>
                </div>

                {/* Upload Content Section */}
                <div className="bg-[#1E1E1E] p-6 rounded-lg border border-gray-700 mb-8">
                    <h2 className="text-xl font-semibold mb-4 text-purple-400">Upload Content</h2>
                    <label className="text-sm text-gray-400 mb-2 block">Podcast Content</label>
                    <div className="relative">
                         <textarea
                            placeholder="Enter your podcast content (minimum 50 characters)..."
                            value={content}
                            onChange={handleContentChange}
                            className="w-full h-48 bg-[#2A2A2A] p-4 rounded-lg border border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                        />
                        <p className="absolute bottom-3 right-3 text-xs text-gray-500">{content.length} / 5000</p>
                    </div>
                    <label className="text-sm text-gray-400 mt-4 mb-2 block">Supporting Image (Optional)</label>
                    <div className="border-2 border-dashed border-gray-600 rounded-lg p-10 flex flex-col items-center justify-center cursor-pointer hover:border-purple-500">
                        <FaCloudUploadAlt size={40} className="text-gray-500 mb-2"/>
                        <p>Click to upload or drag and drop</p>
                    </div>
                </div>

                {/* AI Features Section */}
                 <div className="bg-[#1E1E1E] p-6 rounded-lg border border-gray-700">
                    <h2 className="text-xl font-semibold mb-4 text-purple-400">AI Features</h2>
                    <div className="flex items-start gap-4">
                        <FaComments size={24} className="text-purple-400 mt-1"/>
                        <div>
                            <h3 className="font-semibold">Generate two-person natural conversation</h3>
                            <p className="text-sm text-gray-400">Our AI creates realistic dialogues between two speakers with distinct personalities.</p>
                        </div>
                    </div>
                 </div>

                 <div className="flex justify-end mt-8">
                    <button className="bg-[#6D28D9] font-bold py-3 px-8 rounded-lg hover:bg-[#5b21b6] transition-colors">
                        Generate Podcast
                    </button>
                 </div>
            </div>
        </div>
    );
};

export default CreatePodcast;