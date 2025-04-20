import "dotenv/config";
import express from "express";
import https from "https";
import { createServer } from "http";
import { Server } from "socket.io";
import fs from "fs";

// Load the certificate and key
const key = fs.readFileSync("certs/server.key");
const cert = fs.readFileSync("certs/server.crt");

// Explicitly type the options for HTTPS server
const options: https.ServerOptions = {
  key,
  cert,
};

const PORT = Number(process.env.WS_PORT) || 3001;
const app = express();
const server = https.createServer(options, app);

app.get("/health", (req, res) => {
  res.status(200).json({ message: "Web Socket Server health ok " });
});

const io = new Server(server, {
  // cors: { origin: process.env.FRONTEND_URL, credentials: true },
  cors: { origin: "*" },
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

  // video streams functionality
  // Store peer IDs in a room (for simplicity, using a single room)
  const roomName = "video-room";
  const peersInRoom = new Set(); // Tracks PeerJS IDs in the room

  // Handle join-room event
  socket.on("join-room", (peerId, username) => {
    if (!peerId || typeof peerId !== "string") {
      console.error("Invalid peerId:", peerId);
      return;
    }

    // Join the room
    socket.join(roomName);
    peersInRoom.add(peerId);
    console.log(`Peer ${peerId} joined room ${roomName}`);
    // Notify other clients in the room about the new peer
    socket.to(roomName).emit("user-connected", peerId, username);
    // Send the new client a list of existing peers (optional, for immediate connection)
    socket.emit(
      "existing-peers",
      Array.from(peersInRoom).filter(id => id !== peerId)
    );
  });

  // Handle client disconnect
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
    // Find the peerId associated with this socket (if any)
    let peerIdToRemove;
    for (const peerId of peersInRoom) {
      if (socket.rooms.has(roomName)) {
        peerIdToRemove = peerId;
        break;
      }
    }
    if (peerIdToRemove) {
      peersInRoom.delete(peerIdToRemove);
      // Notify other clients in the room
      io.to(roomName).emit("user-disconnected", peerIdToRemove);
      console.log(`Peer ${peerIdToRemove} left room ${roomName}`);
    }
  });
});

server.listen(PORT, "0.0.0.0", () => console.log(`Web socket Server running on port:${PORT}`));
