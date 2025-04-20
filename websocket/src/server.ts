import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const PORT = process.env.WS_PORT || 3001;
const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: { origin: process.env.FRONTEND_URL, credentials: true },
});

const players: any = {}; // Store player positions

io.on("connection", socket => {
  players[socket.id] = {
    x: Math.floor(Math.random() * 701) + 300,
    y: Math.floor(Math.random() * 501) + 100,
  };
  // console.log("New player connected, players: ", players);
  io.emit("user-joined", players);

  socket.on("move", direction => {
    if (direction.x) players[socket.id].x = direction.x;
    if (direction.y) players[socket.id].y = direction.y;
    // console.log("location",Math.random());
    
    io.emit("update-players", players);
  });

  socket.on("chat-message", data => {
    io.emit("chat-message", { user: data.user, text: data.text });
  });

  // Handle player disconnect
  socket.on("disconnect", () => {
    // console.log(`Player disconnected with id ${socket.id} Remaining: `, players);
    delete players[socket.id];
    io.emit("update-players", players);
  });
});

server.listen(PORT, () => console.log(`Web socket Server running on port:${PORT}`));
