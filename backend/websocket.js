const WebSocket = require("ws");
const murfService = require("./murfService");
const dialogService = require("./dialogService");

module.exports = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    console.log("Client connected");

    ws.on("message", async (message) => {
      const data = JSON.parse(message);

      if (data.topic) {
        // Generate dialogue using OpenAI
        const dialogue = await dialogService.generateDialogue(data.topic);

        // Convert dialogue to audio using Murf
        const audioBase64 = await murfService.generateAudioStream(dialogue);

        ws.send(JSON.stringify({ dialogue, audio: audioBase64 }));
      }
    });

    ws.on("close", () => console.log("Client disconnected"));
  });
};
