import { JwtPayload } from "jsonwebtoken";
import { Types } from "mongoose";

export interface PlayerMoveData {
  x: number;
  y: number;
  animation: "idle" | "front" | "back" | "left" | "right";
  avatar: "boy1" | "boy2" | "girl1" | "girl2";
  username:string;
  peerId?: string;
}

export interface CustomJwtPayload extends JwtPayload {
  id: Types.ObjectId;
  username: string;
  avatar: string;
}
