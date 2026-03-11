import { useEffect, useRef } from "react";
import { Canvas } from "../components/sections/Metaverse/pixi";
import { SocketClient } from "@/network/SocketClient";
import { ZoomButtons, MediaControls } from "@/components/sections";

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
      const app = canvasInstance.current?.app;

      if (app) {
        app.destroy(true, true);
      }
      canvasInstance.current = null;
    };
  }, []);

  return (
    <>
      <div ref={pixiContainer} className="h-full w-full"></div>
      <ZoomButtons />
      <MediaControls socketClient={socketClientRef.current} />
    </>
  );
}
