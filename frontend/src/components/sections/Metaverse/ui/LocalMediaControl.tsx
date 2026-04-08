import { Maximize2, Mic, MicOff, Minimize2, Video, VideoOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { startAudio, startVideo, stopAudio, stopVideo } from "@/components/utils/media.utils";
import { useMetaverseContext } from "@/context/metaverse.context";
import { useRef } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { pressX } from "@/components/utils/user.utils";

const LocalMediaActions = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const {
    isFullScreen,
    isVideoActive,
    setIsFullScreen,
    isAudioActive,
    mediaManagerRef,
    setIsAudioActive,
    setIsVideoActive,
  } = useMetaverseContext();

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
          className={`${
            isVideoActive ? "block" : "hidden"
          } absolute top-0 right-0 cursor-pointer rounded-md bg-black/40 p-0.5`}
          onClick={() => setIsFullScreen(!isFullScreen)}
        >
          {isFullScreen ? <Minimize2 size={30} /> : <Maximize2 />}
        </div>
      </div>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={
              !isAudioActive
                ? () => startAudio(mediaManagerRef, setIsAudioActive)
                : () => stopAudio(mediaManagerRef, setIsAudioActive)
            }
            size="icon"
            className={` ${
              isAudioActive
                ? "bg-green-500/70 hover:bg-green-600/70"
                : "bg-red-500/70 hover:bg-red-600/70"
            }`}
          >
            {isAudioActive ? <Mic /> : <MicOff />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isAudioActive ? "Mute" : "Unmute"}</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={
              !isVideoActive
                ? () => startVideo(mediaManagerRef, setIsVideoActive, videoRef)
                : () => stopVideo(mediaManagerRef, setIsVideoActive)
            }
            size="icon"
            className={`rounded text-white ${
              isVideoActive
                ? "bg-green-500/70 hover:bg-green-600/70"
                : "bg-red-500/70 hover:bg-red-600/70"
            }`}
          >
            {isVideoActive ? <Video /> : <VideoOff />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isVideoActive ? "Stop video" : "Show video"}</p>
        </TooltipContent>
      </Tooltip>
      <Button className="bg-yellow-500 text-black md:hidden" size="icon" onClick={pressX}>
        <span className="text-lg">X</span>
      </Button>
    </div>
  );
};

export default LocalMediaActions;
