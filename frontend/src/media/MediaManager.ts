// import Peer from "simple-peer";
import { AudioStream } from "./AudioStream";
import { VideoStream } from "./VideoStream";
// import { SocketClient } from "@/Network/SocketClient";

export class MediaManager {
  private audioStream?: AudioStream;
  private videoStream?: VideoStream;

  constructor() {
    // Initialize later when needed
  }

  isAudioActive(): boolean {
    if (!this.audioStream) return false;
    const stream = this.audioStream.getStream();
    if (!stream) return false;
    const audioTracks = stream.getAudioTracks();
    return (
      audioTracks.length > 0 &&
      audioTracks.every(track => track.enabled && track.readyState === "live")
    );
  }

  async startAudio(): Promise<MediaStream | null> {
    try {
      if (this.isAudioActive()) return this.audioStream?.getStream() || null;
      this.audioStream = new AudioStream();
      return await this.audioStream.start();
    } catch (error) {
      console.error("Failed to start audio:", error);
      return null;
    }
  }

  async isVideoActive(): Promise<boolean> {
    if (!this.videoStream) return false;
    const stream = this.videoStream.getStream();
    if (!stream) return false;
    const videoTracks = stream.getVideoTracks();
    return (
      videoTracks.length > 0 &&
      videoTracks.every(track => track.enabled && track.readyState === "live")
    );
  }

  async startVideo(videoElement: HTMLVideoElement): Promise<MediaStream | null> {
    try {
      this.videoStream = new VideoStream(videoElement);
      return await this.videoStream.start();
    } catch (error) {
      console.error("Failed to start video:", error);
      return null;
    }
  }

  // async startVideoCall(peerId: string, socketClient: SocketClient) {
  //   const stream = await this.videoStream?.start();
  //   const peer = new Peer({ initiator: true, stream });
  //   peer.on("signal", (data: any) => {
  //     socketClient.getSocket().emit("webrtc-signal", { peerId, signal: data });
  //   });
  //   // Handle incoming signals
  //   socketClient.getSocket().on("webrtc-signal", data => {
  //     peer.signal(data.signal);
  //   });
  //   return peer;
  // }

  stopAudio() {
    if (this.audioStream) {
      this.audioStream.stop();
      this.audioStream = undefined;
    }
  }

  stopVideo() {
    if (this.videoStream) {
      this.videoStream.stop();
      this.videoStream = undefined;
    }
  }
}
