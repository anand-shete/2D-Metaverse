import { SocketClient } from "@/network/SocketClient";
import { Application, Assets, AnimatedSprite, Container, Spritesheet, Texture } from "pixi.js";
import { PlayerMoveData, Players } from "@/types/interface";
import { PlayerMoveAnimation } from "@/types/enum";
import { AvatarId } from "@/types/type";
import { AVATAR_CONFIG } from "./data/avatar";

export default class RemotePlayers {
  private socketIdToSpriteMap = new Map<string, AnimatedSprite>();
  private currentAnimations = new Map<string, string>();
  private mapContainer?: Container;
  private spriteSheet?: Spritesheet;
  private spriteSheetPromise?: Promise<Spritesheet>;

  constructor(
    public app: Application,
    public socket: SocketClient,
  ) {}

  setMapContainer(mapContainer: Container) {
    this.mapContainer = mapContainer;
  }

  async updateRemotePlayers(players: Players) {
    if (!this.mapContainer) return;
    for (const id of this.socketIdToSpriteMap.keys()) {
      if (!players[id]) {
        this.removePlayer(id);
      }
    }

    for (const id of Object.keys(players)) {
      if (id === this.socket.getSocket().id) continue;
      // store the socketId as key
      const remotePlayer: PlayerMoveData = players[id];

      // Create sprite once for a new remote player.
      // reduce delay between setting player coordinates and creating remote player sprite
      let sprite = this.socketIdToSpriteMap.get(id);
      if (!sprite) sprite = await this.createRemotePlayer(id, remotePlayer);

      sprite.x = remotePlayer.x;
      sprite.y = remotePlayer.y;
      this.updateAnimation(id, sprite, remotePlayer.animation);
    }
  }

  cleanupRemotePlayers() {
    for (const id of this.socketIdToSpriteMap.keys()) {
      this.removePlayer(id);
    }
    this.mapContainer = undefined;
    this.currentAnimations.clear();
  }

  private async createRemotePlayer(id: string, player: PlayerMoveData): Promise<AnimatedSprite> {
    if (!this.mapContainer) {
      throw new Error("Map container is not initialized for RemotePlayers");
    }

    const spriteSheet = await this.getSpriteSheet(player.avatar);

    const animation = player.animation;
    const sprite = new AnimatedSprite(spriteSheet.animations[animation]);
    sprite.animationSpeed = 0.1;
    sprite.anchor.set(0.5);
    // this is called snapping to player position
    sprite.x = player.x;
    sprite.y = player.y;
    sprite.play();

    this.socketIdToSpriteMap.set(id, sprite);
    this.currentAnimations.set(id, animation);
    this.mapContainer.addChild(sprite);

    return sprite;
  }

  private removePlayer(id: string) {
    const sprite = this.socketIdToSpriteMap.get(id);
    if (!sprite) return;

    this.mapContainer?.removeChild(sprite);
    sprite.destroy();
    this.socketIdToSpriteMap.delete(id);
    this.currentAnimations.delete(id);
  }

  private updateAnimation(id: string, sprite: AnimatedSprite, animation?: string) {
    const nextAnimation = this.getPlayerAnimation(animation);
    const currentAnimation = this.currentAnimations.get(id);
    if (currentAnimation === nextAnimation) return;

    if (!this.spriteSheet?.animations[nextAnimation]) return;
    sprite.textures = this.spriteSheet.animations[nextAnimation];
    sprite.play();
    this.currentAnimations.set(id, nextAnimation);
  }

  private getPlayerAnimation(animation?: string): string {
    if (animation && this.spriteSheet?.animations[animation]) return animation;
    return PlayerMoveAnimation.IDLE;
  }

  private async getSpriteSheet(avatar: AvatarId): Promise<Spritesheet> {
    if (this.spriteSheet) return this.spriteSheet;
    if (this.spriteSheetPromise) return this.spriteSheetPromise;
    // console.log("avatar", avatar);
    const selectedAvatar = AVATAR_CONFIG[avatar];
    this.spriteSheetPromise = Assets.load(selectedAvatar.texture).then(async (texture: Texture) => {
      const sheet = new Spritesheet(texture, selectedAvatar.sheet);
      await sheet.parse();
      this.spriteSheet = sheet;
      return sheet;
    });

    return this.spriteSheetPromise;
  }
}

/*
Interpolation means:

Keep a target position from network updates.
Every render frame, move only part of the distance toward that target.
So motion appears smooth between packets.
Simple idea:

On socket update: set targetX, targetY
On each frame:
x = x + (targetX - x) * alpha
y = y + (targetY - y) * alpha
Where alpha is something like 0.15 to 0.35.

Higher alpha = faster catch-up, less smoothing
Lower alpha = smoother but more delay 
*/
