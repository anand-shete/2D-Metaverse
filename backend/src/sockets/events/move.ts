import { FastifyInstance } from "fastify";
import { Socket } from "socket.io";
import { Player } from "../types";

export const move = (id: string, fastify: FastifyInstance, players: Player, direction) => {
  if (direction.x) players[id].x = direction.x;
  if (direction.y) players[id].y = direction.y;
  // console.log("location",Math.random());

  fastify.io.emit("update-players", players);
};
