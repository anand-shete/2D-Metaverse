import { Socket } from "socket.io";
import { FastifyInstance } from "fastify";
import { playerMapValue } from "../types/interface";

// Store player positions
const playersMap: Map<string, playerMapValue> = new Map();

export const handleConnection = (socket: Socket, fastify: FastifyInstance) => {
  const { id } = socket;
  playersMap.set(id, { x: -1000, y: -1000 });

  // emit to new socket to get player coordinates
  fastify.io.emit("player:join", Object.fromEntries(playersMap));

  socket.on("player:join", data => {
    playersMap.set(id, { x: data.x, y: data.y });
  });

  socket.on("player:move", direction => {
    const check = playersMap.get(id);
    if (!check) return;

    playersMap.set(id, { ...check, x: direction.x, y: direction.y });
    fastify.io.emit("player:update", Object.fromEntries(playersMap));
  });

  socket.on("player:chat", data => {
    fastify.io.emit("player:chat", { user: data.user, text: data.text });
  });

  socket.on("peer:joined", (peerId: string) => {
    const player = playersMap.get(id);
    if (!player) return;

    playersMap.set(id, { ...player, peerId: peerId });
    socket.broadcast.emit("peer:available", peerId);
  });

  socket.on("disconnect", () => {
    const player = playersMap.get(id);
    if (!player) return;

    fastify.io.emit("peer:disconnect", player.peerId);
    playersMap.delete(id);
  });
};
