import {
  AnimatedSprite,
  Application,
  Assets,
  Container,
  Spritesheet,
  Text,
  TextStyle,
} from "pixi.js";
import { PlayerConfig, PlayerMoveAnimation } from "@/types/enum";
import { SpriteManager, InteractionSystem } from ".";
import { SocketClient } from "@/network/SocketClient";
import { interactArray } from "./data/zones";
import { AvatarId, MovementKey } from "@/types/type";
import { PlayerMoveData, TileBounds } from "@/types/interface";
import { AvatarConfig } from "./data/avatar";

/**Handle loading, movement and collision of local player */
export default class Player {
  public playerSprite: AnimatedSprite;
  private usernameText: Text;
  private lastPacketSent?: number;
  public worldX: number;
  public worldY: number;
  private currentAnimation = PlayerMoveAnimation.IDLE;
  private interactionSystem: InteractionSystem;
  private movementMask = 0;
  private static readonly KEY_W = 1 << 0;
  private static readonly KEY_A = 1 << 1;
  private static readonly KEY_S = 1 << 2;
  private static readonly KEY_D = 1 << 3;

  constructor(
    public app: Application,
    public socket: SocketClient,
    public sheet: Spritesheet,
    public spriteManager: SpriteManager,
    public mapContainer: Container,
    public avatar: AvatarId,
    public username: string,
  ) {
    this.playerSprite = new AnimatedSprite(this.sheet.animations[PlayerMoveAnimation.IDLE]);
    this.playerSprite.animationSpeed = 0.1;
    this.playerSprite.x = app.screen.width / 2;
    this.playerSprite.y = app.screen.height / 2;
    this.playerSprite.anchor.set(0.5);
    this.playerSprite.scale.set(1);
    this.worldX = 830 + Math.round(Math.random() * 270); // 830-1100
    this.worldY = 1000 + Math.round(Math.random() * 324); // 1000-1324
    this.app.stage.addChild(this.playerSprite);
    this.playerSprite.play();

    this.usernameText = new Text({
      text: this.username,
      style: new TextStyle({
        fontSize: 10,
        fill: 0xffffff,
        fontWeight: "bold",
        fontFamily: "monospace",
        stroke: { color: "#000000", width: 2 },
        padding: 2,
      }),
    });
    this.usernameText.anchor.set(0.5);
    this.usernameText.x = app.screen.width / 2;
    this.usernameText.y = app.screen.height / 2 - 30;
    this.app.stage.addChild(this.usernameText);

    this.interactionSystem = new InteractionSystem(this.mapContainer, interactArray, () =>
      this.getPlayerTileBounds(this.worldX, this.worldY),
    );
  }

  // runs 60 times/sec
  public updateLocalPlayer() {
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

    newWorldX = this.worldX + dx;
    if (this.canPlayerMove(newWorldX, this.worldY)) {
      this.worldX = newWorldX;
    }

    newWorldY = this.worldY + dy;
    if (this.canPlayerMove(this.worldX, newWorldY)) {
      this.worldY = newWorldY;
    }

    // console.log("x=", newWorldX, "y=", newWorldY);
    if (this.movementMask === 0) newAnimation = PlayerMoveAnimation.IDLE;

    if (newAnimation !== this.currentAnimation) {
      this.currentAnimation = newAnimation;
      this.playerSprite.textures = this.sheet.animations[this.currentAnimation];
      this.playerSprite.play();
    }

    this.interactionSystem.update();

    // Send animation state immediately when direction changes, not only on periodic move packets???
    // transmit local player movement over sockets (with throttling)
    if (!this.lastPacketSent || Date.now() - this.lastPacketSent > 30) {
      const move: PlayerMoveData = {
        x: this.worldX,
        y: this.worldY,
        animation: newAnimation,
        avatar: this.avatar,
        username: this.username,
      };
      this.socket.getSocket().emit("player:move", move);
      this.lastPacketSent = Date.now();
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
    this.usernameText.destroy();
    this.app.stage.removeChild(this.playerSprite);
    this.playerSprite.destroy();
  }

  private getPlayerTileBounds(x: number, y: number): TileBounds {
    const pWidth = PlayerConfig.PLAYER_WIDTH;
    const pHeight = PlayerConfig.PLAYER_HEIGHT;
    const tile_size = PlayerConfig.TILE_SIZE;

    // (new player coordinates - playerCenter) / size of tile (32px)
    return {
      left: Math.floor((x - pWidth / 2) / tile_size),
      right: Math.floor((x + pWidth / 2) / tile_size),
      top: Math.floor((y - pHeight / 2) / tile_size),
      bottom: Math.floor((y + pHeight / 2) / tile_size),
    };
  }

  private canPlayerMove(x: number, y: number): boolean {
    const { left, right, bottom, top } = this.getPlayerTileBounds(x, y);

    for (let y = top; y <= bottom; y++) {
      for (let x = left; x <= right; x++) {
        if (this.spriteManager.collisionMap[y][x] === 1) {
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
    avatar: AvatarId,
    username: string,
  ): Promise<Player> {
    const selected = AvatarConfig[avatar];
    const texture = await Assets.load(selected.texture);
    const sheet = new Spritesheet(texture, selected.sheet);
    await sheet.parse();
    return new Player(app, socket, sheet, spriteManager, mapContainer, avatar, username);
  }
}
