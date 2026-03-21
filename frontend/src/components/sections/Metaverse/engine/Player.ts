import { AnimatedSprite, Application, Assets, Container, Spritesheet } from "pixi.js";
import { PlayerConfig, PlayerMoveAnimation } from "@/types/enum";
import { SpriteManager, InteractionSystem } from ".";
import { SocketClient } from "@/network/SocketClient";
import { girl2, girl2Json } from "@/assets";
import { interactArray } from "./data/zones";
import { MovementKey } from "@/types/type";
import { TileBounds } from "@/types";

/**Handle loading, movement and collision of local player */
export default class Player {
  public playerSprite: AnimatedSprite;
  public lastSent?: number;
  private currentAnimation: string = PlayerMoveAnimation.IDLE;
  public worldX: number;
  public worldY: number;
  private interactionSystem: InteractionSystem;
  private movementMask = 0;
  private static readonly KEY_W = 1 << 0;
  private static readonly KEY_A = 1 << 1;
  private static readonly KEY_S = 1 << 2;
  private static readonly KEY_D = 1 << 3;

  constructor(
    public app: Application,
    public socket: SocketClient,
    public loadedSprite: Spritesheet,
    public spriteManager: SpriteManager,
    public mapContainer: Container,
  ) {
    this.playerSprite = new AnimatedSprite(this.loadedSprite.animations[PlayerMoveAnimation.IDLE]);
    this.playerSprite.animationSpeed = 0.1;
    this.playerSprite.x = app.screen.width / 2;
    this.playerSprite.y = app.screen.height / 2;
    this.playerSprite.anchor.set(0.5);
    this.playerSprite.scale.set(1);
    this.worldX = 830 + Math.random() * 270; // 830-1100
    this.worldY = 1000 + Math.random() * 324; // 1000-1324
    this.app.stage.addChild(this.playerSprite);
    this.playerSprite.play();

    this.interactionSystem = new InteractionSystem(this.mapContainer, interactArray, () =>
      this.getPlayerTileBounds(),
    );
  }

  // runs 60 times/sec
  public updateMovement() {
    let newAnimation = this.currentAnimation;
    const speed = PlayerConfig.MOVE_SPEED;
    let dx = 0;
    let dy = 0;
    let newWorldX: number = this.worldX;
    let newWorldY: number = this.worldY;

    // animate the player, keeping it at center and move the mapContainer
    if (this.movementMask & Player.KEY_W) {
      newAnimation = PlayerMoveAnimation.FRONT;
      dy -= speed;
    }
    if (this.movementMask & Player.KEY_S) {
      newAnimation = PlayerMoveAnimation.BACK;
      dy += speed;
    }
    if (this.movementMask & Player.KEY_A) {
      newAnimation = PlayerMoveAnimation.LEFT;
      dx -= speed;
    }
    if (this.movementMask & Player.KEY_D) {
      newAnimation = PlayerMoveAnimation.RIGHT;
      dx += speed;
    }

    const width = PlayerConfig.PLAYER_WIDTH;
    const height = PlayerConfig.PLAYER_HEIGHT;
    const tile_size = PlayerConfig.TILE_SIZE;

    newWorldX = this.worldX + dx;
    if (this.canPlayerMove(newWorldX, this.worldY, width, height, tile_size)) {
      this.worldX = newWorldX;
    }

    newWorldY = this.worldY + dy;
    // console.log("x=", newWorldX, "y=", newWorldY);
    if (this.canPlayerMove(this.worldX, newWorldY, width, height, tile_size)) {
      this.worldY = newWorldY;
    }

    if (this.movementMask === 0) newAnimation = PlayerMoveAnimation.IDLE;

    if (newAnimation !== this.currentAnimation) {
      this.currentAnimation = newAnimation;
      this.playerSprite.textures = this.loadedSprite.animations[this.currentAnimation];
      this.playerSprite.play();
    }

    this.interactionSystem.update();

    // transmit local player movement over sockets (with throttling)
    if (!this.lastSent || Date.now() - this.lastSent > 100) {
      const move = { x: this.worldX, y: this.worldY };
      this.socket.getSocket().emit("player:move", move);
      this.lastSent = Date.now();
    }
  }

  public setMovementKey(key: MovementKey, pressed: boolean) {
    let bit = 0;
    if (key === "w") bit = Player.KEY_W;
    else if (key === "a") bit = Player.KEY_A;
    else if (key === "s") bit = Player.KEY_S;
    else if (key === "d") bit = Player.KEY_D;

    if (pressed) {
      this.movementMask |= bit;
    } else {
      this.movementMask &= ~bit;
    }
  }

  public destroy() {
    this.interactionSystem.destroy();
    this.app.stage.removeChild(this.playerSprite);
    this.playerSprite.destroy();
  }

  private getPlayerTileBounds(): TileBounds {
    const width = PlayerConfig.PLAYER_WIDTH;
    const height = PlayerConfig.PLAYER_HEIGHT;
    const tileSize = PlayerConfig.TILE_SIZE;

    return {
      left: Math.floor((this.worldX - width / 2) / tileSize),
      right: Math.floor((this.worldX + width / 2) / tileSize),
      top: Math.floor((this.worldY - height / 2) / tileSize),
      bottom: Math.floor((this.worldY + height / 2) / tileSize),
    };
  }

  private canPlayerMove(
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
          return false;
        }
      }
    }

    return true;
  }

  static async loadPlayer(
    app: Application,
    socket: SocketClient,
    spriteManager: SpriteManager,
    mapContainer: Container,
  ): Promise<Player> {
    const texture = await Assets.load(girl2);
    const loadedSpriteSheet = new Spritesheet(texture, girl2Json);
    await loadedSpriteSheet.parse();
    return new Player(app, socket, loadedSpriteSheet, spriteManager, mapContainer);
  }
}
