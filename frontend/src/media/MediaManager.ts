// mediaManager.ts
import { Peer, MediaConnection } from "peerjs";
import { AudioStream } from "./AudioStream";
import { VideoStream } from "./VideoStream";
import { SocketClient } from "@/network/SocketClient";

export class MediaManager {
  private audioStream?: AudioStream;
  private videoStream?: VideoStream;
  private videoElement?: HTMLVideoElement;
  private peer: Peer;
  private connections: Map<string, MediaConnection> = new Map();
  private localStream = new MediaStream(); // create empty stream

  constructor(
    private socket: SocketClient,
    private onRemoteStreamAdded?: (peerId: string, stream: MediaStream) => void,
    private onRemoteStreamRemoved?: (peerId: string) => void,
  ) {
    this.peer = new Peer();
    this.setupPeerListeners();
    this.setupSocketListeners();
  }

  private setupPeerListeners() {
    this.peer.on("open", this.handlePeerOpen);
    this.peer.on("call", this.handleIncomingCall);
    this.peer.on("error", this.handlePeerError);
  }

  private setupSocketListeners() {
    const socket = this.socket.getSocket();
    socket.on("peer:available", this.handlePeerAvailable);
    socket.on("peer:disconnect", this.handlePeerDisconnect);
  }

  private readonly handlePeerOpen = (peerId: string) => {
    const socket = this.socket.getSocket();
    socket.emit("peer:joined", peerId);
  };

  private readonly handleIncomingCall = (call: MediaConnection) => {
    call.answer(this.localStream);
    const peerId = call.peer;
    this.connections.set(peerId, call);
    this.attachCallListeners(call, peerId);
  };

  private readonly handlePeerError = (err: unknown) => {
    console.error("PeerJS server error:", err);
  };

  private readonly handlePeerAvailable = (peerId: string) => {
    this.callPeer(peerId);
  };

  private readonly handlePeerDisconnect = (peerId: string) => {
    const call = this.connections.get(peerId);
    if (!call) return;

    call.close();
    this.connections.delete(peerId);
    this.onRemoteStreamRemoved?.(peerId);
  };

  private readonly cleanupPeer = (peerId: string) => {
    if (!this.connections.has(peerId)) return;
    this.connections.delete(peerId);
    this.onRemoteStreamRemoved?.(peerId);
  };

  private attachCallListeners = (call: MediaConnection, peerId: string) => {
    call.on("stream", remoteStream => {
      this.onRemoteStreamAdded?.(peerId, remoteStream);
    });

    call.on("close", () => {
      this.cleanupPeer(peerId);
    });

    call.on("error", err => {
      console.error(`MediaConnection error - ${peerId}:`, err);
      this.cleanupPeer(peerId);
    });

    const pc = call.peerConnection;
    if (!pc) return;

    const onIceChange = () => {
      const state = pc.iceConnectionState as RTCIceConnectionState;
      if (!["failed", "closed", "disconnected"].includes(state)) return;
      call.close();
      this.cleanupPeer(peerId);
    };

    pc.addEventListener("iceconnectionstatechange", onIceChange);

    call.on("close", () => {
      pc.removeEventListener("iceconnectionstatechange", onIceChange);
    });
  };

  private callPeer(peerId: string, force: boolean = false) {
    if (!this.localStream.getTracks().length) return;

    const existingCall = this.connections.get(peerId);
    if (existingCall && !force) return;

    if (existingCall && force) {
      existingCall.close();
      this.connections.delete(peerId);
    }

    const call = this.peer.call(peerId, this.localStream);
    this.connections.set(peerId, call);
    this.attachCallListeners(call, peerId);
  }

  private handleLocalStreamActivated(previousTrackCount: number) {
    const currentTrackCount = this.localStream.getTracks().length;
    if (previousTrackCount > 0 || currentTrackCount === 0) return;

    // Re-announce and renegotiate when local stream becomes active for the first time.
    if (!this.peer.id) return;
    const socket = this.socket.getSocket();
    socket.emit("peer:joined", this.peer.id);
    const peerIds = [...this.connections.keys()];
    peerIds.forEach(peerId => {
      this.callPeer(peerId, true);
    });
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
    const previousTrackCount = this.localStream.getTracks().length;
    this.audioStream = new AudioStream();
    const audioStream = await this.audioStream.requestMicAccess();
    if (!audioStream) return;
    audioStream.getAudioTracks().forEach(track => this.localStream.addTrack(track));
    this.handleLocalStreamActivated(previousTrackCount);
    this.updateVideoElement();
    return audioStream;
  }

  /** Attaches videoStream to `this.videoStream` property of MediaManager */
  public async startVideo(videoEle: HTMLVideoElement): Promise<MediaStream | undefined> {
    if (this.isVideoActive()) return this.videoStream?.getStream();
    const previousTrackCount = this.localStream.getTracks().length;
    this.videoElement = videoEle;
    this.videoStream = new VideoStream(videoEle);
    const videoStream = await this.videoStream.start();
    if (!videoStream) return;
    videoStream.getVideoTracks().forEach(track => this.localStream.addTrack(track));
    this.handleLocalStreamActivated(previousTrackCount);
    this.updateVideoElement();
    return videoStream;
  }

  public stopAudio() {
    if (!this.audioStream) return;
    const tracks = this.audioStream.stop();
    tracks.forEach(track => this.localStream.removeTrack(track));
    this.audioStream = undefined;
    this.updateVideoElement();
  }

  public stopVideo() {
    if (!this.videoStream) return;
    const tracks = this.videoStream.stop();
    tracks.forEach(track => this.localStream.removeTrack(track));
    this.videoStream = undefined;
    this.updateVideoElement();
  }

  public destroy() {
    this.stopAudio();
    this.stopVideo();

    this.connections.forEach(call => call.close());
    this.connections.clear();

    const socket = this.socket.getSocket();
    socket.off("peer:available", this.handlePeerAvailable);
    socket.off("peer:disconnect", this.handlePeerDisconnect);

    this.peer.off("open", this.handlePeerOpen);
    this.peer.off("call", this.handleIncomingCall);
    this.peer.off("error", this.handlePeerError);
    this.peer.destroy();

    this.onRemoteStreamAdded = undefined;
    this.onRemoteStreamRemoved = undefined;
  }

  // Helper method to update the video element safely
  private updateVideoElement() {
    if (!this.videoElement) return;

    // Pause the video to avoid interrupting an ongoing play()
    this.videoElement.pause();
    this.videoElement.srcObject = this.localStream;

    // Only play if there are video tracks
    if (!this.localStream.getVideoTracks().length) return;
    this.videoElement.play();
  }
}
