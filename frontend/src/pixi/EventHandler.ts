import { Application } from "pixi.js";
import { ObjectFactory, Player, RemotePlayers, SpriteManager } from ".";
import { SocketClient } from "@/network/SocketClient";

enum Keys {
  w = "w",
  a = "a",
  s = "s",
  d = "d",
}

export default class EventHandler {
  private player?: Player;
  private remotePlayers: RemotePlayers;

  constructor(
    public app: Application,
    public socket: SocketClient,
    public spriteManager: SpriteManager,
    public objectFactory: ObjectFactory
  ) {
    this.app = app;
    this.socket = socket;
    this.spriteManager = spriteManager;
    this.remotePlayers = new RemotePlayers(app, this.socket);
  }

  setEventHandlerForPlayer(player: Player, socket: SocketClient) {
    this.player = player;
    this.socket = socket;
    this.setupEventListeners();
  }

  private setupEventListeners() {
    window.addEventListener("keydown", this.handleKeyDown.bind(this));
    window.addEventListener("keyup", this.handleKeyUp.bind(this));

    // broadcasting player movement to other connected sockets
    this.socket.getSocket().on("update-players", (players: any) => {
      this.remotePlayers.updatePlayers(players, this.spriteManager.mapContainer);
    });
    window.addEventListener("beforeunload", this.cleanup.bind(this));
  }

  private handleKeyDown(e: KeyboardEvent) {
    if (this.player && Object.values(Keys).includes(e.key as Keys)) {
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
    this.socket.getSocket().off("update-players");
  }
}
