const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const cors = require("cors");

const app = express();
app.use(cors());

// Tạo server HTTP
const server = http.createServer(app);

// Tạo WebSocket server
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("🔥 Client connected to WebSocket");

  ws.on("message", (message) => {
    console.log(`📩 Received: ${message}`);
    ws.send(`Server received: ${message}`);
  });

  ws.on("close", () => {
    console.log("❌ Client disconnected");
  });
});

// API đơn giản để kiểm tra server
app.get("/", (req, res) => {
  res.send("🚀 Server is running!");
});

// Lắng nghe cổng 3000
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
