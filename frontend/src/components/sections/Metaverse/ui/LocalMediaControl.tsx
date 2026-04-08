import { LogOut, Maximize2, Mic, MicOff, Minimize2, Video, VideoOff } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { startAudio, startVideo, stopAudio, stopVideo } from "@/components/utils/media.utils";
import { useMetaverseContext } from "@/context/metaverse.context";
import { useRef } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const LocalMediaActions = () => {
  const navigate = useNavigate();
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
    <div className="fixed bottom-0 flex h-22 w-full flex-row items-center justify-between border-t bg-slate-800/80">
      <div className="flex flex-row items-center justify-around">
        {/* Local video */}
        <div className={`ml-[19vw] ${isFullScreen ? "block" : "hidden"}`}></div>
        <div
          className={`text-white transition-transform duration-300 ${
            isFullScreen
              ? "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md bg-slate-600/50 p-4"
              : "relative mr-[4vw] ml-[8vw] h-18 w-28 rounded-md border border-neutral-400"
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

        {/* Controls */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={
                !isAudioActive
                  ? () => startAudio(mediaManagerRef, setIsAudioActive)
                  : () => stopAudio(mediaManagerRef, setIsAudioActive)
              }
              size="icon"
              className={`mr-2 rounded md:mr-6 ${
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
      </div>

      <Button className="mr-[5vw] flex p-4 text-black" size="lg" onClick={() => navigate("/")}>
        <LogOut />
        <span>Exit</span>
      </Button>
    </div>
  );
};

export default LocalMediaActions;
