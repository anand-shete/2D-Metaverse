import { Application, Sprite, Texture } from "pixi.js";
import { toast } from "sonner";

export class VideoStream {
  private stream?: MediaStream;

  constructor(private videoElement: HTMLVideoElement) {
    this.videoElement = videoElement;
  }

  async start(): Promise<MediaStream> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      this.videoElement.srcObject = this.stream;
      this.videoElement.play();
      return this.stream;
    } catch (error) {
      toast.error("Camera access denied", {
        description: "Please allow camera access from your browser",
      });
      throw error;
    }
  }

  // other users video?
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
      this.videoElement.srcObject = null;
      this.stream = undefined;
    }
  }
  // Expose the stream
  getStream(): MediaStream | undefined {
    return this.stream;
  }
}
