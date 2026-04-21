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
  notes?: { fileName: string; fileUrl: string }[];
  createdAt: Date;
}

export interface IUserIntent {
  success: boolean;
  intent?: "retrieve" | "info";
  confidence?: number;
}

export interface IFilterResponse {
  success: boolean;
  filter: IFilter;
}

export interface IFilter {
  subject?: "PM" | "RL" | "AAI" | "SMA" | "OS" | "DBMS";
  chapter?: number;
  noteType?: "notes" | "question_paper" | "syllabus";
}

export interface IMetabotServiceResponse {
  success: boolean;
  message: string;
  notes?: { fileName: string; fileUrl: string }[];
}
