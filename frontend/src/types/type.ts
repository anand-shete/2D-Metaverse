export type MovementKey = "w" | "a" | "s" | "d";

export type AvatarId = "boy1" | "boy2" | "girl1" | "girl2";

export type ChatMessageHistory = ChatMessage[];

export type ChatMessage = {
  username: string;
  message: string;
  timestamp: number;
  notes?: { fileName: string; fileUrl: string }[];
};

export const BlockKeysArr = ["w", "a", "s", "d", "x", "c"];

export const mapFileTypesToActual: Record<string, string> = {
  pdf: "pdf",
  "vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
  plain: "txt",
};

export const MAX_FILE_SIZE = 20 * 1024 * 1024;
