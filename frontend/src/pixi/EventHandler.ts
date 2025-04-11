import { Application } from "pixi.js";
import { socket } from "./Canvas";
import { Player } from "./Player";
import { RemotePlayers } from "./RemotePlayers";
import { SpriteManager } from "./SpriteManager";

export class EventHandler {
  private player?: Player;
  private remotePlayers: RemotePlayers;

  constructor(public app: Application, public spriteManager: SpriteManager) {
    this.app = app;
    this.spriteManager = spriteManager;
    this.remotePlayers = new RemotePlayers(app);
  }

  setPlayer(player?: Player) {
    this.player = player;
    this.setupEventListeners();
  }

  private async setupEventListeners() {
    window.addEventListener("keydown", this.handleKeyDown.bind(this));
    window.addEventListener("keyup", this.handleKeyUp.bind(this));
    socket.on("update-players", (players: any) => {
      this.remotePlayers.updatePlayers(players);
    });
    window.addEventListener("beforeunload", this.cleanup.bind(this));
  }

  private handleKeyDown(e: KeyboardEvent) {
    if (this.player && !this.player.keys[e.key]) {
      this.player.keys[e.key] = true;
    }
  }

  private handleKeyUp(e: KeyboardEvent) {
    if (this.player) {
      delete this.player.keys[e.key];
    }
  }

  private cleanup() {
    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("keyup", this.handleKeyUp);
    socket.off("update-players"); 
  }
}
