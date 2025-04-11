// ObjectFactory class and methods are used to instantiate different types of game objects (e.g., chairs, tables, whiteboards) with consistent properties (scale, position, etc.).
import { Application, Sprite } from "pixi.js";

export class ObjectFactory {
  constructor(public app: Application, public assets: any) {
    this.app = app;
    this.assets = assets;
  }

  create(name: string, x: number, y: number, scale: number) {
    console.log("this.assets",this.assets);
    
    const sprite = Sprite.from(this.assets[name]);
    sprite.anchor.set(0.5);
    sprite.scale.set(scale);
    sprite.x = x;
    sprite.y = y;

    this.app.stage.addChild(sprite);
    return sprite;
  }

  // we will load the sprites from a spritesheet
}
