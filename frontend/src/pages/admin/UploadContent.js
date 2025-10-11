import React, { useState } from "react";
import { database } from '../../firebase';
import { ref, push } from 'firebase/database';

const UploadContent = () => {
  const [podcastTitle, setPodcastTitle] = useState("");
  const [podcastContent, setPodcastContent] = useState("");
  const [speaker1Name, setSpeaker1Name] = useState("");
  const [speaker2Name, setSpeaker2Name] = useState("");
  const [script, setScript] = useState("");
  const [mergedAudioUrl, setMergedAudioUrl] = useState("");
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [language, setLanguage] = useState("en-US");
  const [speaker1Gender, setSpeaker1Gender] = useState("male");
  const [speaker2Gender, setSpeaker2Gender] = useState("female");

  const handleGenerateScript = async () => {
    if (!podcastTitle || !podcastContent || !speaker1Name || !speaker2Name) 
      return alert("Fill all fields");

    setIsGeneratingScript(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/generatePodcast`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: podcastTitle, content: podcastContent, speaker1Name, speaker2Name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate script");
      setScript(data.result);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsGeneratingScript(false);
    }
  };

  const handleGenerateAudio = async () => {
    if (!script) return alert("Script is empty!");
    setIsGeneratingAudio(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/generateAudio`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          text: script,
          speaker1Gender,
          speaker2Gender,
          speaker1Name,
          speaker2Name,
          language
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate audio");
      setMergedAudioUrl(data.audioUrl);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  const handleUploadPodcast = async () => {
    if (!podcastTitle || !podcastContent || !script || !mergedAudioUrl) {
      return alert("Please generate script and audio before uploading");
    }

    setIsUploading(true);
    try {
      const podcastsRef = ref(database, 'podcasts');
      await push(podcastsRef, {
        title: podcastTitle,
        content: podcastContent,
        script,
        audioUrl: mergedAudioUrl,
        speaker1Name,
        speaker2Name,
        speaker1Gender,
        speaker2Gender,
        language,
        date: new Date().toLocaleDateString(),
        views: 0
      });
      alert("Podcast uploaded successfully!");
      setPodcastTitle("");
      setPodcastContent("");
      setSpeaker1Name("");
      setSpeaker2Name("");
      setScript("");
      setMergedAudioUrl("");
    } catch (err) {
      console.error(err);
      alert("Failed to upload podcast.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-2xl shadow-lg w-full max-w-3xl p-6 space-y-6">
        <h1 className="text-3xl font-bold text-white text-center mb-4 flex items-center justify-center gap-2">
          <span role="img" aria-label="mic">🎤</span> Podcast Generator
        </h1>

        {/* Inputs */}
        <input 
          placeholder="Podcast Title" 
          value={podcastTitle} 
          onChange={e => setPodcastTitle(e.target.value)} 
          className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <textarea 
          placeholder="Podcast Content" 
          value={podcastContent} 
          onChange={e => setPodcastContent(e.target.value)} 
          className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 h-28 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <div className="flex gap-4">
          <input 
            placeholder="Speaker 1 Name" 
            value={speaker1Name} 
            onChange={e => setSpeaker1Name(e.target.value)} 
            className="flex-1 p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input 
            placeholder="Speaker 2 Name" 
            value={speaker2Name} 
            onChange={e => setSpeaker2Name(e.target.value)} 
            className="flex-1 p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex gap-4 items-center">
          <div className="flex flex-col">
            <label className="text-gray-300 mb-1">Speaker 1 Gender</label>
            <select 
              value={speaker1Gender} 
              onChange={e => setSpeaker1Gender(e.target.value)} 
              className="p-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-gray-300 mb-1">Speaker 2 Gender</label>
            <select 
              value={speaker2Gender} 
              onChange={e => setSpeaker2Gender(e.target.value)} 
              className="p-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div className="flex flex-col flex-1">
            <label className="text-gray-300 mb-1">Language</label>
            <select 
              value={language} 
              onChange={e => setLanguage(e.target.value)} 
              className="p-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="en-US">English US</option>
              <option value="en-UK">English UK</option>
              <option value="en-IN">English IN</option>
              <option value="de-DE">Germany</option>
              <option value="es-MX">Spanish</option>
              <option value="it-IT">Italian</option>
              <option value="zh-CN">Chinese</option>
              <option value="hi-IN">Hindi</option>
              <option value="ta-IN">Tamil</option>
            </select>
          </div>
        </div>

        <button 
          onClick={handleGenerateScript} 
          disabled={isGeneratingScript} 
          className="w-full py-3 bg-purple-600 rounded-lg text-white font-bold hover:bg-purple-700 transition"
        >
          {isGeneratingScript ? "Generating..." : "Generate Script"}
        </button>

        {script && (
          <div className="space-y-3">
            <h2 className="text-white font-semibold">Script</h2>
            <textarea 
              value={script} 
              onChange={e => setScript(e.target.value)} 
              className="w-full p-3 rounded-lg bg-gray-700 text-white h-28 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button 
              onClick={handleGenerateAudio} 
              disabled={isGeneratingAudio} 
              className="w-full py-3 bg-purple-600 rounded-lg text-white font-bold hover:bg-purple-700 transition"
            >
              {isGeneratingAudio ? "Generating Audio..." : "Generate Merged Audio"}
            </button>
          </div>
        )}

        {mergedAudioUrl && (
          <div className="space-y-2">
            <h2 className="text-white font-semibold">Merged Podcast Audio</h2>
            <audio controls src={mergedAudioUrl} className="w-full rounded-lg" />
          </div>
        )}

        {mergedAudioUrl && script && (
          <button 
            onClick={handleUploadPodcast} 
            disabled={isUploading} 
            className="w-full py-3 bg-green-500 rounded-lg text-white font-bold hover:bg-green-600 transition"
          >
            {isUploading ? "Uploading..." : "Upload Podcast"}
          </button>
        )}
      </div>
    </div>
  );
};

export default UploadContent;
