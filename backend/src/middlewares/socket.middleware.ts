import { Socket } from "socket.io";
import { verifyToken } from "@utils/jwt";

export const verifySocketUserMiddleware = async (
  socket: Socket,
  next: (
    err?:
      | {
          data?: any;
          name: string;
          message: string;
          stack?: string;
          cause?: unknown;
        }
      | undefined,
  ) => void,
) => {
  try {
    const cookieHeader = socket.request.headers.cookie;
    if (!cookieHeader) {
      return next(new Error("Authentication error: No cookies found"));
    }

    const token = cookieHeader.split("=")[1];
    if (!token) {
      return next(new Error("Authentication error: Missing access token"));
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return next(new Error("Authentication error: Invalid token"));
    }

    socket.data.user = decoded;
    next();
  } catch (error) {
    return next(new Error("Authentication error"));
  }
};
