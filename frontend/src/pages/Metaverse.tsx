import { useEffect, useRef } from "react";
import { Canvas } from "../pixi";
import { SocketClient } from "@/network/SocketClient";
import { ZoomButtons, MediaControls } from "@/components/sections";

// type User = { id: string; name: string };

export default function Metaverse() {
  const pixiContainer = useRef<HTMLDivElement | null>(null);
  const canvasInstance = useRef<Canvas | null>(null);
  const socket = new SocketClient();
  const socketClientRef = useRef<SocketClient>(socket);
  // const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (pixiContainer.current && !canvasInstance.current) {
      canvasInstance.current = new Canvas(pixiContainer.current, socketClientRef.current);
    }

    return () => {
      if (canvasInstance.current?.app) canvasInstance.current?.app.destroy(true, true);
      canvasInstance.current = null;
    };
  }, []);

  return (
    <>
      <div ref={pixiContainer} className="max-h-full min-w-full" />
      <ZoomButtons />
      <MediaControls socketClient={socketClientRef.current} />
    </>
  );
}
