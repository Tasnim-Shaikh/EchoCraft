const axios = require("axios");

module.exports = {
  generateAudioStream: async (text) => {
    const API_KEY = process.env.MURF_API_KEY;

    const response = await axios.post(
      "https://api.murf.ai/v1/text-to-speech",
      { text, voice: "female_english_us" },
      { headers: { Authorization: `Bearer ${API_KEY}` } }
    );

    // return base64 audio
    return response.data.audio;
  }
};
