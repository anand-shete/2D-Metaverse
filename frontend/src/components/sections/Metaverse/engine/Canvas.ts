import { Application } from "pixi.js";
import { SpriteManager, EventHandler, Player } from ".";
import { SocketClient } from "@/network/SocketClient";

export default class Canvas {
  public app: Application;
  public player!: Player;
  public spriteManager!: SpriteManager;
  public eventHandler?: EventHandler;
  private readonly tickerUpdate = () => this.updateCanvas();
  private removeButtonListeners?: () => void;

  constructor(
    divElement: HTMLDivElement,
    public socket: SocketClient,
  ) {
    this.app = new Application();
    this.app
      .init({ resizeTo: window })
      .then(async () => {
        this.socket = socket;
        divElement.appendChild(this.app.canvas as HTMLCanvasElement);
        this.app.canvas.style.width = "100vw";
        this.app.canvas.style.height = "100vh";
        this.spriteManager = new SpriteManager(this.app);
        this.eventHandler = new EventHandler(this.app, this.socket, this.spriteManager);
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
      this.spriteManager.mapContainer,
    );
    this.spriteManager.setPlayerSprite(this.player);
    if (this.eventHandler) this.eventHandler.setEventHandlerForPlayer(this.player, this.socket);
    this.app.ticker.add(this.tickerUpdate);
  }

  setup3Buttons() {
    const zoomInButton = document.getElementById("zoom-in");
    const zoomOutButton = document.getElementById("zoom-out");
    if (!zoomInButton || !zoomOutButton) return;
    
    const handleZoomIn = () => this.spriteManager.zoomIn();
    const handleZoomOut = () => this.spriteManager.zoomOut();

    zoomInButton.addEventListener("click", handleZoomIn);
    zoomOutButton.addEventListener("click", handleZoomOut);

    this.removeButtonListeners = () => {
      zoomInButton.removeEventListener("click", handleZoomIn);
      zoomOutButton.removeEventListener("click", handleZoomOut);
    };
  }

  updateCanvas() {
    if (this.player) this.player.updatePlayer();
    this.spriteManager.updateSprites();
  }

  setMovementKey(key: "w" | "a" | "s" | "d", pressed: boolean) {
    this.player?.setMovementKey(key, pressed);
  }

  destroy() {
    this.removeButtonListeners?.();
    this.removeButtonListeners = undefined;
    this.app.ticker.remove(this.tickerUpdate);
    this.eventHandler?.dispose();
    this.player?.destroy();
    this.spriteManager?.destroyAll();
    this.app.destroy(true, true);
  }
}
