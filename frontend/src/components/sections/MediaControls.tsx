import { useRef, useEffect, useState } from "react";
import { MediaManager } from "@/media/MediaManager";
import { SocketClient } from "@/network/SocketClient";
import { LogOut, Maximize2, Mic, MicOff, Minimize2, Video, VideoOff } from "lucide-react";
import { Button } from "../index";
import { Link } from "react-router";

type Props = {
  socketClient: SocketClient;
};

const MediaControls: React.FC<Props> = ({ socketClient }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaManagerRef = useRef<MediaManager | null>(null);
  const [isVideoActive, setIsVideoActive] = useState<boolean>(false);
  const [isAudioActive, setIsAudioActive] = useState<boolean>(false);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [remoteVideos, setRemoteVideos] = useState<{ [peerId: string]: HTMLVideoElement }>({});
  const [fullScreenPeerId, setFullScreenPeerId] = useState<string | null>(null);

  useEffect(() => {
    mediaManagerRef.current = new MediaManager(socketClient);

    startVideo();

    // Set up callbacks for remote streams
    mediaManagerRef.current.setOnRemoteStreamAdded((peerId, stream) => {
      const videoElement = document.createElement("video");
      videoElement.srcObject = stream;
      videoElement.autoplay = true;
      videoElement.muted = false; // Unmute for remote audio
      // Append to a container instead of storing in state
      const container = document.querySelector(".remote-video-container");
      if (container) container.appendChild(videoElement);
      setRemoteVideos(prev => ({ ...prev, [peerId]: videoElement }));
    });

    mediaManagerRef.current.setOnRemoteStreamRemoved(peerId => {
      setRemoteVideos(prev => {
        const { [peerId]: removed, ...rest } = prev;
        return rest;
      });
    });
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
      if (mediaManagerRef.current?.isAudioActive()) setIsAudioActive(true);
    } catch (error) {
      console.error("Audio error caught in MediaControls:", error);
    }
  };

  const stopAudio = () => {
    try {
      mediaManagerRef.current?.stopAudio();
      setIsAudioActive(false);
    } catch (error) {
      console.log("Error while stopping audio", error);
    }
  };

  const startVideo = async () => {
    if (videoRef.current && mediaManagerRef.current) {
      try {
        await mediaManagerRef.current.startVideo(videoRef.current);
        if (mediaManagerRef.current.isVideoActive()) setIsVideoActive(true);
      } catch (error) {
        console.error("Video failed:", error);
      }
    }
  };

  const stopVideo = () => {
    try {
      mediaManagerRef.current?.stopVideo();
      setIsVideoActive(false);
    } catch (error) {
      console.log("Error stopping video", error);
    }
  };

  const resizeVideo = () => {
    setIsFullScreen(!isFullScreen);
  };

  return (
    <div className="w-screen flex flex-col items-center">
      {/* Remote Videos Grid at the Top */}
      <div className="fixed top-0 w-full flex flex-wrap justify-center gap-4 mb-4 bg-slate-700">
        {Object.entries(remoteVideos).map(([peerId, videoElement]) => (
          <div
            key={peerId}
            className={`transition-all duration-300 mt-1 ${
              fullScreenPeerId === peerId
                ? "fixed w-[40%] h-[60%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 rounded-lg bg-slate-600/50 text-white"
                : "relative w-28 h-18 shadow-custom text-black"
            }`}
          >
            <video
              autoPlay
              className="w-full h-full rounded shadow-custom"
              ref={el => {
                if (el && videoElement.srcObject) el.srcObject = videoElement.srcObject;
              }}
            />
            <div
              className={`${
                isVideoActive ? "block" : "hidden"
              } absolute top-1 right-1 bg-black/40 rounded-lg p-1 cursor-pointer`}
              onClick={() => setFullScreenPeerId(prev => (prev === peerId ? null : peerId))}
            >
              {isFullScreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 />}
            </div>
            <span className="absolute top-1 left-1 text-xs text-white bg-black/50 px-1 rounded">
              User {peerId.slice(0, 4)}
            </span>
          </div>
        ))}
      </div>

      {/* Local Video and Controls */}
      <div className="w-full flex flex-row items-center justify-between">
        <div className="flex flex-row items-center space-x-10">
          <div
            className={`transition-all duration-300 mt-1 ${
              isFullScreen
                ? "fixed w-[40%] h-[60%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 rounded-lg bg-slate-600/50 text-white"
                : "relative w-28 h-18 ml-20 shadow-custom text-black"
            }`}
          >
            <video ref={videoRef} autoPlay muted className="w-full h-full rounded" />
            <div
              className={`${
                isVideoActive ? "block" : "hidden"
              } absolute top-1 right-1 bg-black/40 rounded-lg p-1 cursor-pointer`}
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

        <Link to="/" className="flex p-4 mr-5">
          <Button className="">
            <LogOut />
            Exit
          </Button>
        </Link>
      </div>
    </div>
  );
};
export default MediaControls;
