import { SocketClient } from "@/network/SocketClient";
import { ChatMessage, ChatMessageHistory } from "@/types/type";

export class ChatManager {
  private messages: ChatMessageHistory = [];
  private listener?: (messages: ChatMessageHistory) => void;

  constructor(private socketClient: SocketClient) {
    this.setupSocketListeners();
  }

  sendMessage(message: string) {
    if (!message.trim()) return;
    const socket = this.socketClient.getSocket();
    socket.emit("chat:send", message);
  }

  getMessageHistory() {
    return this.messages;
  }

  onMessagesChange(listener: (messages: ChatMessageHistory) => void) {
    this.listener = listener;
    this.listener(this.messages);

    return () => {
      this.listener = undefined;
    };
  }

  cleanupChatSockets() {
    this.socketClient.getSocket().off("chat:message");
    this.socketClient.getSocket().off("chat:history");
  }

  private notifyListeners() {
    this.listener?.(this.messages);
  }

  private setupSocketListeners() {
    const socket = this.socketClient.getSocket();
    socket.on("chat:message", (data: ChatMessage) => {
      this.messages = [...this.messages, data];
      this.notifyListeners();
    });

    socket.on("chat:history", (data: ChatMessageHistory) => {
      this.messages = data;
      this.notifyListeners();
    });

    socket.emit("chat:history:request");
  }
}
