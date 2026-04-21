import { FastifyInstance } from "fastify";
import { handleConnection } from "./connection";
import { verifySocketUserMiddleware } from "@middlewares/socket.middleware";

export const initSockets = async (fastify: FastifyInstance) => {
  try {
    await fastify.ready();

    
    fastify.io.use(verifySocketUserMiddleware);
    console.log("socket middlware executed");

    fastify.io.on("connection", socket => handleConnection(socket, fastify));
  } catch (error: any) {
    console.log("Error connecting websockets", error);
    process.exit(1);
  }
};

export default initSockets;
