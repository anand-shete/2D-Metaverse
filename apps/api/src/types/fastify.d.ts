import "fastify";
import { Types } from "mongoose";
import { Server } from "socket.io";

declare module "fastify" {
  interface FastifyRequest {
    userId?: string;
    user?: {
      username: string;
      avatar: string;
      id: Types.ObjectId;
    };
  }

  interface FastifyInstance {
    io: Server;
  }
}
