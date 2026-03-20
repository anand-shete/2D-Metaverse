import { Application } from "pixi.js";
import { Player, RemotePlayers, SpriteManager } from ".";
import { SocketClient } from "@/network/SocketClient";
import { MovementKey } from "@/types/type";

export default class EventHandler {
  private player!: Player;
  private remotePlayers: RemotePlayers;
  private listenersAttached: boolean = false;
  private readonly keys = new Set<MovementKey>(["w", "a", "s", "d"]);

  constructor(
    public app: Application,
    public socket: SocketClient,
    public spriteManager: SpriteManager,
  ) {
    this.remotePlayers = new RemotePlayers(app, socket);
  }

  setEventHandlerForPlayer(player: Player, socket: SocketClient) {
    this.player = player;
    this.socket = socket;
    this.setupEventListeners();
  }

  cleanup() {
    if (!this.listenersAttached) return;
    this.listenersAttached = false;

    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("keyup", this.handleKeyUp);
    window.removeEventListener("beforeunload", this.onBeforeUnload);
    this.socket.getSocket().off("player:update", this.onPlayerUpdate);
  }

  private setupEventListeners() {
    if (this.listenersAttached) return;
    this.listenersAttached = true;
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);

    const socket = this.socket.getSocket();
    socket.on("player:join", () => {
      // emit initial player position
      const data = { x: this.player.worldX, y: this.player.worldY };
      socket.emit("player:join", data);
    });

    socket.on("player:update", this.onPlayerUpdate);

    window.addEventListener("beforeunload", this.onBeforeUnload);
  }

  private readonly onPlayerUpdate = (players: any) => {
    this.remotePlayers.updatePlayers(players, this.spriteManager.mapContainer);
  };

  private readonly onBeforeUnload = () => {
    this.cleanup();
  };

  private readonly handleKeyDown = (e: KeyboardEvent) => {
    const key = e.key.toLowerCase() as MovementKey;
    if (!this.player || !this.keys.has(key)) return;
    this.player.setMovementKey(key, true);
  };

  private readonly handleKeyUp = (e: KeyboardEvent) => {
    const key = e.key.toLowerCase() as MovementKey;
    if (!this.player || !this.keys.has(key)) return;
    this.player.setMovementKey(key, false);
  };
}
