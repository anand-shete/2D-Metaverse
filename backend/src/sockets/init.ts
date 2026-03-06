import { FastifyInstance } from "fastify";
import { createPlayer } from "./player";
import { Server } from "socket.io";

// Store player positions
const players: {
  [id: string]: { x: number; y: number };
} = {};

export const initSockets = async (fastify: FastifyInstance, io: Server) => {
  try {
    await fastify.ready();

    // refactor
    io.on("connection", socket => {
      const { id } = socket;

      console.log("socket connected", id);
      players[id] = createPlayer();

      // console.log("New player connected, players: ", players);
      io.emit("user-joined", players);

      socket.on("move", direction => {
        if (direction.x) players[id].x = direction.x;
        if (direction.y) players[id].y = direction.y;
        // console.log("location",Math.random());

        io.emit("update-players", players);
      });

      socket.on("chat-message", data => {
        io.emit("chat-message", { user: data.user, text: data.text });
      });

      socket.on("disconnect", () => {
        // console.log(`Player disconnected with id ${id} Remaining: `, players);
        delete players[id];
        io.emit("update-players", players);
      });

      // video streams functionality
      const roomName = "video-room";
      const peersInRoom = new Set(); // Tracks PeerJS IDs in the room

      // Handle join-room event
      socket.on("join-room", (peerId, username) => {
        // console.log("done1");
        if (!peerId || typeof peerId !== "string") {
          console.error("Invalid peerId:", peerId);
          return;
        }

        // console.log("done2");
        // Join the room
        socket.join(roomName);
        peersInRoom.add(peerId);
        console.log(`Peer ${peerId} joined room ${roomName}`);
        // Notify other clients in the room about the new peer
        socket.to(roomName).emit("user-connected", peerId, username);
        // Send the new client a list of existing peers (optional, for immediate connection)
        socket.emit(
          "existing-peers",
          Array.from(peersInRoom).filter(id => id !== peerId),
        );
      });

      // Handle client disconnect
      socket.on("disconnect", () => {
        console.log("Client disconnected:", id);
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
  } catch (error: any) {
    console.log("Error connecting websockets", error);
    process.exit(1);
  }
};

export default initSockets;
