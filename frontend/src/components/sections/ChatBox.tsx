import { useState, useEffect, useRef } from "react";
import { ChatManager } from "@/chat/ChatManager";
// import { SocketClient } from "@/Network/SocketClient";

export default function ChatBox() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    { user: string; text: string; timestamp: number }[]
  >([]);
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Chat Test Page</h1>
      <div className="w-80 bg-white rounded shadow-lg p-4">
        <div className="h-64 overflow-y-auto mb-2">
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
          className="w-full p-2 border rounded"
        />
      </div>
    </div>
  );
}
