import api from "@/api";
import { useEffect, useRef } from "react";
import { Canvas } from "../components/sections/Metaverse/engine";
import { SocketClient } from "@/network/SocketClient";
import { MetaverseUILayer } from "@/components/sections";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useUserContext } from "@/context/user.context";

export default function Metaverse() {
  const canvasInstance = useRef<Canvas | null>(null);
  const socketClientRef = useRef<SocketClient | null>(null);
  const pixiContainer = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const { setUser } = useUserContext();

  // init socket layer
  if (!socketClientRef.current) {
    socketClientRef.current = new SocketClient();
  }

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/auth");
        const payload = res.data.payload;
        setUser(payload);

        if (pixiContainer.current && !canvasInstance.current) {
          canvasInstance.current = new Canvas(
            pixiContainer.current,
            socketClientRef.current!,
            payload.avatar,
            payload.username,
          );
        }
      } catch (err) {
        toast.error("Login to continue");
        navigate("/login");
      }
    };

    checkAuth();

    return () => {
      canvasInstance.current?.destroy();
      canvasInstance.current = null;
      socketClientRef.current?.disconnect();
    };
  }, []);

  return (
    <>
      <div ref={pixiContainer} className="h-full w-full"></div>
      <MetaverseUILayer
        socketClient={socketClientRef.current}
        handleKeyPress={(key, pressed) => canvasInstance.current?.setKey(key, pressed)}
      />
    </>
  );
}
