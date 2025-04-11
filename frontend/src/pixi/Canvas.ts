import { Application } from "pixi.js";
import { SpriteManager } from "./SpriteManager";
import { Player } from "./Player";
import { EventHandler } from "./EventHandler";

import { WS_URL } from "@/api";
import { io } from "socket.io-client";
export const socket = io(WS_URL, { withCredentials: true });

export class Canvas {
  public app: Application;
  public player?: Player;
  public spriteManager!: SpriteManager;
  public eventHandler?: EventHandler;

  constructor(divElement: HTMLDivElement) {
    this.app = new Application();
    this.app
      .init({ resizeTo: window })
      .then(async () => {
        divElement.appendChild(this.app.canvas as HTMLCanvasElement);
        this.app.canvas.style.width = "100vw";
        this.app.canvas.style.height = "100vh";
        this.spriteManager = new SpriteManager(this.app);
        this.eventHandler = new EventHandler(this.app, this.spriteManager);
        await this.init();
      })
      .catch((e: any) => console.log("Error Appending canvas", e));
  }

  async init() {
    if (this.spriteManager) this.spriteManager.loadInitialSprites();
    this.player = await Player.create(this.app);    // main player 
    if (this.eventHandler) this.eventHandler.setPlayer(this.player);
    this.app.ticker.add(() => this.update());
  }

  update() {
    if (this.player) this.player.update();
    this.spriteManager.update();
  }
}
