import { Schema } from "mongoose";

export interface playerMapValue {
  peerId?: string;
  x: number;
  y: number;
}

export interface CustomJwtPayload {
  _id: Schema.Types.ObjectId;
  username: string;
  avatar: string;
}
