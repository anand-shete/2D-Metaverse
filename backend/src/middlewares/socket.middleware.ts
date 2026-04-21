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
      const error = new Error("Authentication error: No cookies found");
      return next(error);
    }

    const token = cookieHeader.split("=")[1];
    if (!token) {
      const error = new Error("Authentication error: Missing access token");
      return next(error);
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      const error = new Error("Authentication error: Invalid token");
      return next(error);
    }

    socket.data.user = decoded;
    next();
  } catch (error) {
    console.log("errored");
    return next(new Error("Authentication error"));
  }
};
