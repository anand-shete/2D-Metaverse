import { FastifyInstance } from "fastify";
import { playerMapValue } from "../../types";

export const move = (
  id: string,
  fastify: FastifyInstance,
  players: Map<string, playerMapValue>,
  direction: any,
) => {
  const check = players.get(id);
  if (!check) return;

  players.set(id, { ...check, x: direction.x, y: direction.y });
  fastify.io.emit("player:update", Object.fromEntries(players));
};
