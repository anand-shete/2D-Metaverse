import { Application, Sprite, Assets, Container, Spritesheet, AnimatedSprite } from "pixi.js";
import { ObjectFactory, Player } from ".";
import { createCollisionMap } from "./collisionMapData";

export default class SpriteManager {
  private sprites: { [key: string]: Sprite } = {};
  private player!: Player;
  private zoomLevel: number = 1; // this is zoom level of mapContainer, not the map sprite
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
      map: "/map/map.png",
    });

    const assets: Promise<Record<string, any>> = await Assets.loadBundle("objects");
    this.factory = new ObjectFactory(this.app, assets);
    this.sprites["map"] = this.factory.create("map", 0, 0, 1);
    this.mapContainer.addChild(this.sprites["map"]);
    this.app.stage.addChild(this.mapContainer);
    // this.sprites["door"] = await this.factory.createAnimateedSprite("door", 100, 200);

    const texture = await Assets.load("/furniture/door/door_0.png");
    const atlasData = await (await fetch("/furniture/door/door_0.json")).json();
    const doorSpriteSheet = new Spritesheet(texture, atlasData);
    await doorSpriteSheet.parse();
    const doorSprite = new AnimatedSprite(doorSpriteSheet.animations["close"]);
    doorSprite.animationSpeed = 0.1;  
    doorSprite.x = 200;
    doorSprite.y = 200;
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
    this.app.stage.scale.set(this.zoomLevel);
  }
  zoomOut() {
    this.zoomLevel = Math.max(this.zoomLevel - 0.1, 0.5);
    this.app.stage.scale.set(this.zoomLevel);
  }

  // FIXME: fix the locate player button, maybe only adjust thre mapcontainer on the canvas?
  locatePlayer() {
    const screenCenterX = this.app.screen.width / 2;
    const screenCenterY = this.app.screen.height / 2;
    this.mapContainer.x = screenCenterX - this.player.worldX;
    this.mapContainer.y = screenCenterY - this.player.worldY;
  }

  // we are moving the entire fking mapContainer which has (map and all remote players) sprite
  updateSprites() {
    if (this.player) {
      // console.log("height", this.mapContainer.height);   2284
      // console.log("width", this.mapContainer.width); 2048
      this.mapContainer.x = this.app.screen.width / 2 - this.player.worldX; // 515.5 - 1024 = -508.5
      this.mapContainer.y = this.app.screen.height / 2 - this.player.worldY; // 351 - 1124 = -773
      // console.log("intial position of mapcContainer x ", this.mapContainer.x); // -508.5
      // console.log("intial position of mapcContainer y", this.mapContainer.y); // -773
      // console.log("app screen width", this.app.screen.width);   // 1031
      // console.log("app screen height", this.app.screen.height);   // 702
    }
  }

  destroyAll() {
    this.mapContainer.destroy({ children: true });
    this.sprites = {};
  }
}
