import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Maximize2, MessagesSquare, Mic, MicOff, Minimize2, Video, VideoOff } from "lucide-react";
import { startAudio, startVideo, stopAudio, stopVideo } from "@/components/utils/media.utils";
import { useMetaverseContext } from "@/context/metaverse.context";
import { pressX } from "@/components/utils/user.utils";
import { SocketClient } from "@/network/SocketClient";
import { ChatBox } from "@/components/sections";
import { useUserContext } from "@/context/user.context";

const LocalMediaActions = ({ socketClient }: { socketClient: SocketClient }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isChatBoxOpen, setIsChatBoxOpen] = useState(false);
  const [width, setWidth] = useState<number>(window.innerWidth);

  const { user } = useUserContext();

  const {
    isFullScreen,
    isVideoActive,
    setIsFullScreen,
    isAudioActive,
    mediaManagerRef,
    setIsAudioActive,
    setIsVideoActive,
  } = useMetaverseContext();

  useEffect(() => {
    const pressC = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "c") setIsChatBoxOpen(true);
      if (e.key.toLowerCase() === "escape") setIsChatBoxOpen(false);
    };

    document.addEventListener("keydown", pressC);

    return () => {
      document.removeEventListener("keydown", pressC);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [width]);

  return (
    <div className="fixed bottom-0 flex h-20 min-w-full flex-row items-center justify-center space-x-5 border-t bg-slate-800/90 md:justify-start md:space-x-10 md:pl-20">
      <div className={`ml-[7vw] ${isFullScreen ? "block" : "hidden"}`}></div>
      <div
        className={`text-white transition-transform duration-300 ${
          isFullScreen
            ? "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md bg-slate-600/50 p-4"
            : "relative h-18 w-28 rounded-md border border-neutral-400"
        }`}
      >
        <video ref={videoRef} autoPlay muted className="h-full w-full rounded-md object-cover" />
        <div
          className={`${isVideoActive ? "block" : "hidden"} absolute top-0 right-0 flex cursor-pointer rounded-md bg-black/40 p-0.5`}
          onClick={() => setIsFullScreen(!isFullScreen)}
        >
          <span>{isFullScreen ? <Minimize2 size={30} /> : <Maximize2 />}</span>
        </div>
        <div className="absolute top-0 left-1" onClick={() => setIsFullScreen(!isFullScreen)}>
          <span className={`rounded-xs bg-black/50 p-0.5 ${isFullScreen ? "text-2xl" : "text-sm"}`}>
            {user?.username}
          </span>
        </div>
      </div>

      {isAudioActive ? (
        <Button
          onClick={() => stopAudio(mediaManagerRef, setIsAudioActive)}
          size={width >= 768 ? "default" : "icon"}
          className="bg-green-500/70 hover:bg-green-600/70"
        >
          <Mic />
          <span className="hidden text-slate-300 md:inline">Disable Audio</span>
        </Button>
      ) : (
        <Button
          onClick={() => startAudio(mediaManagerRef, setIsAudioActive)}
          size={width >= 768 ? "default" : "icon"}
          className="bg-red-500/70 hover:bg-red-600/70"
        >
          <MicOff />
          <span className="hidden text-slate-300 md:inline">Enable Audio</span>
        </Button>
      )}

      {isVideoActive ? (
        <Button
          onClick={() => stopVideo(mediaManagerRef, setIsVideoActive)}
          size={width >= 768 ? "default" : "icon"}
          className="bg-green-500/70 hover:bg-green-600/70"
        >
          <Video />
          <span className="hidden text-slate-300 md:inline">Disable Video</span>
        </Button>
      ) : (
        <Button
          onClick={() => startVideo(mediaManagerRef, setIsVideoActive, videoRef)}
          size={width >= 768 ? "default" : "icon"}
          className="bg-red-500/70 hover:bg-red-600/70"
        >
          <VideoOff />
          <span className="hidden text-slate-300 md:inline">Enable Video</span>
        </Button>
      )}

      <Button className="bg-yellow-500 text-black md:hidden" size="icon" onClick={pressX}>
        <span className="text-lg">X</span>
      </Button>

      <Button
        onClick={() => setIsChatBoxOpen(!isChatBoxOpen)}
        size={width >= 768 ? "default" : "icon"}
        className="mx-auto bg-blue-500/70 text-white hover:bg-blue-600/70"
      >
        <MessagesSquare />
        <span className="hidden text-slate-200 md:inline">World Chat</span>
      </Button>

      <ChatBox
        isOpen={isChatBoxOpen}
        onClose={() => setIsChatBoxOpen(false)}
        socket={socketClient}
      />
    </div>
  );
};

export default LocalMediaActions;
