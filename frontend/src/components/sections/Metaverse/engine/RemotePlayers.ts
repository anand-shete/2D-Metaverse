import { SocketClient } from "@/network/SocketClient";
import { Application, Assets, Container, Sprite, Texture } from "pixi.js";
import { Players } from "@/types";
import Player2 from "@/assets/player/player2.png";

export default class RemotePlayers {
  private remotePlayers: { [id: string]: Sprite } = {};
  private texture?: Texture;
  private texturePromise?: Promise<Texture>;

  constructor(
    public app: Application,
    public socket: SocketClient,
  ) {
    this.app = app;
    this.socket = socket;
  }

  private async getTexture(): Promise<Texture> {
    if (this.texture) return this.texture;

    if (!this.texturePromise) {
      this.texturePromise = Assets.load(Player2).then(texture => {
        this.texture = texture;
        return texture;
      });
    }

    return this.texturePromise;
  }

  // called only after recieving the "player:update" socket event from setupEventListeners()
  async updatePlayers(players: Players, mapContainer: Container) {
    // console.log("total players", Object.keys(players).length);
    for (const id in this.remotePlayers) {
      if (!players[id]) {
        mapContainer.removeChild(this.remotePlayers[id]);
        delete this.remotePlayers[id];
      }
    }

    for (const id in players) {
      if (id === this.socket.getSocket().id) continue;

      // If the received socket id is not present in client's remotePlayers object, create player and update the object
      if (!this.remotePlayers[id]) {
        const texture = await this.getTexture();
        const sprite = Sprite.from(texture);
        this.remotePlayers[id] = sprite;
        sprite.x = this.remotePlayers[id].x;
        sprite.y = this.remotePlayers[id].y;
        mapContainer.addChild(sprite);
      }

      // If the socket id is present, update the player location
      if (this.remotePlayers[id]) {
        this.remotePlayers[id].x = players[id].x;
        this.remotePlayers[id].y = players[id].y;
      }
    }
  }
}
