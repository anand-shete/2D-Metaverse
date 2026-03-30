import { SocketClient } from "@/network/SocketClient";
import {
  Application,
  Assets,
  AnimatedSprite,
  Container,
  Spritesheet,
  Texture,
  Text,
  TextStyle,
} from "pixi.js";
import { PlayerMoveData, Players, RemotePlayerData } from "@/types/interface";
import { PlayerMoveAnimation } from "@/types/enum";
import { AvatarId } from "@/types/type";
import { AvatarConfig } from "./data/avatar";

export default class RemotePlayers {
  private socketIdToRemotePlayersMap = new Map<string, RemotePlayerData>();
  private avatarSpriteSheets = new Map<AvatarId, Spritesheet>();
  private avatarSpriteSheetPromises = new Map<AvatarId, Promise<Spritesheet>>();
  private mapContainer?: Container;

  constructor(
    public app: Application,
    public socket: SocketClient,
  ) {}

  setMapContainer(mapContainer: Container) {
    this.mapContainer = mapContainer;
  }

  async updateRemotePlayers(players: Players) {
    if (!this.mapContainer) return;

    for (const id of this.socketIdToRemotePlayersMap.keys()) {
      if (!players[id]) this.removePlayer(id);
    }

    // for each remote player id
    for (const id of Object.keys(players)) {
      if (id === this.socket.getSocket().id) continue;
      const remotePlayer: PlayerMoveData = players[id];
      // Create sprite once for a new remote player.
      // reduce delay between setting player coordinates and creating remote player sprite
      let sprite = this.socketIdToRemotePlayersMap.get(id)?.animatedSprite;
      if (!sprite) sprite = await this.getOrCreateRemotePlayer(id, remotePlayer);

      const remoteContainer = this.socketIdToRemotePlayersMap.get(id)?.container;
      if (remoteContainer) {
        remoteContainer.x = remotePlayer.x;
        remoteContainer.y = remotePlayer.y;
      }

      const usernameText = this.socketIdToRemotePlayersMap.get(id)?.username;
      if (usernameText && usernameText.text !== remotePlayer.username) {
        usernameText.text = remotePlayer.username;
      }

      const playerSheet = this.socketIdToRemotePlayersMap.get(id)?.spritesheet;
      if (!playerSheet) continue;
      this.updateAnimation(id, sprite, playerSheet, remotePlayer.animation);
    }
  }

  cleanupRemotePlayers() {
    for (const id of this.socketIdToRemotePlayersMap.keys()) {
      this.removePlayer(id);
    }
    this.mapContainer = undefined;
    this.socketIdToRemotePlayersMap.clear();
  }

  private getOrCreateRemotePlayer(id: string, player: PlayerMoveData): Promise<AnimatedSprite> {
    const existingSprite = this.socketIdToRemotePlayersMap.get(id)?.animatedSprite;
    if (existingSprite) return Promise.resolve(existingSprite);

    const inFlightCreation = this.socketIdToRemotePlayersMap.get(id)?.animatedSpriteCreationPromise;
    if (inFlightCreation) return inFlightCreation;

    const creationPromise = this.createRemotePlayer(id, player)
      .then(sprite => {
        const current = this.socketIdToRemotePlayersMap.get(id);
        if (current) {
          this.socketIdToRemotePlayersMap.set(id, {
            ...current,
            animatedSpriteCreationPromise: undefined,
          });
        }
        return sprite;
      })
      .catch(error => {
        this.removePlayer(id);
        throw error;
      });

    const current = this.socketIdToRemotePlayersMap.get(id);
    this.socketIdToRemotePlayersMap.set(id, {
      ...current,
      animatedSpriteCreationPromise: creationPromise,
    });
    return creationPromise;
  }

  private async createRemotePlayer(id: string, player: PlayerMoveData): Promise<AnimatedSprite> {
    if (!this.mapContainer) {
      throw new Error("Map container is not initialized for RemotePlayers");
    }

    const remotePlayerContainer = new Container();
    remotePlayerContainer.x = player.x;
    remotePlayerContainer.y = player.y;

    //
    const spriteSheet = await this.getSpriteSheet(player.avatar);

    const animation = player.animation;
    const sprite = new AnimatedSprite(spriteSheet.animations[animation]);
    sprite.animationSpeed = 0.1;
    sprite.anchor.set(0.5);

    // Keep child coordinates local to the remote player container.
    sprite.x = 0;
    sprite.y = 0;
    sprite.play();

    const usernameText = new Text({
      text: player.username,
      style: new TextStyle({
        fontSize: 10,
        fill: 0xffffff,
        fontWeight: "bold",
        fontFamily: "monospace",
        stroke: { color: "#000000", width: 2 },
        padding: 2,
      }),
    });

    usernameText.anchor.set(0.5);
    usernameText.x = 0;
    usernameText.y = -30;
    remotePlayerContainer.addChild(sprite);
    remotePlayerContainer.addChild(usernameText);
    this.mapContainer.addChild(remotePlayerContainer);

    this.socketIdToRemotePlayersMap.set(id, {
      container: remotePlayerContainer,
      spritesheet: spriteSheet,
      animatedSprite: sprite,
      username: usernameText,
      animatedSpriteCreationPromise: undefined,
      animation,
    });

    return sprite;
  }

  private removePlayer(id: string) {
    const remoteContainer = this.socketIdToRemotePlayersMap.get(id)?.container;
    if (!remoteContainer) return;

    this.mapContainer?.removeChild(remoteContainer);
    remoteContainer.destroy({ children: true });

    this.socketIdToRemotePlayersMap.delete(id);
  }

  private updateAnimation(
    id: string,
    sprite: AnimatedSprite,
    spriteSheet: Spritesheet,
    animation?: PlayerMoveAnimation,
  ) {
    const nextAnimation = this.getPlayerAnimation(spriteSheet, animation);
    const currentAnimation = this.socketIdToRemotePlayersMap.get(id)?.animation;
    if (currentAnimation === nextAnimation) return;

    if (!spriteSheet.animations[nextAnimation]) return;
    sprite.textures = spriteSheet.animations[nextAnimation];
    sprite.play();

    const current = this.socketIdToRemotePlayersMap.get(id);
    if (!current) return;

    this.socketIdToRemotePlayersMap.set(id, {
      ...current,
      animation: nextAnimation as PlayerMoveAnimation,
    });
  }

  private getPlayerAnimation(spriteSheet: Spritesheet, animation?: PlayerMoveAnimation) {
    if (animation && spriteSheet.animations[animation]) return animation;
    return PlayerMoveAnimation.IDLE;
  }

  private async getSpriteSheet(avatar: AvatarId): Promise<Spritesheet> {
    const cachedSheet = this.avatarSpriteSheets.get(avatar);
    if (cachedSheet) return cachedSheet;

    const pendingSheet = this.avatarSpriteSheetPromises.get(avatar);
    if (pendingSheet) return pendingSheet;

    const selectedAvatar = AvatarConfig[avatar];
    const nextSheetPromise = Assets.load(selectedAvatar.texture).then(async (texture: Texture) => {
      const sheet = new Spritesheet(texture, selectedAvatar.sheet);
      await sheet.parse();
      this.avatarSpriteSheets.set(avatar, sheet);
      this.avatarSpriteSheetPromises.delete(avatar);
      return sheet;
    });
    this.avatarSpriteSheetPromises.set(avatar, nextSheetPromise);

    return nextSheetPromise;
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
