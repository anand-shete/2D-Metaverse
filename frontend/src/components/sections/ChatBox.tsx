import { useState, useEffect, useRef } from "react";
import { ChatManager } from "@/chat/ChatManager";
// import { SocketClient } from "@/Network/SocketClient";

export default function ChatBox() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ user: string; text: string; timestamp: number }[]>([]);
  const chatManagerRef = useRef<ChatManager | null>(null);
  const user = "Player1"; // Replace with dynamic user ID later

  useEffect(() => {
    // chatManagerRef.current = new ChatManager(new SocketClient());
    const updateMessages = () => {
      if (chatManagerRef.current) {
        setMessages(chatManagerRef.current.getMessages());
      }
      requestAnimationFrame(updateMessages);
    };
    updateMessages();

    return () => {
      if (chatManagerRef.current) {
        chatManagerRef.current = null;
      }
    };
  }, []);

  const handleSend = () => {
    if (message.trim() && chatManagerRef.current) {
      chatManagerRef.current.sendMessage(user, message);
      setMessage("");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="mb-4 text-2xl font-bold">Chat Test Page</h1>
      <div className="w-80 rounded bg-white p-4 shadow-lg">
        <div className="mb-2 h-64 overflow-y-auto">
          {messages.map((msg, i) => (
            <p key={i}>
              <strong>{msg.user}</strong>: {msg.text}
            </p>
          ))}
        </div>
        <input
          type="text"
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyPress={e => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
          className="w-full rounded border p-2"
        />
      </div>
    </div>
  );
}
