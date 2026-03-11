import { Socket } from "socket.io";
import { createPlayer } from "./utils/player";
import { FastifyInstance } from "fastify";
import { move } from "./events/move";
import { Player } from "./types";
import { chat } from "./events/chat";

// Store player positions
const players: Player = {};

export const handleConnection = (socket: Socket, fastify: FastifyInstance) => {
  const { id } = socket;

  console.log("socket connected:", id);
  players[id] = createPlayer();

  // console.log("New player connected, players: ", players);
  fastify.io.emit("user-joined", players);

  socket.on("player:move", direction => {
    move(id, fastify, players, direction);
  });

  socket.on("player:message", data => {
    chat(fastify, data);
  });

  socket.on("peer:joined", peerId => {
    socket.broadcast.emit("media:ready", peerId);
  });
};
