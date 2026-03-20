import { Application, Sprite, Assets, Container } from "pixi.js";
import { Player, createCollisionMap } from ".";
import { map } from "@/assets";

export default class SpriteManager {
  public mapContainer!: Container;
  public collisionMap: number[][];
  private zoomLevel: number = 1; // zoom level of mapContainer
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
    this.mapContainer.scale.set(this.zoomLevel);
    Assets.addBundle("objects", {
      map: map,
    });

    const assets: Record<string, any> = await Assets.loadBundle("objects");
    this.mapSprite = Sprite.from(assets.map);
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

  zoomIn() {
    this.zoomLevel = Math.min(this.zoomLevel + 0.5, 2.0);
    this.mapContainer.scale.set(this.zoomLevel);
  }

  zoomOut() {
    this.zoomLevel = Math.max(this.zoomLevel - 0.5, 0.5);
    this.mapContainer.scale.set(this.zoomLevel);
  }

  // Update camera position to center on the local player
  updateMap() {
    if (!this.player) return;

    this.mapContainer.x = this.app.screen.width / 2 - this.player.worldX * this.zoomLevel;
    this.mapContainer.y = this.app.screen.height / 2 - this.player.worldY * this.zoomLevel;
  }

  cleanup() {
    this.mapContainer?.destroy({ children: true, texture: false, textureSource: false });
    this.mapSprite = undefined;
  }
}
