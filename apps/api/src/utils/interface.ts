import { PlayerMoveData } from "@metaverse/shared/interface";
import { FastifyInstance } from "fastify";
import { JwtPayload } from "jsonwebtoken";
import { Types } from "mongoose";
import { Socket } from "socket.io";

export interface SocketContent {
  socket: Socket;
  fastify: FastifyInstance;
  playersMap: Map<string, PlayerMoveData>;
}

export interface CustomJwtPayload extends JwtPayload {
  id: Types.ObjectId;
  username: string;
  avatar: string;
}
