import { SocketClient } from "../network/SocketClient";

export class ChatManager {
  private messages: { user: string; text: string; timestamp: number }[] = [];

  constructor(private socketClient: SocketClient) {
    this.setupSocketListeners();
  }

  private setupSocketListeners() {
    this.socketClient
      .getSocket()
      .on("chat-message", (data: { user: string; text: string }) => {
        this.messages.push({ ...data, timestamp: Date.now() });
      });
  }

  sendMessage(user: string, text: string) {
    if (text.trim()) {
      this.socketClient.getSocket().emit("chat-message", { user, text });
    }
  }

  getMessages() {
    return this.messages;
  }
}
