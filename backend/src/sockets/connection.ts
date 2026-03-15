import { Socket } from "socket.io";
import { FastifyInstance } from "fastify";
import { move } from "./events/move";
import { chat } from "./events/chat";

// Store player positions
const players: Map<string, { x: number; y: number }> = new Map();

export const handleConnection = (socket: Socket, fastify: FastifyInstance) => {
  const { id } = socket;
  // console.log("socket connected:", id);

  fastify.io.emit("player:join", players);

  socket.on("player:move", direction => {
    move(id, fastify, players, direction);
  });

  socket.on("player:message", data => {
    chat(fastify, data);
  });

  socket.on("peer:joined", (peerId: string) => {
    console.log("new peer available",peerId)
    socket.broadcast.emit("peer:available", peerId);
  });

  socket.on("peer:disconnect", socketId => {
    players.delete(socketId);
  });

  // TODO handle socket disconnections
  socket.on("disconnect", id => {
    // console.log("client disconnected", id);
  });
};
