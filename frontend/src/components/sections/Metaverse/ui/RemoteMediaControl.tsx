import { useMetaverseContext } from "@/context/metaverse.context";
import { Maximize2, Minimize2 } from "lucide-react";

const RemoteMediaControl = () => {
  const { remoteVideos, fullScreenPeerId, isVideoActive, isFullScreen, setFullScreenPeerId } =
    useMetaverseContext();

  return (
    <div className="fixed top-0 flex w-screen flex-col flex-wrap items-center justify-center gap-4 bg-slate-700">
      {Object.entries(remoteVideos).map(([peerId, videoElement]) => (
        <div
          key={peerId}
          className={`mt-1 transition-all duration-300 ${
            fullScreenPeerId === peerId
              ? "fixed top-1/2 left-1/2 h-[60%] w-[40%] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-slate-600/50 p-4 text-white"
              : "relative h-18 w-28 text-black"
          }`}
        >
          <video
            autoPlay
            className="shadow-custom h-full w-full rounded"
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
  );
};

export default RemoteMediaControl;
