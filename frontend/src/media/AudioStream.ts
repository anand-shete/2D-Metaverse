import { toast } from "sonner";

export class AudioStream {
  private stream?: MediaStream;

  async start(): Promise<MediaStream> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audio = new Audio();
      audio.srcObject = this.stream;
      audio.play(); // For testing
      return this.stream;
    } catch (error) {
      toast.error("Microphone access denied", {
        description: "Please allow microphone access from your browser",
      });
      throw error;
    }
  }

  stop() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => {
        track.stop();
        track.enabled = false; // Explicitly disable
      });
      this.stream = undefined;
    }
  }

  getStream(): MediaStream | undefined {
    return this.stream;
  }
}
