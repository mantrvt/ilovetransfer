const http = require("http");
const WebSocket = require("ws");
const fs = require("fs");
const path = require("path");

const server = http.createServer((req, res) => {
  let filePath = path.join(__dirname, "public", req.url === "/" ? "index.html" : req.url);
  
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("Not Found");
      return;
    }

    let ext = path.extname(filePath);
    let contentType = "text/html";
    if (ext === ".png") contentType = "image/png";
    if (ext === ".css") contentType = "text/css";
    if (ext === ".js") contentType = "text/javascript";

    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  });
});

const wss = new WebSocket.Server({ server });
const rooms = {}; // { roomName: Set<clients> }

wss.on("connection", (ws) => {
  console.log("🔌 Client connected");

  ws.on("message", (message, isBinary) => {

    // ===== BINARY FILE CHUNKS =====
    if (isBinary) {
      if (!ws.room) return;

      ws.room.forEach(client => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(message, { binary: true });
        }
      });
      return;
    }

    // ===== JSON MESSAGES =====
    let data;
    try {
      data = JSON.parse(message.toString());
    } catch {
      return;
    }

    // JOIN ROOM
    if (data.type === "join") {
      ws.roomName = data.room;
      rooms[data.room] = rooms[data.room] || new Set();
      rooms[data.room].add(ws);
      ws.room = rooms[data.room];

      ws.send(JSON.stringify({
        type: "joined",
        room: data.room
      }));

      console.log(`👥 Joined room: ${data.room}`);
      return;
    }

    // FILE START / END
    if (data.type === "file-start" || data.type === "file-end") {
      if (!ws.room) return;

      ws.room.forEach(client => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(data));
        }
      });
    }
  });

  ws.on("close", () => {
    if (ws.roomName && rooms[ws.roomName]) {
      rooms[ws.roomName].delete(ws);
      console.log(`❌ Left room: ${ws.roomName}`);
    }
  });
});

//IMPORTANT: Render-compatible port
const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log(`iLoveTransfer running on port ${PORT}`);
});
