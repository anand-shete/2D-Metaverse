// Handles the create of new Player, animating the playerSprite based on keys object
import { AnimatedSprite, Application, Assets, Container, Spritesheet, Texture } from "pixi.js";
import { SpriteManager } from ".";
import { SocketClient } from "@/network/SocketClient";

export default class Player {
  public playerSprite: AnimatedSprite;
  public keys: { [pressedKey: string]: boolean } = {};
  public lastSent?: number;
  private currentAnimation: string = "idle";
  public worldX: number;
  public worldY: number;
  public moveX: number = 0; // FIXME: joystick movement on phone
  public moveY: number = 0;

  constructor(
    public app: Application,
    public socket: SocketClient,
    public loadedSprite: Spritesheet,
    public spriteManager: SpriteManager,
    public mapContainer: Container
  ) {
    this.socket = socket;
    this.mapContainer = mapContainer;
    this.playerSprite = new AnimatedSprite(this.loadedSprite.animations["idle"]);
    this.playerSprite.animationSpeed = 0.1;
    this.playerSprite.x = app.screen.width / 2; // 515.5(1031/2) - initial position of the player sprite
    this.playerSprite.y = app.screen.height / 2; // 351(702/2)
    this.playerSprite.anchor.set(0.5);
    this.playerSprite.scale.set(1);
    this.worldX = 1024; // 2048/2. These are world co-ordinates of the player
    this.worldY = 1124; // 2248/2. Player position = This is the initial position + these values
    this.app.stage.addChild(this.playerSprite);
    this.playerSprite.play();
    this.spriteManager = spriteManager;
  }

  updatePlayer() {
    let newAnimation = this.currentAnimation;
    const speed = 10;
    let dx = 0;
    let dy = 0;
    let newWorldX = this.worldX;
    let newWorldY = this.worldY;
    console.log("worldX", this.worldX, "worldY", this.worldY);
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
      this.socket.getSocket().emit("move", { x: this.worldX, y: this.worldY });
      this.lastSent = Date.now();
    }
  }

  private isColliding(
    x: number,
    y: number,
    playerWidth: number,
    playerHeight: number,
    tileSize: number
  ): boolean {
    // ((player's current world co-ordinates - player width) / 2) / size of single tile (32px)
    // all this to calculate player's current tile to check our collision array
    const left = Math.floor((x - playerWidth / 2) / tileSize);
    const right = Math.floor((x + playerWidth / 2) / tileSize);
    const top = Math.floor((y - playerHeight / 2) / tileSize);
    const bottom = Math.floor((y + playerHeight / 2) / tileSize);

    // Check all the adjacent cell to the players
    for (let gy = top; gy <= bottom; gy++) {
      for (let gx = left; gx <= right; gx++) {
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

  // updatePlayer() {
  //   let moveX = 0;
  //   let moveY = 0;

  //   if (window.innerWidth > 600) {
  //     // Keyboard controls for desktop
  //     if (this.keys["w"]) moveY -= 1;
  //     if (this.keys["s"]) moveY += 1;
  //     if (this.keys["a"]) moveX -= 1;
  //     if (this.keys["d"]) moveX += 1;
  //   } else {
  //     // Joystick controls for mobile
  //     moveX = this.moveX;
  //     moveY = this.moveY;
  //   }

  //   const speed = 7;
  //   this.worldX += moveX * speed;
  //   this.worldY += moveY * speed;

  //   // Update animation based on movement
  //   let newAnimation = "idle";
  //   if (moveX !== 0 || moveY !== 0) {
  //     if (Math.abs(moveX) > Math.abs(moveY)) {
  //       newAnimation = moveX > 0 ? "right" : "left";
  //     } else {
  //       newAnimation = moveY > 0 ? "back" : "front";
  //     }
  //   }

  //   if (newAnimation !== this.currentAnimation) {
  //     this.currentAnimation = newAnimation;
  //     this.playerSprite.textures = this.loadedSprite.animations[this.currentAnimation];
  //     this.playerSprite.play();
  //   }

  //   // Emit position to server
  //   if (!this.lastSent || Date.now() - this.lastSent > 100) {
  //     this.socket.getSocket().emit("move", { x: this.worldX, y: this.worldY });
  //     this.lastSent = Date.now();
  //   }
  // }

  static async create(
    app: Application,
    socket: SocketClient,
    spriteManager: SpriteManager,
    mapContainer: Container
  ): Promise<Player> {
    const texture = await Assets.load("/player/girl/girl-sheet.png");
    const atlasData = await (await fetch("/player/girl/girl.json")).json();
    const loadedSpriteSheet = new Spritesheet(texture, atlasData);
    await loadedSpriteSheet.parse();
    return new Player(app, socket, loadedSpriteSheet, spriteManager, mapContainer);
  }
}
