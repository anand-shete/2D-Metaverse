import { Application, Sprite, Assets, Container } from "pixi.js";
import { ObjectFactory, Player } from ".";
import { createCollisionMap } from "./collisionMapData";
// import door0Json from "@/assets/furniture/door/door_0.json";
// import door0Img from "@/assets/furniture/door/door_0.png";
import map from "@/assets/map/map.png";

export default class SpriteManager {
  private mapSprite?: Sprite;
  private player!: Player;
  private zoomLevel: number = 1; // zoom level of mapContainer, not the map sprite
  public mapContainer!: Container;
  public factory!: ObjectFactory;
  public collisionMap!: number[][];

  constructor(private app: Application) {
    this.app = app;
    this.collisionMap = createCollisionMap();
  }

  /* filhal, we are only loading the map here and the current scene Graph is 
  app.stage
    |- mapContainer (map)
    |- playerSprite (player)
  */
  async loadInitialSprites() {
    // console.log("collision", this.collisionMap); // rows: 0 to 71 (72) and colums: 0 to 64 (each array's elements)
    this.mapContainer = new Container();
    this.mapContainer.scale.set(this.zoomLevel);

    // These .json files reference .png files internally, so Pixi will automatically load both.
    Assets.addBundle("objects", {
      map: map,
    });

    const assets: Record<string, any> = await Assets.loadBundle("objects");
    this.factory = new ObjectFactory(this.app, assets);
    this.mapSprite = Sprite.from(assets.map);
    this.mapSprite.anchor.set(0);
    this.mapSprite.scale.set(1);
    this.mapSprite.x = 0;
    this.mapSprite.y = 0;
    this.mapContainer.addChild(this.mapSprite);
    this.app.stage.addChild(this.mapContainer);
    // this.sprites["door"] = await this.factory.createAnimateedSprite("door", 100, 200);

    // const texture = await Assets.load(door0Img);
    // const doorSpriteSheet = new Spritesheet(texture, door0Json);
    // await doorSpriteSheet.parse();
    // const doorSprite = new AnimatedSprite(doorSpriteSheet.animations["close"]);
    // doorSprite.animationSpeed = 0.1;
    // doorSprite.x = 200;
    // doorSprite.y = 200;
    // this.app.stage.addChild(doorSprite);
    // doorSprite.play();
    // console.log(
    //   "Raw width: ",
    //   this.sprites["map"].texture.width,
    //   "\nRaw height: ",
    //   this.sprites["map"].texture.height
    // );
    // console.log(
    //   "After modifying by Pixi, height: ",
    //   this.mapContainer.height,
    //   "\nwidth: ",
    //   this.mapContainer.width
    // );
  }

  setPlayerSprite(player: Player) {
    this.player = player;
  }

  zoomIn() {
    this.zoomLevel = Math.min(this.zoomLevel + 0.1, 2.0);
    this.mapContainer.scale.set(this.zoomLevel);
  }

  zoomOut() {
    this.zoomLevel = Math.max(this.zoomLevel - 0.1, 0.5);
    this.mapContainer.scale.set(this.zoomLevel);
  }

  // we are moving the entire fking mapContainer (map and all remote players) sprite
  updateSprites() {
    if (!this.player) return;

    this.mapContainer.x = this.app.screen.width / 2 - this.player.worldX; // 515.5 - 1024 = -508.5
    this.mapContainer.y = this.app.screen.height / 2 - this.player.worldY; // 351 - 1124 = -773
    // console.log("intial position of mapcContainer x ", this.mapContainer.x); // -508.5
    // console.log("intial position of mapcContainer y", this.mapContainer.y); // -773
    // console.log("app screen width", this.app.screen.width);   // 1031
    // console.log("app screen height", this.app.screen.height);   // 702
  }

  destroyAll() {
    this.mapContainer?.destroy({ children: true, texture: false, textureSource: false });
    this.mapSprite = undefined;
  }
}
