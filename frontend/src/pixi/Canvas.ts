import { Application, Graphics } from "pixi.js";
import { SpriteManager, EventHandler, Player } from ".";
import { SocketClient } from "@/network/SocketClient";

export default class Canvas {
  public app: Application;
  public player!: Player;
  public spriteManager!: SpriteManager;
  public eventHandler?: EventHandler;
  public socket!: SocketClient;

  constructor(divElement: HTMLDivElement) {
    this.app = new Application();
    this.app
      .init({ resizeTo: window })
      .then(async () => {
        this.socket = new SocketClient();
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
    if (this.eventHandler)
      this.eventHandler.setEventHandlerForPlayer(this.player, this.socket);
    this.app.ticker.add(() => this.updateCanvas());

    if (window.innerWidth <= 600) {
      this.createJoystick();
    }
  }

  private createJoystick() {
    const base = new Graphics();
    base.beginFill(0xcccccc); // Light gray base
    base.drawCircle(0, 0, 50);
    base.endFill();
    base.x = 50; // Bottom-left with margin
    base.y = this.app.screen.height - 50;
    this.app.stage.addChild(base);
    base.interactive = true;

    const stick = new Graphics();
    stick.fill(0x333333); // Dark gray stick
    stick.circle(0, 0, 20);
    stick.endFill();
    stick.x = base.x;
    stick.y = base.y;
    this.app.stage.addChild(stick);

    let activePointerId: number | null = null;

    base.on("pointerdown", event => {
      activePointerId = event.data.pointerId;
    });

    this.app.stage.on("pointermove", event => {
      if (activePointerId !== null && event.data.pointerId === activePointerId) {
        const touchPos = event.data.getLocalPosition(this.app.stage);
        const dx = touchPos.x - base.x;
        const dy = touchPos.y - base.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const radius = 50;
        let stickX, stickY;

        if (distance > radius) {
          const angle = Math.atan2(dy, dx);
          stickX = base.x + radius * Math.cos(angle);
          stickY = base.y + radius * Math.sin(angle);
        } else {
          stickX = touchPos.x;
          stickY = touchPos.y;
        }

        stick.x = stickX;
        stick.y = stickY;

        const offsetX = stickX - base.x;
        const offsetY = stickY - base.y;
        this.player.moveX = offsetX / radius; // -1 to 1
        this.player.moveY = offsetY / radius; // -1 to 1
      }
    });

    this.app.stage.on("pointerup", event => {
      if (activePointerId !== null && event.data.pointerId === activePointerId) {
        stick.x = base.x;
        stick.y = base.y;
        this.player.moveX = 0;
        this.player.moveY = 0;
        activePointerId = null;
      }
    });
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
