import { io, Socket } from "socket.io-client";
import { WS_URL } from "@/api";

export class SocketClient {
  private socket: Socket;

  constructor() {
    this.socket = io(WS_URL);
  }

  getSocket(): Socket {
    return this.socket;
  }

  disconnect() {
    this.socket.disconnect();
  }
}
