import { X } from "lucide-react";
import { useState, useEffect, useRef, KeyboardEventHandler } from "react";
import { ChatManager } from "@/chat/ChatManager";
import { Button } from "@/components/ui/button";
import { SocketClient } from "@/network/SocketClient";
import { ChatMessageHistory } from "@/types/type";
import { useUserContext } from "@/context/user.context";
import { Input } from "@/components/ui/input";

interface ChatBoxProps {
  isOpen: boolean;
  onClose: () => void;
  socket: SocketClient;
}

export default function ChatBox({ isOpen, onClose, socket }: ChatBoxProps) {
  const { user } = useUserContext();
  const inputBoxRef = useRef<HTMLInputElement | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessageHistory>([]);
  const chatManagerRef = useRef<ChatManager | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const chatManager = new ChatManager(socket);
    chatManagerRef.current = chatManager;

    const unsubscribe = chatManager.onMessagesChange(setMessages);

    return () => {
      unsubscribe();
      chatManagerRef.current?.cleanupChatSockets();
      chatManagerRef.current = null;
    };
  }, [socket]);

  useEffect(() => {
    setMessage("");
    isOpen ? inputBoxRef.current?.focus() : inputBoxRef.current?.blur();
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSend = () => {
    if (!chatManagerRef.current) return;

    chatManagerRef.current.sendMessage(message);
    setMessage("");
  };

  const handleKeyDownInChatbox: KeyboardEventHandler<HTMLInputElement> = e => {
    const movementKeys = ["w", "a", "s", "d", "x"];
    if (movementKeys.includes(e.key.toLowerCase())) {
      e.stopPropagation();
    }

    if (e.key === "Enter") handleSend();
  };

  return (
    <div>
      {/* Background Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-1 bg-black/50 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Chatbox modal */}
      <div
        className={`md:s-10 fixed right-6 bottom-24 z-40 w-96 rounded-lg bg-white shadow-2xl transition-all duration-300 ease-out md:bottom-32 ${isOpen ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-12 opacity-0"}`}
      >
        <div className="flex items-center justify-between rounded-t-lg border-b border-gray-200 bg-slate-700 p-4 text-white">
          <h2 className="mx-auto text-lg font-semibold">World Chat</h2>
          <Button
            onClick={onClose}
            size="icon"
            variant="ghost"
            className="h-6 w-6 hover:bg-slate-600"
          >
            <X size={18} />
          </Button>
        </div>

        <div className="flex h-96 flex-col">
          <div className="flex-1 space-y-3 overflow-y-scroll bg-gray-50 p-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex flex-col wrap-break-word ${msg.username === user?.username ? "ml-9" : "ml-0"}`}
              >
                <p className="text-xs font-semibold text-gray-500">{msg.username}</p>
                <p
                  className={`${msg.username === user?.username ? "bg-slate-200" : "bg-white"} rounded border-l-2 border-slate-700 p-2 text-sm text-gray-800`}
                >
                  {msg.message}
                </p>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex gap-2 rounded-b-lg border-t border-slate-400 p-4">
            <Input
              type="text"
              value={message}
              ref={inputBoxRef}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={handleKeyDownInChatbox}
              placeholder="Hey @metabot, fetch notes for AI"
              className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm focus:border-slate-700 focus:ring-1 focus:ring-slate-700 focus:outline-none"
            />
            <Button
              onClick={handleSend}
              className="bg-slate-700 px-4 text-white hover:bg-slate-800"
              size="sm"
            >
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
