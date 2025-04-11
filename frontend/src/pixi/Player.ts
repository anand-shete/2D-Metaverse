import {
  AnimatedSprite,
  Application,
  Assets,
  Sprite,
  Spritesheet,
  Texture,
} from "pixi.js";
import { socket } from "./Canvas";
import { SpriteManager } from "./SpriteManager";

export class Player {
  public sprite: AnimatedSprite;
  public keys: { [pressedKey: string]: boolean } = {};
  public lastSent?: number;
  private currentAnimation: string = "idle";

  constructor(
    public app: Application,
    public texture: Texture,
    public loadedSprite: Spritesheet,
    public spriteManager:SpriteManager
  ) {
    this.app = app;
    this.sprite = new AnimatedSprite(this.loadedSprite.animations["idle"]);
    this.sprite.animationSpeed = 0.1;
    this.sprite.x = app.screen.width / 2;
    this.sprite.y = app.screen.height / 2;
    app.stage.addChild(this.sprite);
    this.sprite.play();
    this.spriteManager.addPlayerToContainer(this.sprite);
  }

  update() {
    let newAnimation = this.currentAnimation;
    const speed = 3;

    if (this.keys["w"]) {
      newAnimation = "front";
      this.sprite.y -= speed;
    }
    if (this.keys["s"]) {
      newAnimation = "back";
      this.sprite.y += speed;
    }
    if (this.keys["a"]) {
      newAnimation = "left";
      this.sprite.x -= speed;
    }
    if (this.keys["d"]) {
      newAnimation = "right";
      this.sprite.x += speed;
    }
    if (!Object.keys(this.keys).length) this.sprite.stop();

    if (
      newAnimation !== this.currentAnimation &&
      this.loadedSprite.animations[newAnimation]
    ) {
      this.currentAnimation = newAnimation;
      this.sprite.textures =
        this.loadedSprite.animations[this.currentAnimation];
      this.sprite.play();
    }

    if (!this.lastSent || Date.now() - this.lastSent > 100) {
      socket.emit("move", { x: this.sprite.x, y: this.sprite.y });
      this.lastSent = Date.now();
    }
  }

  
  static async create(app: Application): Promise<Player> {
    const texture = await Assets.load("/player/girl/girl-sheet.png");
    const atlasData = await (await fetch("/player/girl/girl.json")).json();
    const loadedSpriteSheet = new Spritesheet(texture, atlasData);
    await loadedSpriteSheet.parse();
    const spriteManager = new SpriteManager(app);
    return new Player(app, texture, loadedSpriteSheet,spriteManager);
  }
}
