import { FastifyInstance } from "fastify";

export const chat = (fastify: FastifyInstance, data: any) => {
  fastify.io.emit("chat-message", { user: data.user, text: data.text });
};
