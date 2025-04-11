// SpriteManager class handles the creation, updating, and removal of multiple sprites (e.g., furniture, rooms). SpriteManager focused on managing sprites rather than creating them.
import { Application, Sprite, Assets, Container } from "pixi.js";
import { ObjectFactory } from "./ObjectFactory";
import { Player } from "./Player";

export class SpriteManager {
  private sprites: { [key: string]: Sprite } = {};
  private mapContainer: Container;

  constructor(private app: Application) {
    this.app = app;
    this.mapContainer = new Container();

    this.app.stage.addChild(this.mapContainer);
  }

  async loadInitialSprites() {
    Assets.addBundle("furniture", {
      map: "/map/map.png",
    });

    const assets = await Assets.loadBundle("furniture");
    const factory: ObjectFactory = new ObjectFactory(this.app, assets);

    this.sprites['map'] = factory.create('map', this.app.screen.width / 2, this.app.screen.height / 2, 1);
    console.log("done1 called", this.sprites);

    this.mapContainer.addChild(this.sprites['map']);
  }
  addPlayerToContainer(player: any) {
    console.log("done2 player:",player);
    this.mapContainer.addChild(player);
  }
  update() {
    // updates for other objects
  }
}
