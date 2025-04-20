import { AnimatedSprite, Application, Assets, Sprite, Spritesheet } from "pixi.js";

export default class ObjectFactory {
  constructor(public app: Application, public assets: Record<string, any>) {
    this.app = app;
    this.assets = assets;
  }

  create(name: string, x: number, y: number, scale: number) {
    const sprite = Sprite.from(this.assets[name]);
    sprite.anchor.set(0); // damm!
    sprite.scale.set(scale);
    sprite.x = x;
    sprite.y = y;
    this.app.stage.addChild(sprite);
    return sprite;
  }

  async createAnimateedSprite(name: string, x: number, y: number) {
    const door = this.assets[name] as Spritesheet;
    await door.parse(); // Important: wait for animations to be available
    const doorSprite = new AnimatedSprite(door.animations["close"]);
    doorSprite.play();
    doorSprite.x = x;
    doorSprite.y = y;

    this.app.stage.addChild(doorSprite); // or wherever you want to add it
    return doorSprite;
    /*
        const texture = await Assets.load("/player/girl/girl-sheet.png");
        const atlasData = await (await fetch("/player/girl/girl.json")).json();
        const loadedSpriteSheet = new Spritesheet(texture, atlasData);
        await loadedSpriteSheet.parse();
        return new Player(app, socket, texture, loadedSpriteSheet, spriteManager, mapContainer);
    */
  }
}
