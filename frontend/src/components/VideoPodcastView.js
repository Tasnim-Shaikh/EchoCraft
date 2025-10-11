import React, { useState } from "react";

export default function VideoPodcastView() {
  const [audioSrc, setAudioSrc] = useState(null);
  const [playing, setPlaying] = useState(false);

  // Replace with audio from PodcastGeneration component
  const handlePlay = () => setPlaying(true);
  const handlePause = () => setPlaying(false);

  return (
    <div className="p-6 max-w-3xl mx-auto text-center">
      <h2 className="text-2xl font-bold mb-4">Video Podcast</h2>
      <div className="flex justify-center gap-4 mb-4">
        <img src="/assets/person1.png" alt="Person 1" className="w-32 h-32 rounded-full shadow-lg animate-pulse" />
        <img src="/assets/person2.png" alt="Person 2" className="w-32 h-32 rounded-full shadow-lg animate-pulse" />
      </div>

      {audioSrc && (
        <audio controls src={audioSrc} autoPlay={playing} className="w-full mb-4"></audio>
      )}

      <div>
        <button onClick={handlePlay} className="bg-green-500 text-white px-4 py-2 rounded mr-2">Play</button>
        <button onClick={handlePause} className="bg-red-500 text-white px-4 py-2 rounded">Pause</button>
      </div>
    </div>
  );
}
