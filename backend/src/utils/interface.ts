import { FastifyInstance } from "fastify";
import { JwtPayload } from "jsonwebtoken";
import { Types } from "mongoose";
import { Socket } from "socket.io";
import { ChatUserType } from "./enum";

export interface SocketContent {
  socket: Socket;
  fastify: FastifyInstance;
  playersMap: Map<string, PlayerMoveData>;
}

export interface PlayerMoveData {
  x: number;
  y: number;
  animation: "idle" | "front" | "back" | "left" | "right";
  avatar: "boy1" | "boy2" | "girl1" | "girl2";
  username: string;
  peerId?: string;
}

export interface CustomJwtPayload extends JwtPayload {
  id: Types.ObjectId;
  username: string;
  avatar: string;
}

export interface PopulatedChat {
  message: string;
  sender: ChatUserType;
  userId?: { username: string };
  createdAt: Date;
}

export interface IUserIntent {
  intent: "retrieve" | "info";
  confidence: number;
}
