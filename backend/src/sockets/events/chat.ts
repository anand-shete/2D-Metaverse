import { FastifyInstance } from "fastify";

export const chat = (fastify: FastifyInstance, data: any) => {
  fastify.io.emit("player:chat", { user: data.user, text: data.text });
};
