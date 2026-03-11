// mediaManager.ts
import { Peer, MediaConnection } from "peerjs";
import { AudioStream } from "./AudioStream";
import { VideoStream } from "./VideoStream";
import { SocketClient } from "@/network/SocketClient";

export class MediaManager {
  private audioStream?: AudioStream;
  private videoStream?: VideoStream;
  private peer: Peer;
  private connections: Map<string, MediaConnection> = new Map();
  private localStream = new MediaStream();
  private onRemoteStreamAdded?: (peerId: string, stream: MediaStream) => void;
  private onRemoteStreamRemoved?: (peerId: string) => void;
  private videoElement?: HTMLVideoElement;

  constructor(private socket: SocketClient) {
    this.peer = new Peer();
    this.setupPeerListeners();
    this.setupSocketListeners();
  }

  private setupPeerListeners() {
    this.peer.on("open", peerId => {
      console.log("connected to peerjs server");
      this.socket.getSocket().emit("peer:joined", peerId);
    });

    this.peer.on("call", call => {
      call.answer(this.localStream);
      this.registerCall(call);
    });

    this.peer.on("error", err => {
      console.error("PeerJS server error:", err);
    });
  }

  private setupSocketListeners() {
    const socket = this.socket.getSocket();

    socket.on("media:ready", (peerId: string) => {
      this.callPeer(peerId);
    });

    socket.on("player:disconnect", (peerId: string) => {
      const call = this.connections.get(peerId);
      if (!call) return;

      call.close();
      this.connections.delete(peerId);
      this.onRemoteStreamRemoved?.(peerId);
    });
  }

  private callPeer(peerId: string) {
    if (!this.localStream.getTracks().length) return;

    const call = this.peer.call(peerId, this.localStream);
    this.registerCall(call);
  }

  private registerCall(call: MediaConnection) {
    const peerId = call.peer;
    this.connections.set(peerId, call);

    call.on("stream", remoteStream => {
      this.onRemoteStreamAdded?.(peerId, remoteStream);
    });

    call.on("close", () => {
      this.connections.delete(peerId);
      this.onRemoteStreamRemoved?.(peerId);
    });

    call.on("error", err => {
      console.error(`MediaConnection error (${peerId}):`, err);
    });
  }

  // Public API
  public setOnRemoteStreamAdded(cb: (peerId: string, stream: MediaStream) => void) {
    this.onRemoteStreamAdded = cb;
  }

  public setOnRemoteStreamRemoved(cb: (peerId: string) => void) {
    this.onRemoteStreamRemoved = cb;
  }

  public isAudioActive(): boolean {
    if (!this.audioStream) return false;
    const s = this.audioStream.getAudioStream();
    return !!s && s.getAudioTracks().some(t => t.enabled);
  }

  public isVideoActive(): boolean {
    if (!this.videoStream) return false;
    const s = this.videoStream.getStream();
    return !!s && s.getVideoTracks().some(t => t.enabled);
  }

  public async startAudio(): Promise<MediaStream | undefined> {
    if (this.isAudioActive()) return this.audioStream!.getAudioStream()!;
    this.audioStream = new AudioStream();
    const audioStream = await this.audioStream.requestMicAccess();
    if (!audioStream) return;

    audioStream.getAudioTracks().forEach(track => {
      this.localStream.addTrack(track);
    });
    this.updateVideoElement();
    return audioStream;
  }

  public async startVideo(videoEl: HTMLVideoElement): Promise<MediaStream | null> {
    this.videoElement = videoEl;
    this.videoStream = new VideoStream(videoEl);

    const videoStream = await this.videoStream.start();
    if (!videoStream) console.error("Failed to start video stream");

    videoStream.getVideoTracks().forEach(track => {
      this.localStream.addTrack(track);
    });
    this.updateVideoElement();
    return videoStream;
  }

  public stopAudio() {
    if (this.audioStream) {
      const tracks = this.audioStream.getAudioStream()?.getAudioTracks() || [];
      tracks.forEach(track => {
        this.localStream.removeTrack(track);
        track.stop();
      });
      this.audioStream = undefined;
      this.updateVideoElement();
    }
  }

  public stopVideo() {
    if (this.videoStream) {
      const tracks = this.videoStream.getStream()?.getVideoTracks() || [];
      tracks.forEach(track => {
        this.localStream.removeTrack(track);
        track.stop();
      });
      this.videoStream = undefined;
      this.updateVideoElement();
    }
  }

  // Helper method to update the video element safely
  private updateVideoElement() {
    if (this.videoElement) {
      // Pause the video to avoid interrupting an ongoing play()
      this.videoElement.pause();
      this.videoElement.srcObject = this.localStream;
      // Only play if there are video tracks
      if (this.localStream.getVideoTracks().length > 0) {
        this.videoElement.play().catch(error => {
          console.error("Error playing video:", error);
        });
      }
    }
  }
}
