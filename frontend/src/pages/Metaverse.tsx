import { useEffect, useRef, useState } from "react";
import { Canvas } from "../pixi";
import { Locate, ZoomIn, ZoomOut } from "lucide-react";
import { SocketClient } from "@/network/SocketClient";
import { Button } from "@/components/ui/button";
import { MediaControls } from "@/components/sections";

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
      <div ref={pixiContainer} className="min-h-screen max-w-screen" />
      <div className="absolute right-4 bottom-25 flex flex-col gap-2">
        <Button id="zoom-in" className="rounded border opacity-80">
          <ZoomIn />
        </Button>
        <Button id="zoom-out" className="rounded border opacity-80">
          <ZoomOut />
        </Button>
        <Button id="locate-player" className="rounded border opacity-80">
          <Locate />
        </Button>
      </div>
      <div className="fixed bottom-0 z-1 h-20 w-screen border-t bg-slate-800">
        <MediaControls socketClient={socketClientRef.current} />
      </div>
    </div>
  );
}
