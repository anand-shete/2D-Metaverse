// videoStream.ts
import { Application, Sprite, Texture } from "pixi.js";
import { toast } from "sonner";

export class VideoStream {
  private stream?: MediaStream;

  constructor(private videoElement: HTMLVideoElement) {}

  async start(): Promise<MediaStream> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      // Don’t set srcObject or call play() here—leave it to MediaManager
      return this.stream;
    } catch (error) {
      toast.error("Camera access denied", {
        description: "Please allow camera access from your browser",
      });
      throw error;
    }
  }

  startPixi(app: Application): Sprite {
    const texture = Texture.from(this.videoElement);
    const sprite = new Sprite(texture);
    sprite.width = 100;
    sprite.height = 75;
    app.stage.addChild(sprite);
    return sprite;
  }

  stop() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = undefined;
    }
  }

  getStream(): MediaStream | undefined {
    // Changed to return undefined if no stream
    return this.stream;
  }
}
