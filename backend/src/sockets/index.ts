import { FastifyInstance } from "fastify";

const players: any = {}; // Store player positions

const initSockets = async (fastify: FastifyInstance) => {
  try {
    await fastify.ready();

    // refactor
    fastify.io.on("connection", socket => {
      console.log("socket connected", socket.id);
      players[socket.id] = {
        x: Math.floor(Math.random() * 701) + 300,
        y: Math.floor(Math.random() * 501) + 100,
      };
      // console.log("New player connected, players: ", players);
      fastify.io.emit("user-joined", players);

      socket.on("move", direction => {
        if (direction.x) players[socket.id].x = direction.x;
        if (direction.y) players[socket.id].y = direction.y;
        // console.log("location",Math.random());

        fastify.io.emit("update-players", players);
      });

      socket.on("chat-message", data => {
        fastify.io.emit("chat-message", { user: data.user, text: data.text });
      });

      socket.on("disconnect", () => {
        // console.log(`Player disconnected with id ${socket.id} Remaining: `, players);
        delete players[socket.id];
        fastify.io.emit("update-players", players);
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
          fastify.io.to(roomName).emit("user-disconnected", peerIdToRemove);
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
