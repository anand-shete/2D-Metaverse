import api from "@/api";
import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Canvas } from "../components/sections/Metaverse/engine";
import { SocketClient } from "@/network/SocketClient";
import { MetaverseUILayer } from "@/components/sections";
import { MetaverseLoader } from "@/components/common";
import { useUserContext } from "@/context/user.context";

export default function Metaverse() {
  const canvasInstance = useRef<Canvas | null>(null);
  const socketClientRef = useRef<SocketClient | null>(null);
  const pixiContainer = useRef<HTMLDivElement | null>(null);
  const [isCanvasLoading, setIsCanvasLoading] = useState(true);
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

    const timeoutId = setTimeout(() => setIsCanvasLoading(false), 1000);

    return () => {
      canvasInstance.current?.destroy();
      canvasInstance.current = null;
      socketClientRef.current?.disconnect();
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <>
      {isCanvasLoading && <MetaverseLoader />}
      <div
        ref={pixiContainer}
        className={`h-dvh w-screen ${isCanvasLoading ? "hidden" : "block"}`}
      />
      {!isCanvasLoading && (
        <MetaverseUILayer
          socketClient={socketClientRef.current!}
          handleKeyPress={(key, pressed) => canvasInstance.current?.setKey(key, pressed)}
        />
      )}
    </>
  );
}
