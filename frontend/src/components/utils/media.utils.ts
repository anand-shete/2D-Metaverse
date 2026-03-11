import { MediaManager } from "@/media/MediaManager";
import { Dispatch, RefObject, SetStateAction } from "react";

export const startAudio = async (
  mediaManagerRef: RefObject<MediaManager | null>,
  setIsAudioActive: Dispatch<SetStateAction<boolean>>,
) => {
  try {
    await mediaManagerRef.current?.startAudio();
    if (mediaManagerRef.current?.isAudioActive()) setIsAudioActive(true);
  } catch (error) {
    console.error("Audio error caught in MediaControls:", error);
  }
};

export const stopAudio = (
  mediaManagerRef: RefObject<MediaManager | null>,
  setIsAudioActive: Dispatch<SetStateAction<boolean>>,
) => {
  try {
    mediaManagerRef.current?.stopAudio();
    setIsAudioActive(false);
  } catch (error) {
    console.log("Error while stopping audio", error);
  }
};

export const startVideo = async (
  mediaManagerRef: RefObject<MediaManager | null>,
  setIsVideoActive: Dispatch<SetStateAction<boolean>>,
  videoRef?: RefObject<HTMLVideoElement | null>,
) => {
  if (!videoRef) return;

  if (videoRef.current && mediaManagerRef.current) {
    try {
      await mediaManagerRef.current.startVideo(videoRef.current);
      if (mediaManagerRef.current.isVideoActive()) setIsVideoActive(true);
    } catch (error) {
      console.error("Video failed:", error);
    }
  }
};

export const stopVideo = (
  mediaManagerRef: RefObject<MediaManager | null>,
  setIsVideoActive: Dispatch<SetStateAction<boolean>>,
) => {
  try {
    mediaManagerRef.current?.stopVideo();
    setIsVideoActive(false);
  } catch (error) {
    console.log("Error stopping video", error);
  }
};
