// mediaManager.ts
import { Peer, MediaConnection, PeerJSOption } from "peerjs";
import { AudioStream } from "./AudioStream";
import { VideoStream } from "./VideoStream";
import { SocketClient } from "@/network/SocketClient";

export class MediaManager {
  private audioStream?: AudioStream;
  private videoStream?: VideoStream;
  private peer: Peer;
  private connections: Record<string, MediaConnection> = {};
  private localStream: MediaStream = new MediaStream(); // Single stream for all tracks
  private onRemoteStreamAdded?: (peerId: string, stream: MediaStream) => void;
  private onRemoteStreamRemoved?: (peerId: string) => void;
  private videoElement?: HTMLVideoElement;

  constructor(private socket: SocketClient, peerOptions?: PeerJSOption) {
    this.peer = new Peer(null as any, peerOptions);
    this.setupPeerListeners();
    this.setupSocketListeners();
  }

  private setupPeerListeners() {
    this.peer.on("open", id => {
      this.socket.getSocket().emit("join-room", id);
    });

    this.peer.on("call", call => {
      call.answer(this.localStream);
      this.registerCall(call);
    });

    this.peer.on("error", err => {
      console.error("PeerJS error:", err);
    });
  }

  private setupSocketListeners() {
    const sock = this.socket.getSocket();

    sock.on("user-connected", (peerId: string) => {
      this.callPeer(peerId);
    });

    sock.on("user-disconnected", (peerId: string) => {
      const conn = this.connections[peerId];
      if (conn) {
        conn.close();
        delete this.connections[peerId];
        this.onRemoteStreamRemoved?.(peerId);
      }
    });
  }

  private callPeer(peerId: string) {
    if (this.localStream.getTracks().length > 0) {
      const call = this.peer.call(peerId, this.localStream);
      this.registerCall(call);
    }
  }

  private registerCall(call: MediaConnection) {
    const peerId = call.peer;
    this.connections[peerId] = call;

    call.on("stream", remoteStream => {
      this.onRemoteStreamAdded?.(peerId, remoteStream);
    });

    call.on("close", () => {
      delete this.connections[peerId];
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
    const s = this.audioStream.getStream();
    return !!s && s.getAudioTracks().some(t => t.enabled);
  }

  public isVideoActive(): boolean {
    if (!this.videoStream) return false;
    const s = this.videoStream.getStream();
    return !!s && s.getVideoTracks().some(t => t.enabled);
  }

  public async startAudio(): Promise<MediaStream | null> {
    if (this.isAudioActive()) return this.audioStream!.getStream()!;
    this.audioStream = new AudioStream();
    const audioStream = await this.audioStream.start();
    if (audioStream) {
      audioStream.getAudioTracks().forEach(track => {
        this.localStream.addTrack(track);
      });
      this.updateVideoElement();
    }
    return audioStream;
  }

  public async startVideo(videoEl: HTMLVideoElement): Promise<MediaStream | null> {
    this.videoElement = videoEl;
    this.videoStream = new VideoStream(videoEl);
    const videoStream = await this.videoStream.start();
    if (videoStream) {
      videoStream.getVideoTracks().forEach(track => {
        this.localStream.addTrack(track);
      });
      this.updateVideoElement();
    } else {
      console.error("Failed to start video stream");
    }
    return videoStream;
  }

  public stopAudio() {
    if (this.audioStream) {
      const tracks = this.audioStream.getStream()?.getAudioTracks() || [];
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
