import { Application, Assets, Sprite, Texture } from "pixi.js";
import { socket } from "./Canvas";

export class RemotePlayers {
  private remotePlayers: { [id: string]: Sprite } = {};
  private texture?: Texture;

  constructor(private app: Application) {
    this.app = app;
  }

  async updatePlayers(players: { [id: string]: { x: number; y: number } }) {
    for (const id in this.remotePlayers) {
      if (!players[id]) {
        this.app.stage.removeChild(this.remotePlayers[id]);
        delete this.remotePlayers[id];
      }
    }

    for (const id in players) {
      if (id === socket.id) continue;

      // FIXME different Sprite for each player 
      if (!this.remotePlayers[id]) {
        this.texture = await Assets.load("/player/player2.png");
        const sprite: Sprite = new Sprite(this.texture);
        this.remotePlayers[id] = sprite;
        this.app.stage.addChild(sprite);
      }

      if (this.remotePlayers[id]) {
        this.remotePlayers[id].x = players[id].x;
        this.remotePlayers[id].y = players[id].y;
      }
    }
  }
}
