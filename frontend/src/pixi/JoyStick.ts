import { Container, Sprite, Application, Assets } from "pixi.js";

export class Joystick {
  private outerCircle!: Sprite;
  private innerCircle!: Sprite;
  private container: Container;
  private isDragging: boolean = false;
  private touchId: number | null = null;
  public dx: number = 0;
  public dy: number = 0;
  private maxDistance: number = 50; // Max distance inner circle can move from center

  constructor(private app: Application) {
    this.container = new Container();
    this.app.stage.addChild(this.container);

    // Position the joystick at a fixed location (bottom-left)
    this.container.x = 100; // Adjust as needed
    this.container.y = this.app.screen.height - 150; // Near bottom
    this.container.visible = true; // Always visible for testing
    this.loadAssets();
  }

  async loadAssets() {
    Assets.addBundle("joystick", {
      outer: "/joystick/outer.png",
      inner: "/joystick/inner.png",
    });
    const joystick = await Assets.loadBundle("joystick");
    // Outer circle (base)
    this.outerCircle = Sprite.from(joystick.outer);
    this.outerCircle.anchor.set(0.5);
    this.outerCircle.scale.set(1); // Adjust size as needed
    this.container.addChild(this.outerCircle);

    // Inner circle (knob)
    this.innerCircle = Sprite.from(joystick.inner);
    this.innerCircle.anchor.set(0.5);
    this.innerCircle.scale.set(1);
    this.container.addChild(this.innerCircle);

    // Make the outer circle interactive
    this.outerCircle.eventMode = "static"; // Enable interaction
    this.outerCircle.on("pointerdown", this.onPointerDown.bind(this));
    this.outerCircle.on("pointermove", this.onPointerMove.bind(this));
    this.outerCircle.on("pointerup", this.onPointerUp.bind(this));
    this.outerCircle.on("pointerupoutside", this.onPointerUp.bind(this));
  }

  private onPointerDown(event: any) {
    if (!this.isDragging) {
      const touchData = event.data;
    //   console.log("touchData",touchData);
      
      this.touchId = touchData.identifier;
      this.isDragging = true;

      // Reset inner circle
      this.innerCircle.x = 0;
      this.innerCircle.y = 0;
      this.dx = 0;
      this.dy = 0;
    }
  }

  private onPointerMove(event: any) {
    if (this.isDragging && event.data.identifier === this.touchId) {
      const localPos = event.data.getLocalPosition(this.container);

      // Calculate distance from center
      let dx = localPos.x;
      let dy = localPos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Limit to maxDistance
      if (distance > this.maxDistance) {
        const scale = this.maxDistance / distance;
        dx *= scale;
        dy *= scale;
      }

      // Update inner circle position
      this.innerCircle.x = dx;
      this.innerCircle.y = dy;

      // Normalize to -1 to 1 for movement
      this.dx = dx / this.maxDistance;
      this.dy = dy / this.maxDistance;
    }
  }

  private onPointerUp(event: any) {
    if (this.isDragging && event.data.identifier === this.touchId) {
      this.isDragging = false;
      this.touchId = null;
      this.dx = 0;
      this.dy = 0;
      this.innerCircle.x = 0;
      this.innerCircle.y = 0;
    }
  }

  public isActive(): boolean {
    return this.isDragging;
  }
}
