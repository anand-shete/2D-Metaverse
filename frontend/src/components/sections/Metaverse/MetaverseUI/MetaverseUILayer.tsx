import { LocalMediaControl, MobileControls, RemoteMediaControl } from "@/components/sections/index";
import { IRemoteVideos } from "@/types/interface";
import { useRef, useEffect, useState } from "react";
import { MediaManager } from "@/media/MediaManager";
import { SocketClient } from "@/network/SocketClient";
import { MetaverseContext } from "@/context/metaverse.context";
import { MovementKey } from "@/types/type";

interface Props {
  socketClient: SocketClient;
  handleKeyPress: (key: MovementKey, pressed: boolean) => void;
}

export default function MetaverseUILayer({ socketClient, handleKeyPress }: Props) {
  const mediaManagerRef = useRef<MediaManager | null>(null);
  const [isVideoActive, setIsVideoActive] = useState<boolean>(false);
  const [isAudioActive, setIsAudioActive] = useState<boolean>(false);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [fullScreenPeerId, setFullScreenPeerId] = useState<string | null>(null);
  const [remoteVideos, setRemoteVideos] = useState<IRemoteVideos>({});

  // mediaManger ref manages both local and incoming A/V streams
  useEffect(() => {
    if (!mediaManagerRef.current) {
      mediaManagerRef.current = new MediaManager(
        socketClient,
        (peerId: string, stream: MediaStream) => {
          const videoElement: HTMLVideoElement = document.createElement("video");
          videoElement.srcObject = stream;
          videoElement.autoplay = true;
          setRemoteVideos(prev => ({ ...prev, [peerId]: videoElement }));
        },
        (peerId: string) => {
          setRemoteVideos(prev => {
            const { [peerId]: _, ...rest } = prev;
            return rest;
          });
        },
      );
    }

    return () => {
      if (!mediaManagerRef.current) return;

      mediaManagerRef.current.destroy();
      mediaManagerRef.current = null;
    };
  }, []);

  const value = {
    mediaManagerRef,
    isVideoActive,
    setIsVideoActive,
    isAudioActive,
    setIsAudioActive,
    isFullScreen,
    setIsFullScreen,
    fullScreenPeerId,
    setFullScreenPeerId,
    remoteVideos,
    setRemoteVideos,
  };

  return (
    <div className="relative">
      <MetaverseContext value={value}>
        <RemoteMediaControl />
        <MobileControls onKeyChange={handleKeyPress} />
        <LocalMediaControl socketClient={socketClient} />
      </MetaverseContext>
    </div>
  );
}
