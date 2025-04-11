import { useEffect, useRef } from "react";
import { Canvas } from "../pixi/Canvas";

export default function PixiCanvas() {
  const pixiContainer = useRef<HTMLDivElement>(null);
  const canvasInstance = useRef<Canvas | null>(null);

  useEffect(() => {
    if (pixiContainer.current) {
      new Canvas(pixiContainer.current);
    }
    return () => {
      if (canvasInstance.current) {
        canvasInstance.current.app.destroy(true, { children: true });
      }
    };
  }, []);

  return <div ref={pixiContainer} />;
}
