import { Application } from "pixi.js";
import { SpriteManager, EventHandler, Player } from ".";
import { SocketClient } from "@/network/SocketClient";

export default class Canvas {
  public app: Application;
  public player!: Player;
  public spriteManager!: SpriteManager;
  public eventHandler?: EventHandler;

  constructor(divElement: HTMLDivElement, public socket: SocketClient) {
    this.app = new Application();
    this.app
      .init({ resizeTo: window })
      .then(async () => {
        this.socket = socket;
        divElement.appendChild(this.app.canvas as HTMLCanvasElement);
        this.app.canvas.style.width = "100vw";
        this.app.canvas.style.height = "100vh";
        this.spriteManager = new SpriteManager(this.app);
        this.eventHandler = new EventHandler(
          this.app,
          this.socket,
          this.spriteManager,
          this.spriteManager.factory
        );
        await this.init();
        this.setup3Buttons();
      })
      .catch((e: any) => console.log("Error Appending canvas", e));
  }

  async init() {
    if (this.spriteManager) await this.spriteManager.loadInitialSprites();
    this.player = await Player.create(
      this.app,
      this.socket,
      this.spriteManager,
      this.spriteManager.mapContainer
    );
    this.spriteManager.setPlayerSprite(this.player);
    if (this.eventHandler) this.eventHandler.setEventHandlerForPlayer(this.player, this.socket);
    this.app.ticker.add(() => this.updateCanvas());
  }

  setup3Buttons() {
    const zoomInButton = document.getElementById("zoom-in");
    const zoomOutButton = document.getElementById("zoom-out");
    const locateButton = document.getElementById("locate-player");
    if (zoomInButton && zoomOutButton && locateButton) {
      zoomInButton.addEventListener("click", () => this.spriteManager.zoomIn());
      zoomOutButton.addEventListener("click", () => this.spriteManager.zoomOut());
      // locateButton.addEventListener("click", () => this.spriteManager.locatePlayer());
    }
  }

  updateCanvas() {
    if (this.player) this.player.updatePlayer();
    this.spriteManager.updateSprites();
  }
}
