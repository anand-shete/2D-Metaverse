import { JwtPayload } from "jsonwebtoken";
import { Types } from "mongoose";

export interface PlayerMoveData {
  x: number;
  y: number;
  animation: "idle" | "front" | "back" | "left" | "right";
  peerId?: string;
  avatar?: "boy1" | "boy2" | "girl1" | "girl2";
}

export interface CustomJwtPayload extends JwtPayload {
  id: Types.ObjectId;
  username: string;
  avatar: string;
}
