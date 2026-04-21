import {
  LocalMediaControl,
  MobileControls,
  RemoteMediaControl,
  UploadFiles,
  ViewArchives,
} from "@/components/sections/index";
import { IRemotePeerUsernames, IRemoteVideos } from "@/types/interface";
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
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false); // local user
  const [fullScreenRemoteUser, setFullScreenRemoteUser] = useState<string | null>(null); //remote user
  const [remoteVideos, setRemoteVideos] = useState<IRemoteVideos>({});
  const [remotePeerUsernames, setRemotePeerUsernames] = useState<IRemotePeerUsernames>({});
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isArchivesOpen, setIsArchivesOpen] = useState(false);

  // mediaManger ref manages both local and incoming A/V streams
  useEffect(() => {
    if (!mediaManagerRef.current) {
      mediaManagerRef.current = new MediaManager(
        socketClient,
        (peerId: string, username: string) => {
          setRemotePeerUsernames(prev => ({ ...prev, [peerId]: username }));
          console.log("lists", remotePeerUsernames);
        },
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
          setRemotePeerUsernames(prev => {
            const { [peerId]: _, ...rest } = prev;
            return rest;
          });
        },
      );
    }
    const openTerminalOverlay = () => setIsUploadOpen(true);
    const openViewArchives = () => setIsArchivesOpen(true);

    window.addEventListener("metaverse:upload-open", openTerminalOverlay);
    window.addEventListener("metaverse:view-archives", openViewArchives);

    return () => {
      window.removeEventListener("metaverse:upload-open", openTerminalOverlay);
      window.addEventListener("metaverse:view-archives", openViewArchives);

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
    fullScreenRemoteUser,
    setFullScreenRemoteUser,
    remoteVideos,
    setRemoteVideos,
    remotePeerUsernames,
    setRemotePeerUsernames,
  };

  return (
    <>
      <MetaverseContext value={value}>
        <RemoteMediaControl />
        <MobileControls onKeyChange={handleKeyPress} />
        <LocalMediaControl socketClient={socketClient} />
        <UploadFiles isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />
        <ViewArchives isOpen={isArchivesOpen} onClose={() => setIsArchivesOpen(false)} />
      </MetaverseContext>
    </>
  );
}
