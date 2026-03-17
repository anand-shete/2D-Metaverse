import { useEffect, useRef } from "react";
import { Canvas } from "../components/sections/Metaverse/engine";
import { SocketClient } from "@/network/SocketClient";
import { MetaverseUILayer } from "@/components/sections";

export default function Metaverse() {
  const pixiContainer = useRef<HTMLDivElement | null>(null);
  const canvasInstance = useRef<Canvas | null>(null);
  const socketClientRef = useRef<SocketClient | null>(null);

  if (!socketClientRef.current) {
    socketClientRef.current = new SocketClient();
  }

  useEffect(() => {
    if (pixiContainer.current && !canvasInstance.current) {
      canvasInstance.current = new Canvas(pixiContainer.current, socketClientRef.current!);
    }

    return () => {
      canvasInstance.current?.destroy();
      canvasInstance.current = null;
    };
  }, []);

  return (
    <>
      <div ref={pixiContainer} className="h-full w-full"></div>
      <MetaverseUILayer
        socketClient={socketClientRef.current}
        handleKeyPress={(key, pressed) => canvasInstance.current?.setMovementKey(key, pressed)}
      />
    </>
  );
}
