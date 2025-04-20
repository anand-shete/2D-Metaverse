// src/components/MediaControls.tsx
import { useRef, useEffect, useState } from "react";
import { MediaManager } from "@/media/MediaManager";
import { LogOut, Maximize2, Mic, MicOff, Minimize2, Video, VideoOff } from "lucide-react";
import { Button } from "../index";
import { Link } from "react-router";
import { cn } from "@/lib/utils";

export default function MediaControls() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaManagerRef = useRef<MediaManager | null>(null);
  const [isVideoActive, setIsVideoActive] = useState<boolean>(false);
  const [isAudioActive, setIsAudioActive] = useState<boolean>(false);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  useEffect(() => {
    mediaManagerRef.current = new MediaManager();

    return () => {
      if (mediaManagerRef.current) {
        mediaManagerRef.current.stopAudio();
        mediaManagerRef.current.stopVideo();
      }
    };
  }, []);

  const startAudio = async () => {
    try {
      await mediaManagerRef.current?.startAudio();
      if (mediaManagerRef.current?.isAudioActive()) setIsAudioActive(!isAudioActive);
    } catch (error) {
      console.error("Audio error catched in MediaControls:", error);
    }
  };

  const stopAudio = () => {
    try {
      mediaManagerRef.current?.stopAudio();
      setIsAudioActive(!isAudioActive);
    } catch (error) {
      console.log("Error while stopping audio", error);
    }
  };

  const startVideo = async () => {
    if (videoRef.current && mediaManagerRef.current) {
      try {
        await mediaManagerRef.current.startVideo(videoRef.current);
        if (await mediaManagerRef.current.isVideoActive())
          setIsVideoActive(!isVideoActive);
      } catch (error) {
        console.error("Video failed:", error);
      }
    }
  };

  const stopVideo = () => {
    try {
      mediaManagerRef.current?.stopVideo();
      setIsVideoActive(!isVideoActive);
    } catch (error) {
      console.log("Error stopping video", error);
    }
  };
  const resizeVideo = () => {
    setIsFullScreen(!isFullScreen);
  };

  return (
    <div className="w-screen flex justify-between">
      <div className="w-1/2 flex flex-row  items-center space-x-10">
        <div
          className={`transition-all duration-300 mt-1 ${
            isFullScreen
              ? "fixed w-[40%] h-[60%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 rounded-lg bg-slate-600/50 text-white"
              : "relative w-28 h-18 ml-20  shadow-custom text-black"
          }`}
        >
          <video ref={videoRef} autoPlay muted className="w-full h-full rounded" />
          <div
            className={`${isVideoActive ? "block" : "hidden"} 
          absolute top-1 right-1 bg-black/40 rounded-lg p-1 cursor-pointer`}
            onClick={resizeVideo}
          >
            {isFullScreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 />}
          </div>
        </div>

        <Button
          onClick={!isAudioActive ? startAudio : stopAudio}
          className={`px-2 py-1 rounded text-sm ${
            isAudioActive
              ? "bg-green-500/70 hover:bg-green-600/70"
              : "bg-red-500/70 hover:bg-red-600/70"
          }`}
        >
          {isAudioActive ? <Mic /> : <MicOff />}
        </Button>
        <Button
          onClick={!isVideoActive ? startVideo : stopVideo}
          className={`px-2 py-1 text-white rounded text-sm ${
            isVideoActive
              ? "bg-green-500/70 hover:bg-green-600/70"
              : "bg-red-500/70 hover:bg-red-600/70"
          }`}
        >
          {isVideoActive ? <Video /> : <VideoOff />}
        </Button>
      </div>

      {/* Total users onlnie */}
      <Link to="/" className="flex p-4 mr-5">
        <Button className="">
          <LogOut />
          Exit
        </Button>
      </Link>
    </div>
  );
}
