import { Application, Sprite, Assets, Container } from "pixi.js";
import { Player, createCollisionMap } from ".";
import { map } from "@/assets";

/** Manage the add/removal of sprites, containers on the map */
export default class SpriteManager {
  public mapContainer!: Container;
  public collisionMap: number[][];
  private player!: Player;
  private mapSprite?: Sprite;

  constructor(public app: Application) {
    this.collisionMap = createCollisionMap();
  }

  /* Initialize the map and scene graph structure:
     app.stage
       |- mapContainer (contains map sprite)
       |- playerSprite (added by Player class)
  */
  async initMap() {
    this.mapContainer = new Container();
    // this.mapContainer.scale.set(1);

    const texture = await Assets.load(map);
    this.mapSprite = Sprite.from(texture);
    this.mapSprite.anchor.set(0);
    this.mapSprite.scale.set(1);
    this.mapSprite.x = 0;
    this.mapSprite.y = 0;

    this.mapContainer.addChild(this.mapSprite);
    this.app.stage.addChild(this.mapContainer);
  }

  setPlayer(player: Player) {
    this.player = player;
  }

  // Update camera position to center on the local player
  updateMap() {
    if (!this.player) return;

    this.mapContainer.x = this.app.screen.width / 2 - this.player.worldX;
    this.mapContainer.y = this.app.screen.height / 2 - this.player.worldY;
  }

  cleanup() {
    this.mapContainer?.destroy({ children: true, texture: false, textureSource: false });
    this.mapSprite = undefined;
  }
}
