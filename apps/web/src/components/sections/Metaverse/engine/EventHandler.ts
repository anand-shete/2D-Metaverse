import { Application } from "pixi.js";
import { Player, RemotePlayers, SpriteManager } from ".";
import { SocketClient } from "@/network/SocketClient";
import { MovementKey } from "@/types/type";
import { Players } from "@/types/interface";

/** Handle new player connections, local player keyboard listeners and movement transmission*/
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
    this.remotePlayers.setMapContainer(this.spriteManager.mapContainer);
    this.setupEventListeners();
  }

  cleanup() {
    if (!this.listenersAttached) return;
    this.listenersAttached = false;

    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("keyup", this.handleKeyUp);
    window.removeEventListener("beforeunload", this.onBeforeUnload);
    this.socket.getSocket().off("player:update", this.onPlayerUpdate);
    this.remotePlayers.cleanupRemotePlayers();
  }

  private setupEventListeners() {
    if (this.listenersAttached) return;
    this.listenersAttached = true;

    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
    window.addEventListener("beforeunload", this.onBeforeUnload);

    const socket = this.socket.getSocket();
    socket.on("player:update", this.onPlayerUpdate);
  }

  private readonly onPlayerUpdate = (players: Players) => {
    this.remotePlayers.updateRemotePlayers(players);
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
