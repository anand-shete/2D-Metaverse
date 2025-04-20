import { SocketClient } from "@/network/SocketClient";
import { Application, Assets, Container, Sprite, Texture } from "pixi.js";

export default class RemotePlayers {
  private remotePlayers: { [id: string]: Sprite } = {};
  private texture?: Texture;

  constructor(public app: Application, public socket: SocketClient) {
    this.app = app;
    this.socket = socket;
  }

  // called only after recieving the "update-players" socket event from setupEventListeners()
  async updatePlayers(
    players: { [id: string]: { x: number; y: number } },
    mapContainer: Container
  ) {
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
        this.texture = await Assets.load("/player/player2.png");
        const sprite = Sprite.from(this.texture);
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
