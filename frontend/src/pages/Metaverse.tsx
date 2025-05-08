import { useEffect, useRef, useState } from "react";
import { Canvas } from "../pixi";
import { Button, MediaControls } from "@/components";
import { Locate, ZoomIn, ZoomOut } from "lucide-react";
import { SocketClient } from "@/network/SocketClient";
import userContext from "../context/user";

type User = { id: string; name: string };

export default function Metaverse() {
  const pixiContainer = useRef<HTMLDivElement>(null);
  const canvasInstance = useRef<Canvas | null>(null);
  const socketClientRef = useRef<SocketClient>(new SocketClient());
  // const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (pixiContainer.current && !canvasInstance.current) {
      canvasInstance.current = new Canvas(pixiContainer.current, socketClientRef.current);
    }
    return () => {
      if (canvasInstance.current?.app) {
        canvasInstance.current?.app.destroy(true, {
          children: true,
          texture: true,
        });
      }
      canvasInstance.current = null;
    };
  }, []);
  return (
    <div>
      <div ref={pixiContainer} className="max-w-screen min-h-screen " />
      <div className="absolute bottom-25 right-4 flex flex-col gap-2">
        <Button id="zoom-in" className="rounded opacity-80 border">
          <ZoomIn />
        </Button>
        <Button id="zoom-out" className="rounded opacity-80 border">
          <ZoomOut />
        </Button>
        <Button id="locate-player" className="rounded opacity-80 border">
          <Locate />
        </Button>
      </div>
      <div className="fixed z-1 bottom-0 h-20 w-screen bg-slate-800 border-t">
        <MediaControls socketClient={socketClientRef.current} />
      </div>
    </div>
  );
}
