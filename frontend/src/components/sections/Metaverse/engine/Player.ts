// Handles the create of new Player, animating the playerSprite based on keys object
import { AnimatedSprite, Application, Assets, Container, Spritesheet } from "pixi.js";
import { SpriteManager } from ".";
import { SocketClient } from "@/network/SocketClient";
import girlSheet from "@/assets/player/girl/girl-sheet.png";
import girlJson from "@/assets/player/girl/girl.json";

export default class Player {
  public playerSprite: AnimatedSprite;
  public keys: { [pressedKey: string]: boolean } = {};
  public lastSent?: number;
  private currentAnimation: string = "idle";
  public worldX: number;
  public worldY: number;
  private interactionListener?: (e: KeyboardEvent) => void;
  private readonly INTERACT_KEY = "x";

  constructor(
    public app: Application,
    public socket: SocketClient,
    public loadedSprite: Spritesheet,
    public spriteManager: SpriteManager,
    public mapContainer: Container,
  ) {
    this.socket = socket;
    this.mapContainer = mapContainer;
    this.playerSprite = new AnimatedSprite(this.loadedSprite.animations["idle"]);
    this.playerSprite.animationSpeed = 0.1;
    this.playerSprite.x = app.screen.width / 2; // 515.5(1031/2) - initial position of the player sprite
    this.playerSprite.y = app.screen.height / 2; // 351(702/2)
    this.playerSprite.anchor.set(0.5);
    this.playerSprite.scale.set(1);
    this.worldX = 800 + Math.random() * 224; // 2048/2. These are world co-ordinates of the player
    this.worldY = 800 + Math.random() * 324; // 2248/2. Player position = This is the initial position + these values
    this.app.stage.addChild(this.playerSprite);
    this.playerSprite.play();
    this.spriteManager = spriteManager;

    this.setupInteractionListener();
  }

  private setupInteractionListener() {
    this.interactionListener = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== this.INTERACT_KEY) return;

      const tileSize = 32;
      const playerWidth = 43;
      const playerHeight = 96;

      const left = Math.floor((this.worldX - playerWidth / 2) / tileSize);
      const right = Math.floor((this.worldX + playerWidth / 2) / tileSize);
      const top = Math.floor((this.worldY - playerHeight / 2) / tileSize);

      if ((top === 3 || top === 4) && left >= 14 && left <= 17 && right >= 14 && right <= 18) {
        this.openInNewTab("https://app.eraser.io/");
      } else if (top === 28 && left > 40 && left < 48) {
        this.openInNewTab("https://ndl.iitkgp.ac.in/");
      } else if (top === 28 && left > 50 && left < 58) {
        this.openInNewTab("https://open.spotify.com/");
      }
    };

    document.addEventListener("keydown", this.interactionListener);
  }

  public setMovementKey(key: "w" | "a" | "s" | "d", pressed: boolean) {
    if (pressed) {
      this.keys[key] = true;
    } else {
      delete this.keys[key];
    }
  }

  updatePlayer() {
    let newAnimation = this.currentAnimation;
    const speed = 10;
    let dx = 0;
    let dy = 0;
    let newWorldX = this.worldX;
    let newWorldY = this.worldY;
    // console.log("worldX", this.worldX, "worldY", this.worldY);
    // console.log("Initial Y (world):", this.playerSprite.y);
    // console.log("Initial Tile X:", Math.floor(this.playerSprite.x / 64));
    // console.log("Initial Tile Y:", Math.floor(this.playerSprite.y / 64));
    // console.log("test ", this.app.screen.height / 2);

    // we are not moving the player at all, we are animating the player and moving the entire mapContainer based on user inputs

    if (this.keys["w"]) {
      newAnimation = "front";
      dy -= speed;
    }
    if (this.keys["s"]) {
      newAnimation = "back";
      dy += speed;
    }
    if (this.keys["a"]) {
      newAnimation = "left";
      dx -= speed;
    }
    if (this.keys["d"]) {
      newAnimation = "right";
      dx += speed;
    }
    // Constants (adjust as needed)
    const TILE_SIZE = 32;
    const PLAYER_WIDTH = 43;
    const PLAYER_HEIGHT = 96;

    // We are animating the movement and updating the world coordiates of the player to showcase movement
    newWorldX = this.worldX + dx;
    if (!this.isColliding(newWorldX, this.worldY, PLAYER_WIDTH, PLAYER_HEIGHT, TILE_SIZE)) {
      this.worldX = newWorldX;
    }

    // Same here
    newWorldY = this.worldY + dy;
    if (!this.isColliding(this.worldX, newWorldY, PLAYER_WIDTH, PLAYER_HEIGHT, TILE_SIZE)) {
      this.worldY = newWorldY;
    }

    if (!Object.keys(this.keys).length) this.currentAnimation = "idle";
    if (newAnimation !== this.currentAnimation && this.loadedSprite.animations[newAnimation]) {
      this.currentAnimation = newAnimation;
      this.playerSprite.textures = this.loadedSprite.animations[this.currentAnimation];
      this.playerSprite.play();
    }
    if (!this.lastSent || Date.now() - this.lastSent > 100) {
      const move = { x: this.worldX, y: this.worldY };
      this.socket.getSocket().emit("player:move", move);
      this.lastSent = Date.now();
    }
  }

  private isColliding(
    x: number,
    y: number,
    playerWidth: number,
    playerHeight: number,
    tileSize: number,
  ): boolean {
    // ((player's current world co-ordinates - player width) / 2) / size of single tile (32px)
    // all this to calculate player's current tile to check our collision array
    const l = Math.floor((x - playerWidth / 2) / tileSize);
    const r = Math.floor((x + playerWidth / 2) / tileSize);
    const t = Math.floor((y - playerHeight / 2) / tileSize);
    const b = Math.floor((y + playerHeight / 2) / tileSize);

    // Check all the adjacent cell to the players
    for (let gy = t; gy <= b; gy++) {
      for (let gx = l; gx <= r; gx++) {
        if (
          gy < 0 ||
          gy >= 71 ||
          gx < 0 ||
          gx >= 64 ||
          (gy < this.spriteManager.collisionMap.length &&
            gx < this.spriteManager.collisionMap[0].length &&
            this.spriteManager.collisionMap[gy][gx] === 1)
        ) {
          // console.log("Collision detected - worldX:", x, "worldY:", y, "gx:", gx, "gy:", gy);
          return true;
        }
      }
    }
    return false; // No collision
  }

  static async create(
    app: Application,
    socket: SocketClient,
    spriteManager: SpriteManager,
    mapContainer: Container,
  ): Promise<Player> {
    const texture = await Assets.load(girlSheet);
    const loadedSpriteSheet = new Spritesheet(texture, girlJson);
    await loadedSpriteSheet.parse();
    return new Player(app, socket, loadedSpriteSheet, spriteManager, mapContainer);
  }

  private openInNewTab(url: string) {
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer"; // Prevents security vulnerabilities
    link.click();
  }

  public destroy() {
    if (this.interactionListener) {
      document.removeEventListener("keydown", this.interactionListener);
      this.interactionListener = undefined;
    }
    this.app.stage.removeChild(this.playerSprite);
    this.playerSprite.destroy();
  }
}
