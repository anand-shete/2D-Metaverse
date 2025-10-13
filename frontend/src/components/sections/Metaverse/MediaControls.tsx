import { useRef, useEffect, useState } from "react";
import { MediaManager } from "@/media/MediaManager";
import { SocketClient } from "@/network/SocketClient";
import { LogOut, Maximize2, Mic, MicOff, Minimize2, Video, VideoOff } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";

interface Props {
  socketClient: SocketClient;
}

const MediaControls: React.FC<Props> = ({ socketClient }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaManagerRef = useRef<MediaManager | null>(null);
  const [isVideoActive, setIsVideoActive] = useState<boolean>(false);
  const [isAudioActive, setIsAudioActive] = useState<boolean>(false);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [remoteVideos, setRemoteVideos] = useState<{ [peerId: string]: HTMLVideoElement }>({});
  const [fullScreenPeerId, setFullScreenPeerId] = useState<string | null>(null);

  // init video and audio
  useEffect(() => {
    mediaManagerRef.current = new MediaManager(socketClient);

    // dont use await here
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

  return (
    <div className="fixed bottom-0 z-1 h-23 border-t bg-slate-800">
      <div className="flex w-screen flex-col items-center">
        {/* Remote Videos Grid at the Top */}
        <div className="fixed top-0 mb-4 flex w-full flex-wrap justify-center gap-4 bg-slate-700">
          {Object.entries(remoteVideos).map(([peerId, videoElement]) => (
            <div
              key={peerId}
              className={`mt-1 transition-all duration-300 ${
                fullScreenPeerId === peerId
                  ? "fixed top-1/2 left-1/2 h-[60%] w-[40%] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-slate-600/50 p-4 text-white"
                  : "relative h-18 w-28 text-black shadow-custom"
              }`}
            >
              <video
                autoPlay
                className="h-full w-full rounded shadow-custom"
                ref={el => {
                  if (el && videoElement.srcObject) el.srcObject = videoElement.srcObject;
                }}
              />
              <div
                className={`${
                  isVideoActive ? "block" : "hidden"
                } absolute top-1 right-1 cursor-pointer rounded-lg bg-black/40 p-1`}
                onClick={() => setFullScreenPeerId(prev => (prev === peerId ? null : peerId))}
              >
                {isFullScreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 />}
              </div>
              <span className="absolute top-1 left-1 rounded bg-black/50 px-1 text-xs text-white">
                User {peerId.slice(0, 4)}
              </span>
            </div>
          ))}
        </div>

        {/* Local Video and Controls */}
        <div className="flex w-full flex-row items-center justify-between">
          <div className="flex flex-row items-center space-x-10">
            <div
              className={`mt-1 transition-all duration-300 ${
                isFullScreen
                  ? "fixed top-1/2 left-1/2 h-[60%] w-[40%] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-slate-600/50 p-4 text-white"
                  : "relative mr-4 ml-10 h-18 w-28 text-black shadow-custom md:mr-10 md:ml-20"
              }`}
            >
              <video ref={videoRef} autoPlay muted className="h-full w-full" />
              <div
                className={`${
                  isVideoActive ? "block" : "hidden"
                } absolute top-1 right-1 cursor-pointer rounded-lg bg-black/40 p-1`}
                onClick={() => setIsFullScreen(!isFullScreen)}
              >
                {isFullScreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 />}
              </div>
            </div>

            <Button
              onClick={!isAudioActive ? startAudio : stopAudio}
              size="icon"
              className={`mr-2 rounded md:mr-6 ${
                isAudioActive
                  ? "bg-green-500/70 hover:bg-green-600/70"
                  : "bg-red-500/70 hover:bg-red-600/70"
              }`}
            >
              {isAudioActive ? <Mic /> : <MicOff />}
            </Button>
            <Button
              onClick={!isVideoActive ? startVideo : stopVideo}
              size="icon"
              className={`rounded text-white ${
                isVideoActive
                  ? "bg-green-500/70 hover:bg-green-600/70"
                  : "bg-red-500/70 hover:bg-red-600/70"
              }`}
            >
              {isVideoActive ? <Video /> : <VideoOff />}
            </Button>
          </div>

          <Link to="/" className="mr-3 flex p-4 md:mr-10">
            <Button className="">
              <LogOut />
              Exit
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default MediaControls;
