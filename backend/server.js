require("dotenv").config();
const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
const axios = require("axios");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;5000;

app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MURF_API_KEY = process.env.MURF_API_KEY;

if (!GEMINI_API_KEY || !MURF_API_KEY) {
  console.error("GEMINI_API_KEY or MURF_API_KEY missing in .env");
  process.exit(1);
}

// If ffmpeg is not in PATH, set manually
// ffmpeg.setFfmpegPath("C:\\ffmpeg\\bin\\ffmpeg.exe");
// ffmpeg.setFfprobePath("C:\\ffmpeg\\bin\\ffprobe.exe");

// ------------------------ Generate Podcast Script ------------------------
app.post("/generatePodcast", async (req, res) => {
  try {
    const { title, content, speaker1Name, speaker2Name } = req.body;
    if (!title || !content || !speaker1Name || !speaker2Name) {
      return res.status(400).json({ error: "Title, content, and both speaker names are required" });
    }

    const prompt = `
You are a dialogue generation assistant. Your only task is to write dialogue.

CRITICAL RULES:
1. Output MUST be plain text dialogue ONLY.
2. Do NOT include any text outside the dialogue.
3. Use the speaker names exactly as given.
4. Generate content less than 2900 characters.

TASK:
Generate a podcast dialogue about this topic: "${content}"

SPEAKERS:
- Speaker 1: "${speaker1Name}"
- Speaker 2: "${speaker2Name}"
`;

    const apiRes = await fetch(
      `https://aiplatform.googleapis.com/v1/publishers/google/models/gemini-2.5-flash-lite:streamGenerateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }] }),
      }
    );

    if (!apiRes.ok) throw new Error(`Google API error ${apiRes.status}`);
    const data = await apiRes.json();

    let result = "";
    if (data?.candidates?.length) {
      data.candidates.forEach(candidate => {
        const text = candidate?.content?.parts?.[0]?.text;
        if (text) result += text;
      });
    } else if (Array.isArray(data)) {
      data.forEach(item => {
        const text = item?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) result += text;
      });
    } else {
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) result += text;
    }

    res.json({ result: result.trim() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Failed to generate script" });
  }
});

// ------------------------ Generate TTS & Merge ------------------------
app.post("/generateAudio", async (req, res) => {
  try {
    const { text, speaker1Gender, speaker2Gender, speaker1Name, speaker2Name, language } = req.body;

    // Map of voices; for same gender, we pick different voices
    const voiceMap = {
      "en-US": { male: ["en-US-miles", "en-US-ryan"], female: ["en-US-natalie", "en-US-ariana"] },
      "en-UK": { male: ["en-UK-theo", "en-UK-oliver"], female: ["en-UK-ruby", "en-UK-hazel"] },
      "en-IN": { male: ["en-IN-aarav", "en-IN-rohan"], female: ["en-IN-arohi", "en-IN-alia"] },
      "de-DE": { male: ["de-DE-matthias", "de-DE-björn"], female: ["de-DE-lia", "de-DE-erna"] },
      "es-MX": { male: ["es-MX-carlos", "es-MX-alejandro"], female: ["es-MX-valeria", "	es-MX-luisa"] },
      "it-IT": { male: ["it-IT-lorenzo", "it-IT-angelo"], female: ["it-IT-giulia", "it-IT-vera"] },
      "zh-CN": { male: ["zh-CN-tao", "zh-CN-zhang"], female: ["zh-CN-jiao", "zh-CN-baolin"] },
      "hi-IN": { male: ["hi-IN-kabir", "hi-IN-shaan"], female: ["hi-IN-ayushi", "hi-IN-shweta"] },
      "ta-IN": { male: ["ta-IN-sarvesh", "ta-IN-suresh"], female: ["ta-IN-iniya", "ta-IN-abirami"] },
    };

    const segments = [];
    const lines = text.split("\n").filter(l => l.trim() !== "");

    for (let line of lines) {
      line = line.trim();
      let speaker, content;
      if (line.startsWith(`${speaker1Name}:`)) {
        speaker = speaker1Name;
        content = line.replace(`${speaker1Name}:`, "").trim();
      } else if (line.startsWith(`${speaker2Name}:`)) {
        speaker = speaker2Name;
        content = line.replace(`${speaker2Name}:`, "").trim();
      } else {
        speaker = speaker1Name;
        content = line;
      }

      const gender = speaker === speaker1Name ? speaker1Gender : speaker2Gender;
      const voices = voiceMap[language]?.[gender] || ["en-US-natalie", "en-US-sara"];
      const voiceId = speaker === speaker1Name ? voices[0] : voices[1];

      // Split content into <= 3000 char chunks
      const chunks = [];
      let start = 0;
      while (start < content.length) {
        chunks.push(content.slice(start, start + 3000));
        start += 3000;
      }

      for (let chunk of chunks) {
        const ttsResponse = await axios.post(
          "https://api.murf.ai/v1/speech/generate",
          { text: chunk, voiceId },
          { headers: { "Content-Type": "application/json", Accept: "application/json", "api-key": MURF_API_KEY } }
        );

        // Download audio to temp file
        const audioUrl = ttsResponse.data.audioFile;
        const audioRes = await axios.get(audioUrl, { responseType: "arraybuffer" });
        const fileName = path.join(__dirname, `temp_${segments.length}.mp3`);
        fs.writeFileSync(fileName, Buffer.from(audioRes.data));
        segments.push(fileName);
      }
    }

    // Merge all segments
    const outputFile = path.join(__dirname, `merged_${Date.now()}.mp3`);
    await new Promise((resolve, reject) => {
      const ffmpegCommand = ffmpeg();
      segments.forEach(f => ffmpegCommand.input(f));
      ffmpegCommand
        .on("end", () => resolve())
        .on("error", (err) => reject(err))
        .mergeToFile(outputFile);
    });

    // Cleanup temp files
    segments.forEach(f => fs.unlinkSync(f));

    // Return merged audio URL
    res.json({ audioUrl: `http://localhost:${PORT}/${path.basename(outputFile)}` });

  } catch (err) {
    console.error("❌ Error generating audio:", err.response?.data || err.message);
    res.status(500).json({ error: err.message || "Failed to generate audio" });
  }
});

// Serve merged files
app.use(express.static(__dirname));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
