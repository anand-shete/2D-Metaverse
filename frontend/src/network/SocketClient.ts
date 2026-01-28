import { io, Socket } from "socket.io-client";

const WS_URL = import.meta.env.VITE_WS_URL;

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
