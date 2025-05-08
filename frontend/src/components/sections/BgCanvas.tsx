import { useEffect, useRef } from "react";
import { Application, Graphics } from "pixi.js";

const BgCanvas = () => {
  const pixiRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const app = new Application();
    let destroyed = false;

    (async () => {
      await app.init({ resizeTo: window });
      if (pixiRef.current) pixiRef.current.appendChild(app.canvas);
      const maxCircles = 500;
      let circles = 0;
      app.ticker.add(() => {
        if (circles < maxCircles && !destroyed) {
          const circle = new Graphics()
            .circle(
              app.screen.width * Math.random(),
              app.screen.height * Math.random(),
              2
            )
            .fill({ color: 0xb3b3b3 });
          app.stage.addChild(circle);
          circles += 1;
        }
      });
    })();

    return () => {
      destroyed = true;
      app.destroy();
    };
  }, []);

  return <div ref={pixiRef} className="fixed top-0 left-0 w-screen h-screen -z-1" />;
};

export default BgCanvas;
