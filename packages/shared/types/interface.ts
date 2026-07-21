import { ChatUserType } from "./enum.js";

export enum NoteType {
  NOTES = "notes",
  QUESTION_PAPER = "question_paper",
  SYLLABUS = "syllabus",
}

export interface PopulatedChat {
  message: string;
  sender: ChatUserType;
  userId?: { username: string };
  notes?: { fileName: string; fileUrl: string }[];
  createdAt: Date;
}

export interface PlayerMoveData {
  x: number;
  y: number;
  animation: "idle" | "front" | "back" | "left" | "right";
  avatar: "boy1" | "boy2" | "girl1" | "girl2";
  username: string;
  peerId?: string;
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
  noteType?: NoteType;
}

export interface IMetabotServiceResponse {
  success: boolean;
  message: string;
  notes?: { fileName: string; fileUrl: string }[];
}
