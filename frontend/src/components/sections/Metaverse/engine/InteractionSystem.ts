import { Container, Graphics, Text, TextStyle } from "pixi.js";
import { InteractionZone, TileBounds } from "@/types/interface";

export default class InteractionSystem {
  private activeZone?: InteractionZone;
  private readonly INTERACT_KEY = "x";
  private readonly graphics = new Graphics();
  private readonly promptContainer = new Container();
  private readonly promptBackground = new Graphics();
  private readonly keyBackground = new Graphics();

  private readonly promptPrefix = new Text({
    text: "Press",
    style: new TextStyle({
      fill: "#f5f6f7",
      fontFamily: "monospace",
      fontSize: 13,
      fontWeight: "600",
      stroke: { color: "#000000", width: 2 },
      align: "left",
    }),
  });
  private readonly promptKey = new Text({
    text: "X",
    style: new TextStyle({
      fill: "#111111",
      fontFamily: "monospace",
      fontSize: 12,
      fontWeight: "700",
      align: "center",
    }),
  });
  private readonly promptSuffix = new Text({
    text: "to interact",
    style: new TextStyle({
      fill: "#f5f6f7",
      fontFamily: "monospace",
      fontSize: 13,
      fontWeight: "600",
      stroke: { color: "#000000", width: 2 },
      align: "left",
    }),
  });

  constructor(
    private readonly mapContainer: Container,
    private readonly zones: InteractionZone[],
    private readonly getPlayerTileBounds: () => TileBounds,
  ) {
    this.promptContainer.visible = false;
    this.promptPrefix.anchor.set(0, 0.5);
    this.promptKey.anchor.set(0.5);
    this.promptSuffix.anchor.set(0, 0.5);

    this.promptContainer.addChild(this.promptBackground);
    this.promptContainer.addChild(this.promptPrefix);
    this.promptContainer.addChild(this.keyBackground);
    this.promptContainer.addChild(this.promptKey);
    this.promptContainer.addChild(this.promptSuffix);

    this.graphics.visible = false;
    this.mapContainer.addChild(this.graphics);
    this.mapContainer.addChild(this.promptContainer);
    document.addEventListener("keydown", this.onKeyDown);
  }

  public update() {
    const bounds = this.getPlayerTileBounds();
    this.activeZone = this.zones.find(zone => this.isPlayerInZone(bounds, zone));

    if (!this.activeZone) {
      this.graphics.visible = false;
      this.promptContainer.visible = false;
      return;
    }

    const { x, y, width, height } = this.activeZone.highlight;
    this.graphics.clear();
    this.graphics
      .rect(x, y, width, height)
      .stroke({ color: 0xffff00, width: 4, alpha: 0.9 }).visible = true;

    const promptText = this.activeZone.promptText ?? "Press X to interact";
    this.layoutPrompt(promptText);
    this.promptContainer.x = x + width / 2;
    this.promptContainer.y = y - 10;
    this.promptContainer.visible = true;
  }

  public destroy() {
    document.removeEventListener("keydown", this.onKeyDown);
    this.mapContainer.removeChild(this.graphics);
    this.mapContainer.removeChild(this.promptContainer);
    this.graphics.destroy();
    this.promptBackground.destroy();
    this.keyBackground.destroy();
    this.promptPrefix.destroy();
    this.promptKey.destroy();
    this.promptSuffix.destroy();
    this.promptContainer.destroy();
  }

  private layoutPrompt(promptText: string) {
    const text = promptText.trim();
    const xMatch = /\bx\b/i.exec(text);
    const beforeX = xMatch ? text.slice(0, xMatch.index).trim() : "Press";
    const afterX = xMatch ? text.slice(xMatch.index + xMatch[0].length).trim() : "to interact";

    this.promptPrefix.text = beforeX || "Press";
    this.promptSuffix.text = afterX || "to interact";

    const horizontalPadding = 10;
    const verticalPadding = 6;
    const contentGap = 4;
    const keyHorizontalPadding = 8;
    const keyVerticalPadding = 4;

    const keyWidth = Math.ceil(this.promptKey.width + keyHorizontalPadding * 2);
    const keyHeight = Math.ceil(this.promptKey.height + keyVerticalPadding * 2);
    const contentHeight = Math.max(this.promptPrefix.height, this.promptSuffix.height, keyHeight);
    const contentWidth =
      this.promptPrefix.width + contentGap + keyWidth + contentGap + this.promptSuffix.width;
    const bubbleWidth = Math.ceil(contentWidth + horizontalPadding * 2);
    const bubbleHeight = Math.ceil(contentHeight + verticalPadding * 2);

    this.promptBackground
      .clear()
      .roundRect(-bubbleWidth / 2, -bubbleHeight, bubbleWidth, bubbleHeight, 10)
      .fill({ color: 0x181818, alpha: 0.8 });

    const contentStartX = -contentWidth / 2;
    const contentY = -bubbleHeight / 2;
    this.promptPrefix.position.set(contentStartX, contentY);

    const keyCenterX = this.promptPrefix.x + this.promptPrefix.width + contentGap + keyWidth / 2;
    const keyCenterY = contentY;
    this.keyBackground
      .clear()
      .roundRect(keyCenterX - keyWidth / 2, keyCenterY - keyHeight / 2, keyWidth, keyHeight, 4)
      .fill(0xf7f7f7)
      .stroke({ color: 0x111111, width: 2 });
    this.promptKey.position.set(keyCenterX, keyCenterY);

    this.promptSuffix.position.set(keyCenterX + keyWidth / 2 + contentGap, contentY);
  }

  private readonly onKeyDown = (e: KeyboardEvent) => {
    if (e.key.toLowerCase() !== this.INTERACT_KEY || !this.activeZone?.url) return;
    window.open(this.activeZone.url, "_blank", "noopener,noreferrer");
  };

  private isPlayerInZone(bounds: TileBounds, zone: InteractionZone): boolean {
    const { xMin, xMax, yMin, yMax } = zone.area;
    return (
      bounds.left <= xMax && bounds.right >= xMin && bounds.top <= yMax && bounds.bottom >= yMin
    );
  }
}
