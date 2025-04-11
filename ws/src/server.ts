import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const PORT = process.env.WS_PORT;
const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: { origin: "http://localhost:5173", credentials: true },
});

const players: any = {}; // Store player positions

io.on("connection", (socket) => {
  players[socket.id] = {
    x: Math.floor(Math.random() * 701) + 300,
    y: Math.floor(Math.random() * 501) + 100,
  };
  console.log("New player connected, players: ", players);
  io.emit("user-joined", players);

  socket.on("move", (direction) => {
    if (direction.x) players[socket.id].x = direction.x;
    if (direction.y) players[socket.id].y = direction.y;
    // console.log("updated postition", players);s
    io.emit("update-players", players);
  });

  // Handle player disconnect
  socket.on("disconnect", () => {
    // console.log(`Player disconnected with id ${socket.id} Remaining: `, players);
    delete players[socket.id];
    io.emit("update-players", players);
  });
});

server.listen(PORT, () =>
  console.log(`Web socket Server running on port:${PORT}`)
);
