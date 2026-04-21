import { MediaManager } from "@/media/MediaManager";
import { IRemotePeerUsernames, IRemoteVideos } from "@/types/interface";
import React, { createContext, SetStateAction, useContext } from "react";

interface IMetaverseContext {
  mediaManagerRef: React.RefObject<MediaManager | null>;
  isVideoActive: boolean;
  setIsVideoActive: React.Dispatch<React.SetStateAction<boolean>>;
  isAudioActive: boolean;
  setIsAudioActive: React.Dispatch<React.SetStateAction<boolean>>;
  isFullScreen: boolean;
  setIsFullScreen: React.Dispatch<SetStateAction<boolean>>;
  fullScreenRemoteUser: string | null;
  setFullScreenRemoteUser: React.Dispatch<SetStateAction<string | null>>;
  remoteVideos: IRemoteVideos;
  setRemoteVideos: React.Dispatch<SetStateAction<IRemoteVideos>>;
  remotePeerUsernames: IRemotePeerUsernames;
  setRemotePeerUsernames: React.Dispatch<SetStateAction<IRemotePeerUsernames>>;
}

export const MetaverseContext = createContext<IMetaverseContext | null>(null);

export const useMetaverseContext = () => {
  const ctx = useContext(MetaverseContext);
  if (!ctx) throw new Error("useMetaverseContext must be used inside MetaverseProvider");

  return ctx;
};
