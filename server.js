const http = require("http");
const WebSocket = require("ws");
const fs = require("fs");
const path = require("path");

const server = http.createServer((req, res) => {
  // serve index.html
  if (req.url === "/") {
    fs.readFile(path.join(__dirname, "public/index.html"), (err, data) => {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    });
  }
});

const wss = new WebSocket.Server({ server });
const rooms = {}; // { roomName: Set<clients> }

wss.on("connection", (ws) => {

  ws.on("message", (message, isBinary) => {

    // 🔥 BINARY FILE CHUNK
    if (isBinary) {
      ws.room?.forEach(client => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(message, { binary: true });
        }
      });
      return;
    }

    // 🔥 JSON MESSAGE
    const data = JSON.parse(message.toString());

    // JOIN ROOM
    if (data.type === "join") {
      ws.roomName = data.room;
      rooms[data.room] = rooms[data.room] || new Set();
      rooms[data.room].add(ws);
      ws.room = rooms[data.room];
      return;
    }

    // FILE START / END
    if (data.type === "file-start" || data.type === "file-end") {
      ws.room?.forEach(client => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(data));
        }
      });
    }
  });

  ws.on("close", () => {
    if (ws.roomName && rooms[ws.roomName]) {
      rooms[ws.roomName].delete(ws);
    }
  });
});

server.listen(8080, () => {
  console.log("❤️ iLoveTransfer running at http://localhost:8080");
});
