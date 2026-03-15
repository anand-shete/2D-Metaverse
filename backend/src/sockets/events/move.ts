import { FastifyInstance } from "fastify";

export const move = (
  id: string,
  fastify: FastifyInstance,
  players: Map<string, { x: number; y: number }>,
  direction: any,
) => {
  players.set(id, { x: direction.x, y: direction.y });
  fastify.io.emit("player:update", players);
};
