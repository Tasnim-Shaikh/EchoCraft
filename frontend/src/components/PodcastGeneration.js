import React, { useState, useEffect, useRef } from "react";

export default function PodcastGeneration() {
  const [topic, setTopic] = useState("");
  const [dialogue, setDialogue] = useState("");
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const wsRef = useRef(null);

  const handleGenerate = () => {
    if (!topic) return alert("Enter a topic");

    setLoading(true);
    setDialogue("");
    setAudioUrl(null);

    wsRef.current = new WebSocket("ws://localhost:5000"); // Replace with deployed backend
    wsRef.current.onopen = () => {
      wsRef.current.send(JSON.stringify({ topic }));
    };

    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setDialogue(data.dialogue);

      // Convert base64 to audio URL
      const audioBlob = new Blob([Uint8Array.from(atob(data.audio), c => c.charCodeAt(0))], { type: "audio/mpeg" });
      setAudioUrl(URL.createObjectURL(audioBlob));
      setLoading(false);
    };

    wsRef.current.onclose = () => console.log("WebSocket closed");
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Generate Podcast</h2>
      <input
        type="text"
        placeholder="Enter podcast topic..."
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />
      <button onClick={handleGenerate} className="bg-indigo-500 text-white px-4 py-2 rounded mb-4">
        Generate
      </button>

      {loading && <p className="text-gray-500">Generating podcast...</p>}

      {dialogue && (
        <div className="p-4 border rounded mt-4 bg-gray-50">
          <h3 className="font-semibold mb-2">AI Dialogue:</h3>
          <p>{dialogue}</p>
        </div>
      )}

      {audioUrl && (
        <div className="mt-4">
          <audio controls src={audioUrl} className="w-full"></audio>
        </div>
      )}
    </div>
  );
}
