import { LogOut, Maximize2, Mic, MicOff, Minimize2, Video, VideoOff } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { startAudio, startVideo, stopAudio, stopVideo } from "@/components/utils/media.utils";
import { useMetaverseContext } from "@/context/metaverse.context";
import { useRef } from "react";

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
    <div className="flex w-full flex-row items-center justify-between fixed bottom-0 h-23 border-t bg-slate-800">
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
      </div>

      <Link to="/" className="mr-3 flex p-4 md:mr-10">
        <Button className="">
          <LogOut />
          Exit
        </Button>
      </Link>
    </div>
  );
};

export default LocalMediaActions;
