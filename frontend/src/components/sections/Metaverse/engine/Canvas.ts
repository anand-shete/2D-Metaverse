import { Application } from "pixi.js";
import { SpriteManager, EventHandler, Player } from ".";
import { SocketClient } from "@/network/SocketClient";
import { AvatarId, MovementKey } from "@/types/type";

export default class Canvas {
  public app: Application;
  public player!: Player;
  public spriteManager!: SpriteManager;
  public eventHandler?: EventHandler;
  private readonly container: HTMLDivElement;
  private resizeObserver?: ResizeObserver;
  private readonly tickerUpdate = () => this.renderFrame();
  private removeButtonListeners?: () => void;

  constructor(
    divElement: HTMLDivElement, // property not stored on this instance
    public socket: SocketClient,
    public avatar: AvatarId,
    public username: string,
  ) {
    this.container = divElement;
    this.app = new Application();
    this.app
      .init({
        resizeTo: divElement,
        resolution: Math.min(window.devicePixelRatio, 2),
        autoDensity: true,
        antialias: false,
      })
      .then(async () => {
        divElement.appendChild(this.app.canvas as HTMLCanvasElement);
        this.setupResizeObserver();
        this.spriteManager = new SpriteManager(this.app);
        this.eventHandler = new EventHandler(this.app, this.socket, this.spriteManager);
        await this.initPlayer();
      })
      .catch((e: any) => {
        console.log("Error initializing Pixi app", e);
      });
  }

  setKey(key: MovementKey, pressed: boolean) {
    this.player.setMovementKey(key, pressed);
  }

  destroy() {
    this.resizeObserver?.disconnect();
    this.resizeObserver = undefined;

    this.removeButtonListeners?.();
    this.removeButtonListeners = undefined;

    if (!this.app.ticker) return;
    this.app.ticker.remove(this.tickerUpdate);
    this.eventHandler?.cleanup();
    this.player?.destroy();
    this.spriteManager?.cleanup();
    this.app.destroy(true, true);
  }

  private setupResizeObserver() {
    if (typeof ResizeObserver === "undefined") return;

    const handleResize = () => {
      const width = this.container.clientWidth;
      const height = this.container.clientHeight;
      if (!width || !height) return;

      this.app.renderer.resize(width, height);
      this.player?.handleViewportResize();
    };

    this.resizeObserver = new ResizeObserver(handleResize);
    this.resizeObserver.observe(this.container);
    handleResize();
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

  // runs 60 times/sec
  private renderFrame() {
    this.player.updateLocalPlayer();
    this.spriteManager.updateMap();
  }
}
