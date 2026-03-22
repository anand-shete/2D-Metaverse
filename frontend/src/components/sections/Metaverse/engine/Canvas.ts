import { Application } from "pixi.js";
import { SpriteManager, EventHandler, Player } from ".";
import { SocketClient } from "@/network/SocketClient";
import { AvatarId, MovementKey } from "@/types/type";

export default class Canvas {
  public app: Application;
  public player!: Player;
  public spriteManager!: SpriteManager;
  public eventHandler?: EventHandler;
  private readonly tickerUpdate = () => this.renderFrame();
  private removeButtonListeners?: () => void;

  constructor(
    divElement: HTMLDivElement, // property not stored on this instance
    public socket: SocketClient,
    public avatar: AvatarId,
    public username: string,
  ) {
    this.app = new Application();
    this.app
      .init({
        resizeTo: window,
        resolution: Math.min(window.devicePixelRatio, 2),
        autoDensity: true,
        antialias: false,
      })
      .then(async () => {
        divElement.appendChild(this.app.canvas as HTMLCanvasElement);
        this.spriteManager = new SpriteManager(this.app);
        this.eventHandler = new EventHandler(this.app, this.socket, this.spriteManager);
        await this.initPlayer();
        this.setZoomBtns();
      })
      .catch((e: any) => console.log("Error initializing Pixi app", e));
  }

  setKey(key: MovementKey, pressed: boolean) {
    this.player.setMovementKey(key, pressed);
  }

  destroy() {
    this.removeButtonListeners?.();
    this.removeButtonListeners = undefined;

    if (!this.app.ticker) return;
    this.app.ticker.remove(this.tickerUpdate);
    this.eventHandler?.cleanup();
    this.player?.destroy();
    this.spriteManager?.cleanup();
    this.app.destroy(true, true);
  }

  private async initPlayer() {
    if (!this.spriteManager) return;
    await this.spriteManager.initMap();
    this.player = await Player.loadPlayer(
      this.app,
      this.socket,
      this.spriteManager,
      this.spriteManager.mapContainer,
      this.avatar,
      this.username,
    );
    this.spriteManager.setPlayer(this.player);
    if (!this.eventHandler) return;
    this.eventHandler.setEventHandlerForPlayer(this.player, this.socket);
    this.app.ticker.add(this.tickerUpdate);
  }

  private setZoomBtns() {
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

  // runs 60 times/sec
  private renderFrame() {
    this.player.updateLocalPlayer();
    this.spriteManager.updateMap();
  }
}
