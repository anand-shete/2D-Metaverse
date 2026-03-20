import { Socket } from "socket.io";
import { FastifyInstance } from "fastify";
import { move, chat } from "./events";
import { playerMapValue } from "../types";

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
    move(id, fastify, playersMap, direction);
  });

  socket.on("player:chat", data => {
    chat(fastify, data);
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
