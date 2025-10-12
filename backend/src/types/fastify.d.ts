import "fastify";
import { Server } from "socket.io";

declare module "fastify" {
  interface FastifyRequest {
    userId?: string;
  }

  interface FastifyInstance {
    io: Server;
  }
}
