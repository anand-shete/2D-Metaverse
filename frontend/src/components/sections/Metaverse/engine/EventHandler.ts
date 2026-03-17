import { Application } from "pixi.js";
import { Player, RemotePlayers, SpriteManager } from ".";
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
  private listenersAttached = false;

  constructor(
    public app: Application,
    public socket: SocketClient,
    public spriteManager: SpriteManager,
  ) {
    this.app = app;
    this.socket = socket;
    this.spriteManager = spriteManager;
    this.remotePlayers = new RemotePlayers(app, this.socket);
  }

  private readonly onPlayerUpdate = (players: any) => {
    this.remotePlayers.updatePlayers(players, this.spriteManager.mapContainer);
  };

  private readonly onBeforeUnload = () => {
    this.cleanup();
  };

  private readonly onKeyDown = (e: KeyboardEvent) => {
    this.handleKeyDown(e);
  };

  private readonly onKeyUp = (e: KeyboardEvent) => {
    this.handleKeyUp(e);
  };

  setEventHandlerForPlayer(player: Player, socket: SocketClient) {
    this.player = player;
    this.socket = socket;
    this.setupEventListeners();
  }

  private setupEventListeners() {
    if (this.listenersAttached) return;
    this.listenersAttached = true;

    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);

    // broadcasting player movement to other connected sockets
    const socket = this.socket.getSocket();
    socket.on("player:update", this.onPlayerUpdate);
    window.addEventListener("beforeunload", this.onBeforeUnload);
  }

  private handleKeyDown(e: KeyboardEvent) {
    const key = e.key.toLowerCase();
    if (this.player && Object.values(Keys).includes(key as Keys)) {
      this.player.keys[key] = true;
    }
  }

  private handleKeyUp(e: KeyboardEvent) {
    const key = e.key.toLowerCase();
    if (this.player) {
      delete this.player.keys[key];
    }
  }

  private cleanup() {
    if (!this.listenersAttached) return;
    this.listenersAttached = false;

    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
    window.removeEventListener("beforeunload", this.onBeforeUnload);
    this.socket.getSocket().off("player:update", this.onPlayerUpdate);
  }

  public dispose() {
    this.cleanup();
  }
}
