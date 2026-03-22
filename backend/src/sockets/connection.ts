import { Socket } from "socket.io";
import { FastifyInstance } from "fastify";
import { PlayerMoveData } from "../types/interface";

// Store player positions
const playersMap: Map<string, PlayerMoveData> = new Map();

export const handleConnection = (socket: Socket, fastify: FastifyInstance) => {
  const { id } = socket;
  playersMap.set(id, { x: -1000, y: -1000, animation: "idle" });

  // emit to new socket to get player coordinates
  fastify.io.emit("player:join", Object.fromEntries(playersMap));

  socket.on("player:join", data => {
    const current = playersMap.get(id);
    if (!current) return;

    playersMap.set(id, { ...current, x: data.x, y: data.y });
  });

  socket.on("player:move", (data: PlayerMoveData) => {
    const check = playersMap.get(id);
    if (!check) return;

    playersMap.set(id, { ...check, ...data });
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
